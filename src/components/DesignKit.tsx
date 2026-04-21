"use client";

import { useState } from "react";
import type { DesignSystem } from "@/lib/types";
import { ChevronDown, ChevronUp, Palette, Copy, Check } from "lucide-react";

export function DesignKit({ designSystem }: { designSystem: DesignSystem }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const colorsText = designSystem.colors.map(c => `${c.name}: ${c.value}`).join('\n');
    const text = `UIWARS Design Kit - ${designSystem.name}\n\nColors:\n${colorsText}\n\nFont: ${designSystem.typography.fontFamily}\nRadius: ${designSystem.borderRadius}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-4 border-neo-ink bg-white shadow-[4px_4px_0px_0px_#000]">
      <div className="w-full flex items-center justify-between px-5 bg-neo-ink text-white font-black uppercase tracking-widest text-sm">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex-1 flex items-center gap-2 py-3 text-left"
        >
          <Palette size={16} strokeWidth={3} />
          <span>Design Kit — use these in your design</span>
          {open ? <ChevronUp size={18} strokeWidth={3} className="ml-2" /> : <ChevronDown size={18} strokeWidth={3} className="ml-2" />}
        </button>
        <button
          onClick={handleCopy}
          className="ml-4 flex items-center gap-2 bg-white text-neo-ink border-4 border-neo-ink px-3 py-1 text-xs hover:bg-neo-accent hover:text-white transition-colors"
        >
          {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={3} />}
          {copied ? "COPIED!" : "COPY KIT"}
        </button>
      </div>

      {open && (
        <div className="p-5 grid md:grid-cols-2 gap-6">
          {/* Font */}
          <div className="space-y-2">
            <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50">Font Family</p>
            <div className="border-4 border-neo-ink p-4 bg-neo-canvas">
              <p className="text-2xl font-black" style={{ fontFamily: designSystem.typography.fontFamily }}>
                {designSystem.typography.fontFamily.split(",")[0]}
              </p>
              <p className="text-xs font-mono text-neo-ink/50 mt-1">{designSystem.typography.fontFamily}</p>
              <div className="flex gap-4 mt-3">
                {designSystem.typography.sizes.map(s => (
                  <div key={s.label}>
                    <p className="text-[10px] font-black uppercase text-neo-ink/40">{s.label}</p>
                    <p className="font-bold text-xs">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50">Color Tokens</p>
            <div className="space-y-2">
              {designSystem.colors.map(token => (
                <div key={token.name} className="flex items-center gap-3 border-2 border-neo-ink p-2 bg-neo-canvas">
                  <div
                    className="w-10 h-10 flex-shrink-0 border-2 border-neo-ink"
                    style={{ backgroundColor: token.value }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-black uppercase text-sm leading-none">{token.name}</p>
                    <p className="font-mono text-xs text-neo-ink/60 mt-0.5">{token.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Style rules */}
          <div className="md:col-span-2 flex gap-6 border-t-4 border-neo-ink pt-4">
            <div>
              <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50 mb-2">Border Radius</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-neo-accent border-2 border-neo-ink"
                  style={{ borderRadius: designSystem.borderRadius }}
                />
                <span className="font-mono font-bold text-sm">{designSystem.borderRadius}</span>
              </div>
            </div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest text-neo-ink/50 mb-2">Base Spacing</p>
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-px">
                  {[1, 2, 3, 4].map(n => (
                    <div
                      key={n}
                      className="bg-neo-ink"
                      style={{
                        width: `${parseInt(designSystem.spacingUnit) * 0.8}px`,
                        height: `${parseInt(designSystem.spacingUnit) * n * 0.8}px`,
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono font-bold text-sm">{designSystem.spacingUnit}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
