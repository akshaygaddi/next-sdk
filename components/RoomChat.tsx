import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Users,
  ArrowLeftFromLine,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Loader2,
  AlertCircle,
  Crown,
} from "lucide-react";
import { formatDistanceToNow, formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVirtualizer } from '@tanstack/react-virtual';

// Message component for better performance
const ChatMessage = React.memo(({ message, currentUser, isLastMessage }) => {
  const isOwnMessage = message.user_id === currentUser?.id;

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-end space-x-2 max-w-md ${
          isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://avatar.vercel.sh/${message.user_id}`}
              alt={`${message.user_id}'s avatar`}
            />
            <AvatarFallback>
              {message.user_id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`group relative px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-accent rounded-tl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <p className="text-xs mt-1 opacity-70">
            {formatDistanceToNow(new Date(message.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
});

// Participant component
const ParticipantCard = React.memo(({ participant, isCreator }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${participant.user_id}`}
              alt={`${participant.user_id}'s avatar`}
            />
            <AvatarFallback>
              {participant.user_id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">
                {participant.user_id}
              </p>
              {isCreator && (
                <Crown className="h-3 w-3 text-primary/70" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(participant.joined_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Joined {new Date(participant.joined_at).toLocaleDateString()}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

// Main RoomChat component
export default function RoomChat({ room }) {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Memoize filtered participants
  const filteredParticipants = useMemo(() =>
      participants.filter((participant) =>
        participant.user_id.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [participants, searchQuery]
  );

  // Virtualized messages list
  const messageVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollAreaRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  // Room expiration timer
  useEffect(() => {
    if (!room.expires_at) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const expiresAt = new Date(room.expires_at);
      if (expiresAt > now) {
        setTimeRemaining(formatDistance(expiresAt, now, { addSuffix: true }));
      } else {
        setTimeRemaining("Expired");
        router.push("/rooms"); // Auto redirect if room expired
      }
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(timer);
  }, [room.expires_at]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        setShowParticipants((prev) => !prev);
      }
      if (e.ctrlKey && e.key === "j") {
        e.preventDefault();
        messageInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Message input with debounced typing indicator
  const handleMessageChange = useCallback((e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  }, [isTyping]);

  // Initialize data and subscriptions
  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const [userData, participantsData, messagesData] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("room_participants")
            .select("*")
            .eq("room_id", room.id),
          supabase
            .from("messages")
            .select("*")
            .eq("room_id", room.id)
            .order("created_at", { ascending: true })
        ]);

        if (!mounted) return;

        if (userData.error) throw userData.error;
        setCurrentUser(userData.data.user);

        if (participantsData.error) throw participantsData.error;
        setParticipants(participantsData.data);

        if (messagesData.error) throw messagesData.error;
        setMessages(messagesData.data);

        setIsLoading(false);
        setTimeout(() => scrollToBottom("auto"), 100);
      } catch (error) {
        if (mounted) {
          setError(error.message);
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Failed to load chat data",
            variant: "destructive",
          });
        }
      }
    };

    fetchInitialData();

    // Realtime subscriptions
    const participantsSubscription = supabase
      .channel("room_participants")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_participants",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setParticipants((prev) => [...prev, payload.new]);
            toast({
              description: `${payload.new.user_id} joined the room`,
            });
          } else if (payload.eventType === "DELETE") {
            setParticipants((prev) =>
              prev.filter((p) => p.user_id !== payload.old.user_id)
            );
            toast({
              description: `${payload.old.user_id} left the room`,
            });
          }
        }
      )
      .subscribe();

    const messagesSubscription = supabase
      .channel("room_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(participantsSubscription);
      supabase.removeChannel(messagesSubscription);
    };
  }, [room.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      const { error } = await supabase.from("messages").insert({
        room_id: room.id,
        user_id: currentUser.id,
        content: newMessage.trim(),
        type: "text",
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", room.id)
        .eq("user_id", currentUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Left room successfully",
      });
      router.push("/rooms");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave room",
        variant: "destructive",
      });
    }
  };

  const handleTerminateRoom = async () => {
    if (currentUser?.id !== room.created_by) return;

    try {
      const { error } = await supabase
        .from("rooms")
        .update({ is_active: false })
        .eq("id", room.id);

      if (error) throw error;

      toast({
        description: "Room terminated successfully",
      });
      router.push("/rooms");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate room",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Participants Sidebar */}
      <div
        className={`${
          showParticipants ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden border-r border-border bg-card`}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Participants</h2>
            <Badge variant="secondary">
              {participants.length}
            </Badge>
          </div>

          <div className="relative">
            <Input
              className="pl-10 bg-background"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search participants"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-2">
              {filteredParticipants.map((participant) => (
                <ParticipantCard
                  key={participant.user_id}
                  participant={participant}
                  isCreator={participant.user_id === room.created_by}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-full">
        {/* Chat Header */}
        <header className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowParticipants(!showParticipants)}
                    >
                      {showParticipants ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle participants panel (Ctrl + P)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{room.name}</h1>
                  {room.type === 'private' && (
                    <Badge variant="outline" className="text-destructive bg-destructive/10">
                      Private
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {participants.length} participants
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLeaveRoom}
                    >
                      <ArrowLeftFromLine className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Leave room</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {currentUser?.id === room.created_by && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleTerminateRoom}
                      >
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Terminate room</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          {room.expires_at && (
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {timeRemaining ? `Expires ${timeRemaining}` : 'No expiration set'}
            </div>
          )}
        </header>

        {/* Messages Area */}
        <ScrollArea
          className="flex-1 p-6"
          ref={scrollAreaRef}
          onScroll={(e) => {
            const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
            if (bottom) {
              messageVirtualizer.scrollToIndex(messages.length - 1);
            }
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive">
              <AlertCircle className="h-8 w-8 mr-2" />
              <p>Failed to load messages</p>
            </div>
          ) : (
            <div
              style={{
                height: `${messageVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {messageVirtualizer.getVirtualItems().map((virtualRow) => {
                const message = messages[virtualRow.index];
                const isFirstInDay = virtualRow.index === 0 ||
                  new Date(message.created_at).toLocaleDateString() !==
                  new Date(messages[virtualRow.index - 1].created_at).toLocaleDateString();

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isFirstInDay && (
                      <div className="flex items-center space-x-4 my-4">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                        <Separator className="flex-1" />
                      </div>
                    )}
                    <ChatMessage
                      message={message}
                      currentUser={currentUser}
                      isLastMessage={virtualRow.index === messages.length - 1}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <Input
              ref={messageInputRef}
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Type your message... (Ctrl + J to focus)"
              className="flex-1"
              aria-label="Message input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={!currentUser}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim() || !currentUser}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message (Enter)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
          {isTyping && (
            <p className="text-xs text-muted-foreground mt-1">
              Someone is typing...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}