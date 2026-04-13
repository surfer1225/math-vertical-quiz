"use client";

import { useEffect, useCallback } from "react";
import { getLevelConfig } from "@/lib/gameLogic";

interface LevelUpOverlayProps {
  level: number;
  totalCorrect: number;
  onNext: () => void;
}

const CONFETTI_COLORS = ["#6C5CE7", "#A29BFE", "#00B894", "#55EFC4", "#FDCB6E", "#FF6B6B", "#FD79A8"];

export default function LevelUpOverlay({ level, totalCorrect, onNext }: LevelUpOverlayProps) {
  const nextCfg = getLevelConfig(level + 1);

  const launchConfetti = useCallback(() => {
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.top = "-10px";
      piece.style.width = (6 + Math.random() * 8) + "px";
      piece.style.height = (6 + Math.random() * 8) + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(piece);

      const duration = 1000 + Math.random() * 2000;
      const xDrift = (Math.random() - 0.5) * 200;

      piece.animate(
        [
          { transform: "translateY(0) translateX(0) rotate(0deg)", opacity: 1 },
          { transform: `translateY(100vh) translateX(${xDrift}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 },
        ],
        { duration, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }
      );

      setTimeout(() => piece.remove(), duration);
    }
  }, []);

  useEffect(() => {
    launchConfetti();
  }, [launchConfetti]);

  return (
    <div className="overlay">
      <div className="level-up-card">
        <div className="level-up-icon">&#127942;</div>
        <div className="level-up-title">升级到 Level {level + 1}!</div>
        <div className="level-up-desc">太棒了! 你已答对 {totalCorrect} 题</div>
        <div className="level-up-reward">&#11088; 下一关: {nextCfg.desc}</div>
        <button className="level-up-btn" onClick={onNext}>
          开始下一关 &#10132;
        </button>
      </div>
    </div>
  );
}
