// hooks/useRoomHooks.ts
import { useMemo, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRoomStore } from '@/store/useRoomStore';
import { checkRoomPermission, ROOM_ACTIONS } from '@/utils/room-utils';

export const useFilteredRooms = (searchQuery: string, userId: string | null) => {
  const { rooms, joinedRooms } = useRoomStore();

  return useMemo(() =>
      rooms.filter(room => {
        const isVisible = checkRoomPermission(ROOM_ACTIONS.VIEW, room, userId);
        return room.name.toLowerCase().includes(searchQuery.toLowerCase()) && isVisible;
      }),
    [rooms, searchQuery, userId, joinedRooms]
  );
};

export const useRoomSubscription = () => {
  const { fetchRooms } = useRoomStore();
  const supabase = createClient();

  useEffect(() => {
    let isSubscribed = true;

    const subscription = supabase
      .channel('rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: 'is_active=eq.true'
        },
        () => {
          if (isSubscribed) {
            fetchRooms();
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(subscription);
    };
  }, [fetchRooms]);
};

export const useRoomActions = (userId: string | null) => {
  const { joinRoom, leaveRoom, terminateRoom } = useRoomStore();

  const handleJoinRoom = useCallback(async (room: any) => {
    if (!checkRoomPermission(ROOM_ACTIONS.JOIN, room, userId)) {
      throw new Error('Not authorized to join this room');
    }
    await joinRoom(room);
  }, [userId, joinRoom]);

  const handleLeaveRoom = useCallback(async (roomId: string) => {
    if (!checkRoomPermission(ROOM_ACTIONS.LEAVE, { id: roomId }, userId)) {
      throw new Error('Not authorized to leave this room');
    }
    await leaveRoom(roomId);
  }, [userId, leaveRoom]);

  const handleTerminateRoom = useCallback(async (room: any) => {
    if (!checkRoomPermission(ROOM_ACTIONS.TERMINATE, room, userId)) {
      throw new Error('Not authorized to terminate this room');
    }
    await terminateRoom(room);
  }, [userId, terminateRoom]);

  return {
    handleJoinRoom,
    handleLeaveRoom,
    handleTerminateRoom
  };
};