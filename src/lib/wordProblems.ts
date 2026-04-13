import { QuestionResult } from "./types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== 8-1: 鸡兔同笼 (Chickens & Rabbits) =====
export function chickenRabbit(): QuestionResult {
  const chickens = randInt(3, 15);
  const rabbits = randInt(2, 10);
  const heads = chickens + rabbits;
  const legs = chickens * 2 + rabbits * 4;

  const askWhat = pick(["rabbits", "chickens"] as const);

  if (askWhat === "rabbits") {
    return {
      num1: heads, num2: legs, op: "+", answer: rabbits, remainder: 0,
      wordProblem: `笼子里有鸡和兔子共 ${heads} 只，数一数一共有 ${legs} 条腿。请问笼子里有多少只兔子？`,
      hint: "提示：鸡有2条腿，兔子有4条腿",
      unit: "只",
    };
  } else {
    return {
      num1: heads, num2: legs, op: "+", answer: chickens, remainder: 0,
      wordProblem: `笼子里有鸡和兔子共 ${heads} 只，数一数一共有 ${legs} 条腿。请问笼子里有多少只鸡？`,
      hint: "提示：鸡有2条腿，兔子有4条腿",
      unit: "只",
    };
  }
}

// ===== 8-2: 和差问题 (Sum & Difference) =====
export function sumDifference(): QuestionResult {
  const a = randInt(15, 50);
  const b = randInt(5, a - 5);
  const sum = a + b;
  const diff = a - b;

  const items = pick([
    { nameA: "哥哥", nameB: "弟弟", unit: "颗" as const, thing: "糖果" },
    { nameA: "小明", nameB: "小红", unit: "本" as const, thing: "书" },
    { nameA: "甲班", nameB: "乙班", unit: "人" as const, thing: "同学" },
    { nameA: "姐姐", nameB: "妹妹", unit: "张" as const, thing: "贴纸" },
  ]);

  const askWhat = pick(["bigger", "smaller"] as const);

  if (askWhat === "bigger") {
    return {
      num1: sum, num2: diff, op: "+", answer: a, remainder: 0,
      wordProblem: `${items.nameA}和${items.nameB}一共有 ${sum} ${items.unit}${items.thing}，${items.nameA}比${items.nameB}多 ${diff} ${items.unit}。请问${items.nameA}有多少${items.unit}${items.thing}？`,
      hint: `提示：大数 = (和 + 差) \u00F7 2`,
      unit: items.unit,
    };
  } else {
    return {
      num1: sum, num2: diff, op: "+", answer: b, remainder: 0,
      wordProblem: `${items.nameA}和${items.nameB}一共有 ${sum} ${items.unit}${items.thing}，${items.nameA}比${items.nameB}多 ${diff} ${items.unit}。请问${items.nameB}有多少${items.unit}${items.thing}？`,
      hint: `提示：小数 = (和 \u2212 差) \u00F7 2`,
      unit: items.unit,
    };
  }
}

// ===== 8-3: 年龄问题 (Age Problems) =====
export function ageProblem(): QuestionResult {
  const childAge = randInt(7, 12);
  const parentAge = childAge + randInt(22, 30);
  const yearsAgo = randInt(2, 5);

  const templates = [
    {
      problem: `今年妈妈 ${parentAge} 岁，小明 ${childAge} 岁。${yearsAgo} 年前妈妈比小明大多少岁？`,
      answer: parentAge - childAge,
      hint: "提示：年龄差永远不变！",
    },
    {
      problem: `爸爸今年 ${parentAge} 岁，是小红年龄的 ${Math.floor(parentAge / childAge)} 倍还多 ${parentAge % childAge} 岁。小红今年几岁？`,
      answer: childAge,
      hint: "提示：先列算式，再倒着算",
    },
    {
      problem: `小明今年 ${childAge} 岁，妈妈今年 ${parentAge} 岁。再过几年妈妈的年龄是小明的 2 倍？`,
      answer: parentAge - 2 * childAge,
      hint: "提示：设再过 x 年，妈妈年龄 = 小明年龄 \u00D7 2",
    },
  ];

  // Filter to only valid problems (answer > 0)
  const valid = templates.filter((t) => t.answer > 0);
  const t = pick(valid.length > 0 ? valid : [templates[0]]);

  return {
    num1: parentAge, num2: childAge, op: "+", answer: t.answer, remainder: 0,
    wordProblem: t.problem,
    hint: t.hint,
    unit: "岁",
  };
}

// ===== 8-4: 植树问题 (Tree Planting) =====
export function treePlanting(): QuestionResult {
  const templates = [
    () => {
      const distance = randInt(100, 300);
      const interval = pick([5, 6, 8, 10]);
      const trees = distance / interval + 1;
      return {
        answer: trees,
        problem: `一条 ${distance} 米长的小路两旁种树（两端都种），每隔 ${interval} 米种一棵。一共要种多少棵树？`,
        hint: "提示：两旁种树 = (路长 \u00F7 间隔 + 1) \u00D7 2",
        unit: "棵",
        realAnswer: (distance / interval + 1) * 2,
      };
    },
    () => {
      const numPosts = randInt(8, 20);
      const interval = pick([3, 4, 5, 6]);
      const length = (numPosts - 1) * interval;
      return {
        answer: length,
        problem: `一排篱笆有 ${numPosts} 根柱子，每两根柱子之间相隔 ${interval} 米。这排篱笆一共有多长？`,
        hint: "提示：间隔数 = 柱子数 \u2212 1",
        unit: "米",
        realAnswer: length,
      };
    },
    () => {
      const floors = randInt(5, 12);
      const stairs = randInt(15, 24);
      return {
        answer: (floors - 1) * stairs,
        problem: `一栋楼有 ${floors} 层，每两层之间有 ${stairs} 级台阶。从1楼走到${floors}楼一共要爬多少级台阶？`,
        hint: "提示：层间数 = 楼层数 \u2212 1",
        unit: "级",
        realAnswer: (floors - 1) * stairs,
      };
    },
  ];

  const gen = pick(templates)();
  return {
    num1: 0, num2: 0, op: "+", answer: gen.realAnswer, remainder: 0,
    wordProblem: gen.problem,
    hint: gen.hint,
    unit: gen.unit,
  };
}

