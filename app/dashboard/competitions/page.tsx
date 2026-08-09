'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { CompetitionCard } from '@/components/cards/CompetitionCard';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { MOCK_COMPETITIONS, MOCK_SUBMISSIONS, CURRENT_USER } from '@/lib/mock-data';

export default function UserCompetitionsPage() {
  const [tab, setTab] = useState('entered');

  const enteredCompetitionIds = MOCK_SUBMISSIONS.filter(
    (s) => s.userId === CURRENT_USER.id || s.photographerName === CURRENT_USER.name
  ).map((s) => s.competitionId);

  const enteredCompetitions = MOCK_COMPETITIONS.filter((c) =>
    enteredCompetitionIds.includes(c.id)
  );

  const availableCompetitions = MOCK_COMPETITIONS.filter(
    (c) => !enteredCompetitionIds.includes(c.id)
  );

  const tabs = [
    { id: 'entered', label: 'My Entered Competitions', count: enteredCompetitions.length },
    { id: 'available', label: 'Open Competitions to Enter', count: availableCompetitions.length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          My Competitions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Track contests you have joined and discover upcoming challenges.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === 'entered' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enteredCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      )}
    </div>
  );
}
