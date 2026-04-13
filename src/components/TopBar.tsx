"use client";

interface TopBarProps {
  level: number;
  score: number;
  totalCorrect: number;
  totalAttempted: number;
}

export default function TopBar({ level, score, totalCorrect, totalAttempted }: TopBarProps) {
  const accuracy = totalAttempted > 0
    ? Math.round((totalCorrect / totalAttempted) * 100) + "%"
    : "-";

  return (
    <div className="top-bar">
      <div className="level-badge">Level {level}</div>
      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{score}</div>
          <div className="stat-label">得分</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalCorrect}</div>
          <div className="stat-label">正确</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{accuracy}</div>
          <div className="stat-label">正确率</div>
        </div>
      </div>
    </div>
  );
}
