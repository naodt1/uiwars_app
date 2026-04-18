"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GameMode, GameLevel } from "@/lib/types";
import { generateRoomConfig } from "@/lib/promptGenerator";
import { X, Zap, Lightbulb, Target, Skull, ChevronRight } from "lucide-react";

export interface GameConfig {
  mode: GameMode;
  level: GameLevel;
  timeLimit: number;
  votingTime: number;
}

interface GameConfigModalProps {
  onConfirm: (config: GameConfig) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MODE_META: Record<GameMode, { label: string; desc: string; icon: React.ReactNode; color: string }> = {
  SPEED: {
    label: "SPEED",
    desc: "Fast rounds, simple tasks, short timers.",
    icon: <Zap size={20} strokeWidth={3} />,
    color: "bg-neo-secondary",
  },
  CREATIVE: {
    label: "CREATIVE",
    desc: "Imaginative scenarios, originality wins.",
    icon: <Lightbulb size={20} strokeWidth={3} />,
    color: "bg-neo-muted",
  },
  UX: {
    label: "UX",
    desc: "Real usability problems to solve.",
    icon: <Target size={20} strokeWidth={3} />,
    color: "bg-white",
  },
  CHAOS: {
    label: "CHAOS",
    desc: "Weird, absurd, viral constraints.",
    icon: <Skull size={20} strokeWidth={3} />,
    color: "bg-neo-accent",
  },
};

const LEVEL_META: Record<number, { label: string; desc: string }> = {
  1: { label: "LVL 1 — WARMUP", desc: "No constraints. Simple tasks." },
  2: { label: "LVL 2 — LIGHT", desc: "One light constraint added." },
  3: { label: "LVL 3 — HARD", desc: "2–3 tough constraints." },
  4: { label: "LVL 4 — CHAOS", desc: "Absurd, extreme restrictions." },
};

const TIME_OPTIONS = [
  { label: "2 MIN", value: 2 * 60 * 1000 },
  { label: "5 MIN", value: 5 * 60 * 1000 },
  { label: "7 MIN", value: 7 * 60 * 1000 },
  { label: "10 MIN", value: 10 * 60 * 1000 },
];

const VOTE_OPTIONS = [
  { label: "1 MIN", value: 1 * 60 * 1000 },
  { label: "2 MIN", value: 2 * 60 * 1000 },
  { label: "3 MIN", value: 3 * 60 * 1000 },
];

export function GameConfigModal({ onConfirm, onCancel, loading }: GameConfigModalProps) {
  const randomConfig = generateRoomConfig();
  const [mode, setMode] = useState<GameMode>(randomConfig.mode);
  const [level, setLevel] = useState<GameLevel>(randomConfig.level);
  const [timeLimit, setTimeLimit] = useState(randomConfig.timeLimit);
  const [votingTime, setVotingTime] = useState(randomConfig.votingTime);

  const handleConfirm = () => {
    onConfirm({ mode, level, timeLimit, votingTime });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-ink/70">
      <Card className="-rotate-1 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-neo-ink bg-neo-secondary">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Configure Battle</h2>
          <button
            onClick={onCancel}
            className="border-4 border-neo-ink bg-white p-1 shadow-[3px_3px_0px_0px_#000] hover:bg-neo-accent hover:text-white transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <CardContent className="p-6 space-y-8">
          {/* Mode Selection */}
          <div>
            <label className="font-black uppercase tracking-widest text-sm text-neo-ink/60 block mb-3">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(MODE_META) as GameMode[]).map((m) => {
                const meta = MODE_META[m];
                const selected = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`
                      border-4 border-neo-ink p-3 text-left transition-all
                      ${meta.color}
                      ${selected
                        ? "shadow-[6px_6px_0px_0px_#000] -translate-y-1"
                        : "shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 font-black uppercase tracking-widest">
                      {meta.icon}
                      {meta.label}
                      {selected && <span className="ml-auto">✓</span>}
                    </div>
                    <p className="text-xs font-bold mt-1 text-neo-ink/60">{meta.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="font-black uppercase tracking-widest text-sm text-neo-ink/60 block mb-3">
              Difficulty
            </label>
            <div className="flex flex-col gap-2">
              {([1, 2, 3, 4] as GameLevel[]).map((l) => {
                const meta = LEVEL_META[l];
                const selected = level === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`
                      border-4 border-neo-ink p-3 text-left flex items-center justify-between transition-all
                      ${selected ? "bg-neo-ink text-white shadow-none" : "bg-white hover:bg-neo-canvas shadow-[3px_3px_0px_0px_#000]"}
                    `}
                  >
                    <div>
                      <span className="font-black uppercase tracking-widest text-sm">{meta.label}</span>
                      <span className="ml-3 text-xs font-bold opacity-60">{meta.desc}</span>
                    </div>
                    {selected && <ChevronRight size={16} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timers */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-black uppercase tracking-widest text-sm text-neo-ink/60 block mb-3">
                Design Time
              </label>
              <div className="flex flex-col gap-2">
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeLimit(opt.value)}
                    className={`border-4 border-neo-ink px-3 py-2 font-black uppercase tracking-widest text-sm transition-all
                      ${timeLimit === opt.value
                        ? "bg-neo-ink text-white"
                        : "bg-white hover:bg-neo-secondary shadow-[3px_3px_0px_0px_#000]"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-black uppercase tracking-widest text-sm text-neo-ink/60 block mb-3">
                Voting Time
              </label>
              <div className="flex flex-col gap-2">
                {VOTE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setVotingTime(opt.value)}
                    className={`border-4 border-neo-ink px-3 py-2 font-black uppercase tracking-widest text-sm transition-all
                      ${votingTime === opt.value
                        ? "bg-neo-ink text-white"
                        : "bg-white hover:bg-neo-secondary shadow-[3px_3px_0px_0px_#000]"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-neo-canvas border-4 border-neo-ink p-4 space-y-2">
            <p className="font-black uppercase tracking-widest text-sm">Configuration Summary</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">MODE: {mode}</Badge>
              <Badge variant="secondary">LVL: {level}</Badge>
              <Badge variant="muted">DESIGN: {TIME_OPTIONS.find(o => o.value === timeLimit)?.label}</Badge>
              <Badge variant="outline">VOTE: {VOTE_OPTIONS.find(o => o.value === votingTime)?.label}</Badge>
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full text-xl"
            size="lg"
          >
            {loading ? "CREATING ROOM..." : "START BATTLE →"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
