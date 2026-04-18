export type RoomStatus = 'LOBBY' | 'IN_PROGRESS' | 'SUBMISSION' | 'VOTING' | 'RESULTS';

export type GameMode = 'SPEED' | 'CREATIVE' | 'UX' | 'CHAOS';
export type GameLevel = 1 | 2 | 3 | 4;

export interface StructuredPrompt {
  context: string;
  task: string;
  constraints: string[];
}

export interface Room {
  id: string; // 5-letter code
  prompt: StructuredPrompt; // JSONB
  mode: GameMode;
  level: GameLevel;
  timeLimit: number; // in milliseconds
  votingTime: number; // in milliseconds
  status: RoomStatus;
  timerEndsAt: number | null; // Timestamp
  hostId: string;
  createdAt: number;
}

export interface Player {
  id: string; // Anonymous Auth UID
  name: string;
  figmaLink: string | null;
  votedFor: string | null; // Player ID they voted for
  score: number;
  joinedAt: number;
}
