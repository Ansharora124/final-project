'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, Sparkles, Filter, Trophy, ArrowRight } from 'lucide-react';
import { SubmissionCard } from '@/components/cards/SubmissionCard';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Skeleton';
import { MOCK_SUBMISSIONS, CURRENT_USER } from '@/lib/mock-data';

export default function UserSubmissionsListPage() {
  const [filter, setFilter] = useState('all');

  const mySubmissions = MOCK_SUBMISSIONS.filter(
    (s) => s.userId === CURRENT_USER.id || s.photographerName === CURRENT_USER.name
  );

  const filtered = mySubmissions.filter((sub) => {
    if (filter === 'shortlisted') return sub.status === 'shortlisted' || sub.status === 'winner';
    if (filter === 'review') return sub.status === 'judge_review' || sub.status === 'under_ai_review';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Submissions', count: mySubmissions.length },
    {
      id: 'shortlisted',
      label: 'Shortlisted & Winners ⭐',
      count: mySubmissions.filter((s) => s.status === 'shortlisted' || s.status === 'winner').length,
    },
    {
      id: 'review',
      label: 'In Review Queue',
      count: mySubmissions.filter((s) => s.status === 'judge_review' || s.status === 'under_ai_review').length,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            My Photograph Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time status of your entries through AI vision evaluation and jury scoring.
          </p>
        </div>

        <Link href="/competitions">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Submit New Entry
          </Button>
        </Link>
      </div>

      <Tabs tabs={tabs} activeTab={filter} onChange={setFilter} />

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UploadCloud className="w-8 h-8" />}
          title="No Submissions Found"
          description="You don't have any submissions in this category yet."
          actionLabel="Explore Contests"
          actionHref="/competitions"
        />
      )}
    </div>
  );
}
