'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type MessageBubbleProps = {
    message: {
        id: string
        content: string
        user: { id: string; email: string }
        created_at: string
        updated_at: string
    }
    isOwnMessage: boolean
    onUpdate: (messageId: string, content: string) => void
    onDelete: (messageId: string) => void
}

export function MessageBubble({ message, isOwnMessage, onUpdate, onDelete }: MessageBubbleProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(message.content)

    const handleUpdate = () => {
        onUpdate(message.id, editedContent)
        setIsEditing(false)
    }

    return (
        <div className={`p-4 rounded-lg ${isOwnMessage ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-[70%]`}>
            <p className="font-semibold">{message.user.email}</p>
            {isEditing ? <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                />
                :
                <p>{message.content}</p>
            }
            <p className="text-xs text-gray-500">
                {new Date(message.created_at).toLocaleString()}
                {message.updated_at !== message.created_at && ' (edited)'}
            </p>
            {isOwnMessage && (
                <div className="mt-2 space-x-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleUpdate} size="sm">Save</Button>
                            <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)} size="sm">Edit</Button>
                            <Button onClick={() => onDelete(message.id)} size="sm" variant="destructive">Delete</Button>
                        </>
                    )}
                </div>
            )}
        </div>
    )

}