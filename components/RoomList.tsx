"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Users, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { terminateRoom } from "@/utils/room/commonLogic";
import { toast } from "@/hooks/use-toast";
import { revalidateTag } from "next/cache";

export default function RoomList({ type, onRoomSelect, selectedRoom }) {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRooms = async () => {
      let query = supabase
        .from("rooms")
        .select(
          `
                *,
                room_participants (user_id)
                `,
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (type === "public") {
        query = query.eq("type", "public");
      } else if (type === "created") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        query = query.eq("created_by", user?.id);
      } else if (type === "joined") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        // First, fetch the room_ids the user has joined
        const { data: participantRooms, error: participantError } = await supabase
          .from("room_participants")
          .select("room_id")
          .eq("user_id", user?.id);

        if (participantError) {
          console.error("Error fetching participant rooms:", participantError);
          return;
        }

        const roomIds = participantRooms.map(participant => participant.room_id);
        // Now filter the rooms based on the room_ids
        query = query.in("id", roomIds);
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

    // Set up real-time subscription
    const roomsSubscription = supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        fetchRooms,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomsSubscription);
    };
  }, [type, supabase]);


  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // add to room_participants
  const subscribeToMembers = async (selectedRoomID) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if the user is already a member of the room
    const { data: existingMembers, error: checkError } = await supabase
      .from("room_participants")
      .select("*")
      .eq("room_id", selectedRoomID)
      .eq("user_id", user?.id);

    if (checkError) {
      console.log(checkError);
      return;
    }

    // If the user is not already a member, insert them
    if (existingMembers.length === 0) {
      const { error } = await supabase.from("room_participants").insert({
        room_id: selectedRoomID,
        user_id: user?.id,
      });

      if (error) {
        console.log(error);
      } else {
        console.log("User added to room participants.");
      }
    } else {
      console.log("User is already a member of the room.");
    }
  };

  // leave Room
  const leaveRoom = async (selectedRoomID) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if the user is a member of the room
    const { data: existingMembers, error: checkError } = await supabase
      .from("room_participants")
      .select("*")
      .eq("room_id", selectedRoomID)
      .eq("user_id", user?.id);

    if (checkError) {
      console.log(checkError);
      return;
    }

    // If the user is a member, delete them from the room
    if (existingMembers.length > 0) {
      const { error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", selectedRoomID)
        .eq("user_id", user?.id);

      if (error) {
        console.log(error);
      } else {
        console.log("User removed from room participants.");

      }
    } else {
      console.log("User is not a member of the room.");
    }
  };

  const handleTerminateRoom = async (room) => {
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
                <Badge
                  variant={room.type === "public" ? "default" : "secondary"}
                >
                  {room.type}
                </Badge>
              </div>
              <CardDescription className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {room.room_participants?.[0]?.count || 0} participants
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(room.created_at).toLocaleDateString()}
                </span>
              </CardDescription>
              {
                type !== "created" && type !== "joined" && (
                  <Button
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedRoom?.id === room.id && "border-primary",
                    )}
                    onClick={() => {
                      onRoomSelect(room);
                      subscribeToMembers(room.id);
                    }}
                  >
                    Join Room
                  </Button>
                )
              }
              {type === "created" && (
                <Button
                  onClick={() => handleTerminateRoom(room)}

                >
                  Terminate
                </Button>
              )}
              {type === "joined" && (
                <Button onClick={() => leaveRoom(room.id)} >
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
}
