"use client";

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Room, Player, RoomStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function useRoom(roomId: string) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase is not configured. Please add your credentials to .env.local");
      return;
    }

    let isMounted = true;
    let channel: any = null;

    const init = async () => {
      try {
        const uid = localStorage.getItem("uiwars_userId");
        const nickname = localStorage.getItem("uiwars_nickname");
        
        if (!uid || !nickname) throw new Error("Local identity lost!");
        
        if (!isMounted) return;
        setUserId(uid);

        // Fetch initial room state
        const { data: initialRoom, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (roomError && roomError.code !== "PGRST116") {
          throw roomError;
        }

        if (!isMounted) return;

        if (initialRoom) {
          setRoom({
            id: initialRoom.id,
            prompt: initialRoom.prompt,
            mode: initialRoom.mode,
            level: initialRoom.level,
            timeLimit: initialRoom.time_limit,
            votingTime: initialRoom.voting_time,
            status: initialRoom.status,
            timerEndsAt: initialRoom.timer_ends_at,
            hostId: initialRoom.host_id,
            createdAt: initialRoom.created_at,
          });
        } else {
          setError("Room not found");
        }

        // Fetch initial players
        const { data: initialPlayers, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('room_id', roomId);
        
        if (playersError) throw playersError;

        if (!isMounted) return;

        if (initialPlayers) {
          const loadedPlayers = initialPlayers.map(p => ({
            id: p.id,
            name: p.name,
            figmaLink: p.figma_link,
            votedFor: p.voted_for,
            score: p.score,
            joinedAt: p.joined_at,
          }));
          setPlayers(loadedPlayers);

          if (!loadedPlayers.find(p => p.id === uid)) {
            await supabase.from('players').upsert({
              id: uid,
              room_id: roomId,
              name: nickname,
              figma_link: null,
              voted_for: null,
              score: 0,
              joined_at: Date.now(),
            });
          }
        }

        setLoading(false);
        if (!isMounted) return;

        // Subscribe to changes
        channel = supabase.channel(`room_${roomId}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
            (payload) => {
              const newData = payload.new as any;
              if (newData) {
                setRoom({
                  id: newData.id,
                  prompt: newData.prompt,
                  mode: newData.mode,
                  level: newData.level,
                  timeLimit: newData.time_limit,
                  votingTime: newData.voting_time,
                  status: newData.status,
                  timerEndsAt: newData.timer_ends_at,
                  hostId: newData.host_id,
                  createdAt: newData.created_at,
                });
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
            (payload) => {
              supabase.from('players').select('*').eq('room_id', roomId).then(({ data }) => {
                if (data && isMounted) {
                  setPlayers(data.map(p => ({
                    id: p.id,
                    name: p.name,
                    figmaLink: p.figma_link,
                    votedFor: p.voted_for,
                    score: p.score,
                    joinedAt: p.joined_at,
                  })));
                }
              });
            }
          )
          .subscribe();

      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomId]);

  // Auto-join is handled in init instead of manually
  const joinRoom = async (playerName: string) => {
    // legacy function left to avoid breaking type definition temporarily
  };

  const updateRoomStatus = async (status: RoomStatus, addTimeMs?: number) => {
    if (!userId || room?.hostId !== userId) return;
    await supabase.from('rooms').update({
      status,
      timer_ends_at: addTimeMs ? Date.now() + addTimeMs : null
    }).eq('id', roomId);
  };

  const submitDesign = async (figmaLink: string) => {
    if (!userId) return;
    await supabase.from('players').update({ figma_link: figmaLink }).eq('id', userId);
  };

  const voteForPlayer = async (votedPlayerId: string) => {
    if (!userId || votedPlayerId === userId) return;
    await supabase.from('players').update({ voted_for: votedPlayerId }).eq('id', userId);
  };

  return { room, players, loading, error, userId, joinRoom, updateRoomStatus, submitDesign, voteForPlayer };
}
