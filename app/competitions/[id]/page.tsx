'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
  ExternalLink,
  Camera,
  MapPin,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { CompetitionStatusBadge } from '@/components/ui/Badge';
import { ScoringCriteriaBreakdown } from '@/components/competitions/ScoringCriteriaBreakdown';
import { TimelineStepper } from '@/components/competitions/TimelineStepper';
import { WinnerCard } from '@/components/cards/WinnerCard';
import {
  MOCK_COMPETITIONS,
  MOCK_JUDGES,
  MOCK_SUBMISSIONS,
  MOCK_WINNERS,
  CURRENT_USER,
} from '@/lib/mock-data';
import { formatDate, getDaysLeft, formatCurrency } from '@/lib/utils';

export default function CompetitionDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const competition = MOCK_COMPETITIONS.find((c) => c.id === id || c.slug === id);

  const [activeTab, setActiveTab] = useState('overview');

  if (!competition) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
          <h2 className="text-xl font-bold">Competition Not Found</h2>
          <p className="text-xs text-zinc-400 mt-1 mb-6">The requested competition ID does not exist.</p>
          <Link href="/competitions">
            <Button variant="primary">Browse All Competitions</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if current user already submitted to this competition
  const existingSubmission = MOCK_SUBMISSIONS.find(
    (sub) => sub.competitionId === competition.id && sub.userId === CURRENT_USER.id
  );

  const daysLeft = getDaysLeft(competition.timeline.submissionDeadline);

  const assignedJudges = MOCK_JUDGES.filter((j) =>
    competition.judgeIds.includes(j.id)
  );

  const competitionWinners = MOCK_WINNERS.filter(
    (w) => w.competitionId === competition.id
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'guidelines', label: 'Rules & Guidelines' },
    { id: 'criteria', label: 'Scoring Criteria' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'judges', label: 'Jury Panel', count: assignedJudges.length },
    ...(competition.status === 'results_published'
      ? [{ id: 'results', label: 'Official Winners 🏆', count: competitionWinners.length }]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Cover Header */}
      <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={competition.bannerImage || competition.coverImage}
          alt={competition.title}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
          {/* Tenant Organizer & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={competition.tenantLogo}
                alt={competition.tenantName}
                className="w-4 h-4 rounded object-cover"
              />
              <span className="text-zinc-200 font-medium">{competition.tenantName}</span>
            </div>
            <CompetitionStatusBadge status={competition.status} />
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-primary-300 border border-white/20">
              {competition.category}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            {competition.title}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-300 pt-2 font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Trophy className="w-4 h-4" />
              <span>Prize Pool: {competition.prizePool}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>Deadline: {formatDate(competition.timeline.submissionDeadline)} ({daysLeft.text})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-zinc-400" />
              <span>{competition.submissionCount.toLocaleString()} Entries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left / Center Tabs & Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">About the Competition</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{competition.description}</p>
                </div>

                {/* Prize Pool Breakdown Cards */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Awards & Prize Distribution</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {competition.prizes.map((prize, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-3xl bg-[#09090b] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl shadow-xl"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                            <h4 className="text-base font-bold text-white">{prize.title}</h4>
                          </div>
                          <ul className="space-y-1 text-xs text-zinc-400">
                            {prize.perks.map((perk, pIdx) => (
                              <li key={pIdx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary-400" />
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {prize.cashAmount && (
                          <div className="px-4 py-2 rounded-2xl bg-black border border-white/[0.08] text-right shrink-0">
                            <p className="text-[10px] uppercase font-mono text-zinc-400">Cash Award</p>
                            <p className="text-lg font-extrabold font-mono text-amber-400">
                              {formatCurrency(prize.cashAmount)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GUIDELINES */}
            {activeTab === 'guidelines' && (
              <div className="space-y-8 animate-in fade-in">
                {/* Technical Requirements */}
                <div className="p-6 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary-300" />
                    <span>File & Image Technical Specifications</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-black border border-white/[0.08]">
                      <p className="text-[10px] text-zinc-400 uppercase">Max File Size</p>
                      <p className="font-mono font-bold text-white mt-1">{competition.guidelines.maxFileSizeMB} MB</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black border border-white/[0.08]">
                      <p className="text-[10px] text-zinc-400 uppercase">Allowed Formats</p>
                      <p className="font-mono font-bold text-white mt-1">
                        {competition.guidelines.allowedFormats.join(', ')}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black border border-white/[0.08]">
                      <p className="text-[10px] text-zinc-400 uppercase">Min Resolution</p>
                      <p className="font-mono font-bold text-white mt-1 truncate">
                        {competition.guidelines.minResolution}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black border border-white/[0.08]">
                      <p className="text-[10px] text-zinc-400 uppercase">Submission Limit</p>
                      <p className="font-mono font-bold text-emerald-400 mt-1">
                        Strictly 1 Photo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Competition Rules */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Contest Rules</h3>
                  <ul className="space-y-3 text-xs text-zinc-300">
                    {competition.guidelines.rules.map((rule, idx) => (
                      <li
                        key={idx}
                        className="p-4 rounded-2xl bg-[#09090b] border border-white/[0.08] flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: SCORING CRITERIA */}
            {activeTab === 'criteria' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Jury Scoring Rubric</h3>
                  <p className="text-xs text-zinc-400">
                    All entries shortlisted by the AI vision engine will be evaluated by the assigned master jury across these 5 weighted dimensions.
                  </p>
                </div>
                <ScoringCriteriaBreakdown criteria={competition.criteria} />
              </div>
            )}

            {/* TAB: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Competition Roadmap</h3>
                  <p className="text-xs text-zinc-400">
                    Key milestones from registration launch to official winner publication.
                  </p>
                </div>
                <TimelineStepper timeline={competition.timeline} />
              </div>
            )}

            {/* TAB: JURY PANEL */}
            {activeTab === 'judges' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Assigned Master Jurors</h3>
                  <p className="text-xs text-zinc-400">
                    World-renowned photographers and editors responsible for the final scoring and written evaluations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assignedJudges.map((judge) => (
                    <div
                      key={judge.id}
                      className="p-5 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-3 shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={judge.avatar}
                          alt={judge.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-500/30"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{judge.name}</h4>
                          <p className="text-[11px] text-primary-300 font-medium">{judge.title}</p>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{judge.bio}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {judge.expertise.map((exp, eIdx) => (
                          <span
                            key={eIdx}
                            className="px-2 py-0.5 rounded-lg bg-black border border-white/[0.08] text-zinc-300 text-[10px] font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: RESULTS */}
            {activeTab === 'results' && competition.status === 'results_published' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Official Contest Laureates</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Certified results scored by our master jury panel.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {competitionWinners.map((w) => (
                    <WinnerCard key={w.id} winner={w} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Action Card (1 Col) */}
          <div className="space-y-6">
            <div className="sticky top-24 p-6 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Participation Status
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{competition.prizePool}</span>
                  <CompetitionStatusBadge status={competition.status} />
                </div>
              </div>

              {/* 1 Photo Per User Rule Box */}
              <div className="p-4 rounded-2xl bg-black border border-white/[0.08] space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-primary-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-primary-300" />
                  <span>Strict Single-Submission Policy</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  To ensure the highest artistic standard, every photographer is limited to submitting exactly 1 photograph per contest.
                </p>
              </div>

              {/* Action Buttons based on User Submission State */}
              <div className="space-y-3 pt-2">
                {existingSubmission ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Submission Already Made for this Contest</span>
                    </div>

                    <Link href={`/dashboard/submissions/${existingSubmission.id}`} className="w-full block">
                      <Button variant="primary" size="lg" className="w-full justify-center text-sm">
                        View My Submission
                      </Button>
                    </Link>
                  </div>
                ) : competition.status === 'active' ? (
                  <Link href={`/competitions/${competition.id}/submit`} className="w-full block">
                    <Button variant="primary" size="lg" className="w-full justify-center text-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Submit Your Photograph
                    </Button>
                  </Link>
                ) : competition.status === 'results_published' ? (
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full justify-center text-sm"
                    onClick={() => setActiveTab('results')}
                  >
                    View Official Results
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" disabled className="w-full justify-center text-sm">
                    Submissions Closed
                  </Button>
                )}
              </div>

              {/* Tenant Sponsor Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                <span>Hosted by {competition.tenantName}</span>
                <span className="text-emerald-400 font-medium">Verified Organizer</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
