import React from 'react';

type ProgressBarProps = {
  progress: number;
  color?: string;
  height?: string;
  label?: string;
  subLabel?: string;
};

export default function ProgressBar({
  progress,
  color = 'bg-blue-600',
  height = 'h-2',
  label,
  subLabel,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {(label || subLabel) && (
        <div className="flex justify-between items-end mb-1.5">
          {label && <span className="text-xs font-semibold text-slate-700">{label}</span>}
          {subLabel && <span className="text-[10px] text-slate-400 font-medium tabular-nums">{subLabel}</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
