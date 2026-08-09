'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Trophy,
  Users,
  UploadCloud,
  Gavel,
  CheckSquare,
  Sparkles,
  PlusCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { Button } from '@/components/ui/Button';
import { MOCK_ADMIN_STATS, MOCK_COMPETITIONS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-950/40 via-slate-900 to-slate-900 border border-primary-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/15 text-primary-300 border border-primary-500/30 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform SuperAdmin Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pixel-Prize Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Managing 4 organizational tenants, 50+ total competitions, and 38,450 active photographic submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/competitions/create">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create Competition
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Admin KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Users"
          value={MOCK_ADMIN_STATS.totalUsers.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: '14.2%', isPositive: true }}
          variant="primary"
        />
        <StatCard
          label="Active Contests"
          value={MOCK_ADMIN_STATS.activeCompetitions}
          icon={<Trophy className="w-5 h-5" />}
          variant="gold"
        />
        <StatCard
          label="Submissions"
          value={MOCK_ADMIN_STATS.totalSubmissions.toLocaleString()}
          icon={<UploadCloud className="w-5 h-5" />}
          trend={{ value: '28.1%', isPositive: true }}
          variant="emerald"
        />
        <StatCard
          label="Pending Judging"
          value={MOCK_ADMIN_STATS.pendingJudging}
          icon={<Gavel className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          label="Prize Capital"
          value={MOCK_ADMIN_STATS.totalPrizeDistributed}
          icon={<CheckSquare className="w-5 h-5" />}
          variant="gold"
        />
      </div>

      {/* Analytics Trend Graphs */}
      <AnalyticsCharts />

      {/* Real-time Activity Feed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <span>Real-Time Audit Activity Log</span>
            </h3>
            <p className="text-xs text-slate-400">Live stream of juror reviews, AI shortlists, and participant uploads</p>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_ADMIN_STATS.recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-slate-300">
                  <strong className="text-white font-semibold">{act.actor}</strong>{' '}
                  <span className="text-slate-400">({act.actorRole})</span> {act.action}{' '}
                  <span className="text-primary-300 font-semibold">&ldquo;{act.target}&rdquo;</span>
                </p>
              </div>
              <span className="font-mono text-slate-400 text-[11px] shrink-0">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
