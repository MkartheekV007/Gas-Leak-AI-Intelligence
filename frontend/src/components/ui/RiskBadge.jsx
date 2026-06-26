import React from 'react';
import { cn } from '../../lib/utils';

export function RiskBadge({ level, className }) {
  const normalizedLevel = level?.toUpperCase() || 'UNKNOWN';
  
  const variants = {
    CRITICAL: "bg-danger/20 text-danger border-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    HIGH: "bg-warning/20 text-warning border-warning/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    MEDIUM: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    LOW: "bg-success/20 text-success border-success/30",
    UNKNOWN: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center justify-center tracking-wide",
      variants[normalizedLevel] || variants.UNKNOWN,
      className
    )}>
      {normalizedLevel}
    </span>
  );
}
