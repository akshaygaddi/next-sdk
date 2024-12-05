import React, { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JoinPrivateRoom = ({ onRoomSelect, onClose }) => {
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode || !password) return;

    setIsLoading(true);

    try {
      // First find the room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .eq('type', 'private')
        .eq('is_active', true)
        .single();

      if (roomError || !room) {
        throw new Error('Room not found');
      }

      // Verify password
      if (room.password !== password) {
        throw new Error('Invalid password');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      // Check if already joined
      const { data: existingParticipant } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', room.id)
        .eq('user_id', user.id)
        .single();

      if (existingParticipant) {
        // If already joined, just select the room
        onRoomSelect(room);
        onClose();
        return;
      }

      // Join the room
      const { error: joinError } = await supabase
        .from('room_participants')
        .insert({
          room_id: room.id,
          user_id: user.id
        });

      if (joinError) throw joinError;

      // Clear form and select room
      setRoomCode("");
      setPassword("");

      // Important: Select the room to show chat
      onRoomSelect(room);
      onClose();

      toast({
        description: "Joined room successfully",
      });
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

export default React.memo(JoinPrivateRoom);