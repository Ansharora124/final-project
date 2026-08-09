'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_COMPETITIONS, MOCK_JUDGES } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const judge = MOCK_JUDGES[0];

export default function JudgeCompetitionsPage() {
  const assigned = MOCK_COMPETITIONS.filter((c) =>
    judge.assignedCompetitionIds.includes(c.id)
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Assigned Competitions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Contests where you are appointed as an official evaluation juror.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assigned.map((comp) => (
          <div
            key={comp.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-400 uppercase">
                  {comp.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  Jury Deadline: {formatDate(comp.timeline.judgingDeadline)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{comp.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{comp.shortDescription}</p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Review Completion</span>
                  <span className="font-mono text-amber-400 font-bold">21 / 24 Entries</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">{comp.prizePool} Purse</span>
              <Link href="/judge/review">
                <Button variant="gold" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Score Entries
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
