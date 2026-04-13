import { WorldConfig, LevelConfig, QuestionResult, GameState } from "./types";

// ===== HELPERS =====
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAddQuestion(
  aRange: [number, number],
  bRange: [number, number],
  constraint?: "noCarry" | "carry" | "doubleCarry"
): QuestionResult {
  while (true) {
    const a = randInt(aRange[0], aRange[1]);
    const b = randInt(bRange[0], bRange[1]);
    const onesSum = (a % 10) + (b % 10);
    const tensSum = Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + (onesSum >= 10 ? 1 : 0);

    if (constraint === "noCarry" && onesSum >= 10) continue;
    if (constraint === "carry" && onesSum < 10) continue;
    if (constraint === "doubleCarry" && (onesSum < 10 || tensSum < 10)) continue;

    return { num1: a, num2: b, op: "+", answer: a + b, remainder: 0 };
  }
}

function makeSubQuestion(
  aRange: [number, number],
  bRange: [number, number],
  constraint?: "noBorrow" | "borrow"
): QuestionResult {
  while (true) {
    let a = randInt(aRange[0], aRange[1]);
    let b = randInt(bRange[0], bRange[1]);
    if (a < b) [a, b] = [b, a];
    if (a === b) continue;

    const needBorrow = (a % 10) < (b % 10);
    if (constraint === "noBorrow" && needBorrow) continue;
    if (constraint === "borrow" && !needBorrow) continue;

    return { num1: a, num2: b, op: "-", answer: a - b, remainder: 0 };
  }
}

function makeMulQuestion(
  aRange: [number, number],
  bRange: [number, number],
  constraint?: "noCarry"
): QuestionResult {
  while (true) {
    const a = randInt(aRange[0], aRange[1]);
    const b = randInt(bRange[0], bRange[1]);

    if (constraint === "noCarry") {
      // Each digit of a × b must be < 10
      const onesProduct = (a % 10) * b;
      const tensProduct = (Math.floor(a / 10) % 10) * b;
      if (onesProduct >= 10 || tensProduct >= 10) continue;
    }

    return { num1: a, num2: b, op: "×", answer: a * b, remainder: 0 };
  }
}

function makeDivQuestion(
  quotientRange: [number, number],
  bRange: [number, number],
  allowRemainder: boolean
): QuestionResult {
  while (true) {
    const b = randInt(bRange[0], bRange[1]);
    const quotient = randInt(quotientRange[0], quotientRange[1]);
    const remainder = allowRemainder ? randInt(0, b - 1) : 0;
    const a = quotient * b + remainder;

    if (a < 1) continue;
    return { num1: a, num2: b, op: "÷", answer: quotient, remainder };
  }
}

// ===== WORLD DEFINITIONS =====

const world1: WorldConfig = {
  id: 1, name: "加法基础", emoji: "\u{1F7E2}",
  levels: [
    {
      id: "1-1", name: "Level 1-1", desc: "两位数 + 一位数（无进位）", op: "+",
      generate: () => makeAddQuestion([11, 89], [1, 9], "noCarry"),
    },
    {
      id: "1-2", name: "Level 1-2", desc: "两位数 + 一位数（有进位）", op: "+",
      generate: () => makeAddQuestion([11, 91], [2, 9], "carry"),
    },
    {
      id: "1-3", name: "Level 1-3", desc: "两位数 + 两位数（无进位）", op: "+",
      generate: () => makeAddQuestion([10, 50], [10, 40], "noCarry"),
    },
    {
      id: "1-4", name: "Level 1-4", desc: "两位数 + 两位数（有进位）", op: "+",
      generate: () => makeAddQuestion([10, 60], [10, 50], "carry"),
    },
    {
      id: "1-5", name: "Level 1-5", desc: "两位数 + 两位数（连续进位）", op: "+",
      generate: () => makeAddQuestion([30, 99], [30, 99], "doubleCarry"),
    },
  ],
};

