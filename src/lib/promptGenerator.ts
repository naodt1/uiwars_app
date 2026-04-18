import { GameMode, GameLevel, StructuredPrompt } from "@/lib/types";
import { DESIGN_SYSTEMS, getRandom as pickRandom } from "@/lib/designSystems";

const CONTEXTS = {
  SPEED: [
    "A standard e-commerce store.",
    "A simple weather application.",
    "A food delivery service.",
    "An alarm clock app."
  ],
  CREATIVE: [
    "A space travel agency booking interface.",
    "A vending machine for magical potions.",
    "A dating app for ghosts.",
    "A smart-mirror interface for vampires."
  ],
  UX: [
    "An emergency SOS beacon software.",
    "A highly complex stock trading terminal.",
    "A medical dashboard for an intense ER.",
    "An accessible navigation tool for the visually impaired."
  ],
  CHAOS: [
    "An underground hacker collective's chat app.",
    "The control panel for a malfunctioning robot.",
    "A social network designed entirely for dogs.",
    "A secret government doomsday device."
  ]
};

const TASKS = {
  SPEED: [
    "Design the login screen.",
    "Design the checkout flow.",
    "Design the settings menu.",
    "Design the search results page."
  ],
  CREATIVE: [
    "Design the main exploratory dashboard.",
    "Design the character/user creation flow.",
    "Design the product detail page.",
    "Design the checkout and confirmation."
  ],
  UX: [
    "Design the critical alert warning system.",
    "Design the complex filtering sidebar.",
    "Design the data visualization overview.",
    "Design the primary navigation mechanism."
  ],
  CHAOS: [
    "Design the self-destruct sequence.",
    "Design the account deletion process.",
    "Design the profile personalization page.",
    "Design the main communication interface."
  ]
};

const CONSTRAINTS = {
  LEVEL_2: [ // Light
    "Use only black and white.",
    "No text larger than 16px.",
    "All buttons must be circles.",
    "Use a maximum of 3 font sizes.",
    "No traditional icons (e.g., house, gear) allowed."
  ],
  LEVEL_3: [ // Hard
    "No text allowed anywhere on the screen.",
    "Design without using any straight lines.",
    "The primary action must be hidden until hovered.",
    "The entire UI must fit on a smartwatch screen.",
    "You cannot use any traditional buttons."
  ],
  LEVEL_4: [ // Chaos
    "Must use Comic Sans or Papyrus font exclusively.",
    "The background must be a low-res stock photo of a cat.",
    "All text must be written backwards.",
    "The user must solve a math problem to complete the task.",
    "Make it as confusing and frustrating to use as possible."
  ]
};

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// UX and CREATIVE modes at level 2+ get a mandatory design system
const getDesignSystem = (mode: GameMode, level: GameLevel) => {
  if ((mode === 'UX' || mode === 'CREATIVE') && level >= 2) {
    return pickRandom(DESIGN_SYSTEMS);
  }
  return undefined;
};

const getConstraintsForLevel = (level: GameLevel, mode: GameMode): string[] => {
  if (level === 1) return ["Make it user friendly and accessible."]; // Warmup

  let pool: string[] = [];
  if (level === 2) pool = [...CONSTRAINTS.LEVEL_2];
  if (level === 3) pool = [...CONSTRAINTS.LEVEL_3];
  if (level === 4) pool = [...CONSTRAINTS.LEVEL_4];

  // Pick random constraints
  const count = level === 2 ? 1 : level === 3 ? 2 : 2; // Level 2: 1, Level 3: 2, Level 4: 2 extremely chaotic ones
  
  // Shuffle pool to pick unique
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateRoomConfig = (): { mode: GameMode; level: GameLevel; prompt: StructuredPrompt; timeLimit: number; votingTime: number } => {
  const modes: GameMode[] = ['SPEED', 'CREATIVE', 'UX', 'CHAOS'];
  const levels: GameLevel[] = [1, 2, 3, 4];
  
  const mode = getRandom(modes);
  const level = getRandom(levels);

  const context = getRandom(CONTEXTS[mode]);
  const task = getRandom(TASKS[mode]);
  const constraints = getConstraintsForLevel(level, mode);

  let timeLimit = 5 * 60 * 1000;
  if (mode === 'SPEED') timeLimit = 3 * 60 * 1000;
  if (level > 2 && mode !== 'SPEED') timeLimit = 7 * 60 * 1000;

  const votingTime = 2 * 60 * 1000;

  const designSystem = getDesignSystem(mode, level);

  return {
    mode,
    level,
    prompt: { context, task, constraints, designSystem },
    timeLimit,
    votingTime
  };
};

/**
 * Generate just the prompt for a specific mode + level (used when the host configures the room manually).
 */
export const generateRoomConfigForOptions = (mode: GameMode, level: GameLevel): StructuredPrompt => {
  const context = getRandom(CONTEXTS[mode]);
  const task = getRandom(TASKS[mode]);
  const constraints = getConstraintsForLevel(level, mode);
  const designSystem = getDesignSystem(mode, level);
  return { context, task, constraints, designSystem };
};

