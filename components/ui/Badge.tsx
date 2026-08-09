import React from 'react';
import { cn } from '@/lib/utils';
import { COMPETITION_STATUS_CONFIG, SUBMISSION_STATUS_CONFIG } from '@/lib/constants';
import { CompetitionStatus, SubmissionStatus } from '@/lib/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'gold' | 'outline' | 'success' | 'danger' | 'purple' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/30',
    gold: 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    slate: 'bg-slate-900/80 text-slate-400 border border-slate-800',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-lg gap-2 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center select-none font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full animate-pulse',
            variant === 'gold' && 'bg-amber-400',
            variant === 'primary' && 'bg-primary-400',
            variant === 'success' && 'bg-emerald-400',
            variant === 'danger' && 'bg-rose-400',
            variant === 'purple' && 'bg-purple-400',
            (!['gold', 'primary', 'success', 'danger', 'purple'].includes(variant)) && 'bg-slate-400'
          )}
        />
      )}
      {children}
    </span>
  );
};

export const CompetitionStatusBadge: React.FC<{ status: CompetitionStatus; className?: string }> = ({
  status,
  className,
}) => {
  const config = COMPETITION_STATUS_CONFIG[status] || COMPETITION_STATUS_CONFIG.active;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};

export const SubmissionStatusBadge: React.FC<{ status: SubmissionStatus; className?: string }> = ({
  status,
  className,
}) => {
  const config = SUBMISSION_STATUS_CONFIG[status] || SUBMISSION_STATUS_CONFIG.submitted;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md',
        config.bg,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  );
};
