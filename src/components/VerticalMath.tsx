"use client";

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { FeedbackType } from "@/lib/types";

interface VerticalMathProps {
  num1: number;
  num2: number;
  op: "+" | "-";
  answer: number;
  answered: boolean;
  feedbackType: FeedbackType;
  showCarry: boolean;
  questionIndex: number;
  onSubmit: (userAnswer: number | null) => void;
}

export interface VerticalMathHandle {
  submit: () => void;
}

const VerticalMath = forwardRef<VerticalMathHandle, VerticalMathProps>(function VerticalMath(
  { num1, num2, op, answer, answered, feedbackType, showCarry, questionIndex, onSubmit },
  ref
) {
  const needHundred = answer >= 100;
  const hundredRef = useRef<HTMLInputElement>(null);
  const tensRef = useRef<HTMLInputElement>(null);
  const onesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (needHundred) {
      hundredRef.current?.focus();
    } else {
      tensRef.current?.focus();
    }
  }, [questionIndex, needHundred]);

  const getVisibleInputs = useCallback(() => {
    const inputs: HTMLInputElement[] = [];
    if (needHundred && hundredRef.current) inputs.push(hundredRef.current);
    if (tensRef.current) inputs.push(tensRef.current);
    if (onesRef.current) inputs.push(onesRef.current);
    return inputs;
  }, [needHundred]);

  const submitAnswer = useCallback(() => {
    const h = needHundred ? (hundredRef.current?.value || "") : "";
    const t = tensRef.current?.value || "";
    const o = onesRef.current?.value || "";
    const combined = h + t + o;
    onSubmit(combined ? parseInt(combined, 10) : null);
  }, [needHundred, onSubmit]);

  useImperativeHandle(ref, () => ({ submit: submitAnswer }), [submitAnswer]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    nextRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    const val = e.target.value;
    if (val.length > 1) e.target.value = val.slice(-1);
    if (val && nextRef?.current) nextRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
      return;
    }

    const inputs = getVisibleInputs();
    const idx = inputs.indexOf(e.target as HTMLInputElement);
    if (idx === -1) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) inputs[idx - 1].focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (idx < inputs.length - 1) inputs[idx + 1].focus();
    }
  };

  const inputClass = (base: string) => {
    if (!feedbackType) return base;
    return `${base} ${feedbackType === "correct" ? "correct" : "wrong"}`;
  };

  const hasCarry = op === "+" && (num1 % 10) + (num2 % 10) >= 10;

  return (
    <div className="vertical-math" onKeyDown={handleKeyDown}>
      <div className="carry-row">
        <div className={`carry-digit${showCarry && hasCarry ? " visible" : ""}`}>
          {showCarry && hasCarry ? "1" : ""}
        </div>
        <div className="carry-digit" />
      </div>

      <div className="math-row">
        <span className="number">{num1}</span>
      </div>

      <div className="math-row">
        <span className="operator">{op === "+" ? "+" : "\u2212"}</span>
        <span className="number">{num2}</span>
      </div>

      <div className="divider" />

      <div className="answer-row">
        {needHundred && (
          <input
            ref={hundredRef}
            className={inputClass("digit-input")}
            maxLength={1}
            inputMode="numeric"
            disabled={answered}
            onChange={(e) => handleInput(e, tensRef)}
          />
        )}
        <input
          ref={tensRef}
          className={inputClass("digit-input")}
          maxLength={1}
          inputMode="numeric"
          disabled={answered}
          onChange={(e) => handleInput(e, onesRef)}
        />
        <input
          ref={onesRef}
          className={inputClass("digit-input")}
          maxLength={1}
          inputMode="numeric"
          disabled={answered}
          onChange={(e) => handleInput(e, null)}
        />
      </div>
    </div>
  );
});

export default VerticalMath;
