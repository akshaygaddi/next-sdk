
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import RoomChat from '@/components/RoomChat'
import PasswordPrompt from '@/components/PasswordPrompt'
import {createClient} from "@/utils/supabase/server";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
    // Resolve the promise from `params`
    const { id } = await params

    console.log(id)

    const supabase =await createClient()

    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single()

    if (!room) {
        notFound()
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        // Redirect to login page or show an error
        return <div>Please log in to join a room.</div>
    }


    // Check if the user is already a participant
    const { data: participant } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', room.id)
        .eq('user_id', user.id)
        .single()

    if (room.type === 'private' && !participant) {
        return <PasswordPrompt room={room} />
    }

    return <RoomChat room={room} initialParticipant={participant} />
}

