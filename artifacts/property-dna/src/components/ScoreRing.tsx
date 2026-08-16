import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 12,
  showGrade = true,
  label = "Score",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  showGrade?: boolean;
  label?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const color =
    score >= 80
      ? "#10b981"
      : score >= 65
        ? "#f59e0b"
        : score >= 45
          ? "#f97316"
          : "#ef4444";

  const grade =
    score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {showGrade && (
          <span
            className="text-3xl font-extrabold"
            style={{ color }}
          >
            {grade}
          </span>
        )}
        <span className="text-2xl font-bold text-navy-800">{animated}</span>
        <span className="text-xs font-medium text-navy-400">{label}</span>
      </div>
    </div>
  );
}
