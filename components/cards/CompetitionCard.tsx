'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Competition } from '@/lib/types';
import { CompetitionStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getDaysLeft } from '@/lib/utils';
import { CURRENT_USER, MOCK_SUBMISSIONS } from '@/lib/mock-data';

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, className }) => {
  // Check if current user has already submitted to this competition
  const existingSubmission = MOCK_SUBMISSIONS.find(
    (sub) => sub.competitionId === competition.id && sub.userId === CURRENT_USER.id
  );

  const daysLeft = getDaysLeft(competition.timeline.submissionDeadline);

  return (
    <div className="group relative bg-[#09090b]/95 rounded-3xl border border-white/[0.08] overflow-hidden hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col justify-between backdrop-blur-xl">
      <div>
        {/* Cover Image */}
        <div className="relative h-52 w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={competition.coverImage}
            alt={competition.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />

          {/* Status & Prize Pool Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <CompetitionStatusBadge status={competition.status} />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black font-extrabold text-xs shadow-xl backdrop-blur-md">
              <Trophy className="w-3.5 h-3.5" />
              <span>{competition.prizePool}</span>
            </div>
          </div>

          {/* Tenant Organizer Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={competition.tenantLogo}
              alt={competition.tenantName}
              className="w-6 h-6 rounded-md object-cover ring-1 ring-white/20"
            />
            <span className="text-xs font-medium text-white/90 drop-shadow-md">
              {competition.tenantName}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-primary-300 font-medium">
            <span>{competition.category}</span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{daysLeft.text}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
            {competition.title}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {competition.shortDescription}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Users className="w-3.5 h-3.5 text-zinc-500" />
              <span>{competition.submissionCount.toLocaleString()} entries</span>
            </div>
            <div className="flex items-center justify-end text-zinc-400">
              <span className="text-[11px] font-mono">1 photo / entrant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0">
        {existingSubmission ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Submission Already Made</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/dashboard/submissions/${existingSubmission.id}`} className="w-full">
                <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                  View Entry
                </Button>
              </Link>
              <Link href={`/competitions/${competition.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                  Details
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/competitions/${competition.id}`} className="w-full">
              <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                View Details
              </Button>
            </Link>
            {competition.status === 'active' ? (
              <Link href={`/competitions/${competition.id}/submit`} className="w-full">
                <Button variant="primary" size="sm" className="w-full justify-center text-xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Participate
                </Button>
              </Link>
            ) : competition.status === 'results_published' ? (
              <Link href={`/competitions/${competition.id}?tab=results`} className="w-full">
                <Button variant="gold" size="sm" className="w-full justify-center text-xs">
                  View Winners
                </Button>
              </Link>
            ) : (
              <Link href={`/competitions/${competition.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs opacity-70">
                  Follow
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
