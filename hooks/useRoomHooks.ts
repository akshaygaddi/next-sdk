// hooks/useRoomHooks.ts
import { useMemo, useEffect, useCallback, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRoomStore } from '@/store/useRoomStore';
import { toast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

// Enhanced Types
interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  created_by: string;
  is_active: boolean;
  room_code: string;
  password: string | null;
  participant_count: number;
  expires_at: string | null;
  last_message?: {
    content: string;
    created_at: string;
    user_id: string;
  };
  metadata?: Record<string, any>;
}

interface RoomParticipant {
  room_id: string;
  user_id: string;
  joined_at: string;
  last_activity: string;
  role: 'owner' | 'moderator' | 'member';
  metadata?: Record<string, any>;
}

interface RoomFilters {
  searchQuery?: string;
  type?: 'public' | 'private' | 'all';
  showJoinedOnly?: boolean;
  sortBy?: 'recent' | 'popular' | 'alphabetical' | 'expiringSoon';
  status?: 'active' | 'expired' | 'all';
}

// Utility Functions
const createRoomChannel = (supabase: any, roomId: string, callbacks: {
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onParticipantChange?: (payload: any) => void;
  onMessage?: (payload: any) => void;
}) => {
  const channel = supabase.channel(`room:${roomId}`);

  if (callbacks.onUpdate || callbacks.onDelete) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      },
      (payload: any) => {
        if (payload.eventType === 'UPDATE' && callbacks.onUpdate) {
          callbacks.onUpdate(payload);
        } else if (payload.eventType === 'DELETE' && callbacks.onDelete) {
          callbacks.onDelete(payload);
        }
      }
    );
  }

  if (callbacks.onParticipantChange) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      },
      callbacks.onParticipantChange
    );
  }

  if (callbacks.onMessage) {
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      callbacks.onMessage
    );
  }

  return channel;
};

// Enhanced Hooks
export const useRoom = (roomId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  const fetchRoomData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch room and participant data in parallel
      const [roomResponse, participantsResponse] = await Promise.all([
        supabase
          .from('rooms')
          .select(`
            *,
            messages (
              content,
              created_at,
              user_id
            )
          `)
          .eq('id', roomId)
          .single(),
        supabase
          .from('room_participants')
          .select('*')
          .eq('room_id', roomId)
      ]);

      if (roomResponse.error) throw roomResponse.error;
      if (participantsResponse.error) throw participantsResponse.error;

      setRoom(roomResponse.data);
      setParticipants(participantsResponse.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch room data'));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load room data"
      });
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomId) return;

    const channel = createRoomChannel(supabase, roomId, {
      onUpdate: (payload) => {
        setRoom(prev => ({
          ...prev,
          ...payload.new
        }));

        // Handle room expiration
        if (!payload.new.is_active) {
          toast({
            title: "Room Expired",
            description: "This room has been terminated or expired."
          });
        }
      },
      onDelete: () => {
        setRoom(null);
        toast({
          title: "Room Deleted",
          description: "This room has been deleted."
        });
      },
      onParticipantChange: (payload) => {
        setParticipants(prev => {
          if (payload.eventType === 'DELETE') {
            return prev.filter(p => p.user_id !== payload.old.user_id);
          } else if (payload.eventType === 'INSERT') {
            return [...prev, payload.new];
          } else {
            return prev.map(p =>
              p.user_id === payload.new.user_id ? payload.new : p
            );
          }
        });
      },
      onMessage: (payload) => {
        setRoom(prev => ({
          ...prev,
          last_message: {
            content: payload.new.content,
            created_at: payload.new.created_at,
            user_id: payload.new.user_id
          }
        }));
      }
    });

    channelRef.current = channel;
    channel.subscribe();

    // Initial fetch
    fetchRoomData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchRoomData]);

  return { room, participants, loading, error, refetch: fetchRoomData };
};

