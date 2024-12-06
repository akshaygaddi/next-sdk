import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@/utils/supabase/client';
import { useRoomStore } from '@/store/useRoomStore';
import { useRoomPresence, useRoom } from '@/hooks/useRoomHooks';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast";

// Icons
import {
  Globe, Lock, Users, Crown, Copy, LogOut, Trash2,
  MessageCircle, Clock, Bell, BellOff, Timer,
  Shield, ChevronRight, Activity, MessageSquare,
  DoorOpen, UserPlus, UserMinus, Settings, Info,
  AlertTriangle, CheckCircle2, XCircle, History,
  Save, RefreshCw, Eye, EyeOff, MoreVertical,
  Pin, PinOff, Hash, Timer as TimerIcon,
} from "lucide-react";

// Timer animation variants
const timerVariants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Notification badge component
const NotificationBadge = ({ count }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1 bg-primary text-primary-foreground
                   rounded-full min-w-[20px] h-5 px-1.5 flex items-center
                   justify-center text-xs font-medium"
      >
        {count}
      </motion.div>
    )}
  </AnimatePresence>
);

// Icon button component
const IconButton = memo(({
                           icon: Icon,
                           onClick,
                           label,
                           active = false,
                           disabled = false,
                           variant = "ghost",
                           className = "",
                           showTooltip = true
                         }) => (
  <HoverCard openDelay={0} closeDelay={0}>
    <HoverCardTrigger asChild>
      <Button
        variant={variant}
        size="icon"
        onClick={onClick}
        disabled={disabled}
        className={`relative ${active ? 'text-primary' : ''} ${className}`}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </HoverCardTrigger>
    {showTooltip && (
      <HoverCardContent side="top" align="center" className="py-1 px-2">
        <p className="text-xs">{label}</p>
      </HoverCardContent>
    )}
  </HoverCard>
));

