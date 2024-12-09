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
  Timer, Check, Image, Mic, Highlighter, Link, Quote, ChevronLeft, ChevronRight, Terminal
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type MessageType = 'text' | 'image' | 'voice' | 'code' | 'poll' | 'link' | 'quote' | 'highlight';

interface Message {
  type: MessageType;
  content?: string;
  imageFile?: File;
  audioBlob?: Blob;
  duration?: number;
  language?: string;
  question?: string;
  options?: string[];
  url?: string;
  title?: string;
  sourceText?: string;
  highlightColor?: string;
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

// Constants
const MESSAGE_TYPES = {
  TEXT: 'text',
  CODE: 'code',
  POLL: 'poll',
  LINK: 'link',
  QUOTE: 'quote',
  HIGHLIGHT: 'highlight'
} as const;

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

const HIGHLIGHT_COLORS = [
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-200' },
  { value: 'green', label: 'Green', class: 'bg-green-200' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-200' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-200' },
];

const MessageInput: React.FC<MessageInputProps> = ({
                                                     onSendMessage,
                                                     disabled = false,
                                                     className = '',
                                                     maxHeight = 300
                                                   }) => {
  const [messageType, setMessageType] = useState<MessageType>('text');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('24');
  const [pollType, setPollType] = useState<'single' | 'multiple'>('single');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');




  // message selctor
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  const messageTypes = [
    { id: 'text', icon: MessageSquare, label: 'Text' },
    // { id: 'image', icon: Image, label: 'Image' },
    // { id: 'voice', icon: Mic, label: 'Voice' },
    { id: 'code', icon: Code, label: 'Code' },
    { id: 'poll', icon: BarChart3, label: 'Poll' },
    { id: 'link', icon: Link, label: 'Link' },
    { id: 'quote', icon: Quote, label: 'Quote' },
    // { id: 'highlight', icon: Highlighter, label: 'Highlight' },
  ];
  // message selctor


  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  // Auto-resize textarea with max height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message, maxHeight]);


  // image uploading and voice recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timer>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);

      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Auto-stop after 60 seconds
      setTimeout(() => stopRecording(), 60000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // image uploading and voice recording

  // Poll handlers
  const handleAddOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) ||
      (direction === 'down' && index === pollOptions.length - 1)) return;

