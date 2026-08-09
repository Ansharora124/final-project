import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'gold' | 'emerald';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  subtitle,
  trend,
  variant = 'default',
  className,
}) => {
  const iconBgs = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-primary-500/15 text-primary-400 border-primary-500/30',
    gold: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div
          className={cn(
            'w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner',
            iconBgs[variant]
          )}
        >
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold font-mono',
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
