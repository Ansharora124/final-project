'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  UploadCloud,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  Bell,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { SubmissionCard } from '@/components/cards/SubmissionCard';
import { Button } from '@/components/ui/Button';
import { CURRENT_USER, MOCK_SUBMISSIONS, MOCK_COMPETITIONS, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { formatDate, getDaysLeft } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const userSubmissions = MOCK_SUBMISSIONS.filter(
    (s) => s.userId === CURRENT_USER.id || s.photographerName === CURRENT_USER.name
  );

  const recommendedContests = MOCK_COMPETITIONS.filter(
    (c) => c.status === 'active' && !userSubmissions.some((s) => s.competitionId === c.id)
  );

  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => !n.read);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Photographer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {CURRENT_USER.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            You have <span className="text-emerald-400 font-semibold">{userSubmissions.length} active submissions</span> across global competitions. 1 entry shortlisted for jury appraisal!
          </p>
        </div>

        <Link href="/competitions">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Browse Contests
          </Button>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Competitions Entered"
          value={CURRENT_USER.stats.competitionsEntered}
          icon={<Trophy className="w-5 h-5" />}
          variant="primary"
          subtitle="Active & completed"
        />
        <StatCard
          label="Photographs Submitted"
          value={userSubmissions.length}
          icon={<UploadCloud className="w-5 h-5" />}
          variant="default"
          subtitle="Max 1 per contest"
        />
        <StatCard
          label="AI Shortlisted"
          value={CURRENT_USER.stats.shortlistsCount}
          icon={<Sparkles className="w-5 h-5" />}
          variant="gold"
          subtitle="Forwarded to jurors"
        />
        <StatCard
          label="Awards Won"
          value={CURRENT_USER.stats.winsCount}
          icon={<Award className="w-5 h-5" />}
          variant="emerald"
          subtitle="Hall of Fame records"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Submissions & Deadlines */}
        <div className="lg:col-span-2 space-y-8">
          {/* Submissions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-400" />
                <span>My Active Submissions</span>
              </h2>
              <Link
                href="/dashboard/submissions"
                className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {userSubmissions.map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))}
            </div>
          </div>

          {/* Recommended Competitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Competitions You Haven&apos;t Entered</span>
              </h2>
              <Link
                href="/competitions"
                className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
              >
                Browse Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedContests.slice(0, 2).map((comp) => {
                const days = getDaysLeft(comp.timeline.submissionDeadline);
                return (
                  <div
                    key={comp.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-primary-400 uppercase">
                        {comp.category}
                      </span>
                      <h4 className="text-base font-bold text-white">{comp.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{comp.shortDescription}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {comp.prizePool}
                      </span>
                      <Link href={`/competitions/${comp.id}/submit`}>
                        <Button variant="primary" size="sm" className="text-xs">
                          Submit Entry
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines & Notifications Preview */}
        <div className="space-y-6">
          {/* Deadlines Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Upcoming Deadlines</span>
            </h3>

            <div className="space-y-3 text-xs">
              {MOCK_COMPETITIONS.slice(0, 3).map((comp) => {
                const dl = getDaysLeft(comp.timeline.submissionDeadline);
                return (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-200 truncate max-w-[150px]">{comp.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{formatDate(comp.timeline.submissionDeadline)}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400">
                      {dl.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications Preview */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary-400" />
                <span>Alerts & Updates</span>
              </h3>
              <Link
                href="/dashboard/notifications"
                className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {MOCK_NOTIFICATIONS.slice(0, 3).map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '/dashboard/notifications'}
                  className="block p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <p className="font-bold text-white flex items-center gap-1.5">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                    {n.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
