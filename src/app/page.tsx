"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Star, Swords, Users, Zap, Lightbulb, Target, Skull } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateRoomConfig } from "@/lib/promptGenerator";
import { GameConfigModal, type GameConfig } from "@/components/GameConfigModal";

const MODE_ICONS: Record<string, React.ReactNode> = {
  SPEED: <Zap size={14} strokeWidth={3} />,
  CREATIVE: <Lightbulb size={14} strokeWidth={3} />,
  UX: <Target size={14} strokeWidth={3} />,
  CHAOS: <Skull size={14} strokeWidth={3} />,
};

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const generateRoomCode = () =>
    Math.random().toString(36).substring(2, 7).toUpperCase();

  const handleCreateRoom = async (config: GameConfig) => {
    if (!isSupabaseConfigured) {
      setError("Supabase not configured. Add credentials to .env.local and run the SQL setup script.");
      return;
    }
    setLoading(true);
    try {
      const uid = localStorage.getItem("uiwars_userId");
      if (!uid) throw new Error("Local identity lost!");

      const newRoomCode = generateRoomCode();
      // Generate prompt for the chosen mode/level
      const fullConfig = generateRoomConfig();
      // Override mode and level with user selection, regenerate prompt for that combo
      const { generateRoomConfigForOptions } = await import("@/lib/promptGenerator");
      const prompt = generateRoomConfigForOptions(config.mode, config.level);

      const { error: insertError } = await supabase.from("rooms").insert({
        id: newRoomCode,
        prompt,
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
    <>
      {showConfig && (
        <GameConfigModal
          onConfirm={(config) => {
            setShowConfig(false);
            handleCreateRoom(config);
          }}
          onCancel={() => setShowConfig(false)}
          loading={loading}
        />
      )}

      <main
        className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center p-6 text-neo-ink"
        style={{
          backgroundImage: 'radial-gradient(#00000022 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px',
          backgroundColor: '#FFFDF5',
        }}
      >
        <div className="max-w-2xl w-full space-y-10 relative">
          {/* Decorative stars */}
          <div className="absolute -top-14 -left-10 rotate-12 text-neo-accent animate-pulse pointer-events-none hidden md:block">
            <Star size={52} className="fill-neo-accent" />
          </div>
          <div className="absolute -bottom-10 -right-8 -rotate-12 text-neo-secondary pointer-events-none hidden md:block">
            <Star size={64} className="fill-neo-secondary" />
          </div>

          {/* Hero */}
          <div className="text-center space-y-4">
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
                <p className="font-bold text-neo-ink/70">Host a room. You choose the mode, level and timer.</p>

                {/* Mode icons preview */}
                <div className="flex gap-2 flex-wrap">
                  {(['SPEED','CREATIVE','UX','CHAOS'] as const).map((m) => (
                    <span key={m} className="flex items-center gap-1 border-4 border-neo-ink bg-white font-black uppercase text-xs px-2 py-1 shadow-[2px_2px_0px_0px_#000] tracking-widest">
                      {MODE_ICONS[m]} {m}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => setShowConfig(true)}
                  disabled={loading}
                  className="w-full text-lg"
                  size="lg"
                >
                  CONFIGURE & CREATE →
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
        </div>
      </main>
    </>
  );
}
