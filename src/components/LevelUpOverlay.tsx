"use client";

import { useEffect, useCallback } from "react";
import { getWorldConfig } from "@/lib/gameLogic";

interface LevelUpOverlayProps {
  world: number;
  level: number;
  levelCorrect: number;
  questionsPerLevel: number;
  stars: number;
  isWorldComplete: boolean;
  onNextLevel: () => void;
  onNextWorld: () => void;
}

const CONFETTI_COLORS = ["#6C5CE7", "#A29BFE", "#00B894", "#55EFC4", "#FDCB6E", "#FF6B6B", "#FD79A8"];

function starText(n: number): string {
  return "\u2B50".repeat(n);
}

export default function LevelUpOverlay({
  world, level, levelCorrect, questionsPerLevel, stars, isWorldComplete, onNextLevel, onNextWorld,
}: LevelUpOverlayProps) {
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

  useEffect(() => { launchConfetti(); }, [launchConfetti]);

  const worldCfg = getWorldConfig(world);

  if (isWorldComplete) {
    const nextWorld = getWorldConfig(world + 1);
    return (
      <div className="overlay">
        <div className="level-up-card">
          <div className="level-up-icon">{worldCfg.emoji}</div>
          <div className="level-up-title">{worldCfg.name} {"通关!"}</div>
          <div className="level-up-desc">
            {"太棒了! 答对 "}{levelCorrect}/{questionsPerLevel}{" 题 "}{starText(stars)}
          </div>
          <div className="level-up-reward">
            {"\uD83D\uDD13 解锁: "}{nextWorld.emoji} {nextWorld.name}
          </div>
          <button className="level-up-btn" onClick={onNextWorld}>
            {"进入 "}{nextWorld.name}{" \u279E"}
          </button>
        </div>
      </div>
    );
  }

  const icon = stars >= 3 ? "\uD83C\uDF1F" : stars >= 1 ? "\u2B50" : "\uD83D\uDCAA";

  return (
    <div className="overlay">
      <div className="level-up-card">
        <div className="level-up-icon">{icon}</div>
        <div className="level-up-title">Level {world}-{level} {"完成!"}</div>
        <div className="level-up-desc">
          {"答对 "}{levelCorrect}/{questionsPerLevel}{" 题 "}{starText(stars)}
        </div>
        <div className="level-up-reward">
          {stars >= 3 ? "完美通关!" : stars >= 1 ? "继续加油!" : "多练练会更好哦!"}
        </div>
        <button className="level-up-btn" onClick={onNextLevel}>
          {"下一关 \u279E"}
        </button>
      </div>
    </div>
  );
}
