'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type MessageProps = {
    message: {
        id: string
        content: string
        user: {
            email: string
        }
        created_at: string
    }
    isOwnMessage: boolean
    onEdit: (messageId: string, newContent: string) => void
    onDelete: (messageId: string) => void
}

export function Message({ message, isOwnMessage, onEdit, onDelete }: MessageProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(message.content)

    const handleEdit = () => {
        onEdit(message.id, editedContent)
        setIsEditing(false)
    }

    return (
        <div className={`p-2 rounded ${isOwnMessage ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            <p className="text-sm font-semibold">{message.user.email}</p>
            {isEditing ? (
                <div className="mt-1">
                    <Input
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="mb-2"
                    />
                    <Button onClick={handleEdit} size="sm">Save</Button>
                    <Button onClick={() => setIsEditing(false)} size="sm" variant="outline" className="ml-2">Cancel</Button>
                </div>
            ) : (
                <>
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                    {isOwnMessage && (
                        <div className="mt-1">
                            <Button onClick={() => setIsEditing(true)} size="sm">Edit</Button>
                            <Button onClick={() => onDelete(message.id)} size="sm" variant="destructive" className="ml-2">Delete</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}