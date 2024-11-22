import React from "react"
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ChatRoom } from '@/components/ChatRoom'

export default async function RoomPage({ params }: { params: { id: string } }) {
    const supabase = await  createClient()
    const { id } = await (params)
    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('id',id )
        .single()

    if (!room) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
            <ChatRoom roomId={room.id} />
        </div>
    )
}

