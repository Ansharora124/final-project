'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number;
  max: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  weightLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  max,
  min = 0,
  step = 1,
  onChange,
  label,
  weightLabel,
  className,
  disabled = false,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {label && <span className="text-sm font-semibold text-slate-200">{label}</span>}
          {weightLabel && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
              {weightLabel}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold font-mono text-primary-400">{value}</span>
          <span className="text-xs text-slate-500 font-mono">/ {max} pts</span>
        </div>
      </div>

      <div className="relative flex items-center select-none touch-none">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #6366f1 ${percentage}%, #1e293b ${percentage}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
        <span>{min} (Poor)</span>
        <span>{Math.round(max / 2)} (Fair)</span>
        <span>{max} (Exceptional)</span>
      </div>
    </div>
  );
};
