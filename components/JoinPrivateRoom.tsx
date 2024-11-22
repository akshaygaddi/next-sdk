'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function JoinPrivateRoom() {
    const [joinCode, setJoinCode] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('id')
            .eq('join_code', joinCode)
            .single()

        if (roomError || !room) {
            console.error('Error finding room:', roomError)
            return
        }

        const { data, error } = await supabase.rpc('join_room', {
            p_room_id: room.id,
            p_password: password
        })

        if (error) {
            console.error('Error joining room:', error)
        } else if (data) {
            router.push(`/room/${room.id}`)
        } else {
            console.error('Failed to join room')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="joinCode">Join Code</Label>
                <Input
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                Join Private Room
            </Button>
        </form>
    )
}

