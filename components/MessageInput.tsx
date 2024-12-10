import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send, Code, MessageSquare, BarChart3,
  Plus, X, ChevronUp, ChevronDown,
  Timer, Check, Link, Quote,
  AlertCircle, MessageCircle, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

type MessageType = 'text' | 'code' | 'poll' | 'link' | 'quote';

interface Message {
  type: MessageType;
  content?: string;
  language?: string;
  question?: string;
  options?: string[];
  url?: string;
  title?: string;
  sourceText?: string;
  settings?: {
    duration: number | null;
    type: 'single' | 'multiple';
  };
}

interface MessageInputProps {
  onSendMessage: (message: Message) => Promise<void>;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

const MESSAGE_TYPES = [
  { id: 'text', icon: MessageSquare, label: 'Text', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
  { id: 'code', icon: Code, label: 'Code', color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' },
  { id: 'poll', icon: BarChart3, label: 'Poll', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  { id: 'link', icon: Link, label: 'Link', color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
  { id: 'quote', icon: Quote, label: 'Quote', color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' }
];

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' }
];

const POLL_DURATIONS = [
  { value: '1', label: '1 hour' },
  { value: '24', label: '24 hours' },
  { value: '168', label: '1 week' }
];

const MessageInput: React.FC<MessageInputProps> = ({
                                                     onSendMessage,
                                                     disabled = false,
                                                     className = '',
                                                     maxHeight = 300
                                                   }) => {
  const [messageType, setMessageType] = useState<MessageType>('text');
  const [isExpanded, setIsExpanded] = useState(true);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('24');
  const [pollType, setPollType] = useState<'single' | 'multiple'>('single');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [sourceText, setSourceText] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message, maxHeight]);

  const resetForm = () => {
    setMessage('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollDuration('24');
    setPollType('single');
    setUrl('');
    setTitle('');
    setSourceText('');
    setMessageType('text');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      let messageToSend: Message;

      switch (messageType) {
        case 'text':
          if (!message.trim()) return;
          messageToSend = { type: 'text', content: message };
          break;

        case 'code':
          if (!message.trim()) return;
          messageToSend = {
            type: 'code',
            content: message,
            language
          };
          break;

        case 'poll':
          const validOptions = pollOptions.filter(opt => opt.trim());
          if (!pollQuestion.trim() || validOptions.length < 2) return;
          messageToSend = {
            type: 'poll',
            content: pollQuestion,
            question: pollQuestion,
            options: validOptions,
            settings: {
              duration: parseInt(pollDuration),
              type: pollType
            }
          };
          break;

        case 'link':
          if (!url.trim()) return;
          messageToSend = {
            type: 'link',
            url,
            title: title.trim() || url,
            content: message
          };
          break;

        case 'quote':
          if (!sourceText.trim()) return;
          messageToSend = {
            type: 'quote',
            sourceText,
            content: message
          };
          break;

        default:
          return;
      }

      await onSendMessage(messageToSend);
      resetForm();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getCurrentIcon = () => {
    const currentType = MESSAGE_TYPES.find(type => type.id === messageType);
    return currentType?.icon || MessageSquare;
  };

  const renderMessageInput = () => {
    switch (messageType) {
      case 'text':
        return (
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Prevent adding a new line
                  handleSubmit(e); // Trigger form submission
                }
              }}
              placeholder="Type your message..."
              className="resize-none rounded-xl"
              style={{ maxHeight: `${maxHeight}px` }}
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              size="icon"
              className="h-10 w-10 rounded-xl bg-orange-500 text-white hover:bg-orange-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste your code here..."
                className="resize-none font-mono bg-muted rounded-xl"
                style={{ maxHeight: `${maxHeight}px` }}
              />
              <Button
                type="submit"
                disabled={!message.trim()}
                size="icon"
                className="h-10 w-10 rounded-xl bg-purple-500 text-white hover:bg-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'poll':
        return (
          <div className="space-y-3">
            <Input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="font-medium rounded-xl"
            />
            <Card className="p-3 space-y-2 bg-muted/50 rounded-xl border-0">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full">
                    {index + 1}
                  </Badge>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...pollOptions];
                      newOptions[index] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 rounded-xl"
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...pollOptions];
                        if (index > 0) {
                          [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]];
                          setPollOptions(newOptions);
                        }
                      }}
                      disabled={index === 0}
                      className="h-8 w-8 rounded-lg"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...pollOptions];
                        if (index < pollOptions.length - 1) {
                          [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
                          setPollOptions(newOptions);
                        }
                      }}
                      disabled={index === pollOptions.length - 1}
                      className="h-8 w-8 rounded-lg"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {pollOptions.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== index))}
                        className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {pollOptions.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="w-full rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </Card>
            <div className="flex items-center gap-2">
              <Select value={pollDuration} onValueChange={setPollDuration}>
                <SelectTrigger className="rounded-xl">
                  <Timer className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {POLL_DURATIONS.map(duration => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pollType} onValueChange={setPollType}>
                <SelectTrigger className="rounded-xl">
                  <Check className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Vote Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Choice</SelectItem>
                  <SelectItem value="multiple">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                disabled={!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2}
                className="ml-auto rounded-xl bg-green-500 text-white hover:bg-green-600"
              >
                Create Poll
              </Button>
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                type="url"
                required
                className="rounded-xl"
              />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Link title (optional)"
                className="rounded-xl"
              />
            </div>
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a description (optional)"
                className="resize-none rounded-xl"
                style={{ maxHeight: `${maxHeight}px` }}
              />
              <Button
                type="submit"
                disabled={!url.trim()}
                size="icon"
                className="h-10 w-10 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter the text you want to quote"
              className="resize-none font-medium rounded-xl"
              style={{ maxHeight: `${maxHeight}px` }}
            />
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add your thoughts (optional)"
                className="resize-none rounded-xl"
                style={{ maxHeight: `${maxHeight}px` }}
              />
              <Button
                type="submit"
                disabled={!sourceText.trim()}
                size="icon"
                className="h-10 w-10 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`sticky bottom-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <form onSubmit={handleSubmit} className="container mx-auto">
        <div className="border-t p-4 space-y-4">
          {/* Message Type Selector */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-muted"
            >
              {/* Use the current message type's icon */}
              {React.createElement(getCurrentIcon(), { className: "h-4 w-4" })}
            </Button>

            {isExpanded && (
              <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
                {MESSAGE_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = messageType === type.id;

                  return (
                    <Button
                      key={type.id}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMessageType(type.id as MessageType)}
                      className={`gap-2 rounded-lg transition-colors ${
                        isSelected ? type.color : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{type.label}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message Input Area */}
          <div className="relative">
            {renderMessageInput()}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;