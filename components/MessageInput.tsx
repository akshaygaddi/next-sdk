'use client'

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  MessageSquare,
  Code,
  Link,
  Quote,
  Paperclip,
  Smile,
  Mic,
  Square,
  Play,
  Pause,
  Video,
  Image as ImageIcon,
  File as FileIcon,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Types
type MessageType = "text" | "code" | "link" | "quote" | "file" | "voice";
type FileType = "image" | "video" | "voice" | "file";

interface FileMetadata {
  url: string;
  key: string;
  id: string;
  duration?: number;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

interface Message {
  type: MessageType;
  content?: string;
  language?: string;
  url?: string;
  title?: string;
  sourceText?: string;
  metadata?: FileMetadata;
}

interface MessageInputProps {
  onSendMessage: (message: Message) => Promise<void>;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];

const MESSAGE_TYPES = [
  {
    id: "text",
    icon: MessageSquare,
    label: "Text",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
  {
    id: "code",
    icon: Code,
    label: "Code",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  },
  {
    id: "link",
    icon: Link,
    label: "Link",
    color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  },
  {
    id: "quote",
    icon: Quote,
    label: "Quote",
    color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
  },
];

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const EMOJI_GROUPS = {
  smileys: ['😊', '😂', '🥹', '😅', '😆', '😉', '😍', '🥰', '😘', '😎'],
  gestures: ['👍', '👋', '🙌', '👏', '🤝', '✌️', '❤️', '🔥', '⭐', '✨'],
  common: ['🎉', '🎈', '🎁', '🌟', '💡', '📌', '⚡', '💯', '🏆', '💪']
};

// Helper Functions
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size exceeds 50MB limit' };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type);

  if (!isImage && !isVideo && !isAudio) {
    return { isValid: false, error: 'Unsupported file type' };
  }

  return { isValid: true };
};

const getFileType = (file: File): FileType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'voice';
  return 'file';
};

const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const getImageDimensions = async (file: File): Promise<{ width: number; height: number } | null> => {
  if (!file.type.startsWith('image/')) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => resolve(null);
  });
};

// FilePreview Component
const FilePreview: React.FC<{
  file: File;
  onRemove: () => void;
}> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <div className="relative group">
      <div className="border rounded-lg p-2 bg-muted/50">
        {file.type.startsWith('image/') ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-32 rounded object-contain"
          />
        ) : file.type.startsWith('video/') ? (
          <video
            src={URL.createObjectURL(file)}
            controls
            className="max-h-32 rounded"
          />
        ) : file.type.startsWith('audio/') ? (
          <audio
            src={URL.createObjectURL(file)}
            controls
            className="w-full"
          />
        ) : (
          <div className="flex items-center gap-2 p-2">
            <FileIcon className="h-4 w-4" /> {/* Use FileIcon instead of File */}
            <span className="text-sm truncate">{file.name}</span>
            <span className="text-sm text-muted-foreground">
              ({formatFileSize(file.size)})
            </span>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white hover:bg-destructive/90"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

// Update VoiceRecorder component props to use async function
interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => Promise<void>;
  onCancel: () => void;
}

