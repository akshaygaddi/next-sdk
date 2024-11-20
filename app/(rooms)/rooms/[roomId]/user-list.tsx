'use client'

import { useState, useEffect } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {createClient} from "@/utils/supabase/client";

type User = {
    id: string
    email: string
}

export function UserList({ roomId }: { roomId: string }) {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('room_users')
                .select('user:users(id, email)')
                .eq('room_id', roomId)

            if (error) {
                console.error('Error fetching users:', error)
            } else {
                setUsers(data.map((item: any) => item.user))
            }
            setIsLoading(false)
        }

        fetchUsers()

        const usersSubscription = supabase
            .channel(`room_users:${roomId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'room_users', filter: `room_id=eq.${roomId}` }, fetchUsers)
            .subscribe()

        return () => {
            supabase.removeChannel(usersSubscription)
        }
    }, [supabase, roomId])

    return (
        <div>
            <h3 className="font-semibold mb-2 text-foreground dark:text-gray-200">Users in Room</h3>
            {isLoading ? (
                [...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full mt-2" />
                ))
            ) : (
                <ul className="space-y-1">
                    {users.map((user) => (
                        <li key={user.id} className="text-sm text-foreground dark:text-gray-300">{user.email}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}