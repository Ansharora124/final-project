'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Calendar,
  Layers,
  Sparkles,
  Award,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Users,
} from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_TENANTS, MOCK_JUDGES } from '@/lib/mock-data';
import { CATEGORIES, DEFAULT_SCORING_CRITERIA } from '@/lib/constants';
import { ScoreCriterion } from '@/lib/types';

export default function CreateCompetitionPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[1]);
  const [tenantId, setTenantId] = useState(MOCK_TENANTS[0].id);
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  );

  // Timeline
  const [regStart, setRegStart] = useState('2026-09-01');
  const [subDeadline, setSubDeadline] = useState('2026-11-30');
  const [aiEvalDate, setAiEvalDate] = useState('2026-12-05');
  const [judgingDate, setJudgingDate] = useState('2026-12-20');
  const [resultsDate, setResultsDate] = useState('2026-12-25');

  // Guidelines
  const [maxFileSize, setMaxFileSize] = useState('35');
  const [minResolution, setMinResolution] = useState('3000 x 2000 px');

  // Scoring Criteria
  const [criteria, setCriteria] = useState<ScoreCriterion[]>(DEFAULT_SCORING_CRITERIA);

  // Prizes
  const [firstPrize, setFirstPrize] = useState('$8,000 USD + Grand Trophy');
  const [secondPrize, setSecondPrize] = useState('$4,500 USD + Silver Plaque');
  const [thirdPrize, setThirdPrize] = useState('$2,500 USD + Certificate');

  // Judges
  const [selectedJudges, setSelectedJudges] = useState<string[]>([MOCK_JUDGES[0].id]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Criteria Weight calculation
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleCriterionWeightChange = (id: string, newWeight: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: newWeight, maxScore: newWeight } : c))
    );
  };

  const handleAddCriterion = () => {
    const newId = `crit-${Date.now()}`;
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: 'New Evaluation Dimension',
        description: 'Custom juror assessment standard',
        weight: 10,
        maxScore: 10,
      },
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) {
      showToast('Minimum 1 Criterion Required', 'Competitions must have at least 1 evaluation dimension.', 'warning');
      return;
    }
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleJudge = (jId: string) => {
    if (selectedJudges.includes(jId)) {
      setSelectedJudges((prev) => prev.filter((id) => id !== jId));
    } else {
      setSelectedJudges((prev) => [...prev, jId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      showToast(
        'Criteria Weights Must Total 100%',
        `Current total is ${totalWeight}%. Please adjust dimension percentages before creating.`,
        'error'
      );
      return;
    }
    if (selectedJudges.length === 0) {
      showToast('Select At Least 1 Juror', 'Assign at least one judge to evaluate submissions.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Competition Created Successfully! 🎉', `"${title}" is now initialized for ${MOCK_TENANTS.find(t=>t.id===tenantId)?.name}.`, 'success');
      router.push('/admin/competitions');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      <div className="space-y-2">
        <Link
          href="/admin/competitions"
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Competitions</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Create New Photography Competition
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure multi-tenant ownership, timeline milestones, custom scoring rubrics, and jury panel assignments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-primary-500/20 text-primary-400 text-xs font-bold font-mono flex items-center justify-center">
              01
            </span>
            <h3 className="text-lg font-bold text-white">Basic Information & Organization</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Competition Title *"
                placeholder="e.g. Masters of the Nocturnal Sky 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Select
                label="Tenant Organization"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                options={MOCK_TENANTS.map((t) => ({ value: t.id, label: t.name }))}
              />
            </div>

            <div>
              <Select
                label="Primary Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES.filter((c) => c !== 'All Categories').map((c) => ({
                  value: c,
                  label: c,
                }))}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Short Hook / Tagline *"
                placeholder="Brief 1-sentence teaser for contest cards..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Full Competition Overview & Mission *"
                placeholder="Detailed description of artistic scope and inspiration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Cover Image URL (High-Res)"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                helperText="URL to high-res photographic cover visual."
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPETITION TIMELINE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-primary-500/20 text-primary-400 text-xs font-bold font-mono flex items-center justify-center">
              02
            </span>
            <h3 className="text-lg font-bold text-white">Competition Roadmap & Deadlines</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Registration Opens"
              type="date"
              value={regStart}
              onChange={(e) => setRegStart(e.target.value)}
              required
            />
            <Input
              label="Submission Deadline"
              type="date"
              value={subDeadline}
              onChange={(e) => setSubDeadline(e.target.value)}
              required
            />
            <Input
              label="AI Preliminary Shortlist Date"
              type="date"
              value={aiEvalDate}
              onChange={(e) => setAiEvalDate(e.target.value)}
              required
            />
            <Input
              label="Juror Scoring Deadline"
              type="date"
              value={judgingDate}
              onChange={(e) => setJudgingDate(e.target.value)}
              required
            />
            <Input
              label="Official Winner Announcement"
              type="date"
              value={resultsDate}
              onChange={(e) => setResultsDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* SECTION 3: SCORING CRITERIA BUILDER (100% VALIDATION) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-primary-500/20 text-primary-400 text-xs font-bold font-mono flex items-center justify-center">
                03
              </span>
              <h3 className="text-lg font-bold text-white">Custom Scoring Rubric</h3>
            </div>

            <div
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 border ${
                totalWeight === 100
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {totalWeight === 100 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>Total Weight: {totalWeight}% / 100%</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Define the weighted evaluation criteria for the master jury panel. Total must equal exactly 100%.
          </p>

          <div className="space-y-4">
            {criteria.map((c, idx) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">0{idx + 1}</span>
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCriteria((prev) =>
                          prev.map((item) => (item.id === c.id ? { ...item, name: val } : item))
                        );
                      }}
                      className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-primary-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={c.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCriteria((prev) =>
                        prev.map((item) =>
                          item.id === c.id ? { ...item, description: val } : item
                        )
                      );
                    }}
                    className="w-full bg-transparent text-xs text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={c.weight}
                      onChange={(e) =>
                        handleCriterionWeightChange(c.id, Number(e.target.value))
                      }
                      className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-center font-mono text-xs font-bold text-primary-400"
                    />
                    <span className="text-xs text-slate-400 font-mono">%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCriterion(c.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove standard"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCriterion}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Scoring Standard
          </Button>
        </div>

        {/* SECTION 4: PRIZE ALLOCATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-primary-500/20 text-primary-400 text-xs font-bold font-mono flex items-center justify-center">
              04
            </span>
            <h3 className="text-lg font-bold text-white">Prize Package Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="1st Place (Gold Prize)"
              value={firstPrize}
              onChange={(e) => setFirstPrize(e.target.value)}
              required
            />
            <Input
              label="2nd Place (Silver Prize)"
              value={secondPrize}
              onChange={(e) => setSecondPrize(e.target.value)}
              required
            />
            <Input
              label="3rd Place (Bronze Prize)"
              value={thirdPrize}
              onChange={(e) => setThirdPrize(e.target.value)}
              required
            />
          </div>
        </div>

        {/* SECTION 5: JURY APPOINTMENTS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-primary-500/20 text-primary-400 text-xs font-bold font-mono flex items-center justify-center">
                05
              </span>
              <h3 className="text-lg font-bold text-white">Assign Master Jurors</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {selectedJudges.length} Juror(s) Assigned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_JUDGES.map((judge) => {
              const isAssigned = selectedJudges.includes(judge.id);
              return (
                <div
                  key={judge.id}
                  onClick={() => toggleJudge(judge.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isAssigned
                      ? 'bg-primary-500/10 border-primary-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={judge.avatar}
                    alt={judge.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{judge.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{judge.title}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                      isAssigned ? 'bg-primary-500 text-white' : 'border border-slate-700'
                    }`}
                  >
                    {isAssigned && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <Link href="/admin/competitions">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<Save className="w-4 h-4" />}
          >
            Create & Initialize Competition
          </Button>
        </div>
      </form>
    </div>
  );
}
