'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/Skeleton';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { BookOpen, Search, Sparkles } from 'lucide-react';

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Composition Tips',
    'Wildlife Photography',
    'Portrait Lighting',
    'Street Photography',
    'Editing Guides',
  ];

  const filteredArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((article) => {
      if (selectedCategory !== 'All' && article.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Juror Insights & Technique Articles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Photography Guides & Tutorials
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Learn composition tension, ethical fieldcraft, dynamic range calibration, and studio lighting directly from our competition jurors and grand laureates.
          </p>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white font-semibold shadow-md shadow-primary-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Featured Guide (when All is selected and no search) */}
        {selectedCategory === 'All' && !searchQuery && (
          <ArticleCard article={MOCK_ARTICLES[0]} featured />
        )}

        {/* Article Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="No Guides Found"
            description="We couldn't find any articles matching your search."
            actionLabel="Reset Search"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
