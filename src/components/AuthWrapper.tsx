"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Star, RefreshCw } from "lucide-react";
import { generateNickname } from "@/lib/nicknames";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  const refreshNickname = useCallback(() => {
    setNicknameInput(generateNickname());
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("uiwars_userId");
    const name = localStorage.getItem("uiwars_nickname");

    if (id && name) {
      setHasIdentity(true);
    } else {
      localStorage.removeItem("uiwars_userId");
      localStorage.removeItem("uiwars_nickname");
      setNicknameInput(generateNickname());
    }
    setMounted(true);
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;

    const newId = crypto.randomUUID();
    localStorage.setItem("uiwars_userId", newId);
    localStorage.setItem("uiwars_nickname", nicknameInput.trim());

    setHasIdentity(true);
  };

  if (!mounted) return null;
  if (hasIdentity) return <>{children}</>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-neo-canvas text-neo-ink bg-halftone">
      <div className="max-w-md w-full relative">
        {/* Decorative stars */}
        <div className="absolute -top-10 -left-10 -rotate-12 text-neo-accent animate-pulse pointer-events-none">
          <Star size={48} className="fill-neo-accent" />
        </div>
        <div className="absolute -bottom-8 -right-8 rotate-12 text-neo-secondary pointer-events-none hidden sm:block">
          <Star size={36} className="fill-neo-secondary" />
        </div>

        <Card className="rotate-1">
          <div className="bg-neo-accent border-b-4 border-neo-ink p-6 text-center">
            <h1
              className="text-6xl font-black uppercase tracking-tighter text-white"
              style={{ textShadow: '4px 4px 0px #000' }}
            >
              UIWARS
            </h1>
            <p className="font-bold text-white/80 mt-1 uppercase tracking-widest text-sm">Design. Battle. Win.</p>
          </div>
          <CardContent className="pt-6 space-y-5">
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-black uppercase tracking-widest text-sm text-neo-ink/70">
                    YOUR NICKNAME
                  </label>
                  <button
                    type="button"
                    onClick={refreshNickname}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neo-ink/50 hover:text-neo-accent transition-colors"
                    title="Generate new nickname"
                  >
                    <RefreshCw size={12} strokeWidth={3} />
                    RANDOM
                  </button>
                </div>
                <Input
                  placeholder="E.G. PIXEL_SHARK42"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value.toUpperCase())}
                  maxLength={15}
                  autoFocus
                  className="text-center font-black tracking-widest uppercase"
                />
              </div>
              <Button type="submit" className="w-full text-xl" size="lg">
                ENTER THE ARENA →
              </Button>
            </form>

            <div className="flex justify-center">
              <p className="bg-white border-2 border-neo-ink px-3 py-1 shadow-[2px_2px_0px_0px_#000] rotate-1 text-center text-xs font-black text-neo-ink uppercase tracking-widest inline-block">
                No account needed. No passwords. Ever.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
