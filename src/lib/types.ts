export interface GameState {
  level: number;
  score: number;
  totalCorrect: number;
  totalAttempted: number;
  questionInLevel: number;
  questionsPerLevel: number;
  streak: number;
  num1: number;
  num2: number;
  op: "+" | "-";
  answer: number;
  answered: boolean;
}

export interface LevelConfig {
  name: string;
  range: [number, number];
  ops: ("+" | "-")[];
  desc: string;
  noCarry?: boolean;
  noBorrow?: boolean;
}

export type FeedbackType = "correct" | "wrong" | null;
