"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { Users, Clock, Search, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { terminateRoom } from "@/utils/room/commonLogic";
import RoomCreationForm from "@/components/RoomCreationForm";

interface RoomSidebarProps {
  selectedRoom: any;
  onRoomSelect: (room: any) => void;
  isMobile: boolean;
  onClose?: () => void;
}

export default function RoomSidebar({
                                      selectedRoom,
                                      onRoomSelect,
                                      isMobile,
                                      onClose,
                                    }: RoomSidebarProps) {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Room list component
  const RoomList = ({ type }) => {
    const [rooms, setRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchRooms = async () => {
        let query = supabase
          .from("rooms")
          .select(`*, room_participants (user_id)`)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (type === "live") {
          query = query.eq("type", "public");
        } else if (type === "created") {
          const { data: { user } } = await supabase.auth.getUser();
          query = query.eq("created_by", user?.id);
        } else if (type === "joined") {
          const { data: { user } } = await supabase.auth.getUser();
          const { data: participantRooms } = await supabase
            .from("room_participants")
            .select("room_id")
            .eq("user_id", user?.id);

          if (participantRooms) {
            const roomIds = participantRooms.map((p) => p.room_id);
            query = query.in("id", roomIds);
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching rooms:", error);
          return;
        }

        setRooms(data);
        setLoading(false);
      };

      fetchRooms();

      const roomsSubscription = supabase
        .channel("rooms")
        .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, fetchRooms)
        .subscribe();

      return () => {
        supabase.removeChannel(roomsSubscription);
      };
    }, [type]);

    const handleJoinRoom = async (room) => {
      const { data: { user } } = await supabase.auth.getUser();

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("room_participants")
        .select()
        .eq("room_id", room.id)
        .eq("user_id", user.id)
        .single();

      if (!existingMember) {
        const { error } = await supabase
          .from("room_participants")
          .insert({ room_id: room.id, user_id: user.id });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to join room",
            variant: "destructive",
          });
          return;
        }
      }

      onRoomSelect(room);
      if (isMobile) onClose?.();
    };

    const handleLeaveRoom = async (roomId) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to leave room",
          variant: "destructive",
        });
      } else {
        if (selectedRoom?.id === roomId) {
          onRoomSelect(null);
        }
      }
    };

    const handleTerminateRoom = async (room) => {
      try {
        const result = await terminateRoom(room.created_by, room.id);
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          });
          if (selectedRoom?.id === room.id) {
            onRoomSelect(null);
          }
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    const filteredRooms = rooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {filteredRooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <Badge variant={room.type === "public" ? "default" : "secondary"}>
                    {room.type}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {room.room_participants?.length || 0} participants
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(room.created_at).toLocaleDateString()}
                  </span>
                </CardDescription>
                {type === "live" && (
                  <Button
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedRoom?.id === room.id && "border-primary"
                    )}
                    onClick={() => handleJoinRoom(room)}
                  >
                    Join Room
                  </Button>
                )}
                {type === "created" && (
                  <Button onClick={() => handleTerminateRoom(room)}>
                    Terminate
                  </Button>
                )}
                {type === "joined" && (
                  <Button onClick={() => handleLeaveRoom(room.id)}>
                    Leave Room
                  </Button>
                )}
              </CardHeader>
            </Card>
          ))}

          {filteredRooms.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No rooms found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border">
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>
                Create a new chat room and invite others to join.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <RoomCreationForm onRoomCreated={onRoomSelect} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="available" className="flex-1">
        <div className="px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="flex-1 pt-2">
          <Tabs defaultValue="live" className="flex-1">
            <div className="px-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="created">My Rooms</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(100vh-220px)] px-4">
              <TabsContent value="live" className="mt-2">
                <RoomList type="live" />
              </TabsContent>
              <TabsContent value="created" className="mt-2">
                <RoomList type="created" />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value="joined" className="flex-1 pt-2">
          <ScrollArea className="h-[calc(100vh-170px)] px-4">
            <RoomList type="joined" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}