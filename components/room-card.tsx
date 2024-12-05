import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Lock,
  Users,
  Crown,
  Copy,
  LogOut,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RoomCard = ({
                    room,
                    onSelect,
                    onJoin,
                    onLeave,
                    onTerminate,
                    currentUserId,
                    hasJoined,
                    isMobile,
                    onClose
                  }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isCreator = room.created_by === currentUserId;
  const isPrivate = room.type === 'private';

  const handleCopyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast({ description: message });
  };

  return (
    <div className="p-4 rounded-lg border border-border hover:border-primary/20 bg-card/50 space-y-3">
      {/* Room Name and Type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPrivate ? (
            <Lock className="h-4 w-4 text-destructive/70" />
          ) : (
            <Globe className="h-4 w-4 text-primary/60" />
          )}
          <span className="font-medium">{room.name}</span>
        </div>
        {isCreator && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Crown className="h-3 w-3 mr-1" />
            Created
          </Badge>
        )}
      </div>

      {/* Room Info */}
      <div className="flex items-center text-sm text-muted-foreground">
        <Users className="h-3 w-3 mr-1" />
        <span>{room.participant_count || 0}</span>
      </div>

      {/* Private Room Details */}
      {isPrivate && (isCreator || hasJoined) && (
        <div className="space-y-2 bg-muted/50 p-2 rounded-md text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Room ID: {room.room_code}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => handleCopyToClipboard(room.room_code, "Room ID copied")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Password: {showPassword ? room.password : '••••••'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => handleCopyToClipboard(room.password, "Password copied")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {hasJoined ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onLeave(room.id);
              }}
            >
              <LogOut className="h-3 w-3 mr-1" />
              Leave
            </Button>
            {isCreator && (
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onTerminate(room);
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Terminate
              </Button>
            )}
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onJoin(room);
            }}
          >
            Join
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(RoomCard);