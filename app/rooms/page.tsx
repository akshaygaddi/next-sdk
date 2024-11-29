"use client";
// app/rooms/page.tsx

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import RoomChat from "@/components/RoomChat";
import { useMediaQuery } from "@/hooks/bolt/use-media-query";
import RoomSidebar from "@/components/bolt/room-sidebar";
import WelcomeScreen from "@/components/bolt/welcome-screen";



export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");


  // Reset sidebar state on screen size change
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const Sidebar = (
    <RoomSidebar
      selectedRoom={selectedRoom}
      onRoomSelect={setSelectedRoom}
      isMobile={!isDesktop}
      onClose={() => setSidebarOpen(false)}
    />
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {isDesktop && <div className="w-80 border-r">{Sidebar}</div>}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            {Sidebar}
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        {!isDesktop && (
          <div className="h-14 border-b flex items-center px-4 justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">
              {selectedRoom ? selectedRoom.name : "Chat Rooms"}
            </h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1">
          {selectedRoom ? (
            <RoomChat room={selectedRoom} selectedRoom={selectedRoom}  />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
}
