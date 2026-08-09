'use client';

import React, { useState } from 'react';
import { Users, Search, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastContext';
import { CURRENT_USER } from '@/lib/mock-data';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  competitionsEntered: number;
  status: 'active' | 'suspended';
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: CURRENT_USER.id,
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    avatar: CURRENT_USER.avatar,
    joinedDate: CURRENT_USER.joinedDate,
    competitionsEntered: 6,
    status: 'active',
  },
  {
    id: 'usr-charlotte',
    name: 'Charlotte Moreau',
    email: 'charlotte.moreau@visuals.fr',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    joinedDate: '2024-04-10',
    competitionsEntered: 4,
    status: 'active',
  },
  {
    id: 'usr-kenji',
    name: 'Kenji Sato',
    email: 'kenji.sato@naturejapan.jp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    joinedDate: '2024-01-22',
    competitionsEntered: 8,
    status: 'active',
  },
  {
    id: 'usr-isabella',
    name: 'Isabella Rossi',
    email: 'isabella.rossi@lensroma.it',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    joinedDate: '2024-05-18',
    competitionsEntered: 3,
    status: 'active',
  },
];

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
    showToast('User Status Updated', 'Account access permissions changed.', 'info');
  };

  const columns = [
    {
      header: 'Photographer',
      cell: (u: UserRecord) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={u.avatar}
            alt={u.name}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
          />
          <div>
            <p className="font-bold text-white text-xs">{u.name}</p>
            <p className="text-[11px] text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Joined Date',
      cell: (u: UserRecord) => <span className="font-mono text-xs text-slate-300">{u.joinedDate}</span>,
    },
    {
      header: 'Contests Entered',
      cell: (u: UserRecord) => (
        <span className="font-mono text-xs font-bold text-white">
          {u.competitionsEntered} Entries
        </span>
      ),
    },
    {
      header: 'Account Status',
      cell: (u: UserRecord) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
            u.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {u.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (u: UserRecord) => (
        <div className="flex items-center justify-end">
          <Button
            variant={u.status === 'active' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => toggleStatus(u.id)}
            className="text-xs"
          >
            {u.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  const filtered = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Photographers & Users Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage registered creators, verify credentials, and manage platform permissions.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <Input
          placeholder="Search photographers by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(u) => u.id} />
    </div>
  );
}
