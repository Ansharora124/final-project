'use client';

import React, { useState } from 'react';
import { Gavel, Plus, Award, Star, CheckCircle2, Search, UserCheck } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_JUDGES } from '@/lib/mock-data';
import { Judge } from '@/lib/types';

export default function AdminJudgesPage() {
  const { showToast } = useToast();
  const [judges, setJudges] = useState<Judge[]>(MOCK_JUDGES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // New Judge State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [expertise, setExpertise] = useState('Wildlife & Animals, Landscape');

  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    const newJudge: Judge = {
      id: `jdg-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      title,
      bio: 'Newly appointed international evaluation juror.',
      expertise: expertise.split(',').map((s) => s.trim()),
      assignedCompetitionIds: [],
      reviewsCompleted: 0,
      totalAssignedReviews: 0,
      status: 'active',
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setJudges((prev) => [...prev, newJudge]);
    setIsAddModalOpen(false);
    showToast('Juror Appointed 🎉', `${name} has been added to the master juror directory.`, 'success');
  };

  const columns = [
    {
      header: 'Juror Profile',
      cell: (j: Judge) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={j.avatar}
            alt={j.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/30"
          />
          <div>
            <p className="font-bold text-white text-xs">{j.name}</p>
            <p className="text-[10px] text-amber-400">{j.title}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Specialty Expertise',
      cell: (j: Judge) => (
        <div className="flex flex-wrap gap-1">
          {j.expertise.map((exp, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium"
            >
              {exp}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Assigned Contests',
      cell: (j: Judge) => (
        <span className="font-mono text-xs font-bold text-white">
          {j.assignedCompetitionIds.length} Contests
        </span>
      ),
    },
    {
      header: 'Review Progress',
      cell: (j: Judge) => (
        <div className="space-y-1">
          <span className="font-mono text-xs text-amber-400 font-bold">
            {j.reviewsCompleted} / {j.totalAssignedReviews}
          </span>
          <div className="w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{
                width: `${(j.reviewsCompleted / Math.max(1, j.totalAssignedReviews)) * 100}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (j: Judge) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
          {j.status}
        </span>
      ),
    },
  ];

  const filtered = judges.filter((j) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return j.name.toLowerCase().includes(q) || j.expertise.some((e) => e.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Judges Panel Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Oversee juror appointments, review workloads, and competition allocations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Appoint New Juror
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <Input
          placeholder="Search jurors by name or photography discipline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(j) => j.id} />

      {/* Appoint Juror Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Appoint New Master Juror"
      >
        <form onSubmit={handleAddJudge} className="space-y-4">
          <Input label="Juror Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Professional Title / Credential" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input
            label="Expertise Disciplines (comma-separated)"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            helperText="e.g. Wildlife, Monochrome, Street Photography"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Appoint Juror
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
