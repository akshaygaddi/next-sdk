"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import RoomChat from "@/components/RoomChat";
import { createClient } from "@/utils/supabase/client";
import RoomSidebar from "@/components/bolt/room-sidebar";
import { toast } from "@/hooks/use-toast";
import EmptyRoomsState from "@/components/EmptyRoomState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RoomsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [hasRooms, setHasRooms] = useState(false);
  const [isRoomLoading, setIsRoomLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width

  // Check user's rooms
  useEffect(() => {
    const checkUserRooms = async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user.id;
        const { data: rooms, error } = await supabase
          .from("room_participants")
          .select("room_id")
          .eq("user_id", userId);

        if (error) throw error;
        setHasRooms(rooms && rooms.length > 0);
      } catch (error) {
        console.error("Error checking rooms:", error);
        toast({
          variant: "destructive",
          description: "Failed to load rooms",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRooms();
  }, []);

  // Room deletion subscription
  useEffect(() => {
    if (!params.id) return;

    const roomSubscription = supabase
      .channel(`room-${params.id}`)
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${params.id}`,
        },
        () => {
          router.push("/rooms");
          toast({
            description: "This room has been terminated",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomSubscription);
    };
  }, [params.id, router]);

  // Sidebar state persistence
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("showSidebar");
    const savedWidth = localStorage.getItem("sidebarWidth");

    if (savedSidebarState !== null) {
      setShowSidebar(JSON.parse(savedSidebarState));
    }
    if (savedWidth !== null) {
      setSidebarWidth(Number(savedWidth));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("showSidebar", JSON.stringify(showSidebar));
    localStorage.setItem("sidebarWidth", String(sidebarWidth));
  }, [showSidebar, sidebarWidth]);

  // Mobile viewport detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView && selectedRoom) {
        setShowSidebar(false);
      } else if (!isMobileView) {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedRoom]);

  // Room loading from URL
  useEffect(() => {
    const loadRoomFromUrl = async () => {
      if (!params.id) {
        setSelectedRoom(null);
        setShowSidebar(true);
        return;
      }

      setIsRoomLoading(true);
      try {
        const { data: room, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        const userId = (await supabase.auth.getUser()).data.user.id;
        const { data: participant, error: participantError } = await supabase
          .from("room_participants")
          .select("*")
          .eq("room_id", params.id)
          .eq("user_id", userId)
          .single();

        if (participantError) {
          router.push("/rooms");
          toast({
            variant: "destructive",
            description: "You don't have access to this room",
          });
          return;
        }

        setSelectedRoom(room);
        if (isMobile) setShowSidebar(false);
      } catch (error) {
        console.error("Error loading room:", error);
        router.push("/rooms");
        toast({
          variant: "destructive",
          description: "Failed to load room",
        });
      } finally {
        setIsRoomLoading(false);
      }
    };

    loadRoomFromUrl();
  }, [params.id, isMobile, router]);

  const handleRoomSelect = (room) => {
    if (room) {
      setIsRoomLoading(true);
      router.push(`/rooms/${room.id}`);
      if (isMobile) setShowSidebar(false);
    } else {
      router.push("/rooms");
      setShowSidebar(true);
    }
  };

  const handleBack = () => {
    router.push("/rooms");
    setShowSidebar(true);
  };

  const handleToggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-background relative">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          "bg-card/50 backdrop-blur-sm border-r",
          isMobile ? "absolute z-50 h-full" : "relative",
          showSidebar ? `w-[${sidebarWidth}px]` : "w-0"
        )}
      >
        <RoomSidebar
          selectedRoom={selectedRoom}
          onRoomSelect={handleRoomSelect}
          isMobile={isMobile}
          onClose={() => setShowSidebar(false)}
          className={cn(
            "transition-opacity duration-300",
            showSidebar ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {/* Toggle Sidebar Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-4 transition-all duration-300",
          showSidebar ? "left-[336px]" : "left-4",
          "z-50"
        )}
        onClick={handleToggleSidebar}
      >
        {showSidebar ? (
          <PanelLeftClose className="w-4 h-4" />
        ) : (
          <PanelLeftOpen className="w-4 h-4" />
        )}
      </Button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {isRoomLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : selectedRoom ? (
          <RoomChat
            room={selectedRoom}
            showSidebar={showSidebar}
            onToggleSidebar={handleToggleSidebar}
          />
        ) : (
          <EmptyRoomsState isLoading={isLoading} hasRooms={hasRooms} />
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default RoomsPage;