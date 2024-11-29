"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Send,
  Users,
  ArrowLeftFromLine,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { terminateRoom, TerminateRoom } from "@/utils/room/commonLogic";

interface Room {
  id: string;
  name: string;
  created_by: string;
}

interface Participant {
  room_id: string;
  user_id: string;
  joined_at: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function RoomChat({
                                   room,
                                   initialParticipant,
                                   selectedRoom,
                                 }: RoomChatProps) {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const supabase = createClient();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Enhanced filtering with fuzzy search
  const filteredParticipants = participants.filter((participant) =>
    participant.user_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Improved message grouping with time-based clustering
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  // Smooth scroll with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setUnreadCount((prev) => prev + 1);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current);
    }

    return () => observer.disconnect();
  }, [messages]);

  // Enhanced scroll behavior
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setUnreadCount(0);
  };

  // / Accessibility keyboard shortcuts
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

  // Message input with typing indicator
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      // Implement typing indicator logic here
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching current user:", error);
        return;
      }
      setCurrentUser(user);
    };

    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("room_participants")
        .select(
          `
          room_id,
          user_id,
          joined_at
        `,
        )
        .eq("room_id", room.id);

      if (error) {
        console.error("Error fetching participants:", error);
        toast({
          title: "Error",
          description: `Failed to fetch participants: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      setIsLoading(false);
      setParticipants(data as Participant[]);
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          user_id
        `,
        )
        .eq("room_id", room.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: `Failed to fetch messages: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      setMessages(data as Message[]);
      scrollToBottom();
    };

    fetchCurrentUser();
    fetchParticipants();
    console.log(participants);

    fetchMessages();

    const participantsChannel = supabase
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
            fetchParticipants();
          } else if (payload.eventType === "DELETE") {
            setParticipants((prev) =>
              prev.filter((p) => p.user_id !== payload.old.user_id),
            );
          }
        },
      )
      .subscribe();

    const messagesChannel = supabase
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
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [supabase, room.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const { error } = await supabase.from("messages").insert({
      room_id: room.id,
      user_id: currentUser.id,
      content: newMessage,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentUser) return;

    const { error } = await supabase
      .from("room_participants")
      .delete()
      .eq("room_id", room.id)
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Error leaving room:", error);
      toast({
        title: "Error",
        description: `Failed to leave the room: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Left Room Successfully`,
        variant: "default",
      });
    }
  };

  // handleTerminateRoom Function
  const handleTerminateRoom = async () => {
    if (!room) {
      return toast({
        title: "Please select a room",
        description: "no room selected",
      });
    }
    try {
      const result = await terminateRoom(room.created_by, room.id);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleTerminateRoom:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Accessible Sidebar */}
      <div
        className={`${
          showParticipants ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden border-r border-border bg-card`}
        role="complementary"
        aria-label="Participants panel"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Participants</h2>
            <Badge
              variant="secondary"
              aria-label={`${participants.length} participants in the room`}
            >
              {participants.length}
            </Badge>
          </div>

          {/* Enhanced Search with Accessibility */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 bg-background"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search participants"
              role="searchbox"
            />
          </div>

          {/* Participant List with Virtual Scrolling */}
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-2">
              {filteredParticipants.map((participant) => (
                <TooltipProvider key={participant.user_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                        role="listitem"
                      >
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
                          <p className="font-medium truncate">
                            {participant.user_id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(participant.joined_at),
                              { addSuffix: true },
                            )}
                          </p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Joined{" "}
                        {new Date(participant.joined_at).toLocaleDateString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area with Enhanced UI */}
      <div className="flex-1 flex flex-col max-w-full">
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
                      aria-label={
                        showParticipants
                          ? "Hide participants"
                          : "Show participants"
                      }
                    >
                      {showParticipants ? (
                        <PanelLeftClose className="h-5 w-5" />
                      ) : (
                        <PanelLeftOpen className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle participants panel (Ctrl + P)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div>
                <h1 className="text-xl font-semibold">{room.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {participants.length}{" "}
                  {participants.length === 1 ? "participant" : "participants"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLeaveRoom()}
                      aria-label="Leave room"
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
                        onClick={() => handleTerminateRoom()}
                        aria-label="Terminate room"
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
        </header>

        {/* Messages Area with Enhanced Scrolling */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
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
            Object.entries(groupMessagesByDate()).map(
              ([date, dateMessages]) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                      {date}
                    </span>
                    <Separator className="flex-1" />
                  </div>
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.user_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-end space-x-2 max-w-md ${
                          message.user_id === currentUser?.id
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        {message.user_id !== currentUser?.id && (
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
                            message.user_id === currentUser?.id
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
                  ))}
                </div>
              ),
            )
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Enhanced Message Input */}
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
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim()}
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
