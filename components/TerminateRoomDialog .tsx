import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { memo } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TerminateRoomDialogProps {
  onTerminate: () => void;
}

export function TerminateRoomDialog({ onTerminate }: TerminateRoomDialogProps) {
  return (
    <AlertDialog>
      <HoverCard>
        <HoverCardTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto p-2">
          <span className="text-sm">Terminate Room</span>
        </HoverCardContent>
      </HoverCard>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the room
            and remove all participants.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onTerminate}
            className="bg-destructive hover:bg-destructive/90"
          >
            Yes, terminate room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}