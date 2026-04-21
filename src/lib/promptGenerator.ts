import { GameMode, GameLevel, StructuredPrompt } from "@/lib/types";
import { DESIGN_SYSTEMS, getRandom as pickRandom } from "@/lib/designSystems";

interface Scenario {
  context: string;
  task: string;
  example: string;
}

const SCENARIOS: Record<GameMode, Scenario[]> = {
  SPEED: [
    {
      context: "A boutique sneaker e-commerce store.",
      task: "Design the product filtering sidebar and results grid.",
      example: "Think 'Nike SNKRS' meets minimalist grid brutalism. Heavy typography, raw edges, and high-contrast product imagery."
    },
    {
      context: "A hyper-local weather application.",
      task: "Design the 7-day forecast timeline and current conditions widget.",
      example: "Similar to the iOS weather app, but utilizing massive typography, strict monochromatic colors, and sharp borders."
    },
    {
      context: "A food delivery service for elite chefs.",
      task: "Design the restaurant menu and cart summary pane.",
      example: "Imagine UberEats but formatted like a high-end editorial magazine with stark white backgrounds and bold black serif text."
    },
    {
      context: "A productivity and alarm clock app.",
      task: "Design the set-alarm screen and the active bed-side display.",
      example: "Use large, glowing neon-style numbers and pill-shaped toggle buttons on a pitch-black canvas."
    }
  ],
  CREATIVE: [
    {
      context: "A space travel agency booking interface.",
      task: "Design the planet selection map and ticket checkout flow.",
      example: "Think retro-futurism. Dark starry backgrounds, glowing neon purple/cyan accents, and technical HUD-style UI elements."
    },
    {
      context: "A magical potion vending machine interface.",
      task: "Design the flavor selection and payment screen.",
      example: "Use rich, mystical colors (deep purples and golds), whimsical rounded fonts, and layout elements that look like glass vials."
    },
    {
      context: "A dating app specifically for ghosts.",
      task: "Design the 'swipe' matching screen and user profile detail.",
      example: "Ethereal and spooky. Use frosted glass effects, floating elements, pale blues/whites, and soft glowing shadows."
    },
    {
      context: "An interactive smart-mirror for vampires.",
      task: "Design the daily schedule and reflection-enhancement dashboard.",
      example: "Gothic chic. Deep blood reds, absolute black, elegant serif typography, and framing that feels like an ornate mirror."
    }
  ],
  UX: [
    {
      context: "An emergency SOS beacon coordination software.",
      task: "Design the active distress signal radar and responder assignment panel.",
      example: "Prioritize extreme clarity. High-contrast warning colors (yellow/red) against dark backgrounds, with unmistakable, large tap targets."
    },
    {
      context: "A highly complex stock trading terminal.",
      task: "Design the multi-asset monitoring dashboard and quick-trade widget.",
      example: "Focus on information density. Use a strict grid, monospaced numbers for alignment, and clear visual hierarchy so data isn't overwhelming."
    },
    {
      context: "A medical triage dashboard for an intense ER.",
      task: "Design the patient queue list and critical vitals summary card.",
      example: "Needs to be glanceable under stress. Use color-coded urgency badges, large readable sans-serif fonts, and clear compartmentalization."
    },
    {
      context: "An accessible city transit navigation tool.",
      task: "Design the 'next train' display and route-planning input.",
      example: "High contrast, massive typography, very clear iconography, avoiding any reliance purely on color to convey meaning."
    }
  ],
  CHAOS: [
    {
      context: "An underground hacker collective's chat app.",
      task: "Design the channel list and message input area.",
      example: "Embrace the terminal aesthetic. Green-on-black, monospaced fonts, ascii-art borders, and jagged, unsettling layouts."
    },
    {
      context: "The control panel for a malfunctioning robot.",
      task: "Design the diagnostic error log and reboot sequence.",
      example: "Make it look glitched. Features overlapping text, stark red error states, jarring diagonal cuts, and chaotic alignments."
    },
    {
      context: "A social network designed entirely for dogs.",
      task: "Design the 'sniff' button interaction and the newsfeed.",
      example: "Absurdly oversized buttons, primary colors only, and paw-friendly navigation that completely ignores human UX standards."
    },
    {
      context: "A secret government doomsday device.",
      task: "Design the countdown timer and the final authorization modal.",
      example: "Cold, scary, and industrial. Heavy 'Brutalist Signal' style: stark off-white/paper background, signal-red accents, and menacing typography."
    }
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
    "The background must be a low-res stock photo.",
    "All text must be written backwards.",
    "The user must solve a math problem to complete the task.",
    "Make it as confusing and frustrating to use as possible."
  ]
};

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// UX and CREATIVE modes at level 2+ get a mandatory design system
const getDesignSystem = (mode: GameMode, level: GameLevel) => {
  // Let's actually give everyone a design system regardless of level/mode to allow downloading color palettes
  return pickRandom(DESIGN_SYSTEMS);
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

  const scenario = getRandom(SCENARIOS[mode]);
  const constraints = getConstraintsForLevel(level, mode);

  let timeLimit = 5 * 60 * 1000;
  if (mode === 'SPEED') timeLimit = 3 * 60 * 1000;
  if (level > 2 && mode !== 'SPEED') timeLimit = 7 * 60 * 1000;

  const votingTime = 2 * 60 * 1000;

  const designSystem = getDesignSystem(mode, level);

  return {
    mode,
    level,
    prompt: { 
      context: scenario.context, 
      task: scenario.task, 
      example: scenario.example, 
      exampleImages: [`/examples/${mode.toLowerCase()}.png`],
      constraints, 
      designSystem 
    },
    timeLimit,
    votingTime
  };
};

/**
 * Generate just the prompt for a specific mode + level (used when the host configures the room manually).
 */
export const generateRoomConfigForOptions = (mode: GameMode, level: GameLevel): StructuredPrompt => {
  const scenario = getRandom(SCENARIOS[mode]);
  const constraints = getConstraintsForLevel(level, mode);
  const designSystem = getDesignSystem(mode, level);
  return { 
    context: scenario.context, 
    task: scenario.task, 
    example: scenario.example, 
    exampleImages: [`/examples/${mode.toLowerCase()}.png`],
    constraints, 
    designSystem 
  };
};
