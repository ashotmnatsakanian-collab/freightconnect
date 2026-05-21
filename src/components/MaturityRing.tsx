"use client";
import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/data";

interface MaturityRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export default function MaturityRing({
  score,
  size = 56,
  strokeWidth = 5,
  showLabel = true,
  className = "",
}: MaturityRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = animated ? circumference * (1 - score / 100) : circumference;
  const color = getScoreColor(score);
  const isPulsing = score > 85;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${isPulsing ? "pulse-ring-anim" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
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
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{
            fontSize: size < 48 ? "0.65rem" : "0.8rem",
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      )}
    </div>
  );
}
