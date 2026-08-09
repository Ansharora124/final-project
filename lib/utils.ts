import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WinnerRank } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRankBadge(rank: WinnerRank | string) {
  switch (rank) {
    case '1st_place':
      return {
        label: '1st Place Winner',
        shortLabel: '1st',
        bg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold',
        badgeColor: 'border-amber-400 text-amber-500 bg-amber-500/10',
        ring: 'ring-amber-400/50',
        icon: '🥇',
      };
    case '2nd_place':
      return {
        label: '2nd Place Runner Up',
        shortLabel: '2nd',
        bg: 'bg-gradient-to-r from-slate-300 to-slate-100 text-slate-900 font-bold',
        badgeColor: 'border-slate-300 text-slate-400 bg-slate-400/10',
        ring: 'ring-slate-400/50',
        icon: '🥈',
      };
    case '3rd_place':
      return {
        label: '3rd Place Finalist',
        shortLabel: '3rd',
        bg: 'bg-gradient-to-r from-amber-700 to-amber-600 text-white font-bold',
        badgeColor: 'border-amber-700 text-amber-600 bg-amber-600/10',
        ring: 'ring-amber-600/50',
        icon: '🥉',
      };
    case 'honorable_mention':
    default:
      return {
        label: 'Honorable Mention',
        shortLabel: 'HM',
        bg: 'bg-indigo-600 text-white font-medium',
        badgeColor: 'border-indigo-400 text-indigo-400 bg-indigo-500/10',
        ring: 'ring-indigo-400/50',
        icon: '🎖️',
      };
  }
}

export function getDaysLeft(deadlineString: string): { text: string; isPast: boolean; days: number } {
  const target = new Date(deadlineString).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { text: 'Deadline Closed', isPast: true, days: 0 };
  }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return { text: '1 day left', isPast: false, days: 1 };
  return { text: `${days} days left`, isPast: false, days };
}