const world2: WorldConfig = {
  id: 2, name: "减法基础", emoji: "\u{1F535}",
  levels: [
    {
      id: "2-1", name: "Level 2-1", desc: "两位数 − 一位数（无借位）", op: "-",
      generate: () => makeSubQuestion([11, 99], [1, 9], "noBorrow"),
    },
    {
      id: "2-2", name: "Level 2-2", desc: "两位数 − 一位数（有借位）", op: "-",
      generate: () => makeSubQuestion([20, 99], [2, 9], "borrow"),
    },
    {
      id: "2-3", name: "Level 2-3", desc: "两位数 − 两位数（无借位）", op: "-",
      generate: () => makeSubQuestion([20, 99], [10, 50], "noBorrow"),
    },
    {
      id: "2-4", name: "Level 2-4", desc: "两位数 − 两位数（有借位）", op: "-",
      generate: () => makeSubQuestion([20, 99], [10, 80], "borrow"),
    },
    {
      id: "2-5", name: "Level 2-5", desc: "两位数加减混合", op: "+",
      generate: () => Math.random() < 0.5
        ? makeAddQuestion([10, 60], [10, 50])
        : makeSubQuestion([20, 99], [10, 80]),
    },
  ],
};

const world3: WorldConfig = {
  id: 3, name: "三位数加减法", emoji: "\u{1F7E1}",
  levels: [
    {
      id: "3-1", name: "Level 3-1", desc: "三位数 + 两位数（无进位）", op: "+",
      generate: () => makeAddQuestion([100, 899], [10, 99], "noCarry"),
    },
    {
      id: "3-2", name: "Level 3-2", desc: "三位数 + 两位数（有进位）", op: "+",
      generate: () => makeAddQuestion([100, 899], [10, 99]),
    },
    {
      id: "3-3", name: "Level 3-3", desc: "三位数 + 三位数", op: "+",
      generate: () => makeAddQuestion([100, 500], [100, 499]),
    },
    {
      id: "3-4", name: "Level 3-4", desc: "三位数 − 两位数", op: "-",
      generate: () => makeSubQuestion([100, 999], [10, 99]),
    },
    {
      id: "3-5", name: "Level 3-5", desc: "三位数 − 三位数", op: "-",
      generate: () => makeSubQuestion([200, 999], [100, 800]),
    },
    {
      id: "3-6", name: "Level 3-6", desc: "三位数加减混合", op: "+",
      generate: () => Math.random() < 0.5
        ? makeAddQuestion([100, 500], [100, 499])
        : makeSubQuestion([200, 999], [100, 800]),
    },
  ],
};

const world4: WorldConfig = {
  id: 4, name: "乘法入门", emoji: "\u2716\uFE0F",
  levels: [
    {
      id: "4-1", name: "Level 4-1", desc: "乘法口诀（2–5）", op: "×",
      generate: () => makeMulQuestion([1, 9], [2, 5]),
    },
    {
      id: "4-2", name: "Level 4-2", desc: "乘法口诀（6–9）", op: "×",
      generate: () => makeMulQuestion([1, 9], [6, 9]),
    },
    {
      id: "4-3", name: "Level 4-3", desc: "两位数 × 一位数（无进位）", op: "×",
      generate: () => makeMulQuestion([11, 33], [2, 3], "noCarry"),
    },
    {
      id: "4-4", name: "Level 4-4", desc: "两位数 × 一位数（有进位）", op: "×",
      generate: () => makeMulQuestion([12, 99], [2, 9]),
    },
    {
      id: "4-5", name: "Level 4-5", desc: "三位数 × 一位数", op: "×",
      generate: () => makeMulQuestion([100, 333], [2, 4]),
    },
  ],
};

const world5: WorldConfig = {
  id: 5, name: "除法入门", emoji: "\u2797",
  levels: [
    {
      id: "5-1", name: "Level 5-1", desc: "表内除法", op: "÷",
      generate: () => makeDivQuestion([1, 9], [2, 9], false),
    },
    {
      id: "5-2", name: "Level 5-2", desc: "两位数 ÷ 一位数（无余数）", op: "÷",
      generate: () => makeDivQuestion([10, 99], [2, 9], false),
    },
    {
      id: "5-3", name: "Level 5-3", desc: "两位数 ÷ 一位数（有余数）", op: "÷",
      generate: () => makeDivQuestion([10, 50], [2, 9], true),
    },
    {
      id: "5-4", name: "Level 5-4", desc: "三位数 ÷ 一位数", op: "÷",
      generate: () => makeDivQuestion([100, 250], [2, 9], true),
    },
  ],
};

