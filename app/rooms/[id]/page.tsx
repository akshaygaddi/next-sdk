// app/rooms/[roomId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RoomChat from "@/components/RoomChat";

import { createClient } from "@/utils/supabase/client";
import RoomSidebar from "@/components/bolt/room-sidebar";
import { toast } from "@/hooks/use-toast";
import EmptyRoomsState from "@/components/EmptyRoomState";

const RoomsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [hasRooms, setHasRooms] = useState(false);

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

  // Add this new effect for room deletion subscription
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
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomSubscription);
    };
  }, [params.id, router]);
  // Save sidebar state to localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("showSidebar");
    if (savedSidebarState !== null) {
      setShowSidebar(JSON.parse(savedSidebarState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("showSidebar", JSON.stringify(showSidebar));
  }, [showSidebar]);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView && selectedRoom) {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedRoom]);

  // Handle room loading and selection logic...

  const handleToggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle room loading from URL
  useEffect(() => {
    const loadRoomFromUrl = async () => {
      setIsLoading(true);

      if (params.id) {
        try {
          const { data: room, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", params.id)
            .single();

          if (error) throw error;

          // Check if user is participant
          const { data: participant, error: participantError } = await supabase
            .from("room_participants")
            .select("*")
            .eq("room_id", params.id)
            .eq("user_id", (await supabase.auth.getUser()).data.user.id)
            .single();

          if (participantError) {
            // Not a participant, redirect to rooms list
            router.push("/rooms");
            return;
          }

          setSelectedRoom(room);
          if (isMobile) setShowSidebar(false);
        } catch (error) {
          console.error("Error loading room:", error);
          router.push("/rooms");
        }
      } else {
        setSelectedRoom(null);
        setShowSidebar(true);
      }
    };

    loadRoomFromUrl();
    setIsLoading(false);
  }, [params.id, isMobile]);

  // Handle room selection
  const handleRoomSelect = (room) => {
    if (room) {
      router.push(`/rooms/${room.id}`);
      if (isMobile) setShowSidebar(false);
    } else {
      router.push("/rooms");
      setShowSidebar(true);
    }
  };

  // Handle mobile back button
  const handleBack = () => {
    router.push("/rooms");
    setShowSidebar(true);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`
          ${showSidebar ? "w-80" : "w-0"} 
          transition-all duration-300 ease-in-out
          ${isMobile ? "absolute z-50 h-full" : "relative"}
          border-r bg-card/50 backdrop-blur-sm
          overflow-hidden
        `}
      >
        {showSidebar && (
          <RoomSidebar
            selectedRoom={selectedRoom}
            onRoomSelect={handleRoomSelect}
            isMobile={isMobile}
            onClose={() => setShowSidebar(false)}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedRoom ? (
          <RoomChat
            room={selectedRoom}
            showSidebar={showSidebar}
            onToggleSidebar={handleToggleSidebar}
          />
        ) : (
          <EmptyRoomsState isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
