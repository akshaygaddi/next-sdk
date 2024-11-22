'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRoom({ name, roomType, password, duration }: {
    name: string
    roomType: 'public' | 'private'
    password?: string
    duration: number
}) {
    const supabase =await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    let joinCode = null
    if (roomType === 'private') {
        const { data, error } = await supabase.rpc('generate_unique_join_code')
        if (error) throw error
        joinCode = data
    }

    console.log(
        {
            name,
            room_type: roomType,
            password: roomType === 'private' ? password : null,
            join_code: joinCode,
            owner_id: user.id,
            time_limit: "2024-11-27 16:17:01+00"
        }
    )


    const { data: room, error } = await supabase.from('rooms').insert({
        name,
        room_type: roomType,
        password: roomType === 'private' ? password : null,
        join_code: joinCode,
        owner_id: user.id,
        time_limit: "2024-11-27 16:17:01+00"
        // expires_at: new Date(Date.now() + duration * 60000).toISOString(),
    }).select().single()

    if (error) throw error

    revalidatePath('/room')
    return room
}

export async function getRooms() {
    const supabase = await createClient()
    const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return rooms
}

export async function joinRoom(roomId: string, password?: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('join_room', {
        p_room_id: roomId,
        p_password: password
    })

    if (error) throw error
    revalidatePath(`/room/${roomId}`)
    return data
}

export async function sendMessage(roomId: string, content: string, type: string = 'text') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase.from('messages').insert({
        room_id: roomId,
        user_id: user.id,
        content,
        type
    }).select().single()

    if (error) throw error
    return data
}

export async function updateMessage(messageId: string, content: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('messages')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteMessage(messageId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

    if (error) throw error
}

export async function leaveRoom(roomId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
        .from('room_members')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id)

    if (error) throw error
    revalidatePath('/room')
}
