'use client'
import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {createClient} from "@/utils/supabase/client";
import {toast} from "@/hooks/use-toast";


export default function RoomCreationForm() {
    const [name, setName] = useState('')
    const [type, setType] = useState('public')
    const [password, setPassword] = useState('')
    const [expiresIn, setExpiresIn] = useState('')
    const router = useRouter()
    const supabase = createClient()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) throw new Error('User not authenticated')

            const expiresAt = expiresIn
                ? new Date(Date.now() + parseInt(expiresIn) * 60 * 1000).toISOString()
                : null

            const { data, error } = await supabase.from('rooms').insert({
                name,
                type,
                password: type === 'private' ? password : null,
                created_by: user.id,
                expires_at: expiresAt,
            }).select()

            if (error) throw error


            toast({
                title: 'Room created successfully!',
                description: `Room ID: ${data[0].id}`,
            })
            router.refresh()
        } catch (error) {
            console.error('Error creating room:', error)
            toast({
                title: 'Error creating room',
                description: 'Please try again later.',
                variant: 'destructive',
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Room Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <RadioGroup value={type} onValueChange={setType}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private</Label>
                </div>
            </RadioGroup>
            {type === 'private' && (
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
            )}
            <div>
                <Label htmlFor="expiresIn">Expires in (minutes, optional)</Label>
                <Input
                    id="expiresIn"
                    type="number"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                />
            </div>
            <Button type="submit">Create Room</Button>
        </form>
    )
}

