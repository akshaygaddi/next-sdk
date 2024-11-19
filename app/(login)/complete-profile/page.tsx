'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { upsertProfile } from './actions'

export default function ProfileUpdateForm() {
    const [username, setUsername] = useState('')
    const [roomsAllowed, setRoomsAllowed] = useState('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('username, rooms_allowed')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error("Error fetching profile:", error)
            } else if (data) {
                setUsername(data.username || '')
                setRoomsAllowed(data.rooms_allowed || '')
            }

            setLoading(false)
        }

        loadProfile()
    }, [supabase, router])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Modify your profile information</CardDescription>
            </CardHeader>
            <form action={upsertProfile}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="rooms_allowed">Rooms Allowed</Label>
                            <Input
                                id="rooms_allowed"
                                name="rooms_allowed"
                                value={roomsAllowed}
                                onChange={(e) => setRoomsAllowed(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </CardFooter>
            </form>
        </Card>
    )
}