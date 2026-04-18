"use client";

import { useEffect, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock, Trophy, Play, Upload, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { room, players, loading, error, userId, updateRoomStatus, submitDesign, voteForPlayer } = useRoom(roomId);
  const [hasJoined, setHasJoined] = useState(false);
  const [figmaLink, setFigmaLink] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const SUBMISSION_TIME = 1 * 60 * 1000;

  // Check if current user joined
  useEffect(() => {
    if (players.length > 0 && userId) {
      const p = players.find(p => p.id === userId);
      if (p) setHasJoined(true);
    }
  }, [players, userId]);

  // Timer Countdown
  useEffect(() => {
    if (!room?.timerEndsAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((room.timerEndsAt! - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [room?.timerEndsAt]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-black text-4xl uppercase animate-pulse text-neo-ink bg-neo-canvas">Loading Battle...</div>;
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-neo-canvas text-neo-ink">
        <Card className="max-w-md w-full bg-neo-accent">
          <CardContent className="pt-6 relative">
             <Badge className="absolute -top-4 -right-4 -rotate-6">ERROR</Badge>
            <h2 className="text-3xl font-black text-white">{error || "Room Not Found"}</h2>
            <Button className="mt-8 bg-white text-neo-ink hover:text-white" onClick={() => window.location.href = '/'}>
              GO HOME
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isHost = userId === room.hostId;
  const currentPlayer = players.find(p => p.id === userId);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderTopBar = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b-8 border-neo-ink bg-neo-secondary sticky top-0 z-50">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" className="bg-white hover:bg-neo-accent hover:text-white" size="icon">
              <ArrowLeft size={24} strokeWidth={3} />
            </Button>
          </Link>
          <div className="bg-neo-accent text-white border-4 border-neo-ink px-4 py-2 font-black uppercase text-xl md:text-3xl shadow-[4px_4px_0px_0px_#000] -rotate-2 leading-none">
            UIWARS
          </div>
        </div>
        
        <div>
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none mt-4 md:mt-0">ROOM: {room.id}</h1>
          <div className="font-bold flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline">STATUS: {room.status}</Badge>
            <Badge variant="muted">{players.length} PLAYERS</Badge>
            <Badge variant="accent">MODE: {room.mode}</Badge>
            <Badge variant="secondary">LVL: {room.level}</Badge>
          </div>
        </div>
      </div>
      {room.timerEndsAt && timeLeft !== null && (
        <div className="mt-4 sm:mt-0 flex items-center gap-2 bg-white border-4 border-neo-ink px-4 py-2 rotate-2 shadow-[4px_4px_0px_0px_#000]">
          <Clock className="stroke-[3px]" />
          <span className="text-2xl font-black tracking-widest">{formatTime(timeLeft)}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-grid bg-neo-canvas text-neo-ink flex flex-col">
      {renderTopBar()}

      <div className="flex-1 container mx-auto p-6 max-w-6xl">
        {!hasJoined ? (
          <div className="max-w-md mx-auto mt-20 text-center font-black text-3xl uppercase animate-pulse">
            SYNCHRONIZING PLAYER...
          </div>
        ) : (
          <div className="space-y-8 mt-4">
            {/* LOBBY PHASE */}
            {room.status === 'LOBBY' && (
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="-rotate-1">
                  <CardHeader><CardTitle>INSTRUCTIONS</CardTitle></CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <p className="font-bold text-lg">Wait for players to join. Once the host starts, you will have {Math.floor(room.timeLimit / 60000)} minutes to design in Figma based on the prompt.</p>
                    {isHost && (
                      <Button onClick={() => updateRoomStatus('IN_PROGRESS', room.timeLimit)} className="w-full text-xl mt-4 bg-neo-secondary text-neo-ink" size="lg">
                        <Play className="mr-2" /> START BATTLE
                      </Button>
                    )}
                    {!isHost && (
                      <div className="p-4 bg-neo-muted/30 border-4 border-neo-ink font-bold animate-pulse">Waiting for host to start...</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>PLAYERS</CardTitle></CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {players.map(p => (
                        <li key={p.id} className="font-bold text-xl uppercase tracking-wide flex items-center gap-2 border-b-4 border-neo-ink pb-2 last:border-0 p-2 bg-white">
                          <Check className="text-neo-accent" strokeWidth={4} /> {p.name} {p.id === room.hostId && <Badge variant="accent" className="scale-75">HOST</Badge>}
                          {p.id === userId && <span className="text-neo-ink/50 ml-auto text-sm">(YOU)</span>}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* IN PROGRESS OR SUBMISSION PHASE */}
            {(room.status === 'IN_PROGRESS' || room.status === 'SUBMISSION') && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-neo-accent p-8 border-4 border-neo-ink shadow-[8px_8px_0px_0px_#000] -rotate-1 relative space-y-4">
                  <Badge variant="secondary" className="absolute -top-4 -left-4 -rotate-12 transform">PROMPT</Badge>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-black/60">YOU ARE DESIGNING FOR:</h3>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">{room.prompt.context}</h2>
                  </div>
                  <div className="bg-white text-neo-ink p-4 border-4 border-neo-ink">
                    <h3 className="text-lg font-bold uppercase tracking-widest text-black/60">TASK:</h3>
                    <p className="text-2xl font-black uppercase">{room.prompt.task}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-black/60">CONSTRAINTS:</h3>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                      {room.prompt.constraints.map((c, i) => (
                        <li key={i} className="text-2xl font-bold text-white uppercase">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Card className="rotate-1">
                  <CardHeader className="bg-neo-secondary"><CardTitle>YOUR SUBMISSION</CardTitle></CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {currentPlayer?.figmaLink ? (
                      <div className="p-6 bg-[#0ACF83]/20 border-4 border-neo-ink font-bold text-center">
                        <Trophy size={48} className="mx-auto mb-4 text-[#0ACF83]" />
                        <p className="text-2xl uppercase">Design Submitted!</p>
                        <a href={currentPlayer.figmaLink} target="_blank" className="underline hover:text-neo-accent transition-colors block mt-2">View Your Link</a>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-lg">Work on your design in Figma! Paste your link below before the timer runs out.</p>
                        <div className="flex gap-4">
                          <Input placeholder="https://figma.com/file/..." value={figmaLink} onChange={e => setFigmaLink(e.target.value)} />
                          <Button onClick={() => submitDesign(figmaLink)} disabled={!figmaLink.includes('figma.com')} className="w-1/3">
                            <Upload className="mr-2" /> SUBMIT
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {isHost && (
                       <Button onClick={() => updateRoomStatus(room.status === 'IN_PROGRESS' ? 'SUBMISSION' : 'VOTING', room.status === 'IN_PROGRESS' ? SUBMISSION_TIME : room.votingTime)} variant="outline" className="w-full mt-4">
                        FORCE TO NEXT PHASE
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* VOTING PHASE */}
            {room.status === 'VOTING' && (
              <div className="space-y-6">
                <div className="bg-neo-muted p-6 border-4 border-neo-ink text-center shadow-[4px_4px_0px_0px_#000]">
                  <h2 className="text-3xl font-black uppercase">VOTE FOR THE BEST DESIGN</h2>
                  <p className="font-bold mt-2">You cannot vote for yourself.</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {players.filter(p => !!p.figmaLink).map(p => (
                    <Card key={p.id} className="hover:-translate-y-2 hover:rotate-1">
                      <CardContent className="pt-6 flex flex-col h-full space-y-4">
                        <div className="flex-1 bg-neo-canvas border-4 border-neo-ink flex flex-col justify-between overflow-hidden">
                          <h3 className="text-2xl font-black uppercase p-4 border-b-4 border-neo-ink bg-white text-center">{p.name}</h3>
                          <div className="w-full bg-neo-canvas relative" style={{ aspectRatio: '16/9' }}>
                            <iframe 
                              className="absolute top-0 left-0 w-full h-full"
                              src={`https://www.figma.com/embed?embed_host=uiwars&url=${encodeURIComponent(p.figmaLink!)}`} 
                              allowFullScreen
                            ></iframe>
                          </div>
                          <a href={p.figmaLink!} target="_blank" rel="noreferrer" className="bg-neo-ink text-white font-bold py-2 px-4 text-center hover:bg-[#0ACF83] hover:text-neo-ink transition-colors border-t-4 border-neo-ink block">
                            OPEN IN FIGMA
                          </a>
                        </div>
                        {currentPlayer?.votedFor === p.id ? (
                           <div className="w-full bg-[#0ACF83] border-4 border-neo-ink py-2 text-center font-bold">VOTED</div>
                        ) : (
                          <Button onClick={() => voteForPlayer(p.id)} disabled={p.id === userId || !!currentPlayer?.votedFor} className="w-full">
                            VOTE FOR {p.name}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {isHost && (
                  <Button onClick={() => updateRoomStatus('RESULTS')} variant="outline" size="lg" className="w-full max-w-xs mx-auto block mt-12 bg-white">
                    END VOTING & SHOW RESULTS
                  </Button>
                )}
              </div>
            )}

            {/* RESULTS PHASE */}
            {room.status === 'RESULTS' && (
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-5xl md:text-7xl font-black uppercase" style={{ WebkitTextStroke: '2px black', color: '#FFD93D', textShadow: '4px 4px 0px #000' }}>RESULTS ARE IN</h2>
                
                <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
                  {players.sort((a, b) => {
                    const votesA = players.filter(p => p.votedFor === a.id).length;
                    const votesB = players.filter(p => p.votedFor === b.id).length;
                    return votesB - votesA;
                  }).map((p, i) => {
                    const votes = players.filter(pl => pl.votedFor === p.id).length;
                    const isWinner = i === 0 && votes > 0;
                    return (
                      <Card key={p.id} className={`transform ${isWinner ? '-rotate-2 border-8 border-neo-accent scale-105' : 'rotate-1'}`}>
                       {isWinner && <Badge className="absolute -top-4 -right-4 animate-bounce text-lg px-4 py-2 shadow-[4px_4px_0px_#000]">WINNER!</Badge>}
                       <CardContent className="pt-6 flex justify-between items-center text-3xl font-black uppercase">
                         <span>{i + 1}. {p.name}</span>
                         <span className="bg-neo-ink text-white px-4 py-2 border-4 border-neo-ink" style={{ WebkitTextStroke: '1px white' }}>{votes}</span>
                       </CardContent>
                      </Card>
                    );
                  })}
                </div>
                 
                 {isHost && (
                   <Button onClick={() => updateRoomStatus('LOBBY')} size="lg" className="mt-12 bg-neo-muted">
                     PLAY AGAIN
                   </Button>
                 )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
