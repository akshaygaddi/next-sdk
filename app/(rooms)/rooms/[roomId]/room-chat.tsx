'use client'

import { useState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Message } from './message'
import { UserList } from './user-list'
import { RoomTimer } from './room-timer'
import { Skeleton } from '@/components/ui/skeleton'
import {createClient} from "@/utils/supabase/client";
import {toast} from "@/hooks/use-toast";

type ChatMessage = {
    id: string
    content: string
    user_id: string
    created_at: string
    user: {
        id: string
        email: string
    }
}

export function RoomChat({ roomId }: { roomId: string }) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            setUserId(user?.id || null)

            const { data, error } = await supabase
                .from('messages')
                .select(`
          id,
          content,
          user_id,
          created_at,
          user:users(id, email)
        `)
                .eq('room_id', roomId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching messages:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch messages. Please try again.",
                    variant: "destructive",
                })
            } else {
                setMessages(data)
            }
            setIsLoading(false)
        }

        fetchMessages()

        const messagesSubscription = supabase
            .channel(`room:${roomId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, fetchMessages)
            .subscribe()

        return () => {
            supabase.removeChannel(messagesSubscription)
        }
    }, [supabase, roomId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const { error } = await supabase
            .from('messages')
            .insert({ content: newMessage, room_id: roomId })

        if (error) {
            console.error('Error sending message:', error)
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            })
        } else {
            setNewMessage('')
        }
    }

    const handleEditMessage = async (messageId: string, newContent: string) => {
        const { error } = await supabase
            .from('messages')
            .update({ content: newContent })
            .eq('id', messageId)
            .eq('user_id', userId)

        if (error) {
            console.error('Error editing message:', error)
            toast({
                title: "Error",
                description: "Failed to edit message. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteMessage = async (messageId: string) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('user_id', userId)

        if (error) {
            console.error('Error deleting message:', error)
            toast({
                title: "Error",
                description: "Failed to delete message. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex h-full bg-background dark:bg-gray-900">
            <div className="flex-grow overflow-hidden flex flex-col">
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))
                    ) : (
                        messages.map((message) => (
                            <Message
                                key={message.id}
                                message={message}
                                isOwnMessage={message.user_id === userId}
                                onEdit={handleEditMessage}
                                onDelete={handleDeleteMessage}
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex space-x-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow dark:bg-gray-800 dark:text-white"
                        />
                        <Button type="submit">Send</Button>
                    </div>
                </form>
            </div>
            <div className="w-64 border-l border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
                <UserList roomId={roomId} />
                <RoomTimer roomId={roomId} />
            </div>
        </div>
    )
}