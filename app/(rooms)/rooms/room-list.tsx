'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton' // Import skeleton component
import { createClient } from '@/utils/supabase/client'

type Room = {
    id: string
    name: string
    created_by: string
    expires_at: string | null
}

export function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true) // Add loading state
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchRooms = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUserId(user?.id || null)

            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('is_active', true)

            if (error) {
                console.error('Error fetching rooms:', error)
            } else {
                setRooms(data)
            }
            setIsLoading(false) // Stop loading after fetch
        }

        fetchRooms()

        const roomsSubscription = supabase
            .channel('public:rooms')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, fetchRooms)
            .subscribe()

        return () => {
            supabase.removeChannel(roomsSubscription)
        }
    }, [supabase])

    const handleJoinRoom = (roomId: string) => {
        router.push(`/rooms/${roomId}`)
    }

    const handleDeleteRoom = async (roomId: string) => {
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', roomId)
            .eq('created_by', userId)

        if (error) {
            console.error('Error deleting room:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skeleton placeholders */}
                {[...Array(4)].map((_, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-8 w-1/3 mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
                <Card key={room.id}>
                    <CardHeader>
                        <CardTitle>{room.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {room.expires_at && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Expires at: {new Date(room.expires_at).toLocaleString()}
                            </p>
                        )}
                        <div className="mt-4 space-x-2">
                            <Button onClick={() => handleJoinRoom(room.id)}>Join</Button>
                            {room.created_by === userId && (
                                <Button variant="destructive" onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
