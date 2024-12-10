'use client'
import React, { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Code,
  Link as LinkIcon,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Quote,
  ExternalLink,
  Image as ImageIcon, Mic, ArrowDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Scroll indicator component
const ScrollIndicator = ({ onClick, unreadCount }) => (
  <div className="fixed bottom-6 right-6 z-50">
    <Button
      onClick={onClick}
      className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white group"
      size="sm"
    >
      <ArrowDown className="h-4 w-4 mr-2 animate-bounce" />
      <span>{unreadCount} new message{unreadCount > 1 ? 's' : ''}</span>
    </Button>
  </div>
);

export const Message = React.memo(({message,
                                     currentUser,
                                     showAvatar = true,  }) => {
  const [copied, setCopied] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const isOwnMessage = message.user_id === currentUser?.id;
  const messageRef = useRef(null);



  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };



  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Message',
          text: message.content,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      handleCopy(message.content);
    }
  };

  // Simple function to get display name from message
  const getDisplayName = () => {
    return message.user_name || 'Anonymous User';
  };

  // Get avatar initials from display name
  const getAvatarInitials = () => {
    const name = getDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  const AvatarComponent = () => (
    <div className="relative shrink-0 transform transition-transform duration-300 group-hover:scale-105">
      <Avatar className="h-8 w-8 ring-2 ring-primary/10">
        <AvatarImage
          src={`https://avatar.vercel.sh/${message.user_id}`}
          alt={`${getDisplayName()}'s avatar`}
        />
        <AvatarFallback>
          {getAvatarInitials()}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
    </div>
  );

  const UserInfo = () => (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-medium text-foreground/80 hover:text-primary transition-colors duration-300 cursor-pointer">
        {getDisplayName()}
      </span>
      <div className="h-1 w-1 rounded-full bg-foreground/30" />
      <span className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </span>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, onClick, className = "" }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`p-2 rounded-full hover:bg-primary/5 transition-all duration-300 group ${className}`}
          >
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );


  const MessageActions = () => (
    <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <ActionButton
        icon={copied ? Check : Copy}
        label={copied ? "Copied!" : "Copy message"}
        onClick={() => handleCopy(message.content)}
      />
      {/*<ActionButton*/}
      {/*  icon={Share2}*/}
      {/*  label="Share message"*/}
      {/*  onClick={handleShare}*/}
      {/*/>*/}
    </div>
  );

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="relative">
            <p className="text-sm leading-relaxed text-foreground/90">
              {message.content}
            </p>
          </div>
        );

      case 'image':
        const [showPreview, setShowPreview] = useState(false);
        return (
          <>
            <Card
              className="overflow-hidden group/card hover:shadow-sm transition-all duration-300 cursor-pointer border border-border/40"
              onClick={() => message.metadata?.metadata?.url && setShowPreview(true)}
            >
              <div className="relative">
                <div className="relative aspect-video overflow-hidden bg-accent/10">
                  {message.metadata?.metadata?.url ? (
                    <img
                      src={message.metadata.metadata.url}
                      alt="Uploaded image"
                      className="object-contain w-full h-full transform transition-transform duration-500 group-hover/card:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              </div>
              {message.content && (
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {message.content}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="max-w-6xl p-2 bg-background/95">
                <div className="sr-only">
                  <DialogTitle>Image Preview</DialogTitle>
                </div>
                {message.metadata?.metadata?.url && (
                  <div className="relative w-full flex items-center justify-center">
                    <img
                      src={message.metadata.metadata.url}
                      alt="Image preview"
                      className="max-h-[85vh] w-auto object-contain border border-border/40 rounded"
                    />
                    {message.content && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 rounded-b">
                        <p className="text-sm text-white/90">
                          {message.content}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        );

      case 'voice':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500">Voice Message</span>
              {message.metadata?.metadata?.duration && (
                <span className="text-xs text-muted-foreground">
                  {Math.floor(message.metadata.metadata.duration / 60)}:
                  {String(message.metadata.metadata.duration % 60).padStart(2, '0')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <audio
                src={message.metadata?.metadata?.url}
                controls
                className="max-w-full"
              />
            </div>
            {message.content && (
              <p className="text-sm text-muted-foreground mt-2">
                {message.content}
              </p>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3 hover:none">
            <div className="flex items-center justify-between bg-accent/30 p-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                  {message.metadata?.language || 'plaintext'}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <ActionButton
                  icon={isCodeExpanded ? ChevronUp : ChevronDown}
                  label={isCodeExpanded ? "Show less" : "Show more"}
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                />
                <ActionButton
                  icon={copied ? Check : Copy}
                  label={copied ? "Copied!" : "Copy code"}
                  onClick={() => handleCopy(message.content)}
                />
              </div>
            </div>
            <div className={`relative rounded-b-lg overflow-hidden transition-all duration-300 ${
              !isCodeExpanded ? 'max-h-[300px]' : ''
            }`}>
              <SyntaxHighlighter
                language={message.metadata?.language || 'javascript'}
                style={vscDarkPlus}
                showLineNumbers
                wrapLines
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  borderRadius: '0 0 0.5rem 0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                {message.content}
              </SyntaxHighlighter>
              {!isCodeExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
              )}
            </div>
          </div>
        );

      case 'link':
        return (
          <Card className="overflow-hidden group/card hover:shadow-lg transition-all duration-300">
            {message.metadata?.preview && (
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={message.metadata.preview || "/api/placeholder/800/400"}
                  alt="Link preview"
                  className="object-cover w-full h-full transform transition-transform duration-500 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <a
                  href={message.metadata?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary transition-colors duration-300 flex items-center gap-1 group/link"
                >
                  {message.metadata?.title || message.metadata?.url}
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300" />
                </a>
              </div>
              {message.content && (
                <p className="text-sm text-muted-foreground">
                  {message.content}
                </p>
              )}
            </div>
          </Card>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              <span className="text-xs text-primary">Quoted Message</span>
            </div>
            <blockquote className="relative pl-4 py-2">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30 rounded-full" />
              <p className="text-sm italic text-foreground/80">
                {message.metadata?.sourceText}
              </p>
              {message.content && (
                <p className="text-sm mt-2 text-foreground/90">
                  {message.content}
                </p>
              )}
            </blockquote>
          </div>
        );

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div
      ref={messageRef}
      className={`flex items-start gap-4 p-4 group ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isOwnMessage && showAvatar && <AvatarComponent />}
      <div className={`flex-1 max-w-2xl ${isOwnMessage ? "items-end" : "items-start"}`}>
        <div className={`relative p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 
          ${isOwnMessage
          ? "bg-primary/5 hover:bg-primary/10"
          : "bg-accent/30 hover:bg-accent/40"
        }`}
        >
          {!isOwnMessage && <UserInfo />}
          {renderContent()}
          <MessageActions />
        </div>
      </div>
    </div>
  );
});

export default Message;



