import { LevelConfig, GameState } from "./types";

export const LEVELS: LevelConfig[] = [
  { name: "Level 1", range: [10, 50], ops: ["+"], desc: "两位数加法（无进位）", noCarry: true },
  { name: "Level 2", range: [10, 60], ops: ["+"], desc: "两位数加法（有进位）", noCarry: false },
  { name: "Level 3", range: [20, 99], ops: ["-"], desc: "两位数减法（无借位）", noBorrow: true },
  { name: "Level 4", range: [30, 99], ops: ["-"], desc: "两位数减法（有借位）", noBorrow: false },
  { name: "Level 5", range: [20, 99], ops: ["+", "-"], desc: "加减法混合挑战" },
];

export const QUESTIONS_PER_LEVEL = 5;

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getLevelConfig(level: number): LevelConfig {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)];
}

export function generateQuestion(level: number): Pick<GameState, "num1" | "num2" | "op" | "answer"> {
  const cfg = getLevelConfig(level);
  const op = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];

  while (true) {
    const a = randInt(cfg.range[0], cfg.range[1]);
    const b = randInt(cfg.range[0], Math.min(a, cfg.range[1]));

    if (op === "+") {
      if (cfg.noCarry && (a % 10) + (b % 10) >= 10) continue;
      return { num1: a, num2: b, op: "+", answer: a + b };
    } else {
      const [big, small] = a >= b ? [a, b] : [b, a];
      if (cfg.noBorrow && (big % 10) < (small % 10)) continue;
      return { num1: big, num2: small, op: "-", answer: big - small };
    }
  }
}

export function calculateScore(streak: number): { points: number; bonus: number } {
  const bonus = Math.min(streak - 1, 4) * 5;
  const points = 10 + bonus;
  return { points, bonus };
}

export function initialState(): GameState {
  const q = generateQuestion(1);
  return {
    level: 1,
    score: 0,
    totalCorrect: 0,
    totalAttempted: 0,
    questionInLevel: 0,
    questionsPerLevel: QUESTIONS_PER_LEVEL,
    streak: 0,
    ...q,
    answered: false,
  };
}
