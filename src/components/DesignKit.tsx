"use client";

import { useState } from "react";
import type { DesignSystem } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";

export function DesignKit({ designSystem }: { designSystem: DesignSystem }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-4 border-neo-ink bg-white shadow-[4px_4px_0px_0px_#000] rotate-0.5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-neo-ink text-white font-black uppercase tracking-widest text-sm"
      >
        <span>🎨 Design Kit — {designSystem.name}</span>
        {open ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
      </button>

      {open && (
        <div className="p-5 space-y-5">
          {/* Colors */}
          <div>
            <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50 mb-2">Color Palette</p>
            <div className="flex flex-wrap gap-3">
              {designSystem.colors.map(token => (
                <div key={token.name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 border-2 border-neo-ink shadow-[2px_2px_0px_0px_#000]"
                    style={{ backgroundColor: token.value }}
                  />
                  <span className="text-[10px] font-black uppercase text-center leading-tight">{token.name}</span>
                  <span className="text-[10px] font-mono text-neo-ink/50">{token.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50 mb-2">Typography</p>
            <div className="bg-neo-canvas border-2 border-neo-ink p-3 space-y-1">
              <p className="font-black text-xs uppercase tracking-widest text-neo-ink/50">Font: {designSystem.typography.fontFamily}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                {designSystem.typography.sizes.map(s => (
                  <span key={s.label} className="font-bold text-xs">
                    <span className="text-neo-ink/50">{s.label}:</span> {s.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tokens */}
          <div className="flex gap-6">
            <div>
              <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50 mb-1">Border Radius</p>
              <div
                className="w-12 h-12 bg-neo-accent border-2 border-neo-ink"
                style={{ borderRadius: designSystem.borderRadius }}
              />
              <p className="text-xs font-mono mt-1 text-neo-ink/60">{designSystem.borderRadius}</p>
            </div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50 mb-1">Spacing Unit</p>
              <div className="flex items-end gap-0.5 h-12">
                {[1, 2, 3, 4].map(n => (
                  <div
                    key={n}
                    className="bg-neo-ink"
                    style={{ width: designSystem.spacingUnit, height: `${parseInt(designSystem.spacingUnit) * n}px` }}
                  />
                ))}
              </div>
              <p className="text-xs font-mono mt-1 text-neo-ink/60">{designSystem.spacingUnit}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
