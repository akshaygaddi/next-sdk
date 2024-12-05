// store/useRoomStore.ts
import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { toast } from '@/hooks/use-toast';

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
}

interface RoomStore {
  rooms: Room[];
  joinedRooms: string[];
  selectedRoom: Room | null;
  loading: boolean;
  error: Error | null;

  // Actions
  fetchRooms: () => Promise<void>;
  joinRoom: (room: Room) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  terminateRoom: (room: Room) => Promise<void>;
  setSelectedRoom: (room: Room | null) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  joinedRooms: [],
  selectedRoom: null,
  loading: false,
  error: null,

  fetchRooms: async () => {
    const supabase = createClient();
    set({ loading: true });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch rooms
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*, room_participants(user_id)')
        .eq('is_active', true);

      if (error) throw error;

      // Fetch joined rooms
      const { data: participantRooms } = await supabase
        .from('room_participants')
        .select('room_id')
        .eq('user_id', user.id);

      set({
        rooms: rooms || [],
        joinedRooms: participantRooms?.map(p => p.room_id) || [],
        error: null
      });
    } catch (error) {
      set({ error: error as Error });
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },

  joinRoom: async (room) => {
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('room_participants')
        .insert({ room_id: room.id, user_id: user.id });

      if (error) throw error;

      set(state => ({
        joinedRooms: [...state.joinedRooms, room.id],
        error: null
      }));

      toast({
        title: "Success",
        description: "Joined room successfully"
      });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  leaveRoom: async (roomId) => {
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        joinedRooms: state.joinedRooms.filter(id => id !== roomId),
        selectedRoom: state.selectedRoom?.id === roomId ? null : state.selectedRoom,
        error: null
      }));

      toast({
        title: "Success",
        description: "Left room successfully"
      });
    } catch (error) {
      set({ error: error as Error });
      throw error;
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

      set(state => ({
        rooms: state.rooms.filter(r => r.id !== room.id),
        selectedRoom: state.selectedRoom?.id === room.id ? null : state.selectedRoom,
        error: null
      }));

      toast({
        title: "Success",
        description: "Room terminated successfully"
      });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));