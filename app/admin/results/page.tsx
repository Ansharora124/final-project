'use client';

import React, { useState } from 'react';
import { Trophy, Award, Sparkles, CheckCircle2, Star, Send } from 'lucide-react';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_COMPETITIONS, MOCK_SUBMISSIONS } from '@/lib/mock-data';

export default function AdminResultsManagementPage() {
  const { showToast } = useToast();
  const [selectedCompId, setSelectedCompId] = useState(MOCK_COMPETITIONS[0].id);

  const competition = MOCK_COMPETITIONS.find((c) => c.id === selectedCompId) || MOCK_COMPETITIONS[0];

  // Candidates for this competition
  const candidates = MOCK_SUBMISSIONS.filter(
    (s) => s.competitionId === competition.id || s.category === competition.category
  );

  // Winner selection state
  const [firstPlaceId, setFirstPlaceId] = useState(candidates[0]?.id || '');
  const [secondPlaceId, setSecondPlaceId] = useState(candidates[1]?.id || '');
  const [thirdPlaceId, setThirdPlaceId] = useState(candidates[2]?.id || '');

  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(competition.status === 'results_published');

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      showToast(
        'Results Published to Hall of Fame! 🏆🎉',
        `Official laureates for "${competition.title}" have been announced worldwide.`,
        'success'
      );
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Results & Award Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Synthesize AI preliminary scores with master jury marks, assign podium ranks, and publish laureates.
          </p>
        </div>

        {isPublished ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Results Published Live</span>
          </div>
        ) : (
          <Button
            variant="gold"
            size="md"
            onClick={handlePublish}
            isLoading={isPublishing}
            leftIcon={<Trophy className="w-4 h-4" />}
          >
            Publish Contest Results
          </Button>
        )}
      </div>

      {/* Competition Selector */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Select Competition to Finalize Results
        </label>
        <Select
          value={selectedCompId}
          onChange={(e) => {
            setSelectedCompId(e.target.value);
            setIsPublished(false);
          }}
          options={MOCK_COMPETITIONS.map((c) => ({
            value: c.id,
            label: `${c.title} (${c.status.toUpperCase()}) - ${c.prizePool}`,
          }))}
        />
      </div>

      {/* Podium Allocator (1st, 2nd, 3rd Place) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Championship Podium Allocation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1st Place Gold */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 shadow-lg shadow-amber-500/5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                <span>🥇</span> 1st Place Champion
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">$8,000 USD</span>
            </div>

            <label className="block text-[11px] text-slate-400 uppercase">Select Winning Entry</label>
            <select
              value={firstPlaceId}
              onChange={(e) => setFirstPlaceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.photographerName} (Jury: {c.finalJudgeScore ?? 96})
                </option>
              ))}
            </select>
          </div>

          {/* 2nd Place Silver */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-400/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-300 text-slate-950 flex items-center gap-1">
                <span>🥈</span> 2nd Place Runner-Up
              </span>
              <span className="text-xs font-mono text-slate-300 font-bold">$4,500 USD</span>
            </div>

            <label className="block text-[11px] text-slate-400 uppercase">Select Winning Entry</label>
            <select
              value={secondPlaceId}
              onChange={(e) => setSecondPlaceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.photographerName} (Jury: {c.finalJudgeScore ?? 94})
                </option>
              ))}
            </select>
          </div>

          {/* 3rd Place Bronze */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-700/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-700 text-white flex items-center gap-1">
                <span>🥉</span> 3rd Place Finalist
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">$2,500 USD</span>
            </div>

            <label className="block text-[11px] text-slate-400 uppercase">Select Winning Entry</label>
            <select
              value={thirdPlaceId}
              onChange={(e) => setThirdPlaceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.photographerName} (Jury: {c.finalJudgeScore ?? 92})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Evaluation Synthesis Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">AI Vision & Juror Composite Synthesis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-3">Photograph</th>
                <th className="p-3">Photographer</th>
                <th className="p-3">AI Vision Score</th>
                <th className="p-3">Jury Average</th>
                <th className="p-3">Combined Score</th>
                <th className="p-3">Assigned Podium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {candidates.map((c) => {
                const is1st = c.id === firstPlaceId;
                const is2nd = c.id === secondPlaceId;
                const is3rd = c.id === thirdPlaceId;

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="p-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.thumbnailUrl} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-white">{c.title}</span>
                    </td>
                    <td className="p-3">{c.photographerName}</td>
                    <td className="p-3 font-mono text-primary-400 font-bold">
                      {c.aiEvaluation.overallScore} pts
                    </td>
                    <td className="p-3 font-mono text-amber-400 font-bold">
                      {c.finalJudgeScore ?? 95.0} pts
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-extrabold">
                      {((c.aiEvaluation.overallScore + (c.finalJudgeScore ?? 95)) / 2).toFixed(1)} / 100
                    </td>
                    <td className="p-3">
                      {is1st && <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">🥇 1st Place</span>}
                      {is2nd && <span className="px-2 py-0.5 rounded bg-slate-300 text-slate-950 font-bold">🥈 2nd Place</span>}
                      {is3rd && <span className="px-2 py-0.5 rounded bg-amber-700 text-white font-bold">🥉 3rd Place</span>}
                      {!is1st && !is2nd && !is3rd && (
                        <span className="text-slate-400">Finalist</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
