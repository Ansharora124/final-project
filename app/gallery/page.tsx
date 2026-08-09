'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { LightboxModal } from '@/components/gallery/LightboxModal';
import { Tabs } from '@/components/ui/Tabs';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/Skeleton';
import { MOCK_GALLERY_PHOTOS, MOCK_COMPETITIONS } from '@/lib/mock-data';
import { CATEGORIES } from '@/lib/constants';
import { Photo } from '@/lib/types';
import { Image as ImageIcon, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCompetition, setSelectedCompetition] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, winners, shortlisted
  const [sortBy, setSortBy] = useState('popular');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const tabs = [
    { id: 'all', label: 'All Photos', count: MOCK_GALLERY_PHOTOS.length },
    {
      id: 'winners',
      label: 'Award Winners 🏆',
      count: MOCK_GALLERY_PHOTOS.filter((p) => p.award?.includes('Winner')).length,
    },
    {
      id: 'shortlisted',
      label: 'AI Shortlisted ⭐',
      count: MOCK_GALLERY_PHOTOS.filter((p) => p.award?.includes('Shortlist')).length,
    },
  ];

  const filteredPhotos = useMemo(() => {
    return MOCK_GALLERY_PHOTOS.filter((photo) => {
      if (filterType === 'winners' && !photo.award?.includes('Winner')) return false;
      if (filterType === 'shortlisted' && !photo.award?.includes('Shortlist')) return false;
      if (selectedCategory !== 'All Categories' && photo.category !== selectedCategory) return false;
      if (selectedCompetition !== 'all' && photo.competitionId !== selectedCompetition) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'likes') return b.likes - a.likes;
      return 0;
    });
  }, [filterType, selectedCategory, selectedCompetition, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Master Photographic Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Curated Gallery
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Explore verified high-resolution photographs submitted across all Pixel-Prize competitions. Click any photograph to view full camera EXIF specifications.
          </p>
        </div>

        {/* Tab Filters */}
        <Tabs tabs={tabs} activeTab={filterType} onChange={setFilterType} />

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Competition Archive
            </label>
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Competitions</option>
              {MOCK_COMPETITIONS.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="popular">Most Viewed</option>
              <option value="likes">Most Appreciated</option>
              <option value="newest">Recent Additions</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} onSelect={(p) => setSelectedPhoto(p)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ImageIcon className="w-8 h-8" />}
            title="No Photographs Found"
            description="No photographs matched your current filter criteria."
            actionLabel="Reset Gallery"
            onAction={() => {
              setFilterType('all');
              setSelectedCategory('All Categories');
              setSelectedCompetition('all');
            }}
          />
        )}
      </main>

      {/* Lightbox Modal */}
      <LightboxModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      <Footer />
    </div>
  );
}
