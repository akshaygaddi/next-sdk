// hooks/usePresence.js
import { useEffect, useState } from 'react';

export function usePresence(supabase, roomId) {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const presenceChannel = supabase.channel(`presence-${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        setOnlineUsers(new Set(Object.keys(newState)));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: supabase.auth.user().id });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [roomId, supabase]);

  return { onlineUsers };
}