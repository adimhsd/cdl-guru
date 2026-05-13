import React from 'react';

type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;

const LEVEL_MAP: Record<string, { label: string; classes: string }> = {
  BEGINNER: {
    label: 'Pemula',
    classes: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  INTERMEDIATE: {
    label: 'Menengah',
    classes: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  ADVANCED: {
    label: 'Mahir',
    classes: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
};

export default function LevelBadge({ level }: { level: Level }) {
  const config = LEVEL_MAP[level] || { label: level, classes: 'bg-slate-100 text-slate-600 border-slate-300' };

  return (
    <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full border shadow-sm ${config.classes}`}>
      {config.label}
    </span>
  );
}