// Room expiry countdown component
const ExpiryCountdown = memo(({ expiresAt, onExpiringSoon }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const secondsLeft = differenceInSeconds(expiry, now);

      if (secondsLeft <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (secondsLeft <= 30 && !isExpiringSoon) {
        setIsExpiringSoon(true);
        onExpiringSoon?.();
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [expiresAt, onExpiringSoon, isExpiringSoon]);

  return (
    <motion.div
      variants={timerVariants}
      initial="initial"
      animate={isExpiringSoon ? "pulse" : "initial"}
      className={`flex items-center gap-1.5 ${
        isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'
      }`}
    >
      <TimerIcon className="h-3 w-3" />
      <span className="text-sm font-medium">{timeLeft}</span>
    </motion.div>
  );
});

// Message preview component
const MessagePreview = memo(({ message, isNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-2 rounded-md ${isNew ? 'bg-primary/5' : 'bg-muted'}`}
  >
    <div className="flex items-start gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={`https://avatar.vercel.sh/${message.user_id}`} />
        <AvatarFallback>{message.user_id.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm line-clamp-2">{message.content}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  </motion.div>
));

// Room status badge component
const RoomStatusBadge = memo(({ type, participantCount, unreadCount }) => (
  <div className="flex items-center gap-2">
    <Badge
      variant={type === 'private' ? 'destructive' : 'default'}
      className="gap-1"
    >
      {type === 'private' ? (
        <>
          <Lock className="h-3 w-3" />
          Private
        </>
      ) : (
        <>
          <Globe className="h-3 w-3" />
          Public
        </>
      )}
    </Badge>
    <Badge variant="secondary" className="gap-1">
      <Users className="h-3 w-3" />
      {participantCount}
    </Badge>
    {unreadCount > 0 && (
      <Badge variant="default" className="gap-1">
        <MessageCircle className="h-3 w-3" />
        {unreadCount}
      </Badge>
    )}
  </div>
));

// Main Room Card Component
const RoomCard = memo(({
                         room,
                         onSelect,
                         onJoin,
                         onLeave,
                         onTerminate,
                         currentUserId,
                         hasJoined,
                         selectedRoom,
                       }) => {
  // State
  const [showDetails, setShowDetails] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  // Hooks
  const supabase = createClient();
  const { participants } = useRoom(room.id);
  const isCreator = room.created_by === currentUserId;
  const isPrivate = room.type === 'private';
  const isSelected = selectedRoom?.id === room.id;
  const isExpired = room.expires_at && new Date(room.expires_at) < new Date();

  // Message subscription
  useEffect(() => {
    if (!hasJoined) return;

    const channel = supabase
      .channel(`room-${room.id}-messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          const newMessage = payload.new;
          setLastMessage(newMessage);

          if (selectedRoom?.id !== room.id) {
            setUnreadCount(prev => prev + 1);

            if (notificationsEnabled) {
              toast({
                title: room.name,
                description: (
                  <div className="flex flex-col gap-2">
                    <p>{newMessage.content}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelect?.(room)}
                    >
                      View Message
                    </Button>
                  </div>
                ),
              });
            }
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [room.id, hasJoined, selectedRoom?.id, notificationsEnabled]);

  // Reset unread count when room is selected
  useEffect(() => {
    if (selectedRoom?.id === room.id) {
      setUnreadCount(0);
    }
  }, [selectedRoom?.id, room.id]);

  // Handlers
  const handleJoinRoom = async () => {
    setIsLoading(true);
    try {
      await onJoin(room, isPrivate ? password : undefined);
      setPassword('');
      setShowPasswordDialog(false);
      setShowPassword(false);
      toast({ description: "Successfully joined the room" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join room"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpiringSoon = () => {
    if (isCreator) {
      toast({
        title: "Room Expiring Soon",
        description: (
          <div className="flex flex-col gap-2">
            <p>This room will expire in 30 seconds</p>
            <Button
              variant="outline"
              onClick={() => handleExtendRoom()}
              className="w-full"
            >
              Extend Room by 30 Minutes
            </Button>
          </div>
        ),
        duration: 10000,
      });
    }
  };

  const handleExtendRoom = async () => {
    setIsLoading(true);
    try {
      const newExpiryDate = new Date(room.expires_at);
      newExpiryDate.setMinutes(newExpiryDate.getMinutes() + 30);

      const { error } = await supabase
        .from('rooms')
        .update({ expires_at: newExpiryDate.toISOString() })
        .eq('id', room.id);

      if (error) throw error;

      toast({
        description: "Room extended by 30 minutes",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to extend room"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`
      ${isSelected ? 'ring-2 ring-primary' : ''}
      ${isExpired ? 'opacity-60' : ''}
      ${isPinned ? 'border-primary/50' : ''}
      relative overflow-hidden transition-all duration-300
    `}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="relative shrink-0">
              {isPrivate ? (
                <div className="p-2 rounded-full bg-destructive/10">
                  <Lock className="h-4 w-4 text-destructive" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
              )}
              <NotificationBadge count={unreadCount} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{room.name}</h3>
                {isCreator && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <RoomStatusBadge
                type={room.type}
                participantCount={room.participant_count}
                unreadCount={unreadCount}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {hasJoined && (
              <>
                <IconButton
                  icon={notificationsEnabled ? Bell : BellOff}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  label={`${notificationsEnabled ? 'Disable' : 'Enable'} notifications`}
                  active={notificationsEnabled}
                />
                <IconButton
                  icon={isPinned ? PinOff : Pin}
                  onClick={() => setIsPinned(!isPinned)}
                  label={isPinned ? 'Unpin room' : 'Pin room'}
                  active={isPinned}
                />
                <IconButton
                  icon={MessageSquare}
                  onClick={() => onSelect?.(room)}
                  label="Open chat"
                  variant="outline"
                  className="text-primary"
                />
              </>
            )}
            {!hasJoined && !isExpired && (
              <IconButton
                icon={DoorOpen}
                onClick={() => isPrivate ? setShowPasswordDialog(true) : handleJoinRoom()}
                label={`Join ${isPrivate ? 'private' : ''} room`}
                variant="outline"
                className="text-primary"
              />
            )}
          </div>
        </div>

        {/* Room Status */}
        <div className="mt-4 space-y-4">
          {/* Capacity Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Room Capacity</span>
              <span>{room.participant_count}/100</span>
            </div>
            <Progress
              value={(room.participant_count / 100) * 100}
              className="h-1.5"
            />
          </div>

          {/* Expiry Timer */}
          {room.expires_at && (
            <div className="flex items-center justify-between">
              <ExpiryCountdown
                expiresAt={room.expires_at}
                onExpiringSoon={handleExpiringSoon}
              />
              {isCreator && !isExpired && (
                <IconButton
                  icon={RefreshCw}
                  onClick={handleExtendRoom}
                  label="Extend room time"
                  disabled={isLoading}
                />
              )}
            </div>
          )}

          {/* Last Message Preview */}
          {hasJoined && lastMessage && (
            <MessagePreview
              message={lastMessage}
              isNew={unreadCount > 0}
            />
          )}
        </div>

        {/* Quick Actions */}
        {hasJoined && (
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://avatar.vercel.sh/${currentUserId}`} />
                <AvatarFallback>{currentUserId.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {participants?.length} members
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isCreator ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <IconButton
                      icon={Trash2}
                      label="Terminate room"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Terminate Room?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All participants will be removed
                        and the room will be permanently closed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onTerminate(room)}
                        className="bg-destructive text-destructive-foreground
                                 hover:bg-destructive/90"
                      >
                        Terminate Room
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <IconButton
                  icon={LogOut}
                  onClick={() => onLeave(room.id)}
                  label="Leave room"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                />
              )}
              <IconButton
                icon={Info}
                onClick={() => setShowDetails(true)}
                label="Room details"
              />
            </div>
          </div>
        )}
      </div>

      {/* Room Details Sheet */}
      <Sheet
        open={showDetails}
        onOpenChange={(open) => {
          setShowDetails(open);
          if (!open) {
            setShowPassword(false);
          }
        }}
      >
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Room Details</SheetTitle>
            <SheetDescription>
              View and manage room settings and participants
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Room Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Room Information</h4>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Room Code</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {room.room_code}
                    </code>
                    <IconButton
                      icon={Copy}
                      onClick={() => {
                        navigator.clipboard.writeText(room.room_code);
                        toast({ description: "Room code copied" });
                      }}
                      label="Copy room code"
                    />
                  </div>
                </div>
                {isPrivate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Password</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {showPassword ? room.password : '••••••'}
                      </code>
                      <IconButton
                        icon={showPassword ? EyeOff : Eye}
                        onClick={() => setShowPassword(!showPassword)}
                        label={showPassword ? 'Hide password' : 'Show password'}
                      />
                      <IconButton
                        icon={Copy}
                        onClick={() => {
                          navigator.clipboard.writeText(room.password!);
                          toast({ description: "Password copied" });
                        }}
                        label="Copy password"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Participants List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Participants</h4>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {participants?.length || 0}
                </Badge>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {participants?.map((participant) => (
                    <div
                      key={participant.user_id}
                      className="flex items-center justify-between p-2 rounded-lg
                               hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${participant.user_id}`}
                          />
                          <AvatarFallback>
                            {participant.user_id.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {participant.user_id === currentUserId ?
                              'You' : participant.user_id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(participant.joined_at),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>
                      {participant.user_id === room.created_by && (
                        <Badge variant="secondary">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Join Private Room Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Join Private Room</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the room password to join {room.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleJoinRoom}
              disabled={!password || isLoading}
            >
              Join Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
});

export default RoomCard;