    const newOptions = [...pollOptions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];
    setPollOptions(newOptions);
  };



  const resetForm = () => {
    setMessage('');
    setImageFile(null);
    setAudioBlob(null);
    setRecordingDuration(0);
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollDuration('24');
    setPollType('single');
    setUrl('');
    setTitle('');
    setSourceText('');
    setHighlightColor('yellow');
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

        case 'image':
          if (!imageFile) return;
          messageToSend = {
            type: 'image',
            imageFile,
            content: message
          };
          break;

        case 'voice':
          if (!audioBlob) return;
          messageToSend = {
            type: 'voice',
            audioBlob,
            duration: recordingDuration
          };
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
            content: pollQuestion, // Add this line to fix the error
            question: pollQuestion,
            options: validOptions,
            settings: {
              duration: pollDuration ? parseInt(pollDuration) : null,
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

        case 'highlight':
          if (!message.trim()) return;
          messageToSend = {
            type: 'highlight',
            content: message,
            highlightColor
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


  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Keyboard handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  return (
    <div className={`sticky bottom-0 w-full p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">


        {/*end*/}
        {messageType === 'image' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                disabled={true}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              {imageFile && (
                <Button
                  disabled={true}
                  // type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {imageFile && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            {/*<Textarea*/}
            {/*  value={message}*/}
            {/*  onChange={(e) => setMessage(e.target.value)}*/}
            {/*  placeholder="Due Limited storage Options we had to disable the image Option"*/}
            {/*  className="resize-none"*/}
            {/*/>*/}
            <Alert>
              <Terminal className="h-4 w-4 bg-red-400" />
              <AlertTitle>Apology</AlertTitle>
              <AlertDescription>
                Due Limited storage Options we had to disable the image Option
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2">

              <Button
                type="reset"
                className="ml-auto"
                onClick={()=>{
                  setMessageType('text')
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!imageFile}
              >
                <Image className="h-4 w-4 mr-2" />
                Send Image
              </Button>

            </div>
          </div>
        )}

        {messageType === 'voice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "secondary"}
                size="lg"
                className="w-24 h-24 rounded-full"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Mic className={`h-8 w-8 ${isRecording ? 'animate-pulse' : ''}`} />

              </Button>
            </div>
            {isRecording && (
              <div className="text-center font-medium">
                Recording... {recordingDuration}s
              </div>
            )}
            {audioBlob && !isRecording && (
              <div className="space-y-2">
                <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />



                <div className="flex items-center gap-2">

                  <Button
                    type="reset"
                    className="ml-auto"
                    onClick={() => {
                      setMessageType("text");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={true}
                    // type="submit"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Voice Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text/Code Input */}
        {(messageType === "text" || messageType === "code") && (
          <div className="space-y-2">
            {messageType === "code" && (
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
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
            )}
            <div className="flex gap-2">
              <div className="flex items-center">
                <div
                  className={`flex items-center gap-1 bg-muted rounded-lg transition-all duration-300 ease-in-out ${
                    isExpanded ? "w-auto p-2" : "w-fit"
                  }`}
                >
                  {messageTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = messageType === type.id;
                    const showItem = isExpanded || isSelected;

                    if (!showItem) return null;

                    return (
                      <div
                        key={type.id}
                        className={`relative flex items-center transition-all duration-200 ${
                          isExpanded ? "mx-1" : "mx-0"
                        }`}
                        onMouseEnter={() => setIsHovered(type.id)}
                        onMouseLeave={() => setIsHovered(null)}
                      >
                        <button
                          onClick={() => {
                            setMessageType(type.id);

                          }}
                          className={`relative flex items-center p-2 rounded-md transition-all duration-200 ${
                            isSelected
                              ? "bg-primary text-white"
                              : "hover:bg-secondary/50"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {(isExpanded || isSelected) && (
                            <span className={`ml-2 text-sm whitespace-nowrap ${
                              isSelected ? "text-white" : ""
                            }`}>
                    {type.label}
                  </span>
                          )}
                        </button>

                        {!isExpanded && isHovered === type.id && !isSelected && (
                          <div
                            className="absolute left-full ml-2 px-2 py-1 bg-black/75 text-white text-xs rounded whitespace-nowrap">
                            {type.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-2 p-2 hover:bg-muted rounded-full transition-all duration-200"
                >
                  {isExpanded ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={messageType === "code" ? "Paste your code here..." : "Type a message..."}
                className={`flex-1 resize-none ${messageType === "code" ? "font-mono bg-muted" : ""}`}
                onKeyDown={handleKeyDown}
                style={{ maxHeight: `${maxHeight}px` }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim()}
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Link Input */}
        {messageType === "link" && (
          <div className="space-y-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              type="url"
              required
            />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title (optional)"
            />
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a description (optional)"
              className="resize-none"
              style={{ maxHeight: `${maxHeight}px` }}
            />
            <div className="flex items-center gap-2">

              <Button
                variant="destructive"
                type="reset"
                className="ml-auto"
                onClick={() => {
                  setMessageType("text");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={!url.trim()}
              >
                <Link className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

          </div>
        )}

        {/* Quote Input */}
        {messageType === "quote" && (
          <div className="space-y-2">
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter the text you want to quote"
              className="resize-none font-medium"
              style={{ maxHeight: `${maxHeight}px` }}
            />
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add your thoughts (optional)"
              className="resize-none"
              style={{ maxHeight: `${maxHeight}px` }}
            />
            <div className="flex items-center gap-2">

              <Button
                variant="destructive"
                type="reset"
                className="ml-auto"
                onClick={() => {
                  setMessageType("text");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={!sourceText.trim()}
              >
                <Quote className="h-4 w-4 mr-2" />
                Add Quote
              </Button>
            </div>

          </div>
        )}

        {/* Highlight Input */}
        {messageType === "highlight" && (
          <div className="space-y-2">
            <Select value={highlightColor} onValueChange={setHighlightColor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Color" />
              </SelectTrigger>
              <SelectContent>
                {HIGHLIGHT_COLORS.map(color => (
                  <SelectItem
                    key={color.value}
                    value={color.value}
                    className={color.class}
                  >
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter text to highlight"
              className={`resize-none ${HIGHLIGHT_COLORS.find(c => c.value === highlightColor)?.class}`}
              style={{ maxHeight: `${maxHeight}px` }}
            />

            <div className="flex items-center gap-2">

              <Button
                type="reset"
                className="ml-auto"
                onClick={() => {
                  setMessageType("text");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={!message.trim()}
              >
                <Highlighter className="h-4 w-4 mr-2" />
                Add Highlight
              </Button>
            </div>

          </div>
        )}

        {/* Poll Creation */}
        {messageType === "poll" && (
          <div className="space-y-4">
            <Input
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="font-medium"
            />

            <Card className="p-4 space-y-2">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="h-6 w-6 shrink-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveOption(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveOption(index, 'down')}
                      disabled={index === pollOptions.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {pollOptions.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                        className="text-destructive hover:text-destructive"
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
                  onClick={handleAddOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </Card>
            <div className="flex gap-4 flex-wrap">
              <Select value={pollDuration} onValueChange={setPollDuration}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
                  <Check className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Vote Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Choice</SelectItem>
                  <SelectItem value="multiple">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  type="reset"
                  className="ml-auto"
                  onClick={() => {
                    setMessageType("text");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2}
                >
                  Create Poll
                </Button>
              </div>


            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;