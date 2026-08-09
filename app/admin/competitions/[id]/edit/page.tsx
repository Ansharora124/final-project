'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trophy, AlertCircle } from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_COMPETITIONS, MOCK_TENANTS } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/constants';

export default function EditCompetitionPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { showToast } = useToast();

  const competition = MOCK_COMPETITIONS.find((c) => c.id === id);

  const [title, setTitle] = useState(competition?.title || '');
  const [shortDescription, setShortDescription] = useState(competition?.shortDescription || '');
  const [description, setDescription] = useState(competition?.description || '');
  const [category, setCategory] = useState<string>(competition?.category || CATEGORIES[1]);
  const [prizePool, setPrizePool] = useState(competition?.prizePool || '$15,000 USD');

  if (!competition) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold">Competition Not Found</h2>
        <Link href="/admin/competitions">
          <Button variant="primary">Back to Competitions</Button>
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Competition Updated', `Changes to "${title}" have been saved.`, 'success');
    router.push('/admin/competitions');
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div className="space-y-2">
        <Link
          href="/admin/competitions"
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Competitions</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Edit Competition: {competition.title}
        </h1>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <Input label="Competition Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Prize Pool Display" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} required />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORIES.filter((c) => c !== 'All Categories').map((c) => ({
            value: c,
            label: c,
          }))}
        />
        <Input
          label="Short Hook / Tagline"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        />
        <Textarea
          label="Full Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Link href="/admin/competitions">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" rightIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
