"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoomCreationForm from "@/components/RoomCreationForm";

export default function CreateRoomButton({ onRoomCreated }) {
  return (
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
          <RoomCreationForm onRoomCreated={onRoomCreated} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
