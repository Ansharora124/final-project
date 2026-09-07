'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, Clock, CheckCircle2, Award, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { Button } from '@/components/ui/Button';
import { MOCK_JUDGES, MOCK_COMPETITIONS, MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const judge = MOCK_JUDGES[0]; // Elena Rostova

export default function JudgeOverviewPage() {
  const assignedCompetitions = MOCK_COMPETITIONS.filter((c) =>
    judge.assignedCompetitionIds.includes(c.id)
  );

  const pendingSubmissions = MOCK_SUBMISSIONS.filter(
    (s) => s.status === 'shortlisted' || s.status === 'judge_review'
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Juror Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Gavel className="w-3.5 h-3.5" />
            <span>Master Juror Scoring Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, Juror {judge.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            You have <span className="text-amber-400 font-semibold">{pendingSubmissions.length} AI-shortlisted entries</span> awaiting evaluation in your queue.
          </p>
        </div>

        <Link href="/judge/photos">
          <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Open Photo Judging
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Assigned Contests"
          value={judge.assignedCompetitionIds.length}
          icon={<Award className="w-5 h-5" />}
          variant="gold"
        />
        <StatCard
          label="Reviews Completed"
          value={judge.reviewsCompleted}
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          label="Pending in Queue"
          value={judge.totalAssignedReviews - judge.reviewsCompleted}
          icon={<Clock className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          label="Juror Reputation"
          value={`${judge.rating} ★`}
          icon={<Shield className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* Assigned Competitions with Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Active Jury Assignments</span>
          </h2>
          <Link href="/judge/competitions" className="text-xs text-primary-400 hover:text-primary-300 font-semibold">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignedCompetitions.map((comp) => (
            <div
              key={comp.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-400 uppercase">{comp.category}</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
                  Deadline: {formatDate(comp.timeline.judgingDeadline)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{comp.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{comp.shortDescription}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Scoring Progress:</span>
                  <span className="font-mono text-amber-400 font-bold">21 / 24 Reviewed (88%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link href="/judge/review">
                  <Button variant="outline" size="sm" className="text-xs">
                    Open Review Queue
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
