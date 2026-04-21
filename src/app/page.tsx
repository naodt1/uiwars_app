"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Star, Swords, Users, Zap, Lightbulb, Target, Skull, DoorOpen, User } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateRoomConfig } from "@/lib/promptGenerator";
import { useLounges } from "@/hooks/useLounges";

const MODE_ICONS: Record<string, React.ReactNode> = {
  SPEED: <Zap size={14} strokeWidth={3} />,
  CREATIVE: <Lightbulb size={14} strokeWidth={3} />,
  UX: <Target size={14} strokeWidth={3} />,
  CHAOS: <Skull size={14} strokeWidth={3} />,
};

export default function Home() {
  const router = useRouter();
  const [view, setView] = useState<'select' | 'multiplayer'>('select');
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { lounges, loading: loungesLoading } = useLounges();

  const generateRoomCode = () =>
    Math.random().toString(36).substring(2, 7).toUpperCase();

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

      const { error: insertError } = await supabase.from("rooms").insert({
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

  if (view === 'select') {
    return (
      <main className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center p-6 text-neo-ink bg-neo-canvas bg-halftone">
        <div className="max-w-3xl w-full space-y-10 text-center">
          <div className="space-y-4">
            <h1
              className="text-7xl md:text-9xl font-black uppercase tracking-tighter"
              style={{ WebkitTextStroke: '3px black', color: 'transparent', textShadow: '6px 6px 0px #FF6B6B' }}
            >
              UIWARS
            </h1>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest bg-neo-secondary inline-block px-4 py-2 border-4 border-neo-ink rotate-2 shadow-[4px_4px_0px_0px_#000]">
              Design. Battle. Win.
            </p>
          </div>

          <p className="text-2xl font-black uppercase tracking-widest text-neo-ink/60">Choose your mode</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Solo */}
            <button
              onClick={() => router.push('/solo')}
              className="group relative text-left bg-neo-muted border-4 border-neo-ink p-8 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all duration-100 active:translate-y-0.5 active:shadow-none -rotate-1"
            >
              <User size={48} strokeWidth={2.5} className="mb-4" />
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Solo Mode</h2>
              <p className="font-bold text-neo-ink/60 text-lg">Practice on your own. Get a random prompt, set a timer, and sharpen your skills.</p>
              <div className="mt-6 inline-flex items-center gap-2 bg-neo-ink text-white font-black uppercase text-sm px-4 py-2 border-2 border-neo-ink shadow-[3px_3px_0px_0px_#666] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                PRACTICE →
              </div>
            </button>

            {/* Multiplayer */}
            <button
              onClick={() => setView('multiplayer')}
              className="group relative text-left bg-neo-accent border-4 border-neo-ink p-8 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all duration-100 active:translate-y-0.5 active:shadow-none rotate-1"
            >
              <Swords size={48} strokeWidth={2.5} className="mb-4 text-white" />
              <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-2">Multiplayer</h2>
              <p className="font-bold text-white/70 text-lg">Battle real players. Create or join a live room, design under pressure, and let the crowd vote.</p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white text-neo-ink font-black uppercase text-sm px-4 py-2 border-2 border-neo-ink shadow-[3px_3px_0px_0px_#000] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                ENTER ARENA →
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center p-6 text-neo-ink bg-neo-canvas bg-halftone">
      <div className="max-w-2xl w-full space-y-10 relative">
        {/* Decorative stars */}
        <div className="absolute -top-14 -left-10 rotate-12 text-neo-accent animate-pulse pointer-events-none hidden md:block">
          <Star size={52} className="fill-neo-accent" />
        </div>
        <div className="absolute -bottom-10 -right-8 -rotate-12 text-neo-secondary pointer-events-none hidden md:block">
          <Star size={64} className="fill-neo-secondary" />
        </div>

        {/* Back + Hero */}
        <div className="text-center space-y-4">
          <button
            onClick={() => setView('select')}
            className="absolute top-0 left-0 font-black uppercase text-sm tracking-widest text-neo-ink/50 hover:text-neo-ink flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          <h1
            className="text-7xl md:text-9xl font-black uppercase tracking-tighter"
            style={{ WebkitTextStroke: '3px black', color: 'transparent', textShadow: '6px 6px 0px #FF6B6B' }}
          >
            UIWARS
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-widest bg-neo-secondary inline-block px-4 py-2 border-4 border-neo-ink rotate-2 shadow-[4px_4px_0px_0px_#000]">
            Multiplayer Arena
          </p>
        </div>

        {error && (
          <div className="bg-neo-accent text-white border-4 border-neo-ink p-4 font-bold shadow-[4px_4px_0px_0px_#000]">
            ⚠ {error}
          </div>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full text-left">
          {/* Create Room */}
          <Card className="-rotate-1">
            <div className="bg-neo-accent border-b-4 border-neo-ink p-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Swords size={28} strokeWidth={3} /> NEW BATTLE
              </h2>
            </div>
            <CardContent className="pt-5 space-y-4">
              <p className="font-bold text-neo-ink/70">Host a room. Mode and difficulty are randomly assigned.</p>
              <Button
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full text-lg"
                size="lg"
              >
                {loading ? "CREATING..." : "CREATE ROOM →"}
              </Button>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="rotate-1 bg-neo-muted">
            <div className="bg-neo-ink border-b-4 border-neo-ink p-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Users size={28} strokeWidth={3} /> JOIN BATTLE
              </h2>
            </div>
            <CardContent className="pt-5 space-y-4">
              <p className="font-bold text-neo-ink/70">Got a battle code? Jump straight in.</p>
              <form onSubmit={handleJoinRoom} className="space-y-3">
                <Input
                  placeholder="ENTER CODE (ABCDE)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  maxLength={5}
                  className="uppercase text-center font-black tracking-widest text-2xl"
                />
                <Button type="submit" variant="secondary" className="w-full text-lg" size="lg">
                  ENTER BATTLE →
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Modes info strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { mode: 'SPEED', color: 'bg-neo-secondary', desc: 'Fast & simple' },
            { mode: 'CREATIVE', color: 'bg-neo-muted', desc: 'Wild scenarios' },
            { mode: 'UX', color: 'bg-white', desc: 'Real problems' },
            { mode: 'CHAOS', color: 'bg-neo-accent', desc: 'Pure madness' },
          ].map(({ mode, color, desc }) => (
            <div key={mode} className={`${color} border-4 border-neo-ink p-3 shadow-[4px_4px_0px_0px_#000] text-center`}>
              <div className="flex justify-center mb-1">{MODE_ICONS[mode]}</div>
              <p className="font-black uppercase text-xs tracking-widest">{mode}</p>
              <p className="text-xs font-bold text-neo-ink/60 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Open Lounges */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <DoorOpen size={22} strokeWidth={3} />
            <h2 className="text-2xl font-black uppercase tracking-tight">Open Lounges</h2>
            <span className="bg-neo-accent text-white text-xs font-black px-2 py-0.5 border-2 border-neo-ink shadow-[2px_2px_0px_0px_#000]">
              LIVE
            </span>
          </div>

          {loungesLoading ? (
            <p className="font-bold text-neo-ink/50 uppercase text-sm tracking-widest animate-pulse">Scanning for battles…</p>
          ) : lounges.length === 0 ? (
            <div className="border-4 border-dashed border-neo-ink/30 p-8 text-center">
              <p className="font-black uppercase text-neo-ink/40 tracking-widest">No open lounges right now.</p>
              <p className="text-sm font-bold text-neo-ink/30 mt-1">Create a room and start one!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {lounges.map((lounge) => (
                <button
                  key={lounge.id}
                  onClick={() => router.push(`/room/${lounge.id}`)}
                  className="group text-left bg-white border-4 border-neo-ink p-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 transition-all duration-100 active:translate-y-0.5 active:shadow-none"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-xs font-black uppercase px-2 py-0.5 border-2 border-neo-ink shadow-[2px_2px_0px_0px_#000] ${
                        lounge.mode === 'SPEED' ? 'bg-neo-secondary' :
                        lounge.mode === 'CREATIVE' ? 'bg-neo-muted' :
                        lounge.mode === 'CHAOS' ? 'bg-neo-accent text-white' :
                        'bg-white'
                      }`}>
                        {MODE_ICONS[lounge.mode]}
                        {lounge.mode}
                      </span>
                      <span className="text-xs font-black uppercase bg-neo-ink text-white px-2 py-0.5">
                        LVL {lounge.level}
                      </span>
                    </div>
                    <span className="font-black text-neo-ink/40 text-xs uppercase tracking-widest">
                      #{lounge.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-neo-ink/60">
                      <Users size={14} strokeWidth={3} />
                      {lounge.playerCount} {lounge.playerCount === 1 ? 'player' : 'players'} waiting
                    </span>
                    <span className="text-xs font-black uppercase text-neo-accent group-hover:underline">
                      JOIN →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
