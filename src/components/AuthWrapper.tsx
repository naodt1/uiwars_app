"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Star } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("uiwars_userId");
    const name = localStorage.getItem("uiwars_nickname");
    
    if (id && name) {
      setHasIdentity(true);
    } else {
      localStorage.removeItem("uiwars_userId");
      localStorage.removeItem("uiwars_nickname");
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

  if (hasIdentity) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-halftone flex flex-col items-center justify-center p-6 bg-neo-canvas text-neo-ink">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-8 -left-8 -rotate-12 text-neo-accent animate-pulse">
          <Star size={48} className="fill-neo-accent" />
        </div>
        <Card className="rotate-1 bg-white">
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-2 text-center">
               <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '2px black', color: 'white', textShadow: '4px 4px 0px #FF6B6B' }}>
                UIWARS
              </h1>
              <p className="font-bold text-lg text-neo-ink/70">Enter a nickname to jump in instantly.</p>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="font-black uppercase tracking-widest text-sm mb-2 block text-neo-ink/70">YOUR NICKNAME</label>
                <Input 
                  placeholder="E.G. DESIGN_BEAST" 
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  maxLength={15}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full text-xl" size="lg">
                JOIN UIWARS
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
