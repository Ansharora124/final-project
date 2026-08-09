'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { CompetitionStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_COMPETITIONS, MOCK_TENANTS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Competition } from '@/lib/types';

export default function AdminCompetitionsPage() {
  const { showToast } = useToast();
  const [competitions, setCompetitions] = useState<Competition[]>(MOCK_COMPETITIONS);
  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setCompetitions((prev) => prev.filter((c) => c.id !== id));
      showToast('Competition Deleted', `"${title}" has been removed.`, 'info');
    }
  };

  const handlePublishResults = (id: string) => {
    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'results_published' } : c))
    );
    showToast('Results Published! 🏆', 'Winner rankings are now visible to the public.', 'success');
  };

  const filtered = competitions.filter((c) => {
    if (tenantFilter !== 'all' && c.tenantId !== tenantFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.tenantName.toLowerCase().includes(q);
    }
    return true;
  });

  const columns = [
    {
      header: 'Competition',
      cell: (comp: Competition) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comp.coverImage}
            alt={comp.title}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
          />
          <div>
            <p className="font-bold text-white text-xs">{comp.title}</p>
            <p className="text-[11px] text-primary-400 font-medium">{comp.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Tenant Organization',
      cell: (comp: Competition) => (
        <span className="text-xs text-slate-300 font-medium">{comp.tenantName}</span>
      ),
    },
    {
      header: 'Status',
      cell: (comp: Competition) => <CompetitionStatusBadge status={comp.status} />,
    },
    {
      header: 'Deadline',
      cell: (comp: Competition) => (
        <span className="font-mono text-xs text-slate-300">
          {formatDate(comp.timeline.submissionDeadline)}
        </span>
      ),
    },
    {
      header: 'Entries',
      cell: (comp: Competition) => (
        <span className="font-mono text-xs font-bold text-white">
          {comp.submissionCount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (comp: Competition) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/competitions/${comp.id}`}>
            <button
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Preview public contest"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href={`/admin/competitions/${comp.id}/edit`}>
            <button
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Edit parameters"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </Link>
          {comp.status === 'judging' && (
            <button
              onClick={() => handlePublishResults(comp.id)}
              className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
              title="Publish Winners"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => handleDelete(comp.id, comp.title)}
            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
            title="Delete contest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Competitions Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Create, configure scoring weights, allocate judges, and publish winner laureates.
          </p>
        </div>

        <Link href="/admin/competitions/create">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create Competition
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by contest title or tenant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div>
          <Select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Tenant Organizations' },
              ...MOCK_TENANTS.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
        </div>
      </div>

      {/* Competitions Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(c) => c.id}
      />
    </div>
  );
}
