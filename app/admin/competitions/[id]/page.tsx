'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit2, Trophy, Users, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CompetitionStatusBadge } from '@/components/ui/Badge';
import { MOCK_COMPETITIONS, MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function AdminCompetitionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const competition = MOCK_COMPETITIONS.find((c) => c.id === id);

  if (!competition) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Competition Not Found</h2>
        <Link href="/admin/competitions" className="mt-4 inline-block">
          <Button variant="primary">Back to Competitions</Button>
        </Link>
      </div>
    );
  }

  const submissions = MOCK_SUBMISSIONS.filter((s) => s.competitionId === competition.id);

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/competitions"
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Competitions</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {competition.title}
          </h1>
          <p className="text-xs text-slate-400">
            Tenant: <strong className="text-white">{competition.tenantName}</strong> · Category:{' '}
            <strong className="text-white">{competition.category}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CompetitionStatusBadge status={competition.status} />
          <Link href={`/admin/competitions/${competition.id}/edit`}>
            <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
              Edit Contest
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-mono">Prize Purse</p>
          <p className="text-2xl font-bold font-mono text-amber-400">{competition.prizePool}</p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-mono">Submission Deadline</p>
          <p className="text-lg font-bold font-mono text-white">
            {formatDate(competition.timeline.submissionDeadline)}
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 uppercase font-mono">Active Submissions</p>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {competition.submissionCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Overview & Rubric */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Contest Scope & Mission</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{competition.description}</p>
      </div>
    </div>
  );
}
