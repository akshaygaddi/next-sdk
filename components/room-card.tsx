import React, { useState, memo, useEffect } from 'react';
import { useRoom, useRoomPresence } from '@/hooks/useRoomHooks';
import { createClient } from '@/utils/supabase/client';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { motion } from 'motion/react';
import { toast } from '@/hooks/use-toast';

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
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import {
  Globe, Lock, Users, Crown, Copy, LogOut, Trash2,
  MessageCircle, Bell, BellOff, Timer, Info,
  DoorOpen, Eye, EyeOff, Pin, PinOff, MessageSquare,
  RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";

const IconButton = memo(({
                           icon: Icon,
                           onClick,
                           label,
                           active = false,
                           disabled = false,
                           variant = "ghost",
                           className = ""
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
    <HoverCardContent side="top" align="center" className="py-1 px-2">
      <p className="text-xs">{label}</p>
    </HoverCardContent>
  </HoverCard>
));

// Room expiry countdown component
const ExpiryCountdown = memo(({ expiresAt, onExpired, onExpiringSoon, hasJoined
                                ,isCreator }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const secondsLeft = differenceInSeconds(expiry, now);

      if (secondsLeft <= 0) {
        setTimeLeft('Expired');
        onExpired?.();
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
  }, [expiresAt, onExpired, onExpiringSoon, isExpiringSoon]);

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

  return (
    <motion.div
      variants={timerVariants}
      initial="initial"
      animate={isExpiringSoon ? "pulse" : "initial"}
      className={`flex items-center gap-1.5 ${
        isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'
      }`}
    >
      <Timer className="h-3 w-3" />
      <span className="text-sm font-medium">{timeLeft}</span>
    </motion.div>
  );
});

const NotificationBadge = memo(({ count }) => (
  count > 0 ? (
    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground
                    rounded-full min-w-[20px] h-5 px-1.5 flex items-center
                    justify-center text-xs font-medium">
      {count}
    </div>
  ) : null
));

const RoomCard = memo(({
                         room,
                         currentUserId,
                         onSelect,
                         onJoin,
                         onLeave,
                         onTerminate,
                         selectedRoom,
                       }) => {
  // Local state
  const [showDetails, setShowDetails] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Custom hooks
  const { room: roomData, participants, loading, error } = useRoom(room.id);
  const isSelected = selectedRoom?.id === room.id;
  const hasJoined = participants?.some(p => p.user_id === currentUserId);

  // Add expanded state
  const [expanded, setExpanded] = useState(false);

  // Custom presence handling
  useEffect(() => {
    if (!hasJoined || !room.id || !currentUserId) return;

    const supabase = createClient();
    let lastUpdate = Date.now();

    const updatePresence = async () => {
      try {
        const now = Date.now();
        if (now - lastUpdate < 30000) return; // Throttle updates to every 30 seconds

        const { error } = await supabase
          .from('room_participants')
          .update({ last_activity: new Date().toISOString() })
          .eq('room_id', room.id)
          .eq('user_id', currentUserId);

        if (error) {
          console.warn('Presence update failed:', error.message);
          return;
        }

        lastUpdate = now;
      } catch (err) {
        console.warn('Presence update error:', err);
      }
    };

    // Initial presence update
    updatePresence();

    // Set up interval for periodic updates
    const interval = setInterval(updatePresence, 30000);

    // Update presence on user activity
    const activityEvents = ['mousedown', 'keydown', 'mousemove', 'touchstart'];
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate >= 30000) {
        updatePresence();
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      // Final presence update on unmount
      supabase
        .from('room_participants')
        .update({ last_activity: new Date().toISOString() })
        .eq('room_id', room.id)
        .eq('user_id', currentUserId)
        .then(() => console.log('Final presence update completed'))
        .catch(err => console.warn('Final presence update failed:', err));
    };
  }, [room.id, currentUserId, hasJoined]);

  // Reset unread count when room is selected
  useEffect(() => {
    if (isSelected) {
      setUnreadCount(0);
    }
  }, [isSelected]);

  // Subscribe to new messages
  useEffect(() => {
    if (!hasJoined) return;

    const supabase = createClient();
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
          if (!isSelected && payload.new.user_id !== currentUserId) {
            setUnreadCount(prev => prev + 1);

            if (notificationsEnabled) {
              toast({
                title: room.name,
                description: (
                  <div className="flex flex-col gap-2">
                    <p>{payload.new.content}</p>
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id, hasJoined, isSelected, currentUserId, notificationsEnabled]);

  const handleJoinRoom = async () => {
    try {
      await onJoin(room, password);
      setPassword('');
      setShowPasswordDialog(false);
      toast({ description: "Successfully joined the room" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to join room"
      });
    }
  };

  const handleExtendRoom = async () => {
    const supabase = createClient();

    try {
      const newExpiryDate = new Date(roomData.expires_at);
      newExpiryDate.setMinutes(newExpiryDate.getMinutes() + 2);

      const { error } = await supabase
        .from('rooms')
        .update({ expires_at: newExpiryDate.toISOString() })
        .eq('id', room.id);

      if (error) throw error;

      toast({
        description: "Room extended by 2 minutes",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to extend room"
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted rounded w-1/2 mb-2" />
        <div className="h-4 bg-muted rounded w-1/4" />
      </Card>
    );
  }

  if (error || !roomData) {
    return (
      <Card className="p-4">
        <div className="text-destructive">Failed to load room data</div>
      </Card>
    );
  }

  const isCreator = roomData.created_by === currentUserId;
  const isPrivate = roomData.type === 'private';
  const isExpired = roomData.expires_at && new Date(roomData.expires_at) < new Date();

  return (
    <Card className={`
      ${isSelected ? 'ring-2 ring-primary' : ''}
      ${isExpired ? 'opacity-60' : ''}
      ${isPinned ? 'border-primary/50' : ''}
      relative overflow-hidden transition-all duration-300
    `}>
      <div className="p-4">
        {/* Header Section */}
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

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold tracking-tight">{room.name}</h3>
                {isCreator && (
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{participants?.length || 0} active</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {hasJoined && (
              <>
                <IconButton
                  icon={MessageSquare}
                  onClick={() => onSelect?.(roomData)}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Room Capacity</span>
              <span>{participants.length}/100</span>
            </div>
            <Progress
              value={(participants.length / 100) * 100}
              className="h-1.5"
            />
          </div>

          {/* Expiry Timer */}
          {roomData.expires_at && (
            <div className="flex items-center justify-between">
              <ExpiryCountdown
                expiresAt={roomData.expires_at}
                hasJoined={hasJoined}
                isCreator={isCreator}
                onExpired={async () => {
                  if (isCreator) {
                    await onTerminate(roomData);
                    toast({
                      title: "Room Expired",
                      description: "The room has been automatically terminated due to expiration."
                    });
                  }
                }
              }
                onExpiringSoon={() => {
                  if (isCreator) {
                    toast({
                      title: "Room Expiring Soon",
                      description: (
                        <div className="flex flex-col gap-2">
                          <p>This room will expire in 30 seconds</p>
                          <Button
                            variant="outline"
                            onClick={handleExtendRoom}
                            className="w-full"
                          >
                            Extend Room by 2 Minutes
                          </Button>
                        </div>
                      ),
                      duration: 10000,
                    });
                  }
                }}
              />

            {/*  trash and referesh*/}
              {isCreator && !isExpired && (
                <div className="flex items-center gap-4">
                  {/* Terminate Room Section */}
                  {
                    !hasJoined && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <IconButton
                            icon={Trash2}
                            label="Terminate Room"
                            variant="ghost"
                            className="text-destructive hover:text-destructive/90 transition-colors"
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold text-destructive">
                              Terminate Room?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              This action cannot be undone. All participants will be removed, and
                              the room will be permanently closed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 flex justify-end gap-3">
                            <AlertDialogCancel className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onTerminate(roomData)}
                              className="px-2 py-2 text-white bg-destructive hover:bg-destructive/90 rounded-lg transition-all"
                            >
                              Terminate Room
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )
                  }


                  {/* Extend Room Section */}
                  <IconButton
                    icon={RefreshCw}
                    onClick={handleExtendRoom}
                    label="Extend Room Time"
                  />
                </div>
              )}



            </div>
          )}
        </div>

        {/* Footer Actions */}
        {/* Expand/Collapse Button */}
        {hasJoined && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 hover:bg-accent/50"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Footer Actions - Now conditionally rendered based on expanded state */}
        {hasJoined && expanded && (
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://avatar.vercel.sh/${currentUserId}`} />
                <AvatarFallback>{currentUserId.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {participants.length} members
              </span>
              <IconButton
                icon={LogOut}
                onClick={() => onLeave(room.id)}
                label="Leave room"
                variant="ghost"
                className="text-destructive hover:text-destructive"
              />
            </div>
            <div className="flex items-center gap-2">
              {isCreator && (
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
                        onClick={() => onTerminate(roomData)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Terminate Room
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
          <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Room Details</SheetTitle>
            <SheetDescription>
              View and manage room settings and participants
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Room Information</h4>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Room Code</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {roomData.room_code}
                    </code>
                    <IconButton
                      icon={Copy}
                      onClick={() => {
                        navigator.clipboard.writeText(roomData.room_code);
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
                        {showPassword ? roomData.password : '••••••'}
                      </code>
                      <IconButton
                        icon={showPassword ? EyeOff : Eye}
                        onClick={() => setShowPassword(!showPassword)}
                        label={showPassword ? 'Hide password' : 'Show password'}
                      />
                      <IconButton
                        icon={Copy}
                        onClick={() => {
                          navigator.clipboard.writeText(roomData.password!);
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
                  {participants.length}
                </Badge>
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {participants.map((participant) => {
                    const isOnline = new Date(participant.last_activity).getTime() > Date.now() - 5 * 60 * 1000;

                    return (
                      <div
                        key={participant.user_id}
                        className="flex items-center justify-between p-2 rounded-lg
                                 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://avatar.vercel.sh/${participant.user_id}`}
                              />
                              <AvatarFallback>
                                {participant.user_id.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full
                                        ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {participant.user_id === currentUserId ? 'You' : participant.user_id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Joined {formatDistanceToNow(new Date(participant.joined_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {participant.user_id === roomData.created_by && (
                          <Badge variant="secondary">
                            <Crown className="h-3 w-3 mr-1" />
                            Owner
                          </Badge>
                        )}
                      </div>
                    );
                  })}
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
              Enter the room password to join {roomData.name}
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
              disabled={!password}
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