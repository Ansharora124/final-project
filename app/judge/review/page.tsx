'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Gavel, EyeOff, ArrowRight, Shield, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function JudgeReviewQueuePage() {
  const queue = MOCK_SUBMISSIONS.filter(
    (s) => s.status === 'shortlisted' || s.status === 'judge_review'
  );

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {queue.length} Shortlisted in Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Juror Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            These photographs passed the AI Vision cutoff (90.0+ threshold) and are awaiting your scoring.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
          <EyeOff className="w-4 h-4 text-amber-400" />
          <span>Blind Scoring Standard Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {queue.map((sub, idx) => (
          <div
            key={sub.id}
            className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              {/* Photo Thumbnail */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sub.thumbnailUrl}
                  alt={sub.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-xs font-semibold text-primary-300 backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                  <span>AI Score: {sub.aiEvaluation.overallScore}</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold font-mono">
                  Rank #{sub.aiEvaluation.rank}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-primary-400 uppercase">
                  {sub.competitionTitle}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{sub.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{sub.description}</p>
              </div>

              {/* Technical Gear bar */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>{sub.exif.camera.split(' ')[0]} · {sub.exif.lens.split(' ')[0]}</span>
                <span>{sub.exif.aperture} · {sub.exif.shutterSpeed}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Queued #{idx + 1}</span>
              <Link href={`/judge/review/${sub.id}`}>
                <Button variant="gold" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Score Photograph
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
