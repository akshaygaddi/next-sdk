'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {toast} from "@/hooks/use-toast";


const presetTimes = [
    { value: '2', label: '2 minutes' },
    { value: '5', label: '5 minutes' },
    { value: '8', label: '8 minutes' },
    { value: '10', label: '10 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '20', label: '20 minutes' },
]

export function CreateRoom() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const expiresAt = duration ? new Date(Date.now() + parseInt(duration) * 60000).toISOString() : null

        const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                expiresAt,
            }),
        })

        if (response.ok) {
            const data = await response.json()
            toast({
                title: "Room created",
                description: "Your new room has been created successfully.",
            })
            router.push(`/rooms/${data.id}`)
        } else {
            console.error('Error creating room:', await response.text())
            toast({
                title: "Error",
                description: "Failed to create room. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Create a New Room</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Room Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter room name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter room description"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Room Duration</Label>
                        <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-3 gap-2">
                            {presetTimes.map((time) => (
                                <div key={time.value}>
                                    <RadioGroupItem
                                        value={time.value}
                                        id={`time-${time.value}`}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={`time-${time.value}`}
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                    >
                                        {time.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full">
                        Create Room
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}