export type Op = "+" | "-" | "×" | "÷";

export interface GameState {
  world: number;
  level: number;       // level within current world
  score: number;
  totalCorrect: number;
  totalAttempted: number;
  levelCorrect: number; // correct answers in current level
  questionInLevel: number;
  questionsPerLevel: number;
  streak: number;
  num1: number;
  num2: number;
  op: Op;
  answer: number;
  remainder: number;   // for division with remainder
  wordProblem?: string;
  hint?: string;
  unit?: string;
  answered: boolean;
}

export interface LevelConfig {
  id: string;          // e.g. "1-1", "4-3"
  name: string;
  desc: string;
  op: Op;
  generate: () => QuestionResult;
}

export interface QuestionResult {
  num1: number;
  num2: number;
  op: Op;
  answer: number;
  remainder: number;
  wordProblem?: string;  // if set, render as word problem instead of vertical math
  hint?: string;         // optional hint for word problems
  unit?: string;         // answer unit, e.g. "只", "个", "岁"
}

export interface WorldConfig {
  id: number;
  name: string;
  emoji: string;
  levels: LevelConfig[];
}

export type FeedbackType = "correct" | "wrong" | null;

export interface LevelStars {
  [levelId: string]: number; // 0-3 stars
}
