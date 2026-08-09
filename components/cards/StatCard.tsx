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
    default: 'bg-zinc-900 text-zinc-300 border-white/10',
    primary: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
    gold: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  return (
    <div
      className={cn(
        'p-6 rounded-3xl bg-[#09090b]/95 border border-white/[0.08] flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        <div
          className={cn(
            'w-10 h-10 rounded-2xl border flex items-center justify-center shadow-inner',
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
        {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
