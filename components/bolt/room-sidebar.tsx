"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import CreateRoomButton from "./create-room-button";
import { cn } from "@/lib/utils";
import RoomList from "@/components/RoomList";

export default function RoomSidebar({
  className,
  selectedRoom,
  onRoomSelect,
  isMobile,
  onClose,
}) {
  return (
    <div
      className={cn("flex h-full flex-col bg-card border-r border", className)}
    >
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CreateRoomButton onRoomCreated={onRoomSelect} />
      </div>

      <Tabs defaultValue="available" className="flex-1">
        <div className="px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="flex-1 pt-2">
          <Tabs defaultValue="live" className="flex-1">
            <div className="px-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="created">My Rooms</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(100vh-220px)] px-4">
              <TabsContent value="live" className="mt-2">
                <RoomList
                  type="live"
                  selectedRoom={selectedRoom}
                  onRoomSelect={(room) => {
                    onRoomSelect(room);
                    if (isMobile) onClose?.();
                  }}
                />
              </TabsContent>
              <TabsContent value="created" className="mt-2">
                <RoomList
                  type="created"
                  selectedRoom={selectedRoom}
                  onRoomSelect={(room) => {
                    onRoomSelect(room);
                    if (isMobile) onClose?.();
                  }}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value="joined" className="flex-1 pt-2">
          <ScrollArea className="h-[calc(100vh-170px)] px-4">
            <RoomList
              type="joined"
              selectedRoom={selectedRoom}
              onRoomSelect={(room) => {
                onRoomSelect(room);
                if (isMobile) onClose?.();
              }}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
