import React from 'react';
import Link from 'next/link';
import { Calendar, Eye, Heart, Sparkles, ChevronRight, Award } from 'lucide-react';
import { Submission } from '@/lib/types';
import { SubmissionStatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SubmissionCardProps {
  submission: Submission;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-slate-700 transition-all group">
      {/* Left Thumbnail and Details */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={submission.thumbnailUrl}
            alt={submission.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {submission.winnerRank && (
            <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 p-1 rounded-md">
              <Award className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">
              {submission.competitionTitle}
            </span>
          </div>
          <h4 className="text-base font-bold text-white truncate">{submission.title}</h4>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(submission.submittedAt)}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-300">
              {submission.exif.camera.split(' ')[0]} {submission.exif.lens.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Status & Scores */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="space-y-1 text-left sm:text-right">
          <SubmissionStatusBadge status={submission.status} />
          <div className="flex items-center gap-2 sm:justify-end text-xs font-mono">
            {submission.aiEvaluation && (
              <span className="text-primary-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI: {submission.aiEvaluation.overallScore}
              </span>
            )}
            {submission.finalJudgeScore && (
              <span className="text-amber-400 font-bold">
                Jury: {submission.finalJudgeScore}
              </span>
            )}
          </div>
        </div>

        <Link href={`/dashboard/submissions/${submission.id}`} className="shrink-0">
          <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
};
