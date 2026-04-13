"use client";

interface StreakBarProps {
  streak: number;
}

export default function StreakBar({ streak }: StreakBarProps) {
  return (
    <div className="streak-bar">
      <span className="streak-icon">&#128293;</span>
      <span className="streak-text">连续答对</span>
      <div className="streak-dots">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={`streak-dot${i < streak ? " active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
