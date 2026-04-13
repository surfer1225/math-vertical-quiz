"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import { FeedbackType } from "@/lib/types";

interface WordProblemProps {
  problem: string;
  hint?: string;
  unit?: string;
  answer: number;
  answered: boolean;
  feedbackType: FeedbackType;
  questionIndex: number;
  onSubmit: (userAnswer: number | null) => void;
}

export interface WordProblemHandle {
  submit: () => void;
}

const WordProblem = forwardRef<WordProblemHandle, WordProblemProps>(function WordProblem(
  { problem, hint, unit, answered, feedbackType, questionIndex, onSubmit },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [questionIndex]);

  const submitAnswer = () => {
    const val = inputRef.current?.value;
    onSubmit(val ? parseInt(val, 10) : null);
  };

  useImperativeHandle(ref, () => ({ submit: submitAnswer }), []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
    }
  };

  const inputClass = () => {
    let cls = "wp-answer-input";
    if (feedbackType === "correct") cls += " correct";
    if (feedbackType === "wrong") cls += " wrong";
    return cls;
  };

  return (
    <div className="word-problem">
      <div className="wp-text">{problem}</div>

      {hint && (
        <div className="wp-hint-area">
          {showHint ? (
            <div className="wp-hint">{hint}</div>
          ) : (
            <button
              className="wp-hint-btn"
              onClick={() => setShowHint(true)}
              type="button"
            >
              {"💡 看提示"}
            </button>
          )}
        </div>
      )}

      <div className="wp-answer-row">
        <span className="wp-label">{"答："}</span>
        <input
          ref={inputRef}
          className={inputClass()}
          type="number"
          inputMode="numeric"
          disabled={answered}
          onKeyDown={handleKeyDown}
          placeholder="?"
        />
        {unit && <span className="wp-unit">{unit}</span>}
      </div>
    </div>
  );
});

export default WordProblem;
