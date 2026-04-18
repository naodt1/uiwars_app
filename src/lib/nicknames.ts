const ADJECTIVES = [
  'PIXEL', 'VECTOR', 'CUBIC', 'ROGUE', 'SOLAR', 'HYPER', 'NEON', 'OMEGA',
  'TURBO', 'GHOST', 'CYBER', 'DARK', 'ATOMIC', 'RAPID', 'ULTRA', 'VOID',
];

const NOUNS = [
  'SHARK', 'WIZARD', 'BEAST', 'TITAN', 'STORM', 'FORGE', 'BLADE', 'WOLF',
  'FALCON', 'VIPER', 'COMET', 'RACER', 'MONK', 'HUNTER', 'RAVEN', 'ECHO',
];

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}_${noun}${num}`;
}
