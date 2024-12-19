import React, { useState, useRef, useCallback, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mic,
  Loader2,
  AlertCircle,
  Code,
  MessageSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote, AlertTriangle,ZoomInIcon, ZoomOutIcon, DownloadIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";




const MessageDisplay = React.memo(({
                                     message,
                                     currentUser,
                                     isSelected,
                                     onSelect,
                                     showAvatar = true,
                                     presenceData = {},
                                     selectionMode = false,
                                     deletionState = null,
                                   }) => {
  const [copied, setCopied] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const isOwnMessage = message.user_id === currentUser?.id;
  const messageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const codeRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      const contentHeight = codeRef.current.scrollHeight;
      const maxCollapsedHeight = 300; // This should match the max-h-[300px]
      setHasOverflow(contentHeight > maxCollapsedHeight);
    }
  }, [message.content]);

  const DeletionIndicator = () => {
    if (!deletionState) return null;

    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          isOwnMessage ? "left-2" : "right-2",
          "flex items-center gap-2 px-2 py-1 rounded-md",
          "text-xs font-medium",
          "bg-background/80 backdrop-blur-sm",
          "transition-all duration-300",
          "z-10",
          deletionState === 'deleting' ? 'text-muted-foreground' : 'text-destructive'
        )}
      >
        {deletionState === 'deleting' ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3" />
            <span>Delete failed</span>
          </>
        )}
      </div>
    );
  };

  const renderDeletedMessage = () => (
    <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
      <MessageSquare className="h-4 w-4" />
      <span>This message was deleted</span>
    </div>
  );


  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const MessageAvatar = () => (
    <div className="relative flex-shrink-0">
      <Avatar className="h-8 w-8 ring-2 ring-background transition-transform duration-200 group-hover:scale-105">
        <AvatarImage
          src={`https://avatar.vercel.sh/${message.user_id}`}
          alt={message.user_name || "Unknown User"}
        />
        <AvatarFallback>
          {(message.user_name || "User").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {presenceData[message.user_id]?.online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
      )}
    </div>
  );

  const MessageHeader = () => (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        {message.user_name || "Unknown User"}
      </span>
      <span className="text-xs text-muted-foreground/70">
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </span>
      {message.is_edited && (
        <span className="text-xs text-muted-foreground/50 italic">(edited)</span>
      )}
    </div>
  );

  const MessageStatus = () => (
    <div className="flex items-center gap-1.5 text-xs mt-1.5">
      {message.status === "sending" && (
        <div className="flex items-center gap-1 text-primary/70">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Sending</span>
        </div>
      )}
      {message.status === "error" && (
        <div className="flex items-center gap-1 text-destructive/90">
          <AlertCircle className="h-3 w-3" />
          <span>Failed to send</span>
        </div>
      )}
    </div>
  );


  // Debounced hover state for smoother transitions
  const [showCheckbox, setShowCheckbox] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Show checkbox with a slight delay to prevent flickering
    const timer = setTimeout(() => setShowCheckbox(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Hide checkbox with a slight delay
    const timer = setTimeout(() => setShowCheckbox(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      onSelect?.(message);
    }
  }, [message, onSelect]);

  const SelectionCheckbox = () => {
    // Don't show checkbox if message is being deleted
    if (deletionState) return null;

    return (
      <div
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2",
          "transition-all duration-300 ease-in-out",
          "transform scale-100 opacity-100",
          {
            'opacity-0 scale-95': !showCheckbox && !isSelected && !selectionMode,
            'opacity-100 scale-100': showCheckbox || isSelected || selectionMode
          }
        )}
      >
        <Checkbox
          id={`message-select-${message.id}`}
          checked={isSelected}
          onCheckedChange={() => onSelect?.(message)}
          disabled={!!deletionState}
          className={cn(
            "data-[state=checked]:bg-primary",
            "data-[state=checked]:text-primary-foreground",
            "transition-all duration-200",
            "focus-visible:ring-2",
            "focus-visible:ring-primary",
            "focus-visible:ring-offset-2",
            {
              'ring-2 ring-primary/50': isHovered && !isSelected && !deletionState,
              'opacity-50 cursor-not-allowed': !!deletionState
            }
          )}
        />
      </div>
    );
  };

  const ActionButton = ({ icon: Icon, label, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="p-1.5 rounded-md hover:bg-accent/80 transition-colors duration-200"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );


  const renderContent = () => {
    if (message.is_deleted || message.status === 'deleted' || message.type === 'deleted') {
      return (
        <div className="flex items-center gap-2 text-muted-foreground/70 italic text-sm">
          <MessageSquare className="h-4 w-4" />
          <span>This message was deleted</span>
        </div>
      );
    }

    switch (message.type) {
      case "text":
        return (
          <div className="text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        );

      case "code": {


        return (
          <div className="space-y-3 hover:none">
            <div className="flex items-center justify-between bg-accent/30 p-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary"
                >
                  {message.metadata?.language || "plaintext"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {hasOverflow && (
                  <ActionButton
                    icon={isCodeExpanded ? ChevronUp : ChevronDown}
                    label={isCodeExpanded ? "Show less" : "Show more"}
                    onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                  />
                )}
                <ActionButton
                  icon={copied ? Check : Copy}
                  label={copied ? "Copied!" : "Copy code"}
                  onClick={() => handleCopy(message.content)}
                />
              </div>
            </div>
            <div
              ref={codeRef}
              className={`relative rounded-b-lg overflow-hidden transition-all duration-300 ${
                !isCodeExpanded ? "max-h-[300px]" : ""
              }`}
            >
              <SyntaxHighlighter
                language={message.metadata?.language || "javascript"}
                style={vscDarkPlus}
                showLineNumbers
                wrapLines
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  borderRadius: "0 0 0.5rem 0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {message.content}
              </SyntaxHighlighter>
              {!isCodeExpanded && hasOverflow && (
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="h-24 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    <button
                      onClick={() => setIsCodeExpanded(true)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-accent/50 hover:bg-accent/70 transition-colors"
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-sm">Show more</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {isCodeExpanded && hasOverflow && (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsCodeExpanded(false)}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-sm">Show less</span>
                </button>
              </div>
            )}
          </div>
        );
      }



      case "image":
        return (
          <div className="group/image space-y-2">
            <div
              onClick={() => setShowImage(true)}
              className="inline-block"
            >
              <img
                src={message.metadata?.url}
                alt={message.content || "Image"}
                className="cursor-pointer transition-all duration-300 hover:brightness-95"
              />
            </div>
            {message.content && (
              <p className="text-sm text-muted-foreground/80 pl-1">
                {message.content}
              </p>
            )}
            <Dialog open={showImage} onOpenChange={setShowImage}>
              <DialogContent className="max-w-4xl p-2">
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={message.metadata?.url}
                    alt={message.content || "Image"}
                    className="w-full h-auto"
                  />
                  {message.content && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-sm text-white/90">
                        {message.content}
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "voice":
        return (
          <div className="space-y-2 p-2 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Voice Message</span>
              {message.metadata?.duration && (
                <Badge variant="secondary" className="text-xs">
                  {Math.floor(message.metadata.duration / 60)}:
                  {String(message.metadata.duration % 60).padStart(2, "0")}
                </Badge>
              )}
            </div>
            <audio
              src={message.metadata?.url}
              controls
              className="w-full max-w-md rounded"
            />
          </div>
        );

      case "link":
        return (
          <div className="overflow-hidden rounded-lg border border-accent group/link hover:border-primary/30 transition-all duration-300">
            {message.metadata?.preview && (
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={message.metadata.preview}
                  alt="Link preview"
                  className="object-cover w-full h-full transform transition-transform duration-500 group-hover/link:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <a
                  href={message.metadata?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary transition-colors duration-300 flex items-center gap-1 group/link-text"
                >
                  {message.metadata?.title || message.metadata?.url}
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-y-1 group-hover/link-text:opacity-100 group-hover/link-text:translate-y-0 transition-all duration-300" />
                </a>
              </div>
              {message.content && (
                <p className="text-sm text-muted-foreground/80">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary/80">Quoted Message</span>
            </div>
            <blockquote className="relative pl-4 py-2">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 to-primary/20 rounded-full" />
              <p className="text-sm italic text-foreground/70">
                {message.metadata?.sourceText}
              </p>
              {message.content && (
                <p className="text-sm mt-2 text-foreground/90 not-italic">
                  {message.content}
                </p>
              )}
            </blockquote>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={messageRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={!!deletionState || message.is_deleted || message.status === 'deleted'}
      tabIndex={deletionState || message.is_deleted || message.status === 'deleted' ? -1 : 0}
      className={cn(
        "group relative flex gap-3 py-2 px-4",
        "transition-all duration-300 ease-in-out",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        {
          "bg-accent/20": isSelected && !deletionState && !message.is_deleted,
          "hover:bg-accent/10": !isSelected && !deletionState && !message.is_deleted,
          "flex-row-reverse": isOwnMessage,
          "flex-row": !isOwnMessage,
          "cursor-pointer": onSelect && !deletionState && !message.is_deleted,
          "pl-10": isOwnMessage && (showCheckbox || isSelected || selectionMode),
          "opacity-50": message.is_deleted || message.status === 'deleted',
          "pointer-events-none": message.is_deleted || message.status === 'deleted',
          "select-none": message.is_deleted || message.status === 'deleted',
          "bg-destructive/10 border-l-2 border-destructive": deletionState === 'error'
        }
      )}
    >
      {isOwnMessage && onSelect && !deletionState && <SelectionCheckbox />}
      {!isOwnMessage && showAvatar && <MessageAvatar />}
      <div className={cn(
        "flex-1 max-w-2xl",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl p-4 transition-all duration-200",
          isOwnMessage
            ? "bg-primary/10 hover:bg-primary/15"
            : "bg-accent/50 hover:bg-accent/60",
          "shadow-sm hover:shadow-md"
        )}>
          {!isOwnMessage && <MessageHeader />}
          {renderContent()}
          <MessageStatus />
        </div>
      </div>
    </div>
  );
});

export default MessageDisplay;