"use client";

interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
}

export default function ProgressBar({ label, current, total }: ProgressBarProps) {
  const pct = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span>{label}</span>
        <span>{current} / {total}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="stars-row">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`star-marker${i < current ? " earned" : ""}`}>
            &#9733;
          </span>
        ))}
      </div>
    </div>
  );
}
