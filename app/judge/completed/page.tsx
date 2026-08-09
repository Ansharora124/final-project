'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Star, Trophy, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function JudgeCompletedReviewsPage() {
  const completed = MOCK_SUBMISSIONS.filter((s) => s.judgeReviews.length > 0);

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Completed Evaluations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Historical log of photographs and rubric scores submitted by your jury account.
        </p>
      </div>

      <div className="space-y-4">
        {completed.map((sub) => {
          const review = sub.judgeReviews[0];
          return (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sub.thumbnailUrl}
                  alt={sub.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-white/10 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-semibold text-primary-400 uppercase">
                    {sub.competitionTitle}
                  </span>
                  <h3 className="text-base font-bold text-white truncate">{sub.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    &ldquo;{review?.comments}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-extrabold text-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{review?.totalScore ?? 96}</span>
                    <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Score Submitted</span>
                </div>

                <Link href={`/judge/review/${sub.id}`}>
                  <Button variant="outline" size="sm">
                    Revisit Entry
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
