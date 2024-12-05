"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import RoomChat from "@/components/RoomChat";
import  useMediaQuery  from "@/hooks/use-media-query";
import RoomSidebar from "@/components/bolt/room-sidebar";
import WelcomeScreen from "@/components/bolt/welcome-screen";


export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <div
          className={`relative ${
            sidebarOpen ? "w-80" : "w-0"
          } border-r bg-card transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <div className="h-full">
            <RoomSidebar
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
              isMobile={false}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only">Chat Rooms</SheetTitle>
              <SheetDescription className="sr-only">
                Browse and join chat rooms
              </SheetDescription>
            </SheetHeader>
            <RoomSidebar
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
              isMobile={true}
              onClose={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center px-4 justify-between bg-card">
          <div className="flex items-center gap-2">
            {isDesktop ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-muted"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {sidebarOpen ? "Close sidebar" : "Open sidebar"}
                </span>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
            <h1 className="font-semibold">
              {selectedRoom ? selectedRoom.name : "Chat Rooms"}
            </h1>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedRoom ? (
            <RoomChat room={selectedRoom} />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
}