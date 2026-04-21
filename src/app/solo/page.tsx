"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Clock, Play, Upload, Trophy, RotateCcw } from "lucide-react";
import { generateRoomConfig } from "@/lib/promptGenerator";
import type { StructuredPrompt, GameMode, GameLevel } from "@/lib/types";
import { DesignKit } from "@/components/DesignKit";

type SoloStatus = 'LOBBY' | 'IN_PROGRESS' | 'DONE';

const MODE_COLORS: Record<GameMode, string> = {
  SPEED: 'bg-neo-secondary',
  CREATIVE: 'bg-neo-muted',
  UX: 'bg-white',
  CHAOS: 'bg-neo-accent text-white',
};

export default function SoloPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SoloStatus>('LOBBY');
  const [prompt, setPrompt] = useState<StructuredPrompt | null>(null);
  const [mode, setMode] = useState<GameMode>('SPEED');
  const [level, setLevel] = useState<GameLevel>(1);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [figmaLink, setFigmaLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const generateNew = () => {
    const config = generateRoomConfig();
    setPrompt(config.prompt);
    setMode(config.mode);
    setLevel(config.level);
    setTimeLimit(config.timeLimit);
    setTimeLeft(Math.floor(config.timeLimit / 1000));
    setStatus('LOBBY');
    setFigmaLink('');
    setSubmitted(false);
  };

  useEffect(() => { generateNew(); }, []);

  useEffect(() => {
    if (status !== 'IN_PROGRESS' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setStatus('DONE');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!prompt) return null;

  return (
    <div className="min-h-[calc(100vh-57px)] text-neo-ink bg-neo-canvas bg-halftone">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b-4 border-neo-ink bg-neo-secondary">
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl uppercase tracking-tight">Solo Practice</span>
          <span className={`text-xs font-black uppercase px-2 py-0.5 border-2 border-neo-ink shadow-[2px_2px_0px_0px_#000] ${MODE_COLORS[mode]}`}>
            {mode} · LVL {level}
          </span>
        </div>
        {status === 'IN_PROGRESS' && (
          <div className="flex items-center gap-2 bg-white border-4 border-neo-ink px-4 py-2 rotate-1 shadow-[4px_4px_0px_0px_#000]">
            <Clock className="stroke-[3px]" size={18} />
            <span className={`text-2xl font-black tracking-widest ${timeLeft < 30 ? 'text-neo-accent animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        {/* LOBBY */}
        {status === 'LOBBY' && (
          <div className="space-y-6 mt-4">
            <PromptCard prompt={prompt} />
            {prompt.designSystem && <DesignKit designSystem={prompt.designSystem} />}
            <div className="flex gap-4">
              <Button onClick={() => setStatus('IN_PROGRESS')} size="lg" className="flex-1 text-xl">
                <Play className="mr-2" /> START TIMER ({Math.floor(timeLimit / 60000)} min)
              </Button>
              <Button onClick={generateNew} variant="outline" size="lg">
                <RotateCcw size={18} className="mr-2" /> New Prompt
              </Button>
            </div>
          </div>
        )}

        {/* IN PROGRESS */}
        {status === 'IN_PROGRESS' && (
          <div className="space-y-6 mt-4">
            <PromptCard prompt={prompt} />
            {prompt.designSystem && <DesignKit designSystem={prompt.designSystem} />}
            
            {prompt.exampleImages && prompt.exampleImages.length > 0 && (
              <div className="bg-neo-ink text-white p-6 border-4 border-white mt-4 shadow-[8px_8px_0px_0px_#000]">
                <h3 className="text-lg font-black uppercase tracking-widest text-white/60 mb-2">INSPIRATION / EXAMPLE:</h3>
                {prompt.example && <p className="text-xl font-bold mb-6">{prompt.example}</p>}
                
                <div className="flex gap-4 overflow-x-auto snap-x pb-2">
                  {prompt.exampleImages.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Design Example ${idx + 1}`}
                      className="w-full max-w-lg flex-shrink-0 snap-center border-4 border-white"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border-4 border-neo-ink p-6 shadow-[4px_4px_0px_0px_#000] rotate-1 space-y-4">
              <h3 className="text-xl font-black uppercase tracking-wide">Your Submission</h3>
              <p className="font-bold text-neo-ink/60">Design in Figma then paste your link before time runs out.</p>
              <div className="flex gap-3">
                <Input
                  placeholder="https://figma.com/file/..."
                  value={figmaLink}
                  onChange={e => setFigmaLink(e.target.value)}
                />
                <Button
                  onClick={() => { setSubmitted(true); setStatus('DONE'); }}
                  disabled={!figmaLink.includes('figma.com')}
                  className="w-1/3"
                >
                  <Upload className="mr-2" /> SUBMIT
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* DONE */}
        {status === 'DONE' && (
          <div className="mt-8 text-center space-y-8">
            <div className="inline-block bg-neo-secondary border-4 border-neo-ink p-8 shadow-[8px_8px_0px_0px_#000] -rotate-1">
              <Trophy size={64} className="mx-auto mb-4" />
              <h2 className="text-5xl font-black uppercase">{submitted ? 'Submitted!' : "Time's Up!"}</h2>
              {submitted && figmaLink && (
                <a href={figmaLink} target="_blank" rel="noreferrer" className="block mt-4 underline font-bold hover:text-neo-accent transition-colors">
                  View your design →
                </a>
              )}
            </div>
            <PromptCard prompt={prompt} />
            <div className="flex gap-4 justify-center">
              <Button onClick={generateNew} size="lg" className="text-xl">
                <RotateCcw className="mr-2" /> New Round
              </Button>
              <Button onClick={() => router.push('/')} variant="outline" size="lg">
                Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PromptCard({ prompt }: { prompt: StructuredPrompt }) {
  return (
    <div className="bg-neo-accent p-8 border-4 border-neo-ink shadow-[8px_8px_0px_0px_#000] -rotate-1 space-y-4 relative">
      <span className="absolute -top-4 -left-4 bg-neo-secondary text-neo-ink font-black uppercase text-xs px-3 py-1 border-2 border-neo-ink shadow-[2px_2px_0px_0px_#000] -rotate-12">PROMPT</span>
      <div>
        <p className="text-lg font-bold uppercase tracking-widest text-black/50">Context</p>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{prompt.context}</h2>
      </div>
      <div className="bg-white text-neo-ink p-4 border-4 border-neo-ink">
        <p className="text-sm font-bold uppercase tracking-widest text-black/50">Task</p>
        <p className="text-2xl font-black uppercase">{prompt.task}</p>
      </div>
      <div>
        <p className="text-lg font-bold uppercase tracking-widest text-black/50">Constraints</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          {prompt.constraints.map((c, i) => (
            <li key={i} className="text-xl font-bold text-white uppercase">{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