// ===== 8-5: 盈亏问题 (Surplus & Deficit) =====
export function surplusDeficit(): QuestionResult {
  const people = randInt(5, 15);
  const perPerson1 = randInt(3, 6);
  const perPerson2 = perPerson1 + randInt(1, 3);
  const total = people * perPerson1 + randInt(2, 8);

  const surplus = total - people * perPerson1;
  const deficit = people * perPerson2 - total;

  const items = pick([
    { thing: "铅笔", unit: "支" },
    { thing: "苹果", unit: "个" },
    { thing: "糖果", unit: "颗" },
    { thing: "练习本", unit: "本" },
  ]);

  return {
    num1: surplus, num2: deficit, op: "+", answer: people, remainder: 0,
    wordProblem: `把一些${items.thing}分给小朋友，每人分 ${perPerson1} ${items.unit}多 ${surplus} ${items.unit}，每人分 ${perPerson2} ${items.unit}少 ${deficit} ${items.unit}。请问有多少个小朋友？`,
    hint: `提示：人数 = (多的 + 少的) \u00F7 (大分 \u2212 小分)`,
    unit: "个",
  };
}

// ===== 8-6: 还原问题 (Working Backwards) =====
export function workBackwards(): QuestionResult {
  const original = randInt(10, 50);
  const add1 = randInt(5, 15);
  const mul = pick([2, 3]);
  const sub1 = randInt(3, 10);
  const final = (original + add1) * mul - sub1;

  return {
    num1: 0, num2: 0, op: "+", answer: original, remainder: 0,
    wordProblem: `小明想一个数，先加上 ${add1}，再乘以 ${mul}，最后减去 ${sub1}，得到 ${final}。小明想的数是多少？`,
    hint: "提示：倒着算回去！最后的结果反过来做",
    unit: "",
  };
}

// ===== 8-7: 找规律 (Pattern Finding) =====
export function findPattern(): QuestionResult {
  const templates = [
    () => {
      const start = randInt(2, 8);
      const diff = randInt(2, 5);
      const seq = Array.from({ length: 5 }, (_, i) => start + diff * i);
      return {
        answer: start + diff * 5,
        problem: `找规律填数：${seq.join(", ")}, ___`,
        hint: "提示：看看相邻两个数之间差多少",
      };
    },
    () => {
      const start = randInt(1, 4);
      const ratio = pick([2, 3]);
      const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(ratio, i));
      return {
        answer: start * Math.pow(ratio, 4),
        problem: `找规律填数：${seq.join(", ")}, ___`,
        hint: "提示：每个数是前一个数的几倍？",
      };
    },
    () => {
      const a = randInt(1, 5);
      const d = randInt(3, 6);
      // 1, 4, 9, 16... (squares) shifted
      const seq = Array.from({ length: 5 }, (_, i) => a + d * i * (i + 1) / 2);
      // simpler: triangular pattern
      const tri = Array.from({ length: 5 }, (_, i) => (i + 1) * (i + 2) / 2);
      return {
        answer: 6 * 7 / 2,
        problem: `找规律填数：${tri.join(", ")}, ___`,
        hint: "提示：每次增加的数在变大，增加了多少？",
      };
    },
  ];

  const gen = pick(templates)();
  return {
    num1: 0, num2: 0, op: "+", answer: gen.answer, remainder: 0,
    wordProblem: gen.problem,
    hint: gen.hint,
    unit: "",
  };
}

// ===== 8-8: 巧算 (Clever Calculation) =====
export function cleverCalc(): QuestionResult {
  const templates = [
    () => {
      const n = randInt(10, 30);
      // 1+2+3+...+n
      const answer = n * (n + 1) / 2;
      return {
        answer,
        problem: `巧算：1 + 2 + 3 + ... + ${n} = ?`,
        hint: "提示：首尾配对！第一个+最后一个，第二个+倒数第二个...",
      };
    },
    () => {
      const a = randInt(20, 50);
      // a × 99 = a × 100 - a
      return {
        answer: a * 99,
        problem: `巧算：${a} \u00D7 99 = ?`,
        hint: `提示：99 = 100 \u2212 1，所以 ${a} \u00D7 99 = ${a} \u00D7 100 \u2212 ${a}`,
      };
    },
    () => {
      const a = randInt(10, 40);
      // a × 101 = a × 100 + a
      return {
        answer: a * 101,
        problem: `巧算：${a} \u00D7 101 = ?`,
        hint: `提示：101 = 100 + 1`,
      };
    },
    () => {
      // 25 × 4 trick
      const k = randInt(3, 12);
      return {
        answer: 25 * 4 * k,
        problem: `巧算：25 \u00D7 ${4 * k} = ?`,
        hint: "提示：25 \u00D7 4 = 100，先凑整百",
      };
    },
  ];

  const gen = pick(templates)();
  return {
    num1: 0, num2: 0, op: "+", answer: gen.answer, remainder: 0,
    wordProblem: gen.problem,
    hint: gen.hint,
    unit: "",
  };
}
