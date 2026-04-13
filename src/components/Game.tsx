"use client";

import { useState, useCallback, useRef } from "react";
import { GameState, FeedbackType } from "@/lib/types";
import { generateQuestion, calculateScore, getWorldConfig, getLevelConfig, getStarRating, QUESTIONS_PER_LEVEL, initialState } from "@/lib/gameLogic";
import TopBar from "./TopBar";
import ProgressBar from "./ProgressBar";
import VerticalMath, { VerticalMathHandle } from "./VerticalMath";
import StreakBar from "./StreakBar";
import LevelUpOverlay from "./LevelUpOverlay";

type Phase = "answering" | "feedback" | "levelUp";

export default function Game() {
  const [state, setState] = useState<GameState>(initialState);
  const [phase, setPhase] = useState<Phase>("answering");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showCarry, setShowCarry] = useState(false);
  const [scorePopKey, setScorePopKey] = useState(0);
  const [scorePopValue, setScorePopValue] = useState(0);
  const [comboKey, setComboKey] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const mathRef = useRef<VerticalMathHandle>(null);

  const worldConfig = getWorldConfig(state.world);
  const levelConfig = getLevelConfig(state.world, state.level);

  const handleSubmit = useCallback((userAnswer: number | null, userRemainder?: number | null) => {
    if (phase !== "answering") return;

    if (userAnswer === null || isNaN(userAnswer)) {
      setFeedbackText("请填写所有数字!");
      setFeedbackType("wrong");
      return;
    }

    const isDivision = state.op === "÷";
    const answerCorrect = userAnswer === state.answer;
    const remainderCorrect = !isDivision || (isDivision && state.remainder === 0)
      ? true
      : (userRemainder !== null && userRemainder !== undefined && userRemainder === state.remainder);
    const isCorrect = answerCorrect && remainderCorrect;

    setState((prev) => {
      const next = { ...prev, totalAttempted: prev.totalAttempted + 1, answered: true };

      if (isCorrect) {
        const newStreak = prev.streak + 1;
        const { points } = calculateScore(newStreak);
        next.totalCorrect = prev.totalCorrect + 1;
        next.levelCorrect = prev.levelCorrect + 1;
        next.streak = newStreak;
        next.score = prev.score + points;
        next.questionInLevel = prev.questionInLevel + 1;
      } else {
        next.streak = 0;
      }

      return next;
    });

    if (isCorrect) {
      const newStreak = state.streak + 1;
      const { points } = calculateScore(newStreak);

      setFeedbackType("correct");
      setFeedbackText(
        newStreak > 1
          ? `太棒了! 连续 ${newStreak} 题 \uD83C\uDF1F +${points}分`
          : `正确! \uD83C\uDF89 +${points}分`
      );
      setShowCarry(true);
      setScorePopValue(points);
      setScorePopKey((k) => k + 1);

      if (newStreak >= 3) {
        setComboCount(newStreak);
        setComboKey((k) => k + 1);
      }
    } else {
      setFeedbackType("wrong");
      const correctStr = isDivision && state.remainder > 0
        ? `${state.answer}......${state.remainder}`
        : `${state.answer}`;
      setFeedbackText(`再想想哦! 正确答案是 ${correctStr}`);
      setShowCarry(true);
    }

    setPhase("feedback");
  }, [phase, state.answer, state.streak, state.op, state.remainder]);

  const resetForNewQuestion = useCallback((worldNum: number, levelNum: number, extra?: Partial<GameState>) => {
    const q = generateQuestion(worldNum, levelNum);
    setState((prev) => ({ ...prev, ...q, answered: false, ...extra }));
    setPhase("answering");
    setFeedbackType(null);
    setFeedbackText("");
    setShowCarry(false);
  }, []);

  const handleNext = useCallback(() => {
    if (state.questionInLevel >= QUESTIONS_PER_LEVEL) {
      setPhase("levelUp");
      return;
    }
    resetForNewQuestion(state.world, state.level);
  }, [state.questionInLevel, state.world, state.level, resetForNewQuestion]);

  const handleWrongNext = useCallback(() => {
    const nextQ = state.questionInLevel + 1;
    if (nextQ >= QUESTIONS_PER_LEVEL) {
      setState((prev) => ({ ...prev, questionInLevel: nextQ }));
      setPhase("levelUp");
      return;
    }
    resetForNewQuestion(state.world, state.level, { questionInLevel: nextQ });
  }, [state.questionInLevel, state.world, state.level, resetForNewQuestion]);

  const isWorldComplete = state.level >= worldConfig.levels.length
    && state.questionInLevel >= QUESTIONS_PER_LEVEL;

  const handleNextLevel = useCallback(() => {
    const nextLevel = state.level + 1;
    resetForNewQuestion(state.world, nextLevel, {
      level: nextLevel,
      questionInLevel: 0,
      levelCorrect: 0,
    });
  }, [state.world, state.level, resetForNewQuestion]);

  const handleNextWorld = useCallback(() => {
    const nextWorld = state.world + 1;
    resetForNewQuestion(nextWorld, 1, {
      world: nextWorld,
      level: 1,
      questionInLevel: 0,
      levelCorrect: 0,
    });
  }, [state.world, resetForNewQuestion]);

  const handleButtonClick = () => {
    if (phase === "answering") {
      mathRef.current?.submit();
    } else if (phase === "feedback") {
      if (feedbackType === "correct") {
        handleNext();
      } else {
        handleWrongNext();
      }
    }
  };

  const buttonLabel = phase === "answering"
    ? "确认答案"
    : phase === "feedback" && state.questionInLevel >= QUESTIONS_PER_LEVEL
      ? "查看结果 \uD83C\uDFC6"
      : "下一题 \u279E";

  const buttonClass = phase === "feedback" && feedbackType === "correct"
    ? "submit-btn next-btn"
    : "submit-btn";

  const stars = getStarRating(state.levelCorrect, QUESTIONS_PER_LEVEL);

  return (
    <>
      <TopBar
        world={state.world}
        worldName={worldConfig.name}
        worldEmoji={worldConfig.emoji}
        level={state.level}
        score={state.score}
        totalCorrect={state.totalCorrect}
        totalAttempted={state.totalAttempted}
      />

      <ProgressBar
        label={levelConfig.desc}
        current={state.questionInLevel}
        total={QUESTIONS_PER_LEVEL}
      />

      <div className="card" style={{ position: "relative" }}>
        <div className="question-number">第 {state.questionInLevel + 1} 题</div>

        <VerticalMath
          ref={mathRef}
          num1={state.num1}
          num2={state.num2}
          op={state.op}
          answer={state.answer}
          remainder={state.remainder}
          answered={state.answered}
          feedbackType={feedbackType}
          showCarry={showCarry}
          questionIndex={state.questionInLevel + state.level * 100 + state.world * 10000}
          onSubmit={handleSubmit}
        />

        {feedbackText && (
          <div className={`feedback ${feedbackType === "correct" ? "feedback-correct" : "feedback-wrong"}`}>
            {feedbackText}
          </div>
        )}

        {scorePopValue > 0 && (
          <div className="score-pop" key={scorePopKey}>+{scorePopValue}</div>
        )}

        <button className={buttonClass} onClick={handleButtonClick}>
          {buttonLabel}
        </button>
      </div>

      <StreakBar streak={state.streak} />

      {comboCount >= 3 && (
        <div className="combo-text" key={comboKey}>{comboCount}x COMBO!</div>
      )}

      {phase === "levelUp" && (
        <LevelUpOverlay
          world={state.world}
          level={state.level}
          levelCorrect={state.levelCorrect}
          questionsPerLevel={QUESTIONS_PER_LEVEL}
          stars={stars}
          isWorldComplete={isWorldComplete}
          onNextLevel={handleNextLevel}
          onNextWorld={handleNextWorld}
        />
      )}
    </>
  );
}
