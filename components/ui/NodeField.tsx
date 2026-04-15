"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Node = { x: number; y: number; r: number; d: number };

function seededNodes(count: number, seed = 7): Node[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    r: 1.2 + rand() * 2.4,
    d: rand() * 4,
  }));
}

export function NodeField({
  density = 28,
  className = "",
  intensity = 1,
}: {
  density?: number;
  className?: string;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const nodes = useMemo(() => seededNodes(density), [density]);
  const center = { x: 50, y: 50 };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9 * intensity} />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>
      </defs>

      {nodes.map((n, i) => (
        <line
          key={`l-${i}`}
          x1={center.x}
          y1={center.y}
          x2={n.x}
          y2={n.y}
          stroke="#3B82F6"
          strokeOpacity={0.12 * intensity}
          strokeWidth={0.08}
        />
      ))}

      <circle cx={center.x} cy={center.y} r={2.2} fill="url(#nodeGlow)" />
      <circle cx={center.x} cy={center.y} r={0.9} fill="#93C5FD" />

      {nodes.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r={n.r * 0.35}
          fill="#60A5FA"
          fillOpacity={0.7 * intensity}
          initial={{ opacity: reduce ? 0.6 : 0.3 }}
          animate={
            reduce
              ? { opacity: 0.6 }
              : { opacity: [0.3, 0.9, 0.3] }
          }
          transition={{
            duration: 3 + n.d,
            repeat: Infinity,
            ease: "easeInOut",
            delay: n.d,
          }}
        />
      ))}
    </svg>
  );
}
