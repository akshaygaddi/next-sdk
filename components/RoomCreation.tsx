import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RoomCreationForm from "@/components/RoomCreationForm";

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