// VoiceRecorder Component
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
                                                       onRecordingComplete,
                                                       onCancel
                                                     }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());

        // Automatically call onRecordingComplete with the blob
        await onRecordingComplete(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = async () => {
    if (chunksRef.current.length > 0) {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      await onRecordingComplete(blob);
      // After completion, we'll automatically submit the form
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="space-y-2">
      {!audioUrl ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "secondary"}
          >
            {isRecording ? <Square className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          {isRecording && (
            <span className="text-sm">
              {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="text-sm">
              {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave} variant="default">
              Send
            </Button>
            <Button type="button" onClick={onCancel} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Import all the components and types from part 1


const MessageInput: React.FC<MessageInputProps> = ({
                                                     onSendMessage,
                                                     disabled = false,
                                                     className = "",
                                                     maxHeight = 300,
                                                   }) => {
  // State
  const [messageType, setMessageType] = useState<MessageType>("text");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);



  // Effects
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message, maxHeight]);

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(Math.round(audio.duration));
      };
    });
  };

  // File upload handler
  const uploadFile = async (file: File): Promise<FileMetadata> => {
    const supabaseClient = createClient();

    // Generate secure filename
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${randomString}-${safeFileName}`;

    try {
      const { data, error } = await supabaseClient.storage
        .from("rooms")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (error) throw error;

      const { data: urlData } = supabaseClient.storage
        .from("rooms")
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        key: data.path,
        id: data.id,
        mimeType: file.type,
        fileName: file.name,
        fileSize: file.size,
        duration: file.type.startsWith('audio/') ? await getAudioDuration(file) : undefined
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Event Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setSelectedFile(file);
  };

  const handleVoiceRecordingComplete = async (blob: Blob) => {
    const voiceFile = new window.File([blob], 'voice-message.webm', { type: 'audio/webm' });
    try {
      setIsUploading(true);
      const metadata = await uploadFile(voiceFile);

      // Create and send the message directly
      const messageToSend: Message = {
        type: "voice",
        content: message, // Optional caption
        metadata: metadata
      };

      await onSendMessage(messageToSend);

      // Reset the form
      resetForm();
    } catch (error) {
      console.error('Voice recording upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setShowVoiceRecorder(false);
    }
  };

  const resetForm = () => {
    setMessage("");
    setUrl("");
    setTitle("");
    setSourceText("");
    setSelectedFile(null);
    setShowVoiceRecorder(false);
    setMessageType("text");
    setIsEmojiPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      let messageToSend: Message;
      setIsUploading(true);

      // Handle file upload if present
      let fileMetadata: FileMetadata | undefined;
      if (selectedFile) {
        try {
          fileMetadata = await uploadFile(selectedFile);
          const fileType = getFileType(selectedFile);

          if (selectedFile.type.startsWith('image')) {
            const dimensions = await getImageDimensions(selectedFile);
            if (dimensions) {
              fileMetadata.dimensions = dimensions;
            }
          }
        } catch (error) {
          console.error('File upload failed:', error);
          throw error;
        }
      }

      // Determine message type and construct message
      if (selectedFile && fileMetadata) {
        messageToSend = {
          type: getFileType(selectedFile) as MessageType,
          content: message, // Optional caption
          metadata: fileMetadata,
        };
      } else {
        switch (messageType) {
          case "text":
            if (!message.trim()) return;
            messageToSend = { type: "text", content: message };
            break;

          case "code":
            if (!message.trim()) return;
            messageToSend = {
              type: "code",
              content: message,
              language,
            };
            break;

          case "link":
            if (!url.trim()) return;
            messageToSend = {
              type: "link",
              url,
              title: title.trim() || url,
              content: message,
            };
            break;

          case "quote":
            if (!sourceText.trim()) return;
            messageToSend = {
              type: "quote",
              sourceText,
              content: message,
            };
            break;

          case "voice":
            if (audioBlob) {
              const voiceFile = new window.File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
              const voiceMetadata = await uploadFile(voiceFile);

              messageToSend = {
                type: "voice",
                content: message,
                metadata: voiceMetadata
              };
              setAudioBlob(null);
            } else {
              return;
            }
            break;

          default:
            return;
        }
      }

      await onSendMessage(messageToSend);
      resetForm();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Render different input types
  const renderMessageInput = () => {
    const inputs = {
      text: (
        <div className="flex items-end gap-2 w-full">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            className="resize-none rounded-xl flex-1"
            style={{ maxHeight: `${maxHeight}px` }}
          />
        </div>
      ),

      code: (
        <div className="space-y-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48 rounded-xl">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste your code here..."
            className="resize-none font-mono bg-muted rounded-xl"
            style={{ maxHeight: `${maxHeight}px` }}
          />
        </div>
      ),

      link: (
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
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a description (optional)"
            className="resize-none rounded-xl"
            style={{ maxHeight: `${maxHeight}px` }}
          />
        </div>
      ),

      quote: (
        <div className="space-y-3">
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter the text you want to quote"
            className="resize-none font-medium rounded-xl"
            style={{ maxHeight: `${maxHeight}px` }}
          />
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add your thoughts (optional)"
            className="resize-none rounded-xl"
            style={{ maxHeight: `${maxHeight}px` }}
          />
        </div>
      ),
    };

    return inputs[messageType] || inputs.text;
  };

  // Component render
  return (
    <div className={`sticky bottom-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <form ref={formRef} onSubmit={handleSubmit} className="container mx-auto">
        <div className="border-t p-4 space-y-2">
          {/* File Preview */}
          {selectedFile && (
            <div className="mb-2">
              <FilePreview
                file={selectedFile}
                onRemove={() => setSelectedFile(null)}
              />
            </div>
          )}

          {/* Voice Recorder */}
          {showVoiceRecorder && (
            <div className="mb-2">
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecordingComplete}
                onCancel={() => setShowVoiceRecorder(false)}
              />
            </div>
          )}

          <div className="flex gap-2">
            {/* Message Type Selector */}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`h-10 w-10 rounded-lg ${
                  MESSAGE_TYPES.find(type => type.id === messageType)?.color || ''
                }`}
              >
                {React.createElement(
                  MESSAGE_TYPES.find(type => type.id === messageType)?.icon || MessageSquare,
                  { className: "h-4 w-4" }
                )}
              </Button>

              {/* Expandable type selector */}
              {isExpanded && (
                <div className="absolute bottom-full mb-2 left-0 bg-background border rounded-lg shadow-lg z-10">
                  <div className="p-1 space-y-1">
                    {MESSAGE_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = messageType === type.id;

                      return (
                        <Button
                          key={type.id}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMessageType(type.id as MessageType);
                            setIsExpanded(false);
                          }}
                          className={`w-full justify-start gap-2 rounded-lg transition-colors ${
                            isSelected ? type.color : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Main Input Area */}
            <div className="flex-1 relative">
              {renderMessageInput()}

              {/* Quick Access Tools */}
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES].join(',')}
                  className="hidden"
                />

                {/* Emoji Picker */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    className="h-8 w-8 rounded-lg hover:bg-muted p-0"
                  >
                    <Smile className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  {isEmojiPickerOpen && (
                    <div
                      className="absolute bottom-full right-0 mb-2 p-2 bg-background border rounded-lg shadow-lg w-64 z-10">
                      <div className="space-y-2">
                        {Object.entries(EMOJI_GROUPS).map(([groupName, emojis]) => (
                          <div key={groupName}>
                            <div className="text-xs text-muted-foreground mb-1 capitalize">
                              {groupName}
                            </div>
                            <div className="grid grid-cols-10 gap-1">
                              {emojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    setMessage((prev) => prev + emoji);
                                    setIsEmojiPickerOpen(false);
                                  }}
                                  className="hover:bg-muted p-1 rounded text-sm"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 rounded-lg hover:bg-muted p-0"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                  className="h-8 w-8 rounded-lg hover:bg-muted p-0"
                >
                  <Mic className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={disabled || (!message.trim() && !selectedFile && !sourceText && !url)}
              size="icon"
              className="h-10 w-10 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;