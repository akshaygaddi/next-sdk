"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Lock,
  Globe, PanelLeftClose, PanelLeftOpen, Quote, Code, BarChart3, Link, Highlighter, MessageSquare, ImageIcon, Mic
} from "lucide-react";
import { formatDistanceToNow, formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MessageInput from "@/components/MessageInput";
import { Card } from "@/components/ui/card";
import  Message  from "@/components/messageDisplay";




// Participant Card Component
const ParticipantCard = React.memo(({ participant, isCreator }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
    <Avatar className="h-8 w-8">
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
        <p className="font-medium truncate text-sm">
          {participant.user_id}
        </p>
        {isCreator && (
          <Badge variant="secondary" className="h-5">
            <Crown className="h-3 w-3 mr-1" />
            Owner
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(participant.joined_at), {
          addSuffix: true,
        })}
      </p>
    </div>
  </div>
));

// Main RoomChat Component
export default function RoomChat({ room,showSidebar, onToggleSidebar }) {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);


  // Load participants visibility from localStorage
  useEffect(() => {
    const savedParticipantsState = localStorage.getItem('showParticipants');
    if (savedParticipantsState !== null) {
      setShowParticipants(JSON.parse(savedParticipantsState));
    }
  }, []);

  // Save participants visibility to localStorage
  useEffect(() => {
    localStorage.setItem('showParticipants', JSON.stringify(showParticipants));
  }, [showParticipants]);

  // Scroll to bottom
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Update timer for room expiration
  useEffect(() => {
    if (!room.expires_at) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const expiresAt = new Date(room.expires_at);
      if (expiresAt > now) {
        setTimeRemaining(formatDistance(expiresAt, now, { addSuffix: true }));
      } else {
        setTimeRemaining("Expired");
        router.push("/rooms");
      }
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(timer);
  }, [room.expires_at, router]);

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

        setLoading(false);
        setTimeout(() => scrollToBottom("auto"), 100);
      } catch (error) {
        if (mounted) {
          setError(error.message);
          setLoading(false);
          toast({
            title: "Error",
            description: "Failed to load chat data",
            variant: "destructive",
          });
        }
      }
    };

    fetchInitialData();

    // Subscribe to room updates
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

    // Subscribe to messages
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
  }, [room.id, scrollToBottom]);

  // Message handlers
  const handleSendMessage = async (messageData) => {
    try {
      const { type, content, ...rest } = messageData;
      const { error } = await supabase.from("messages").insert({
        room_id: room.id,
        user_id: currentUser.id,
        content,
        type,
        metadata: rest, // Additional data like language, poll options, etc.
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Room actions
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p>Failed to load chat</p>
      </div>
    );
  }



  return (
    <div className="flex h-full bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="px-6 py-4 border-b bg-card/50 backdrop-blur-sm supports-[backdrop-filter]:bg-card/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleSidebar}
                      className="shrink-0"
                    >
                      {showSidebar ? (
                        <PanelLeftClose color="#F9802E" className="h-5 w-5 " />
                      ) : (
                        <PanelLeftOpen className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showSidebar ? 'Hide rooms sidebar' : 'Show rooms sidebar'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showSidebar ? 'Hide rooms sidebar' : 'Show rooms sidebar'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Participants Toggle */}


              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{room.name}</h1>
                  {room.type === 'private' ? (
                    <Lock className="h-4 w-4 text-destructive/70" />
                  ) : (
                    <Globe className="h-4 w-4 text-primary/60" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {participants.length} participants
                  </span>
                  {room.expires_at && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {timeRemaining}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowParticipants(!showParticipants)}
                      className="shrink-0"
                    >
                      {showParticipants ? (
                        <EyeOff color='#F9802E' className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showParticipants ? 'Hide participants' : 'Show participants'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showParticipants ? 'Hide participants' : 'Show participants'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage ||
                prevMessage.user_id !== message.user_id ||
                new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 300000;

              const showDate = !prevMessage ||
                new Date(message.created_at).toLocaleDateString() !==
                new Date(prevMessage.created_at).toLocaleDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex items-center my-6">
                      <Separator className="flex-1" />
                      <span className="mx-4 text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <Separator className="flex-1" />
                    </div>
                  )}
                  <Message
                    message={message}
                    currentUser={currentUser}
                    showAvatar={showAvatar}
                  />
                </div>
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          defaultWidth="800px" // Optional custom width
        />
      </div>

      {/* Participants Sidebar */}
      <div
        className={`${
          showParticipants ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden border-l bg-card/50 backdrop-blur-sm`}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Participants</h2>
            <Badge variant="secondary" className="h-6">
              <Users className="h-3 w-3 mr-1" />
              {participants.length}
            </Badge>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {/* Show owner first */}
              {participants
                .sort((a, b) => {
                  if (a.user_id === room.created_by) return -1;
                  if (b.user_id === room.created_by) return 1;
                  return 0;
                })
                .map((participant) => (
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
    </div>
  );
}