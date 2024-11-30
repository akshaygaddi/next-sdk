"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import bcrypt from "bcryptjs";

const formSchema = z.object({
  roomId: z.string().length(5, "Room ID must be 5 digits"),
  password: z.string().min(1, "Password is required"),
});

export default function JoinPrivateRoomForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { data: room, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("private_room_id", data.roomId)
        .single();

      if (error || !room) {
        toast({
          title: "Error",
          description: "Room not found. Please check the Room ID.",
          variant: "destructive",
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(data.password, room.password);

      if (!passwordMatch) {
        toast({
          title: "Error",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: joinError } = await supabase
        .from("room_participants")
        .insert({ room_id: room.id, user_id: user.id });

      if (joinError) throw joinError;

      toast({
        title: "Success!",
        description: "You have joined the private room.",
      });

      router.push(`/rooms/${room.id}`);
      onClose?.();
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="roomId">Room ID</Label>
        <Input
          id="roomId"
          {...form.register("roomId")}
          placeholder="Enter 5-digit room ID"
        />
        {form.formState.errors.roomId && (
          <p className="text-sm text-red-500">
            {form.formState.errors.roomId.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder="Enter room password"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join Room"}
      </Button>
    </form>
  );
}
