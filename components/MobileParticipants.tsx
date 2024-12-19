import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Crown } from "lucide-react";

const MobileParticipants = ({
                              participants,
                              showParticipants,
                              setShowParticipants,
                              currentUserId
                            }) => {
  return (
    <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">
            Participants ({participants.length})
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="p-6">
            <div className="space-y-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={participant.avatar}
                      alt={participant.name}
                    />
                    <AvatarFallback className="text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {participant.name}
                      </span>
                      {participant.isAdmin && (
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                      )}
                      {participant.isModerator && (
                        <Shield className="h-3.5 w-3.5 text-primary/70" />
                      )}
                    </div>
                    {currentUserId === participant.id && (
                      <span className="text-xs text-muted-foreground">You</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {participant.status === 'active' && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileParticipants;