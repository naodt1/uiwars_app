"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User, Sword, Home } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [nickname, setNickname] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="UIWars"
            width={120}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>
      </div>

      {/* Right: player identity */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 border-4 border-neo-ink bg-white font-black uppercase text-sm tracking-widest px-3 py-2 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all"
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
    </nav>
  );
}
