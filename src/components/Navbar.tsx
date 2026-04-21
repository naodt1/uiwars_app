"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User, Sword, Home, Info, X } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [nickname, setNickname] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNickname(localStorage.getItem("uiwars_nickname"));
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uiwars_userId");
    localStorage.removeItem("uiwars_nickname");
    router.push("/");
    router.refresh();
    window.location.reload();
  };

  if (!mounted) return null;
  const isHome = pathname === "/";

  return (
    <nav
      className="sticky top-0 z-50 border-b-4 border-neo-ink flex items-center justify-between px-4 md:px-8 py-3"
      style={{ background: '#FFD93D' }}
    >
      {/* Left: Logo + optional back  */}
      <div className="flex items-center gap-3">
        {!isHome && (
          <Link
            href="/"
            className="flex items-center gap-1 border-4 border-neo-ink bg-white font-black uppercase text-xs tracking-widest px-3 py-2 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Home size={14} strokeWidth={3} />
            HOME
          </Link>
        )}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="bg-neo-accent text-white border-4 border-neo-ink px-3 py-1 font-black uppercase text-xl md:text-2xl tracking-tighter leading-none shadow-[4px_4px_0px_0px_#000] -rotate-1"
            style={{ textShadow: '2px 2px 0px #000' }}
          >
            UI<span className="text-neo-secondary">WARS</span>
          </div>
        </Link>
      </div>

      {/* Right: navigation & player identity */}
      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => setAboutOpen(true)}
          className="hidden sm:flex items-center gap-1 border-4 border-neo-ink bg-neo-muted font-black uppercase text-xs tracking-widest px-3 py-2 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rotate-1"
        >
          <Info size={14} strokeWidth={3} />
          WTF IS THIS?
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 border-4 border-neo-ink bg-white font-black uppercase text-sm tracking-widest px-3 py-2 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all -rotate-1"
          >
            <User size={16} strokeWidth={3} />
            {nickname ?? "PLAYER"}
            <span className="text-neo-ink/40 text-xs ml-1">▾</span>
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 z-50 bg-white border-4 border-neo-ink shadow-[6px_6px_0px_0px_#000] min-w-[180px]">
                <div className="border-b-4 border-neo-ink px-4 py-3 bg-neo-muted">
                  <p className="text-xs font-bold uppercase tracking-widest text-neo-ink/50">Signed in as</p>
                  <p className="font-black uppercase tracking-widest truncate">{nickname}</p>
                </div>

                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide border-b-4 border-neo-ink hover:bg-neo-secondary transition-colors w-full text-left"
                >
                  <Sword size={16} strokeWidth={3} />
                  Battle Lobby
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-neo-accent hover:bg-neo-accent hover:text-white transition-colors w-full text-left"
                >
                  <LogOut size={16} strokeWidth={3} />
                  Change Name
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* About Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neo-ink/60">
          <div className="absolute inset-0" onClick={() => setAboutOpen(false)} />
          <div className="relative bg-white border-4 border-neo-ink shadow-[16px_16px_0px_0px_#000] w-full max-w-lg p-8 rotate-1">
            <button 
              onClick={() => setAboutOpen(false)}
              className="absolute -top-4 -right-4 bg-neo-accent text-white border-4 border-neo-ink p-2 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_#000]"
            >
              <X size={24} strokeWidth={3} />
            </button>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none" style={{ textShadow: '4px 4px 0px #FFD93D' }}>
              WTF IS UIWARS?
            </h2>
            <div className="space-y-4 font-bold text-lg leading-snug">
              <p>You actually clicked the info button? Cute.</p>
              <p>I'm <span className="bg-neo-accent text-white px-2 py-0.5 border-4 border-neo-ink inline-block -rotate-2">Naod Tadele</span>, the creator of this hyper-aggressive design arena.</p>
              <p>If you're stressed out by the ticking timer, impossible constraints, and neon-drenched brutalist assault on your retinas... good. That's literally the point. I didn't build this to hold your hand. I built this to see if you can actually design under pressure.</p>
              <p>If the app breaks, it's not a bug, it's a <span className="underline">feature</span>. If you absolutely despise the pure black borders, go use a boring corporate SaaS app instead.</p>
              <p className="border-l-8 border-neo-ink bg-neo-muted p-4 mt-6 text-neo-ink">
                Follow me on GitHub <a href="https://github.com/naodt1" target="_blank" className="text-white bg-neo-ink border-2 border-neo-ink hover:bg-neo-accent hover:text-white px-2 py-0.5 font-black uppercase transition-colors inline-block rotate-1 shadow-[2px_2px_0px_0px_#000]">@naodt1</a> if you want to complain.
              </p>
            </div>
            <button 
              onClick={() => setAboutOpen(false)}
              className="mt-8 w-full bg-white border-4 border-neo-ink py-4 font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_#000] hover:bg-neo-ink hover:text-white transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              FINE, BACK TO WORK
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
