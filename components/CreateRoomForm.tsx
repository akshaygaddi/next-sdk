'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRoom } from '@/app/room/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CreateRoomForm() {
    const [name, setName] = useState('')
    const [roomType, setRoomType] = useState('public')
    const [password, setPassword] = useState('')
    const [duration, setDuration] = useState('60')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const room = await createRoom({
                name,
                roomType: roomType as 'public' | 'private',
                password: roomType === 'private' ? password : undefined,
                duration: parseInt(duration),
            })
            router.push(`/room/${room.id}`)
        } catch (error) {
            console.error('Error creating room:', error)
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
            <RadioGroup value={roomType} onValueChange={setRoomType}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private</Label>
                </div>
            </RadioGroup>
            {roomType === 'private' && (
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
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                        <SelectItem value="360">6 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                Create Room
            </Button>
        </form>
    )
}
