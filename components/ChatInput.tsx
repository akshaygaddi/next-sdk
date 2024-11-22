'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ChatInputProps = {
    onSendMessage: (content: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim())
            setMessage('')
        }
    }

    return (
        <div className="flex items-center space-x-2 p-4 border-t">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} className="bg-orange-500 text-white hover:bg-orange-600">
                Send
            </Button>
        </div>
    )
}

