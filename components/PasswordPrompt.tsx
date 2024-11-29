"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function PasswordPrompt({ room }) {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.rpc("join_private_room", {
        p_room_id: room.id,
        room_password: password,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Joined room successfully!",
          description: `You've joined ${room.name}`,
        });
        router.refresh();
      } else {
        toast({
          title: "Incorrect password",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Error joining room",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-8 bg-card rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">Enter Room Password</h2>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <Button type="submit" className="w-full">
          Join Room
        </Button>
      </form>
    </div>
  );
}
