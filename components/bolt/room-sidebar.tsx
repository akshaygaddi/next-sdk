// RoomSidebar.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import RoomCreationForm from "@/components/RoomCreationForm";
import JoinPrivateRoom from "@/components/join-private-room";
import RoomCard from "@/components/room-card";

const RoomSidebar = ({ selectedRoom, onRoomSelect, isMobile, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningPrivate, setIsJoiningPrivate] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [initialLoading, setInitialLoading] = useState(true);
  const isFirstRender = useRef(true);
  // Initialize rooms and user
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        // Fetch rooms and participants in parallel
        const [roomsData, participantsData] = await Promise.all([
          supabase.from("rooms").select("*").eq("is_active", true),
          supabase
            .from("room_participants")
            .select("room_id")
            .eq("user_id", user?.id),
        ]);

        if (roomsData.error) throw roomsData.error;
        if (participantsData.error) throw participantsData.error;

        setRooms(roomsData.data || []);
        setJoinedRooms(participantsData.data?.map((p) => p.room_id) || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load rooms",
          variant: "destructive",
        });
      } finally {
        // Only set initialLoading to false if this is the first render
        if (isFirstRender.current) {
          setInitialLoading(false);
          isFirstRender.current = false;
        }
      }
    };

    initialize();

    // Set up real-time subscription for rooms
    const roomSubscription = supabase
      .channel("rooms_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        () => {
          // Don't show loading state for real-time updates
          initialize();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomSubscription);
    };
  }, []);
  const handleJoinRoom = async (room) => {
    try {
      const { error } = await supabase.from("room_participants").insert({
        room_id: room.id,
        user_id: currentUserId,
      });

      if (error) throw error;

      setJoinedRooms((prev) => [...prev, room.id]);
      onRoomSelect(room); // This will show the RoomChat

      toast({
        description: "Joined room successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      });
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      const { error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", currentUserId);

      if (error) throw error;

      setJoinedRooms((prev) => prev.filter((id) => id !== roomId));
      if (selectedRoom?.id === roomId) {
        onRoomSelect(null);
      }

      toast({
        description: "Left room successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave room",
        variant: "destructive",
      });
    }
  };

  const handleTerminateRoom = async (room) => {
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", room.id);

      if (error) throw error;

      if (selectedRoom?.id === room.id) {
        onRoomSelect(null);
      }

      toast({
        description: "Room deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };
  // Filter rooms based on search and visibility
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isVisible =
      room.type === "public" ||
      room.created_by === currentUserId ||
      joinedRooms.includes(room.id);
    return matchesSearch && isVisible;
  });

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse bg-muted rounded-lg" />
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur">
      <div className="p-4 space-y-4">
        {/* Create and Join buttons */}
        <div className="flex gap-2">
          <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-primary">
                <Plus className="mr-2 h-4 w-4" /> New Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Room</DialogTitle>
                <DialogDescription>
                  Create a new chat room and invite others
                </DialogDescription>
              </DialogHeader>
              <RoomCreationForm
                onRoomCreated={(room) => {
                  onRoomSelect(room);
                  setIsCreatingRoom(false);
                  setJoinedRooms((prev) => [...prev, room.id]);
                }}
                onClose={() => setIsCreatingRoom(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isJoiningPrivate} onOpenChange={setIsJoiningPrivate}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Lock className="mr-2 h-4 w-4" /> Join Private
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Private Room</DialogTitle>
                <DialogDescription>
                  Enter room code and password to join
                </DialogDescription>
              </DialogHeader>
              <JoinPrivateRoom
                onRoomSelect={(room) => {
                  onRoomSelect(room);
                  setJoinedRooms((prev) => [...prev, room.id]);
                  setIsJoiningPrivate(false);
                }}
                onClose={() => setIsJoiningPrivate(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
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

      {/* Room Tabs */}
      <Tabs defaultValue="all" className="flex flex-col flex-1 min-h-0">
        <TabsList className="grid w-full grid-cols-2 px-4">
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="joined">Joined</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4">
          <TabsContent value="all" className="mt-2 space-y-2">
            {initialLoading ? (
              <LoadingSkeleton />
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  currentUserId={currentUserId}
                  onSelect={onRoomSelect}
                  onJoin={handleJoinRoom}
                  onLeave={handleLeaveRoom}
                  onTerminate={handleTerminateRoom}
                />
              ))
            ) : (
              <Alert>
                <AlertDescription>
                  No rooms found. <br /> Try adjusting your search or <br /> create a new
                  room.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="joined" className="mt-2 space-y-2">
            {initialLoading ? (
              <LoadingSkeleton />
            ) : filteredRooms.filter((room) => joinedRooms.includes(room.id))
                .length > 0 ? (
              filteredRooms
                .filter((room) => joinedRooms.includes(room.id))
                .map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    currentUserId={currentUserId}
                    hasJoined={true}
                    isSelected={selectedRoom?.id === room.id}
                    onSelect={onRoomSelect}
                    onJoin={handleJoinRoom}
                    onLeave={handleLeaveRoom}
                    onTerminate={handleTerminateRoom}
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
