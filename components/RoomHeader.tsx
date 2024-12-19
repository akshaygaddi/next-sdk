import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Clock,
  Lock,
  Globe,
  Loader2,
  LogOut,
  Shield,
  AlertTriangle,
  Info,
  ChevronRight,
  Settings2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useMediaQuery from "@/hooks/use-media-query"; // You'll need to create this hook

const RoomHeader = ({
                      room,
                      participants,
                      timeRemaining,
                      showParticipants,
                      setShowParticipants,
                      handleLeaveRoom,
                      handleTerminateRoom,
                      isAdmin = false,
                      presenceData = {},
                    }) => {
  const [confirmLeave, setConfirmLeave] = React.useState(false);
  const [confirmTerminate, setConfirmTerminate] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleConfirmAction = async (action) => {
    try {
      setIsLoading(true);
      if (action === 'leave') {
        await handleLeaveRoom();
        setConfirmLeave(false);
      } else if (action === 'terminate') {
        await handleTerminateRoom();
        setConfirmTerminate(false);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Participant Card Component
  const ParticipantCard = React.memo(({ participant, isCreator }) => {
    const presence = presenceData[participant.user_id] || {};

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
        <div className="relative shrink-0">
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${participant.user_id}`}
              alt={`${participant.user_name || participant.user_id}'s avatar`}
            />
            <AvatarFallback>
              {(participant.user_name || participant.user_id).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {presence?.online && (
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate text-sm">
              {participant.user_name || participant.user_id}
            </p>
            {isCreator && (
              <Badge variant="secondary" className="h-5">
                <Shield className="h-3 w-3 mr-1" />
                Owner
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {presence?.typing ? (
              <span className="text-primary">typing...</span>
            ) : (
              "Active"
            )}
          </p>
        </div>
      </div>
    );
  });

  const ParticipantsList = () => (
    <div className="space-y-1">
      {participants
        .sort((a, b) => {
          if (a.user_id === room.created_by) return -1;
          if (b.user_id === room.created_by) return 1;
          return 0;
        })
        .map((participant) => (
          <ParticipantCard
            key={participant.user_id}
            participant={participant}
            isCreator={participant.user_id === room.created_by}
          />
        ))}
    </div>
  );

  const ParticipantsButton = () => {
    // Desktop version
    if (!isMobile) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowParticipants(!showParticipants)}
          className={cn(
            "flex items-center gap-2 px-3 h-8 transition-all",
            showParticipants && "bg-primary/10 text-primary hover:bg-primary/15"
          )}
        >
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium tabular-nums">
            {participants.length}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              showParticipants && "rotate-180"
            )}
          />
        </Button>
      );
    }

    // Mobile version
    return (
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-3 h-8"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium tabular-nums">
              {participants.length}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] p-0 sm:hidden">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle>Participants</SheetTitle>
            <SheetDescription>
              {participants.length} people in this room
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-6rem)] mt-6">
            <div className="px-6 pb-6">
              <ParticipantsList />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="sticky top-0 z-10">
      {/* Main Header */}
      <header className="bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Room Info Section */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-semibold truncate">
                    {room.name}
                  </h1>
                  <div className="flex items-center px-2 py-0.5 text-xs rounded-full bg-accent/30">
                    {room.type === "private" ? (
                      <Lock className="h-3 w-3 text-destructive/70" />
                    ) : (
                      <Globe className="h-3 w-3 text-primary/70" />
                    )}
                  </div>
                </div>

                {/* Time Remaining */}
                {room.expires_at && (
                  <span className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{timeRemaining}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2">
              <ParticipantsButton />

              {/* Room Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span className="sr-only">Room actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs">Room Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setConfirmLeave(true)}
                    className="gap-2 text-sm cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Leave Room
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-destructive">
                        Admin Controls
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setConfirmTerminate(true)}
                        className="gap-2 text-sm text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Shield className="h-4 w-4" />
                        Terminate Room
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Leave Room Dialog */}
      <Dialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Leave Room
            </DialogTitle>
            <DialogDescription>
              You're about to leave this room. You can rejoin later if the room is still active.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="outline" className="text-muted-foreground">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your messages will remain visible to other participants.
            </AlertDescription>
          </Alert>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmLeave(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleConfirmAction('leave')}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
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

      {/* Terminate Room Dialog */}
      {isAdmin && (
        <Dialog open={confirmTerminate} onOpenChange={setConfirmTerminate}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Terminate Room
              </DialogTitle>
              <DialogDescription>
                This action will immediately end the room for all participants.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                • All participants will be removed
                • The room will become inaccessible
                • This action cannot be undone
              </AlertDescription>
            </Alert>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setConfirmTerminate(false)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleConfirmAction('terminate')}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Terminating...
                  </>
                ) : (
                  "Yes, Terminate Room"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoomHeader;