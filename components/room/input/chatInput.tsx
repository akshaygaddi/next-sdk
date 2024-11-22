"use client"

import React, { useState, useCallback, useEffect } from 'react';


import { Send, Type, Code, Link, BarChart } from 'lucide-react';
import { cn } from "@/lib/utils";

// Design Philosophy: Simplified, Intuitive, and Adaptive Input

type MessageType = 'text' | 'code' | 'link' | 'poll';

type ChatInputProps = {
    onSendMessage: (type: MessageType, content: string) => void;
    initialMessage?: string;
};

const MESSAGE_TYPES: {
    type: MessageType;
    icon: React.ElementType;
    label: string;
    bgColor: string;
}[] = [
    {
        type: 'text',
        icon: Type,
        label: 'Text',
        bgColor: 'bg-gray-100 text-gray-700'
    },
    {
        type: 'code',
        icon: Code,
        label: 'Code',
        bgColor: 'bg-green-50 text-green-600'
    },
    {
        type: 'link',
        icon: Link,
        label: 'Link',
        bgColor: 'bg-blue-50 text-blue-600'
    },
    {
        type: 'poll',
        icon: BarChart,
        label: 'Poll',
        bgColor: 'bg-yellow-50 text-yellow-600'
    }
];

export default function ChatInput({
                                      onSendMessage,
                                      initialMessage = ''
                                  }: ChatInputProps) {
    // State Management
    const [message, setMessage] = useState(initialMessage);
    const [messageType, setMessageType] = useState<MessageType>('text');
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-detect message type (optional advanced feature)
    useEffect(() => {
        const detectMessageType = (): MessageType => {
            if (!message) return 'text';

            // Simple heuristics for type detection
            if (message.trim().startsWith('```')) return 'code';
            if (message.trim().startsWith('http')) return 'link';
            return 'text';
        };

        const detectedType = detectMessageType();
        if (detectedType !== messageType) {
            setMessageType(detectedType);
        }
    }, [message]);

    // Send Message Handler
    const handleSendMessage = useCallback(() => {
        const trimmedMessage = message.trim();
        if (trimmedMessage) {
            onSendMessage(messageType, trimmedMessage);
            setMessage('');
            setIsExpanded(false);
        }
    }, [message, messageType, onSendMessage]);

    // Keyboard Handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        // Expand on Shift + Enter
        if (e.key === 'Enter' && e.shiftKey) {
            setIsExpanded(true);
        }
    }, [handleSendMessage]);

    // Render Type Selector
    const renderTypeSelector = () => (
        <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg">
            {MESSAGE_TYPES.map(({ type, icon: Icon, label, bgColor }) => (
                <button
                    key={type}
                    onClick={() => setMessageType(type)}
                    className={cn(
                        "p-2 rounded-md transition-all duration-200 ease-in-out",
                        messageType === type
                            ? `${bgColor} scale-105 shadow-sm`
                            : "hover:bg-gray-200 opacity-60 hover:opacity-100"
                    )}
                    aria-label={`Switch to ${label} input`}
                >
                    <Icon className="w-5 h-5" />
                </button>
            ))}
        </div>
    );

    // Main Component Render
    return (
        <div className={`
            fixed bottom-0 left-0 right-0 
            p-4 bg-white 
            shadow-2xl border-t 
            transition-all duration-300 
            ${isExpanded ? 'h-1/2' : 'h-auto'}
        `}>
            <div className="flex items-center space-x-2 h-full">
                {/* Type Selector */}
                {renderTypeSelector()}

                {/* Textarea */}
                <div className="flex-grow relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={isExpanded ? 5 : 1}
                        placeholder="Type a message..."
                        className={`
                            w-full p-3 
                            border rounded-lg 
                            resize-none 
                            transition-all 
                            focus:ring-2 
                            ${MESSAGE_TYPES.find(t => t.type === messageType)?.bgColor || 'bg-white'}
                        `}
                    />
                    {/* Expand/Collapse Indicator */}
                    {!isExpanded && message.length > 100 && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="absolute bottom-2 right-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                            Expand
                        </button>
                    )}
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`
                        p-3 rounded-full 
                        transition-all duration-200 
                        ${message.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                    aria-label="Send message"
                >
                    <Send className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}