// Enhanced room presence tracking
export const useRoomPresence = (roomId: string, userId: string | null) => {
  const supabase = createClient();
  const lastActivityRef = useRef<number>(Date.now());
  const updateQueue = useRef<Promise<any>>(Promise.resolve());

  // Debounced presence update to prevent too many DB writes
  const updatePresence = useCallback(
    debounce(async () => {
      if (!roomId || !userId) return;

      const now = Date.now();
      if (now - lastActivityRef.current < 30000) return;

      updateQueue.current = updateQueue.current.then(async () => {
        try {
          const { error } = await supabase
            .from('room_participants')
            .update({ last_activity: new Date().toISOString() })
            .eq('room_id', roomId)
            .eq('user_id', userId);

          if (error) throw error;
          lastActivityRef.current = now;
        } catch (error) {
          console.error('Failed to update presence:', error);
        }
      });
    }, 1000),
    [roomId, userId]
  );

  useEffect(() => {
    if (!roomId || !userId) return;

    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    const handleActivity = updatePresence;

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    const interval = setInterval(updatePresence, 30000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
      updatePresence.cancel();
    };
  }, [roomId, userId, updatePresence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomId && userId) {
        supabase
          .from('room_participants')
          .update({ last_activity: new Date().toISOString() })
          .eq('room_id', roomId)
          .eq('user_id', userId)
          .then(() => {
            console.log('Final presence update completed');
          })
          .catch(console.error);
      }
    };
  }, [roomId, userId]);
};

// Enhanced filtered rooms hook with caching
export const useFilteredRooms = (filters: RoomFilters) => {
  const rooms = useRoomStore(state => Array.from(state.rooms.values()));
  const joinedRooms = useRoomStore(state => state.joinedRooms);
  const {
    searchQuery = '',
    type = 'all',
    showJoinedOnly = false,
    sortBy = 'recent',
    status = 'active'
  } = filters;

  return useMemo(() => {
    let filteredRooms = rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = type === 'all' || room.type === type;
      const matchesJoinedFilter = !showJoinedOnly || joinedRooms.has(room.id);
      const matchesStatus = status === 'all' ||
        (status === 'active' ? room.is_active : !room.is_active);

      return matchesSearch && matchesType && matchesJoinedFilter && matchesStatus;
    });

    // Enhanced sorting with expiration consideration
    return filteredRooms.sort((a, b) => {
      switch (sortBy) {
        case 'expiringSoon':
          const aExpiry = a.expires_at ? new Date(a.expires_at).getTime() : Infinity;
          const bExpiry = b.expires_at ? new Date(b.expires_at).getTime() : Infinity;
          return aExpiry - bExpiry;
        case 'popular':
          return (b.participant_count || 0) - (a.participant_count || 0);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          const aTime = a.last_message?.created_at
            ? new Date(a.last_message.created_at).getTime()
            : 0;
          const bTime = b.last_message?.created_at
            ? new Date(b.last_message.created_at).getTime()
            : 0;
          return bTime - aTime;
      }
    });
  }, [rooms, searchQuery, type, showJoinedOnly, sortBy, status, joinedRooms]);
};

// Keyboard navigation hook with room switching
export const useRoomKeyboardShortcuts = (
  roomId: string | null,
  onRoomChange: (roomId: string) => void
) => {
  const rooms = useRoomStore(state => Array.from(state.rooms.values()));

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!e.altKey || !roomId) return;

      const currentIndex = rooms.findIndex(room => room.id === roomId);
      if (currentIndex === -1) return;

      let nextIndex: number;
      switch (e.key) {
        case 'ArrowUp':
          nextIndex = (currentIndex - 1 + rooms.length) % rooms.length;
          break;
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % rooms.length;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextRoom = rooms[nextIndex];
      if (nextRoom && nextRoom.is_active) {
        onRoomChange(nextRoom.id);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [roomId, rooms, onRoomChange]);
};