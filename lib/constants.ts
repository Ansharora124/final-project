import { ScoreCriterion } from './types';
import { CRITERIA } from './judging/rubric';

export const APP_NAME = 'Pixel-Prize';
export const APP_TAGLINE = 'Capture. Compete. Create History.';
export const APP_DESCRIPTION = 'The premier multi-tenant photography competition platform powered by AI shortlisting and world-class expert judging.';

export const CATEGORIES = [
  'All Categories',
  'Wildlife & Animals',
  'Landscape & Nature',
  'Portrait & People',
  'Urban & Architecture',
  'Monochrome & Black/White',
  'Street Photography',
  'Aerial & Drone',
  'Macro & Micro',
  'Fine Art & Abstract',
] as const;

export const COMPETITION_STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  active: {
    label: 'Active & Accepting',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  upcoming: {
    label: 'Opening Soon',
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-700 dark:text-sky-400',
    border: 'border-sky-500/30',
    dot: 'bg-sky-500',
  },
  judging: {
    label: 'In Expert Review',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  results_published: {
    label: 'Winners Announced',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-500',
  },
  closed: {
    label: 'Competition Closed',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500',
  },
};

export const SUBMISSION_STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; step: number; description: string }
> = {
  submitted: {
    label: 'Submission Received',
    bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    step: 1,
    description: 'Photograph uploaded successfully. Queued for AI analysis.',
  },
  under_ai_review: {
    label: 'AI Evaluation In Progress',
    bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30',
    step: 2,
    description: 'AI is analyzing composition, sharpness, color harmony, and quality.',
  },
  shortlisted: {
    label: 'AI Shortlisted ⭐',
    bg: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    step: 3,
    description: 'Passed AI benchmark! Forwarded to the official judge panel for scoring.',
  },
  judge_review: {
    label: 'Under Judge Review',
    bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    step: 4,
    description: 'Assigned jurors are currently scoring based on five weighted criteria.',
  },
  winner: {
    label: 'Prize Winner 🏆',
    bg: 'bg-amber-500/20 text-amber-700 border-amber-500/40 shadow-sm',
    text: 'text-amber-700 dark:text-amber-300 font-semibold',
    border: 'border-amber-500/50',
    step: 5,
    description: 'Congratulations! This photograph earned an official award in this competition.',
  },
  not_selected: {
    label: 'Not Shortlisted',
    bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-500/30',
    step: 3,
    description: 'Did not meet the AI cut-off threshold for the final jury stage.',
  },
};

export const DEFAULT_SCORING_CRITERIA: ScoreCriterion[] = CRITERIA.map(criterion => ({
  id: criterion.id, name: criterion.name, description: criterion.description,
  weight: criterion.max, maxScore: criterion.max,
}));

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Competitions', href: '/competitions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Winners', href: '/winners' },
  { label: 'Articles', href: '/articles' },
  { label: 'About', href: '/about' },
];
