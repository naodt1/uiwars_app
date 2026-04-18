"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { GameMode, GameLevel } from "@/lib/types";

export interface LoungeSummary {
  id: string;
  mode: GameMode;
  level: GameLevel;
  playerCount: number;
  createdAt: number;
}

export function useLounges() {
  const [lounges, setLounges] = useState<LoungeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLounges = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("id, mode, level, created_at, players(count)")
      .eq("status", "LOBBY")
      .order("created_at", { ascending: false });

    if (data) {
      setLounges(
        data.map((r) => ({
          id: r.id,
          mode: r.mode as GameMode,
          level: r.level as GameLevel,
          playerCount: (r.players as unknown as { count: number }[])[0]?.count ?? 0,
          createdAt: r.created_at,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchLounges();

    const channel = supabase
      .channel("lounges_watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, fetchLounges)
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, fetchLounges)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { lounges, loading };
}
