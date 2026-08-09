'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  Search,
  Sparkles,
  Shield,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { SubmissionStatusBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_SUBMISSIONS, MOCK_COMPETITIONS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Submission } from '@/lib/types';

export default function AdminSubmissionsPage() {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [search, setSearch] = useState('');
  const [selectedComp, setSelectedComp] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeModalSub, setActiveModalSub] = useState<Submission | null>(null);

  const handleStatusChange = (id: string, newStatus: any) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    showToast('Status Updated', `Submission status updated to ${newStatus}.`, 'success');
  };

  const filtered = submissions.filter((sub) => {
    if (selectedComp !== 'all' && sub.competitionId !== selectedComp) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        sub.title.toLowerCase().includes(q) ||
        sub.photographerName.toLowerCase().includes(q) ||
        sub.competitionTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      header: 'Photograph & Title',
      cell: (sub: Submission) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sub.thumbnailUrl}
            alt={sub.title}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
          />
          <div>
            <p className="font-bold text-white text-xs">{sub.title}</p>
            <p className="text-[11px] text-slate-400">{sub.photographerName}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Competition',
      cell: (sub: Submission) => (
        <span className="text-xs text-slate-300 font-medium">{sub.competitionTitle}</span>
      ),
    },
    {
      header: 'AI Vision Score',
      cell: (sub: Submission) => (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{sub.aiEvaluation.overallScore} pts</span>
        </div>
      ),
    },
    {
      header: 'Jury Status',
      cell: (sub: Submission) => (
        <span className="font-mono text-xs font-bold text-amber-400">
          {sub.finalJudgeScore ? `${sub.finalJudgeScore} pts` : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (sub: Submission) => <SubmissionStatusBadge status={sub.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (sub: Submission) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setActiveModalSub(sub)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Inspect Entry"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStatusChange(sub.id, 'shortlisted')}
            className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
            title="Force Shortlist"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Submissions Master Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Filter by AI vision thresholds, audit EXIF parameters, and oversee jury allocations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Search by title, photographer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div>
          <Select
            value={selectedComp}
            onChange={(e) => setSelectedComp(e.target.value)}
            options={[
              { value: 'all', label: 'All Competitions' },
              ...MOCK_COMPETITIONS.map((c) => ({ value: c.id, label: c.title })),
            ]}
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'shortlisted', label: 'Shortlisted ⭐' },
              { value: 'judge_review', label: 'Under Judge Review' },
              { value: 'winner', label: 'Prize Winners' },
              { value: 'submitted', label: 'Awaiting AI' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(s) => s.id}
      />

      {/* Quick Inspection Modal */}
      <Modal
        isOpen={!!activeModalSub}
        onClose={() => setActiveModalSub(null)}
        title={activeModalSub?.title || 'Submission Details'}
        size="lg"
      >
        {activeModalSub && (
          <div className="space-y-6">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalSub.imageUrl}
                alt={activeModalSub.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-slate-400 font-bold uppercase">Photographer</p>
                <p className="text-white font-semibold">{activeModalSub.photographerName}</p>
                <p className="text-slate-400">{activeModalSub.photographerLocation}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-slate-400 font-bold uppercase">AI Vision Benchmark</p>
                <p className="text-primary-400 font-mono font-bold text-base">
                  {activeModalSub.aiEvaluation.overallScore} / 100
                </p>
                <p className="text-slate-400">Rank #{activeModalSub.aiEvaluation.rank}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setActiveModalSub(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
