"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  ArrowLeftFromLine,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";

const HeaderIcon = ({ icon: Icon, onClick, tooltip, color }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="h-8 w-8"
        >
          <Icon className="h-4 w-4" color={color} />
          <span className="sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const RoomHeader = ({
                      room,
                      participants,
                      timeRemaining,
                      showParticipants,
                      currentUser,
                      setShowParticipants,
                      handleLeaveRoom,
                    }) => {
  const [confirmLeave, setConfirmLeave] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  const handleConfirmLeave = async () => {
    try {
      setIsLeaving(true);
      await handleLeaveRoom();
    } catch (error) {
      console.error("Error leaving room:", error);
    } finally {
      setIsLeaving(false);
      setConfirmLeave(false);
    }
  };

  return (
    <header className="pl-20 px-4 py-2 border-b bg-card/50 backdrop-blur-lg sticky top-0 z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 truncate">
              <h1 className="text-base font-semibold truncate">{room.name}</h1>
              {room.type === "private" ? (
                <Lock className="h-3 w-3 text-destructive/70 shrink-0" />
              ) : (
                <Globe className="h-3 w-3 text-primary/60 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participants.length}
              </span>
              {room.expires_at && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeRemaining}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <HeaderIcon
            icon={showParticipants ? EyeOff : Eye}
            onClick={() => setShowParticipants(!showParticipants)}
            tooltip={showParticipants ? "Hide participants" : "Show participants"}
            color={showParticipants ? "#F9802E" : undefined}
          />

          <Dialog open={confirmLeave} onOpenChange={setConfirmLeave}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeftFromLine className="h-4 w-4" />
                <span className="sr-only">Leave room</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Room</DialogTitle>
                <DialogDescription>
                  Are you sure you want to leave this room? You can rejoin later if the room is still active.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmLeave(false)}
                  disabled={isLeaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmLeave}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Leaving...
                    </>
                  ) : (
                    "Leave Room"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default RoomHeader;