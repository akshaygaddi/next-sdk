// store/useRoomStore.ts
import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { toast } from '@/hooks/use-toast';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
}

interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  created_by: string;
  expires_at: string | null;
  is_active: boolean;
  room_code: string;
  password: string | null;
  participant_count: number;
  last_message?: {
    content: string;
    created_at: string;
  };
}

interface RoomParticipant {
  room_id: string;
  user_id: string;
  joined_at: string;
}

interface RoomState {
  rooms: Map<string, Room>;
  joinedRooms: Set<string>;
  selectedRoom: Room | null;
  participants: Map<string, RoomParticipant[]>;
  loading: {
    rooms: boolean;
    participants: boolean;
    joining: boolean;
    leaving: boolean;
  };
  error: Error | null;
  lastFetch: number;
}

interface RoomActions {
  fetchRooms: () => Promise<void>;
  fetchParticipants: (roomId: string) => Promise<void>;
  joinRoom: (room: Room, password?: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  terminateRoom: (room: Room) => Promise<void>;
  setSelectedRoom: (room: Room | null) => void;
  updateRoomParticipantCount: (roomId: string, change: number) => void;
  updateLastMessage: (roomId: string, message: { content: string; created_at: string }) => void;
  clearError: () => void;
}

const FETCH_COOLDOWN = 30000; // 30 seconds

export const useRoomStore = create<RoomState & RoomActions>()(
  persist(
    (set, get) => ({
      rooms: new Map(),
      joinedRooms: new Set(),
      selectedRoom: null,
      participants: new Map(),
      loading: {
        rooms: false,
        participants: false,
        joining: false,
        leaving: false,
      },
      error: null,
      lastFetch: 0,

      fetchRooms: async () => {
        const now = Date.now();
        const lastFetch = get().lastFetch;

        // Implement fetch cooldown to prevent excessive requests
        if (now - lastFetch < FETCH_COOLDOWN) {
          return;
        }

        const supabase = createClient();
        set(state => ({ loading: { ...state.loading, rooms: true } }));

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          // Fetch active rooms with participant count
          const { data: rooms, error } = await supabase
            .from('rooms')
            .select(`
              *,
              room_participants(user_id),
              messages(content, created_at)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Fetch joined rooms for current user
          const { data: participantRooms, error: participantError } = await supabase
            .from('room_participants')
            .select('room_id')
            .eq('user_id', user.id);

          if (participantError) throw participantError;

          // Process and store rooms efficiently
          const roomsMap = new Map();
          rooms?.forEach(room => {
            const participantCount = room.room_participants?.length || 0;
            const lastMessage = room.messages?.[0];
            roomsMap.set(room.id, {
              ...room,
              participant_count: participantCount,
              last_message: lastMessage,
            });
          });

          set({
            rooms: roomsMap,
            joinedRooms: new Set(participantRooms?.map(p => p.room_id) || []),
            lastFetch: now,
            error: null,
          });
        } catch (error) {
          set({ error: error as Error });
          toast({
            title: "Error",
            description: "Failed to load rooms",
            variant: "destructive"
          });
        } finally {
          set(state => ({ loading: { ...state.loading, rooms: false } }));
        }
      },

      fetchParticipants: async (roomId: string) => {
        const supabase = createClient();
        set(state => ({ loading: { ...state.loading, participants: true } }));

        try {
          const { data, error } = await supabase
            .from('room_participants')
            .select('*')
            .eq('room_id', roomId);

          if (error) throw error;

          set(state => ({
            participants: new Map(state.participants).set(roomId, data),
            error: null,
          }));
        } catch (error) {
          set({ error: error as Error });
        } finally {
          set(state => ({ loading: { ...state.loading, participants: false } }));
        }
      },

      joinRoom: async (room, password) => {
        const supabase = createClient();
        set(state => ({ loading: { ...state.loading, joining: true } }));

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          // Verify password for private rooms
          if (room.type === 'private' && room.password !== password) {
            throw new Error('Invalid password');
          }

          const { error } = await supabase
            .from('room_participants')
            .insert({ room_id: room.id, user_id: user.id });

          if (error) throw error;

          set(state => ({
            joinedRooms: new Set([...state.joinedRooms, room.id]),
            error: null,
          }));

          // Update participant count
          get().updateRoomParticipantCount(room.id, 1);

          toast({
            description: "Joined room successfully"
          });
        } catch (error) {
          set({ error: error as Error });
          throw error;
        } finally {
          set(state => ({ loading: { ...state.loading, joining: false } }));
        }
      },

      leaveRoom: async (roomId: string) => {
        const supabase = createClient();
        set(state => ({ loading: { ...state.loading, leaving: true } }));

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const { error } = await supabase
            .from('room_participants')
            .delete()
            .eq('room_id', roomId)
            .eq('user_id', user.id);

          if (error) throw error;

          // Update state
          const newJoinedRooms = new Set(get().joinedRooms);
          newJoinedRooms.delete(roomId);

          set(state => ({
            joinedRooms: newJoinedRooms,
            selectedRoom: state.selectedRoom?.id === roomId ? null : state.selectedRoom,
            error: null,
          }));

          // Update participant count
          get().updateRoomParticipantCount(roomId, -1);

          toast({
            description: "Left room successfully"
          });
        } catch (error) {
          set({ error: error as Error });
          throw error;
        } finally {
          set(state => ({ loading: { ...state.loading, leaving: false } }));
        }
      },

      terminateRoom: async (room) => {
        const supabase = createClient();

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');
          if (room.created_by !== user.id) throw new Error('Not authorized');

          const { error } = await supabase
            .from('rooms')
            .update({ is_active: false })
            .eq('id', room.id);

          if (error) throw error;

          // Update state
          const newRooms = new Map(get().rooms);
          newRooms.delete(room.id);

          set(state => ({
            rooms: newRooms,
            selectedRoom: state.selectedRoom?.id === room.id ? null : state.selectedRoom,
            error: null,
          }));

          toast({
            description: "Room terminated successfully"
          });
        } catch (error) {
          set({ error: error as Error });
          throw error;
        }
      },

      setSelectedRoom: (room) => set({ selectedRoom: room }),

      updateRoomParticipantCount: (roomId, change) => {
        set(state => {
          const room = state.rooms.get(roomId);
          if (!room) return state;

          const updatedRoom = {
            ...room,
            participant_count: (room.participant_count || 0) + change,
          };

          const newRooms = new Map(state.rooms);
          newRooms.set(roomId, updatedRoom);

          return { rooms: newRooms };
        });
      },

      updateLastMessage: (roomId, message) => {
        set(state => {
          const room = state.rooms.get(roomId);
          if (!room) return state;

          const updatedRoom = {
            ...room,
            last_message: message,
          };

          const newRooms = new Map(state.rooms);
          newRooms.set(roomId, updatedRoom);

          return { rooms: newRooms };
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'room-store',
      partialize: (state) => ({
        joinedRooms: Array.from(state.joinedRooms),
        lastFetch: state.lastFetch,
      }),
    }
  )
);