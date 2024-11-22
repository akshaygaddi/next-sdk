import { MessageBubble } from './MessageBubble'

type Message = {
    id: string
    content: string
    user: { id: string; email: string }
    created_at: string
    updated_at: string
}

type MessageListProps = {
    messages: Message[]
    currentUserId?: string
    onUpdateMessage: (messageId: string, content: string) => void
    onDeleteMessage: (messageId: string) => void
}

export function MessageList({ messages, currentUserId, onUpdateMessage, onDeleteMessage }: MessageListProps) {
    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={message.user.id === currentUserId}
                    onUpdate={onUpdateMessage}
                    onDelete={onDeleteMessage}
                />
            ))}
        </div>
    )
}
