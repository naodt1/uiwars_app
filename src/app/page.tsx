"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Star, Swords } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateRoomConfig } from "@/lib/promptGenerator";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  const handleCreateRoom = async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase not configured. Add credentials to .env.local and run the SQL setup script.");
      return;
    }
    setLoading(true);
    try {
      const uid = localStorage.getItem("uiwars_userId");
      if (!uid) throw new Error("Local identity lost!");

      const newRoomCode = generateRoomCode();
      const config = generateRoomConfig();

      const { error: insertError } = await supabase.from('rooms').insert({
        id: newRoomCode,
        prompt: config.prompt,
        mode: config.mode,
        level: config.level,
        time_limit: config.timeLimit,
        voting_time: config.votingTime,
        status: "LOBBY",
        timer_ends_at: null,
        host_id: uid,
        created_at: Date.now(),
      });

      if (insertError) throw insertError;

      router.push(`/room/${newRoomCode}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    router.push(`/room/${roomCode.toUpperCase()}`);
  };

  return (
    <main className="min-h-screen bg-halftone flex flex-col items-center justify-center p-6 bg-neo-canvas text-neo-ink">
      <div className="max-w-2xl w-full text-center space-y-12 relative">
        <div className="absolute -top-12 -left-12 rotate-12 text-neo-accent animate-pulse">
          <Star size={48} className="fill-neo-accent" />
        </div>
        <div className="absolute -bottom-8 -right-8 -rotate-12 text-neo-secondary hidden md:block">
          <Star size={64} className="fill-neo-secondary" />
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '2px black', color: 'transparent', textShadow: '6px 6px 0px #FF6B6B' }}>
            UIWARS
          </h1>
          <p className="text-xl md:text-3xl font-bold uppercase tracking-widest bg-neo-secondary inline-block px-4 py-2 border-4 border-neo-ink rotate-2 shadow-[4px_4px_0px_0px_#000]">
            DESIGN BATTLES
          </p>
        </div>

        {error && (
          <div className="bg-neo-accent text-white border-4 border-neo-ink p-4 font-bold shadow-[4px_4px_0px_0px_#000]">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mt-12 w-full text-left">
          <Card className="-rotate-1">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2">
                <Swords size={32} /> Create Room
              </h2>
              <p className="font-bold text-neo-ink/70">Host a new battle and invite players to join.</p>
              <Button onClick={handleCreateRoom} disabled={loading} className="w-full text-xl" size="lg">
                NEW BATTLE
              </Button>
            </CardContent>
          </Card>

          <Card className="rotate-1 bg-neo-muted">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight">Join Room</h2>
              <p className="font-bold text-neo-ink/70">Enter an existing battle code to jump in.</p>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <Input 
                  placeholder="CODE (EX: ABCDE)" 
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  maxLength={5}
                  className="uppercase text-center"
                />
                <Button type="submit" variant="secondary" className="w-full text-xl" size="lg">
                  ENTER BATTLE
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
