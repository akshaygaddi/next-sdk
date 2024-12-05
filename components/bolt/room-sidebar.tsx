import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from "@/components/ui/label";
import {
  Users, Search, Plus, Globe, Lock,Copy,Eye,EyeOff,
  Timer, Trash2, LogOut, Crown, Hourglass, Loader2
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import RoomCreationForm from '@/components/RoomCreationForm';

// Join Private Room Dialog Component


const JoinPrivateRoom = ({ onJoinPrivate }) => {
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode || !password) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("room_code", roomCode)
        .eq("type", "private")
        .eq("is_active", true)
        .single();

      if (roomError || !room) throw new Error("Room not found");
      if (room.password !== password) throw new Error("Invalid password");

      await onJoinPrivate(room);
      setRoomCode("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="roomCode">Room Code</Label>
        <Input
          id="roomCode"
          placeholder="Enter 6-digit room code"
          value={roomCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setRoomCode(value);
          }}
          maxLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter room password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || roomCode.length !== 6 || !password}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join Private Room"
        )}
      </Button>
    </form>
  );
};

// Room Card Component
export const RoomCard = ({
                    room,
                    onSelect,
                    onJoin,
                    onLeave,
                    onTerminate,
                    currentUserId,
                    hasJoined,
                    isMobile,
                    onClose
                  }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isExpiring = room.expires_at && new Date(room.expires_at).getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const isCreator = room.created_by === currentUserId;

  const handleCopyRoomCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(room.room_code);
    toast({
      description: "Room code copied to clipboard",
    });
  };

  const handleCopyPassword = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(room.password);
    toast({
      description: "Password copied to clipboard",
    });
  };

  return (
    <div
      onClick={() => {
        onSelect(room);
        if (isMobile) onClose?.();
      }}
      className="group p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-all duration-200 cursor-pointer bg-card/30 hover:bg-card/50"
    >
      <div className="space-y-3">
        {/* Header with room name and badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {room.type === 'private' ? (
              <Lock className="h-4 w-4 text-destructive/70" />
            ) : (
              <Globe className="h-4 w-4 text-primary/60" />
            )}
            <span className="font-medium text-sm">{room.name}</span>
          </div>
          <div className="flex gap-1">
            {isCreator && (
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Created
              </Badge>
            )}
          </div>
        </div>

        {/* Room details section */}
        <div className="space-y-2">
          {/* Show room code and password for private rooms */}
          {room.type === 'private' && (hasJoined || isCreator) && (
            <div className="text-xs space-y-2 bg-muted/50 rounded-md p-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Room ID: {room.room_code}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 hover:bg-background"
                  onClick={handleCopyRoomCode}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Password: {showPassword ? room.password : '••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 hover:bg-background"
                  onClick={handleCopyPassword}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Room stats and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                {room.participant_count || 0}
              </span>
              {isExpiring && (

                  <Timer className="h-3 w-3 mr-1" />

              )}
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {hasJoined && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeave(room.id);
                  }}
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Leave
                </Button>
              )}
              {isCreator && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTerminate(room);
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Terminate
                </Button>
              )}
              {!hasJoined && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoin(room);
                  }}
                >
                  Join
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export function CreateRoomDialog({ onRoomCreated }) {
  const [open, setOpen] = useState(false);

  const handleRoomCreated = (room) => {
    onRoomCreated(room);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-primary">
          <Plus className="mr-2 h-4 w-4" /> New Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Create a new chat room and invite others
          </DialogDescription>
        </DialogHeader>
        <RoomCreationForm
          onRoomCreated={handleRoomCreated}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// Main Sidebar Component
const RoomSidebar = ({ selectedRoom, onRoomSelect, isMobile, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndRooms = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setCurrentUserId(user.id);

        // Fetch joined rooms
        const { data: participantRooms } = await supabase
          .from('room_participants')
          .select('room_id')
          .eq('user_id', user.id);

        if (participantRooms) {
          setJoinedRooms(participantRooms.map(p => p.room_id));
        }

        // Fetch all active rooms initially
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*, room_participants(user_id)')
          .eq('is_active', true);

        if (roomsError) throw roomsError;
        setRooms(roomsData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load rooms",
          variant: "destructive"
        });
      }
    };

    fetchUserAndRooms();

    // Set up realtime subscriptions
    const roomsSubscription = supabase
      .channel('rooms_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' },
        () => fetchUserAndRooms()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomsSubscription);
    };
  }, []);

  const handleJoinRoom = async (room) => {
    try {
      if (!currentUserId) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('room_participants')
        .insert({
          room_id: room.id,
          user_id: currentUserId
        });

      if (error) throw error;

      setJoinedRooms(prev => [...prev, room.id]);
      onRoomSelect(room);

      toast({
        title: "Success",
        description: "Joined room successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      setJoinedRooms(prev => prev.filter(id => id !== roomId));
      if (selectedRoom?.id === roomId) {
        onRoomSelect(null);
      }

      toast({
        title: "Success",
        description: "Left room successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave room",
        variant: "destructive"
      });
    }
  };

  const handleTerminateRoom = async (room) => {
    try {
      if (currentUserId !== room.created_by) {
        throw new Error('Only room creator can terminate the room');
      }

      const { error } = await supabase
        .from('rooms')
        .update({ is_active: false })
        .eq('id', room.id);

      if (error) throw error;

      if (selectedRoom?.id === room.id) {
        onRoomSelect(null);
      }

      toast({
        title: "Success",
        description: "Room terminated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Filter rooms based on search and visibility rules
  const filteredRooms = rooms
    .filter(room => {
      const isVisible =
        room.type === 'public' || // Show all public rooms
        room.created_by === currentUserId || // Show private rooms created by user
        joinedRooms.includes(room.id); // Show private rooms user has joined

      return room.name.toLowerCase().includes(searchQuery.toLowerCase()) && isVisible;
    });

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur">
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-primary">
                <Plus className="mr-2 h-4 w-4" /> New Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Room</DialogTitle>
                <DialogDescription>Create a new chat room and invite others</DialogDescription>
              </DialogHeader>
              <RoomCreationForm onRoomCreated={onRoomSelect} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Lock className="mr-2 h-4 w-4" /> Join Private
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Private Room</DialogTitle>
                <DialogDescription>Enter room code and password to join</DialogDescription>
              </DialogHeader>
              <JoinPrivateRoom onJoinPrivate={handleJoinRoom} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 px-4">
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="joined">Joined</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="all" className="space-y-2 mt-2">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 animate-pulse bg-muted rounded-lg" />
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelect={onRoomSelect}
                  onJoin={handleJoinRoom}
                  onLeave={handleLeaveRoom}
                  onTerminate={handleTerminateRoom}
                  currentUserId={currentUserId}
                  hasJoined={joinedRooms.includes(room.id)}
                  isMobile={isMobile}
                  onClose={onClose}
                />
              ))
            ) : (
              <Alert>
                <AlertDescription>
                  No rooms found. Try adjusting your search or create a new room.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="joined" className="space-y-2 mt-2">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 animate-pulse bg-muted rounded-lg" />
                ))}
              </div>
            ) : filteredRooms
              .filter(room => joinedRooms.includes(room.id))
              .length > 0 ? (
              filteredRooms
                .filter(room => joinedRooms.includes(room.id))
                .map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={onRoomSelect}
                    onJoin={handleJoinRoom}
                    onLeave={handleLeaveRoom}
                    onTerminate={handleTerminateRoom}
                    currentUserId={currentUserId}
                    hasJoined={true}
                    isMobile={isMobile}
                    onClose={onClose}
                  />
                ))
            ) : (
              <Alert>
                <AlertDescription>
                  You haven't joined any rooms yet.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};


export default React.memo(RoomSidebar);