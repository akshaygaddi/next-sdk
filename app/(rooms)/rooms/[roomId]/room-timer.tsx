'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import {createClient} from "@/utils/supabase/client";

export function RoomTimer({ roomId }: { roomId: string }) {
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [timeLeft, setTimeLeft] = useState<string>('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchRoomData = async () => {
            const { data, error } = await supabase
                .from('rooms')
                .select('expires_at')
                .eq('id', roomId)
                .single()

            if (error) {
                console.error('Error fetching room data:', error)
            } else if (data && data.expires_at) {
                setExpiresAt(new Date(data.expires_at))
            }
        }

        fetchRoomData()
    }, [supabase, roomId])

    useEffect(() => {
        if (!expiresAt) return

        const timer = setInterval(() => {
            const now = new Date()
            const difference = expiresAt.getTime() - now.getTime()

            if (difference <= 0) {
                clearInterval(timer)
                setTimeLeft('Room Expired')
                router.push('/rooms')
            } else {
                const hours = Math.floor(difference / (1000 * 60 * 60))
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((difference % (1000 * 60)) / 1000)
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [expiresAt, router])

    if (!expiresAt) return null

    return (
        <div className="mt-4">
            <h3 className="font-semibold mb-2">Time Left</h3>
            <p>{timeLeft}</p>
        </div>
    )
}