const world6: WorldConfig = {
  id: 6, name: "两位数乘除法", emoji: "\u{1F525}",
  levels: [
    {
      id: "6-1", name: "Level 6-1", desc: "两位数 × 整十数", op: "×",
      generate: () => {
        const a = randInt(11, 50);
        const tens = [10, 20, 30][randInt(0, 2)];
        return { num1: a, num2: tens, op: "×", answer: a * tens, remainder: 0 };
      },
    },
    {
      id: "6-2", name: "Level 6-2", desc: "两位数 × 两位数", op: "×",
      generate: () => makeMulQuestion([11, 50], [11, 30]),
    },
    {
      id: "6-3", name: "Level 6-3", desc: "三位数 ÷ 一位数（复杂）", op: "÷",
      generate: () => makeDivQuestion([100, 200], [3, 9], true),
    },
    {
      id: "6-4", name: "Level 6-4", desc: "乘除混合练习", op: "×",
      generate: () => Math.random() < 0.5
        ? makeMulQuestion([11, 50], [2, 9])
        : makeDivQuestion([10, 99], [2, 9], true),
    },
  ],
};

const world7: WorldConfig = {
  id: 7, name: "综合挑战", emoji: "\u{1F3C6}",
  levels: [
    {
      id: "7-1", name: "Level 7-1", desc: "加减综合", op: "+",
      generate: () => Math.random() < 0.5
        ? makeAddQuestion([100, 500], [100, 499])
        : makeSubQuestion([200, 999], [100, 800]),
    },
    {
      id: "7-2", name: "Level 7-2", desc: "乘除综合", op: "×",
      generate: () => Math.random() < 0.5
        ? makeMulQuestion([11, 50], [2, 9])
        : makeDivQuestion([10, 99], [2, 9], true),
    },
    {
      id: "7-3", name: "Level 7-3", desc: "四则混合", op: "+",
      generate: () => {
        const r = Math.random();
        if (r < 0.25) return makeAddQuestion([100, 500], [100, 499]);
        if (r < 0.5) return makeSubQuestion([200, 999], [100, 800]);
        if (r < 0.75) return makeMulQuestion([11, 50], [2, 9]);
        return makeDivQuestion([10, 99], [2, 9], true);
      },
    },
    {
      id: "7-4", name: "Level 7-4", desc: "终极挑战", op: "+",
      generate: () => {
        const r = Math.random();
        if (r < 0.25) return makeAddQuestion([100, 900], [100, 900]);
        if (r < 0.5) return makeSubQuestion([200, 999], [100, 900]);
        if (r < 0.75) return makeMulQuestion([11, 99], [2, 9]);
        return makeDivQuestion([50, 200], [2, 9], true);
      },
    },
  ],
};

// ===== EXPORTS =====

export const WORLDS: WorldConfig[] = [world1, world2, world3, world4, world5, world6, world7];
export const QUESTIONS_PER_LEVEL = 5;

export function getWorldConfig(worldNum: number): WorldConfig {
  return WORLDS[Math.min(worldNum - 1, WORLDS.length - 1)];
}

export function getLevelConfig(worldNum: number, levelNum: number): LevelConfig {
  const world = getWorldConfig(worldNum);
  return world.levels[Math.min(levelNum - 1, world.levels.length - 1)];
}

export function generateQuestion(worldNum: number, levelNum: number): QuestionResult {
  const cfg = getLevelConfig(worldNum, levelNum);
  return cfg.generate();
}

export function calculateScore(streak: number): { points: number; bonus: number } {
  const bonus = Math.min(streak - 1, 4) * 5;
  const points = 10 + bonus;
  return { points, bonus };
}

export function getStarRating(correct: number, total: number): number {
  const pct = correct / total;
  if (pct >= 1) return 3;
  if (pct >= 0.8) return 2;
  if (pct >= 0.6) return 1;
  return 0;
}

export function initialState(): GameState {
  const q = generateQuestion(1, 1);
  return {
    world: 1,
    level: 1,
    score: 0,
    totalCorrect: 0,
    totalAttempted: 0,
    levelCorrect: 0,
    questionInLevel: 0,
    questionsPerLevel: QUESTIONS_PER_LEVEL,
    streak: 0,
    ...q,
    answered: false,
  };
}
