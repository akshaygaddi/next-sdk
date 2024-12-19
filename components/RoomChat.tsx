"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
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
  Globe,
  Edit2,
  Copy,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import RoomHeader from "@/components/RoomHeader";
import MessageInput from "@/components/MessageInput";
import MessageDisplay from "@/components/messageDisplay";
import { cn } from "@/lib/utils";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { RealtimeChannel } from "@supabase/realtime-js";

// First, update the Message interface to include deleted status
interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  type?: string;
  metadata?: any;
  created_at: string;
  status?: 'sending' | 'sent' | 'error' | 'deleted';
  is_edited?: boolean;
  is_deleted?: boolean;
  user_name?: string;
}

// Interface for participants
interface Participant {
  user_id: string;
  user_name?: string;
  joined_at: string;
}

// Interface for presence data
interface PresenceData {
  [key: string]: {
    online: boolean;
    typing: boolean;
  };
}

// Participant Card Component
const ParticipantCard = React.memo(({
                                      participant,
                                      isCreator,
                                      presenceData
                                    }: {
  participant: Participant;
  isCreator: boolean;
  presenceData: PresenceData;
}) => {
  const presence = presenceData[participant.user_id];

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <div className="relative shrink-0">
        <Avatar className="h-8 w-8 ring-2 ring-primary/10">
          <AvatarImage
            src={`https://avatar.vercel.sh/${participant.user_id}`}
            alt={`${participant.user_name || participant.user_id}'s avatar`}
          />
          <AvatarFallback>
            {(participant.user_name || participant.user_id).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {presence?.online && (
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate text-sm">
            {participant.user_name || participant.user_id}
          </p>
          {isCreator && (
            <Badge variant="secondary" className="h-5">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {presence?.typing ? (
            <span className="text-primary">typing...</span>
          ) : (
            formatDistanceToNow(new Date(participant.joined_at), {
              addSuffix: true,
            })
          )}
        </p>
      </div>
    </div>
  );
});

// Scroll indicator component
const ScrollIndicator = ({ onClick, unreadCount }: { onClick: () => void; unreadCount: number }) => (
  <div
    className="absolute z-50 bottom-20 right-8 cursor-pointer bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      <ArrowLeftFromLine className="h-4 w-4 rotate-90" />
      <span className="text-sm font-medium">{unreadCount} new messages</span>
    </div>
  </div>
);

// Bulk action menu for selected messages
const BulkActionMenu = ({
                          selectedMessages,
                          onDelete,
                          onEdit,
                          currentUser,
                        }: {
  selectedMessages: Message[];
  onDelete: (ids: string[]) => void;
  onEdit: (message: Message) => void;
  currentUser: any;
}) => {
  const handleCopy = () => {
    const text = selectedMessages.map(m => m.content).join('\n\n');
    navigator.clipboard.writeText(text);
    toast({
      description: 'Messages copied to clipboard',
    });
  };

  const canEditMessages = selectedMessages.length === 1 &&
    selectedMessages[0].user_id === currentUser?.id;

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg shadow-xl p-3 z-50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium px-2">
          {selectedMessages.length} selected
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>

        {canEditMessages && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(selectedMessages[0])}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}

        {selectedMessages.every(msg => msg.user_id === currentUser?.id) && (
          <Button
            variant="secondary"
            size="sm"
            className="text-destructive"
            onClick={() => onDelete(selectedMessages.map(m => m.id))}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

// Main RoomChat component
interface EditMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  onSave: (content: string) => Promise<void>;
}

const EditMessageDialog = ({ isOpen, onClose, message, onSave }: EditMessageDialogProps) => {
  const [content, setContent] = useState(message?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (message) {
      setContent(message.content);
    }
  }, [message]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(content);
      onClose();
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <textarea
            className="w-full min-h-[100px] p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your message..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !content.trim() || content === message?.content}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RoomChat = ({
                    room,
                    showSidebar,
                    onToggleSidebar
                  }: {
  room: any;
  showSidebar: boolean;
  onToggleSidebar: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(true);
  const [presenceData, setPresenceData] = useState<PresenceData>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messagesToDelete, setMessagesToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [editMessage, setEditMessage] = useState<Message | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);

  const [deletionStates, setDeletionStates] = useState({});
  // Add this state at the top with other state declarations
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // responsive design specific
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Initialize chat data
  useEffect(() => {
    let mounted = true;

    const initializeChat = async () => {
      try {
        // ... existing initialization code ...
        // Fetch initial data
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

        // Process and set initial messages
        const processedMessages = messagesData.data.map(msg => ({
          ...msg,
          status: 'sent',
          user_name: participantsData.data.find(p => p.user_id === msg.user_id)?.user_name
        }));
        setMessages(processedMessages);
        lastMessageRef.current = processedMessages[processedMessages.length - 1]?.id;

        const channelName = `room:${room.id}:${Math.random().toString(36).slice(2, 7)}`;
        const newChannel = supabase.channel(channelName)
          .on('presence', { event: 'sync' }, () => {
            if (mounted) {
              const state = newChannel.presenceState();
              setPresenceData(state);
            }
          })
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `room_id=eq.${room.id}`
            },
            (payload) => {
              if (!mounted) return;
              console.log('Received realtime event:', payload);

              if (payload.eventType === 'INSERT') {
                setMessages(prev => {
                  // Check if message already exists
                  const exists = prev.some(msg => msg.id === payload.new.id);
                  if (exists) return prev;

                  // Find any temporary version of this message
                  const tempMessageIndex = prev.findIndex(
                    msg => msg.status === 'sending' && msg.content === payload.new.content
                  );

                  if (tempMessageIndex !== -1) {
                    // Replace temporary message with confirmed one
                    const newMessages = [...prev];
                    newMessages[tempMessageIndex] = {
                      ...payload.new,
                      status: 'sent',
                      user_name: participants.find(p => p.user_id === payload.new.user_id)?.user_name
                    };
                    return newMessages;
                  }

                  // Add new message if it's not from current user
                  if (payload.new.user_id !== currentUser?.id) {
                    setUnreadMessages(count => count + 1);
                    return [...prev, {
                      ...payload.new,
                      status: 'sent',
                      user_name: participants.find(p => p.user_id === payload.new.user_id)?.user_name
                    }];
                  }

                  return prev;
                });
              }
              else if (payload.eventType === 'DELETE') {
                // Update the message to show deleted state for all participants
                setMessages(prev => prev.map(msg =>
                  msg.id === payload.old.id
                    ? {
                      ...msg,
                      content: "This message was deleted",
                      is_deleted: true,
                      status: 'deleted',
                      type: 'deleted' // Add this to help with rendering
                    }
                    : msg
                ));

                // Clear deletion states
                setDeletionStates(prev => {
                  const newStates = { ...prev };
                  delete newStates[payload.old.id];
                  return newStates;
                });

                // Remove from selected messages
                setSelectedMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
              }
              else if (payload.eventType === 'UPDATE') {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === payload.new.id
                      ? {
                        ...msg,
                        ...payload.new,
                        content: payload.new.is_deleted ? "This message was deleted" : payload.new.content,
                        status: payload.new.is_deleted ? 'deleted' : 'sent',
                        type: payload.new.is_deleted ? 'deleted' : msg.type,
                        is_deleted: payload.new.is_deleted,
                        user_name: msg.user_name // Preserve the user name
                      }
                      : msg
                  )
                );

                // If message was marked as deleted, remove it from selected messages
                if (payload.new.is_deleted) {
                  setSelectedMessages(prev => prev.filter(msg => msg.id !== payload.new.id));
                  setDeletionStates(prev => {
                    const newStates = { ...prev };
                    delete newStates[payload.new.id];
                    return newStates;
                  });
                }
              }}
          );

        // Subscribe to the channel
        await newChannel.subscribe(async (status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED' && currentUser) {
            await newChannel.track({
              user_id: currentUser.id,
              online: true,
              typing: false
            });
          }
        });

        setChannel(newChannel);
        setLoading(false);

      } catch (err) {
        console.error("Error initializing chat:", err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
        supabase.removeChannel(channel);
      }
    };
  }, [room.id]);

  // Handle message sending
  const handleSendMessage = async (messageData: { content: string; type?: string; metadata?: any }) => {
    if (!messageData || !currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      room_id: room.id,
      user_id: currentUser.id,
      content: messageData.content,
      type: messageData.type || 'text',
      metadata: messageData.metadata || {},
      created_at: new Date().toISOString(),
      status: 'sending' as const,
      user_name: participants.find(p => p.user_id === currentUser.id)?.user_name
    };

    try {
      // Add optimistic message
      setMessages(prev => [...prev, optimisticMessage]);

      const { data, error } = await supabase
        .from("messages")
        .insert({
          room_id: room.id,
          user_id: currentUser.id,
          content: messageData.content,
          type: messageData.type || 'text',
          metadata: messageData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      // The real message will be handled by the subscription
      // We don't need to update the messages state here

      // Scroll to bottom after sending
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Send message error:', error);

      // Update the optimistic message to show error
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, status: 'error' } : msg
      ));

      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleMessageSelect = useCallback((message: Message) => {
    // Add this check
    if (deletionStates[message.id]) return;

    setSelectedMessages(prev => {
      const isSelected = prev.some(m => m.id === message.id);
      return isSelected
        ? prev.filter(m => m.id !== message.id)
        : [...prev, message];
    });
  }, [deletionStates]); // Add deletionStates to dependencies

  const handleDeleteMessages = async (messageIds: string[]) => {
    if (!currentUser || messageIds.length === 0) return;

    try {
      setIsDeleting(true);

      // First, update messages in database to mark them as deleted
      const { error: updateError } = await supabase
        .from("messages")
        .update({
          is_deleted: true,
          content: "This message was deleted"
        })
        .in('id', messageIds)
        .eq('user_id', currentUser.id);

      if (updateError) throw updateError;

      // Optimistically update UI
      setMessages(prev => prev.map(msg =>
        messageIds.includes(msg.id)
          ? {
            ...msg,
            is_deleted: true,
            content: "This message was deleted",
            type: 'deleted',
            status: 'deleted'
          }
          : msg
      ));

      // Clear states
      setDeletionStates(prev => {
        const newStates = { ...prev };
        messageIds.forEach(id => delete newStates[id]);
        return newStates;
      });

      setSelectedMessages([]);
      setMessagesToDelete([]);
      setDeleteDialogOpen(false);

      toast({
        description: `Successfully deleted ${messageIds.length} message${messageIds.length !== 1 ? 's' : ''}`
      });

    } catch (error) {
      console.error('Delete messages error:', error);

      // Revert optimistic updates
      setMessages(prev => prev.map(msg =>
        messageIds.includes(msg.id)
          ? { ...msg, is_deleted: false, status: 'sent' }
          : msg
      ));

      // Update deletion states to show error
      const errorStates = {};
      messageIds.forEach(id => {
        errorStates[id] = 'error';
      });
      setDeletionStates(prev => ({ ...prev, ...errorStates }));

      toast({
        title: 'Error',
        description: 'Failed to delete messages',
        variant: 'destructive'
      });

    } finally {
      setIsDeleting(false);
    }
  };

  // Handle message editing
  const handleEditMessage = async (content: string) => {
    if (!editMessage || !currentUser) return;

    try {
      // Optimistically update the message in the UI
      setMessages(prev =>
        prev.map(msg =>
          msg.id === editMessage.id
            ? { ...msg, content, is_edited: true }
            : msg
        )
      );

      const { error } = await supabase
        .from("messages")
        .update({
          content,
          is_edited: true,
        })
        .eq('id', editMessage.id)
        .eq('user_id', currentUser.id);

      if (error) {
        // If update fails, revert the optimistic update
        setMessages(prev =>
          prev.map(msg =>
            msg.id === editMessage.id
              ? editMessage
              : msg
          )
        );
        throw error;
      }

      setSelectedMessages([]);
      setEditMessage(null);
      setIsEditDialogOpen(false);

      toast({
        description: 'Message updated successfully',
      });
    } catch (error) {
      console.error('Edit message error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message',
        variant: 'destructive',
      });
    }
  };

  // Handle room leaving
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
      console.error('Leave room error:', error);
      toast({
        title: "Error",
        description: "Failed to leave room",
        variant: "destructive",
      });
    }
  };

  // Enhanced scroll handling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
    const bottomThreshold = 100;
    const newIsAtBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;

    setIsAtBottom(newIsAtBottom);
    if (newIsAtBottom) {
      setUnreadMessages(0);
    }
  }, []);

  // Scroll to bottom on new messages if already at bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, []);

  useEffect(() => {
    if (isAtBottom && !isComposing) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, isComposing, scrollToBottom]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  // Mobile-optimized participants modal
  const ParticipantsModal = () => (
    <Dialog open={showParticipantsModal} onOpenChange={setShowParticipantsModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Participants ({participants.length})</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowParticipantsModal(false)}
            >
              <CloseIcon  />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-2 px-1">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.user_id}
                participant={participant}
                isCreator={participant.user_id === room.created_by}
                presenceData={presenceData}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <RoomHeader
          room={room}
          participants={participants}
          showSidebar={showSidebar}
          currentUser={currentUser}
          onToggleSidebar={onToggleSidebar}
          onShowParticipants={() => setShowParticipantsModal(true)}
          isMobile={isMobile}
        />
      </div>

      {/* Messages Area with improved scroll handling */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={cn(
          "flex-1 overflow-y-auto",
          "scroll-smooth",
          "overscroll-y-contain", // Better iOS scroll behavior
          "touch-pan-y", // Smoother touch scrolling
          "bg-dot-pattern" // Optional: subtle background pattern
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {messages.map((message, index) => (
            <MessageDisplay
              key={message.id}
              message={message}
              currentUser={currentUser}
              showAvatar={
                index === 0 ||
                messages[index - 1]?.user_id !== message.user_id ||
                new Date(message.created_at).getTime() -
                new Date(messages[index - 1]?.created_at).getTime() >
                300000
              }
              isSelected={selectedMessages.some(m => m.id === message.id)}
              onSelect={handleMessageSelect}
              presenceData={presenceData}
              selectionMode={selectedMessages.length > 0}
              deletionState={deletionStates[message.id]}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      {/* Floating scroll indicator */}
      {!isAtBottom && unreadMessages > 0 && (
        <button
          onClick={() => scrollToBottom()}
          className={cn(
            "absolute bottom-20 right-4",
            "flex items-center gap-2 px-3 py-2",
            "bg-primary text-primary-foreground",
            "rounded-full shadow-lg",
            "transform transition-transform",
            "hover:scale-105 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          <ArrowLeftFromLine className="h-4 w-4 rotate-90" />
          <span className="text-sm font-medium">{unreadMessages} new</span>
        </button>
      )}

      {/* Message Input with composition handling */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={false}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          isMobile={isMobile}
        />
      </div>

      {/* Selection Actions */}
      {selectedMessages.length > 0 && (
        <div
          className={cn(
            "fixed bottom-20 left-1/2 -translate-x-1/2",
            "flex items-center gap-2 p-2",
            "bg-background/95 backdrop-blur-sm",
            "border rounded-lg shadow-lg",
            "transform transition-all",
            "animate-in slide-in-from-bottom",
            isMobile ? "w-[90%]" : "w-auto"
          )}
        >
          <BulkActionMenu
            selectedMessages={selectedMessages}
            onDelete={handleDeleteMessages}
            onEdit={handleEditMessage}
            currentUser={currentUser}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Mobile Participants Modal */}
      {isMobile && <ParticipantsModal />}

      {/* Edit Dialog */}
      <EditMessageDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditMessage(null);
          setSelectedMessages([]);
        }}
        message={editMessage}
        onSave={handleEditMessage}
        isMobile={isMobile}
      />
    </div>
  );
};

export default RoomChat;