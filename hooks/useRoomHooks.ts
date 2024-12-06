// hooks/useRoomHooks.ts
import { useMemo, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRoomStore } from '@/store/useRoomStore';
import { toast } from '@/hooks/use-toast';

// Types
interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  created_by: string;
  is_active: boolean;
  room_code: string;
  password: string | null;
  participant_count: number;
  last_message?: {
    content: string;
    created_at: string;
  };
}

interface RoomFilters {
  searchQuery?: string;
  type?: 'public' | 'private' | 'all';
  showJoinedOnly?: boolean;
  sortBy?: 'recent' | 'popular' | 'alphabetical';
}

// Utility function to sort rooms
const sortRooms = (rooms: Room[], sortBy: string = 'recent'): Room[] => {
  return [...rooms].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.participant_count || 0) - (a.participant_count || 0);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return b.last_message
          ? new Date(b.last_message.created_at).getTime() - new Date(a.last_message?.created_at || 0).getTime()
          : -1;
    }
  });
};

// Main hooks
export const useFilteredRooms = (filters: RoomFilters) => {
  const rooms = useRoomStore(state => Array.from(state.rooms.values()));
  const joinedRooms = useRoomStore(state => state.joinedRooms);
  const { searchQuery = '', type = 'all', showJoinedOnly = false, sortBy = 'recent' } = filters;

  return useMemo(() => {
    let filteredRooms = rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = type === 'all' || room.type === type;
      const matchesJoinedFilter = !showJoinedOnly || joinedRooms.has(room.id);

      return matchesSearch && matchesType && matchesJoinedFilter;
    });

    return sortRooms(filteredRooms, sortBy);
  }, [rooms, searchQuery, type, showJoinedOnly, sortBy, joinedRooms]);
};

export const useRoom = (roomId: string) => {
  const room = useRoomStore(state => state.rooms.get(roomId));
  const participants = useRoomStore(state => state.participants.get(roomId));
  const fetchParticipants = useRoomStore(state => state.fetchParticipants);
  const loading = useRoomStore(state => state.loading);

  useEffect(() => {
    if (roomId && !participants) {
      fetchParticipants(roomId);
    }
  }, [roomId, participants, fetchParticipants]);

  return {
    room,
    participants,
    loading: loading.participants,
  };
};

export const useRoomSubscription = (roomId?: string) => {
  const supabase = createClient();
  const fetchRooms = useRoomStore(state => state.fetchRooms);
  const updateRoomParticipantCount = useRoomStore(state => state.updateRoomParticipantCount);
  const updateLastMessage = useRoomStore(state => state.updateLastMessage);

  useEffect(() => {
    const channels: any[] = [];

    // Subscribe to general room updates
    const roomChannel = supabase
      .channel('public:rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: 'is_active=eq.true'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    channels.push(roomChannel);

    // Subscribe to specific room if provided
    if (roomId) {
      // Participants subscription
      const participantsChannel = supabase
        .channel(`room-${roomId}-participants`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'room_participants',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              updateRoomParticipantCount(roomId, 1);
            } else if (payload.eventType === 'DELETE') {
              updateRoomParticipantCount(roomId, -1);
            }
          }
        )
        .subscribe();

      // Messages subscription
      const messagesChannel = supabase
        .channel(`room-${roomId}-messages`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            if (payload.new) {
              updateLastMessage(roomId, {
                content: payload.new.content,
                created_at: payload.new.created_at
              });
            }
          }
        )
        .subscribe();

      channels.push(participantsChannel, messagesChannel);
    }

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [roomId, fetchRooms, updateRoomParticipantCount, updateLastMessage]);
};

export const useRoomActions = (userId: string | null) => {
  const joinRoom = useRoomStore(state => state.joinRoom);
  const leaveRoom = useRoomStore(state => state.leaveRoom);
  const terminateRoom = useRoomStore(state => state.terminateRoom);
  const loading = useRoomStore(state => state.loading);

  const handleJoinRoom = useCallback(async (room: Room, password?: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to join a room",
        variant: "destructive"
      });
      return;
    }

    if (room.type === 'private' && !password) {
      toast({
        title: "Error",
        description: "Password required for private rooms",
        variant: "destructive"
      });
      return;
    }

    try {
      await joinRoom(room, password);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join room",
        variant: "destructive"
      });
    }
  }, [userId, joinRoom]);

  const handleLeaveRoom = useCallback(async (roomId: string) => {
    if (!userId) return;

    try {
      await leaveRoom(roomId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave room",
        variant: "destructive"
      });
    }
  }, [userId, leaveRoom]);

  const handleTerminateRoom = useCallback(async (room: Room) => {
    if (!userId || room.created_by !== userId) {
      toast({
        title: "Error",
        description: "Not authorized to terminate this room",
        variant: "destructive"
      });
      return;
    }

    try {
      await terminateRoom(room);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate room",
        variant: "destructive"
      });
    }
  }, [userId, terminateRoom]);

  return {
    joinRoom: handleJoinRoom,
    leaveRoom: handleLeaveRoom,
    terminateRoom: handleTerminateRoom,
    loading
  };
};

// Utility hooks
export const useRoomPresence = (roomId: string, userId: string | null) => {
  const lastActivityRef = useRef<number>(Date.now());
  const supabase = createClient();

  useEffect(() => {
    if (!roomId || !userId) return;

    const updatePresence = async () => {
      const now = Date.now();
      if (now - lastActivityRef.current < 30000) return; // Update every 30 seconds

      try {
        await supabase
          .from('room_participants')
          .update({ last_activity: new Date().toISOString() })
          .eq('room_id', roomId)
          .eq('user_id', userId);

        lastActivityRef.current = now;
      } catch (error) {
        console.error('Failed to update presence:', error);
      }
    };

    const interval = setInterval(updatePresence, 30000);
    const events = ['mousedown', 'keydown', 'touchstart'];

    const handleActivity = () => {
      updatePresence();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [roomId, userId]);
};

export const useRoomKeyboardShortcuts = (roomId: string) => {
  const setSelectedRoom = useRoomStore(state => state.setSelectedRoom);
  const rooms = useRoomStore(state => Array.from(state.rooms.values()));

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + Arrow navigation between rooms
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();

        const currentIndex = rooms.findIndex(room => room.id === roomId);
        if (currentIndex === -1) return;

        const nextIndex = e.key === 'ArrowUp'
          ? (currentIndex - 1 + rooms.length) % rooms.length
          : (currentIndex + 1) % rooms.length;

        setSelectedRoom(rooms[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [roomId, rooms, setSelectedRoom]);
};