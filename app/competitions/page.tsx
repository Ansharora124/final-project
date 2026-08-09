'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CompetitionCard } from '@/components/cards/CompetitionCard';
import { Tabs } from '@/components/ui/Tabs';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/Skeleton';
import { MOCK_COMPETITIONS } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/constants';
import { Search, SlidersHorizontal, Trophy, Sparkles } from 'lucide-react';

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const tabs = [
    { id: 'all', label: 'All Competitions', count: MOCK_COMPETITIONS.length },
    {
      id: 'active',
      label: 'Active & Accepting',
      count: MOCK_COMPETITIONS.filter((c) => c.status === 'active').length,
    },
    {
      id: 'judging',
      label: 'In Expert Review',
      count: MOCK_COMPETITIONS.filter((c) => c.status === 'judging').length,
    },
    {
      id: 'results_published',
      label: 'Winners Announced',
      count: MOCK_COMPETITIONS.filter((c) => c.status === 'results_published').length,
    },
    {
      id: 'upcoming',
      label: 'Opening Soon',
      count: MOCK_COMPETITIONS.filter((c) => c.status === 'upcoming').length,
    },
  ];

  const filteredCompetitions = useMemo(() => {
    return MOCK_COMPETITIONS.filter((comp) => {
      // Tab filter
      if (activeTab !== 'all' && comp.status !== activeTab) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All Categories' && comp.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = comp.title.toLowerCase().includes(query);
        const matchesDesc = comp.description.toLowerCase().includes(query);
        const matchesTenant = comp.tenantName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTenant) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'prize') return b.totalPrizeValue - a.totalPrizeValue;
      if (sortBy === 'submissions') return b.submissionCount - a.submissionCount;
      if (sortBy === 'deadline') {
        return (
          new Date(a.timeline.submissionDeadline).getTime() -
          new Date(b.timeline.submissionDeadline).getTime()
        );
      }
      return 0; // newest
    });
  }, [activeTab, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-10">
        {/* Page Header Banner */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-primary-300 backdrop-blur-xl">
            <Trophy className="w-3.5 h-3.5" />
            <span>Open Calls & Global Awards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Explore Competitions
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Discover active, jury-reviewed photography contests. Submit your single best photograph per competition and gain recognition from international jurors.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="p-4 rounded-3xl bg-[#09090b] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 backdrop-blur-xl shadow-xl">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by contest title, theme, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'newest', label: 'Sort: Newest First' },
                { value: 'prize', label: 'Sort: Highest Prize Pool' },
                { value: 'deadline', label: 'Sort: Closing Soon' },
                { value: 'submissions', label: 'Sort: Most Popular' },
              ]}
            />
          </div>
        </div>

        {/* Competitions Grid */}
        {filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Trophy className="w-8 h-8" />}
            title="No Competitions Found"
            description="We couldn't find any competitions matching your selected filter criteria. Try resetting filters or choosing another category."
            actionLabel="Clear Filters"
            onAction={() => {
              setActiveTab('all');
              setSelectedCategory('All Categories');
              setSearchQuery('');
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
