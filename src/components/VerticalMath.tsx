"use client";

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { FeedbackType, Op } from "@/lib/types";

interface VerticalMathProps {
  num1: number;
  num2: number;
  op: Op;
  answer: number;
  remainder: number;
  answered: boolean;
  feedbackType: FeedbackType;
  showCarry: boolean;
  questionIndex: number;
  onSubmit: (userAnswer: number | null, userRemainder?: number | null) => void;
}

export interface VerticalMathHandle {
  submit: () => void;
}

const VerticalMath = forwardRef<VerticalMathHandle, VerticalMathProps>(function VerticalMath(
  { num1, num2, op, answer, remainder, answered, feedbackType, showCarry, questionIndex, onSubmit },
  ref
) {
  const answerDigits = String(Math.abs(answer)).length;
  const inputCount = Math.max(answerDigits, 2);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const remainderRef = useRef<HTMLInputElement>(null);

  const isDivision = op === "÷";
  const hasRemainder = isDivision && remainder > 0;

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, inputCount);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [questionIndex, inputCount]);

  const getVisibleInputs = useCallback(() => {
    return inputRefs.current.filter((el): el is HTMLInputElement => el !== null);
  }, []);

  const submitAnswer = useCallback(() => {
    const digits = getVisibleInputs().map(el => el.value);
    const combined = digits.join("");
    const userAnswer = combined ? parseInt(combined, 10) : null;

    if (isDivision && hasRemainder) {
      const remVal = remainderRef.current?.value;
      const userRem = remVal ? parseInt(remVal, 10) : null;
      onSubmit(userAnswer, userRem);
    } else {
      onSubmit(userAnswer);
    }
  }, [getVisibleInputs, onSubmit, isDivision, hasRemainder]);

  useImperativeHandle(ref, () => ({ submit: submitAnswer }), [submitAnswer]);

  const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 1) e.target.value = val.slice(-1);
    if (val) {
      // Move to next input
      if (index < inputCount - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (isDivision && hasRemainder) {
        remainderRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
      return;
    }

    const inputs = getVisibleInputs();
    if (isDivision && hasRemainder && remainderRef.current) {
      inputs.push(remainderRef.current);
    }
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

  const opSymbol = op === "+" ? "+" : op === "-" ? "\u2212" : op === "×" ? "\u00D7" : "\u00F7";

  // Carry indicator for addition
  const hasCarry = op === "+" && showCarry && (num1 % 10) + (num2 % 10) >= 10;

  return (
    <div className="vertical-math" onKeyDown={handleKeyDown}>
      {/* Carry row (addition only) */}
      {op === "+" && (
        <div className="carry-row">
          {Array.from({ length: inputCount }, (_, i) => (
            <div key={i} className={`carry-digit${i === inputCount - 2 && hasCarry ? " visible" : ""}`}>
              {i === inputCount - 2 && hasCarry ? "1" : ""}
            </div>
          ))}
        </div>
      )}

      {/* First number */}
      <div className="math-row">
        <span className="number">{num1}</span>
      </div>

      {/* Operator + second number */}
      <div className="math-row">
        <span className="operator">{opSymbol}</span>
        <span className="number">{num2}</span>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Answer inputs */}
      <div className="answer-row">
        {Array.from({ length: inputCount }, (_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            className={inputClass("digit-input")}
            maxLength={1}
            inputMode="numeric"
            disabled={answered}
            onChange={handleInput(i)}
          />
        ))}

        {/* Remainder input for division */}
        {isDivision && (
          <>
            <span className="remainder-dots">......</span>
            <input
              ref={remainderRef}
              className={inputClass("digit-input remainder-input")}
              maxLength={1}
              inputMode="numeric"
              disabled={answered}
              placeholder="余"
              onChange={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );
});

export default VerticalMath;
