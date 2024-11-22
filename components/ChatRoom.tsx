'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@/utils/supabase/client'
import { ChatInput } from '@/components/ChatInput'
import { MessageList } from '@/components/MessageList'
import { sendMessage, updateMessage, deleteMessage, leaveRoom } from '@/app/room/actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function ChatRoom({ roomId }: { roomId: string }) {
    const [messages, setMessages] = useState<any[]>([])
    const { data: session } = useSession()
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*, user:auth.users(id, email)')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true })

            setMessages(data || [])
        }

        fetchMessages()

        const channel = supabase
            .channel(`room:${roomId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
                payload => {
                    setMessages(current => [...current, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, supabase])

    const handleSendMessage = async (content: string) => {
        if (!session?.user) return

        try {
            await sendMessage(roomId, content)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const handleUpdateMessage = async (messageId: string, content: string) => {
        try {
            const updatedMessage = await updateMessage(messageId, content)
            setMessages(current =>
                current.map(msg => msg.id === messageId ? updatedMessage : msg)
            )
        } catch (error) {
            console.error('Error updating message:', error)
        }
    }

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId)
            setMessages(current => current.filter(msg => msg.id !== messageId))
        } catch (error) {
            console.error('Error deleting message:', error)
        }
    }

    const handleLeaveRoom = async () => {
        try {
            await leaveRoom(roomId)
            router.push('/room')
        } catch (error) {
            console.error('Error leaving room:', error)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Room: {roomId}</h2>
                <Button onClick={handleLeaveRoom} variant="destructive">Leave Room</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <MessageList
                    messages={messages}
                    currentUserId={session?.user?.id}
                    onUpdateMessage={handleUpdateMessage}
                    onDeleteMessage={handleDeleteMessage}
                />
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    )
}
