'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Trophy,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Award,
  Users,
  CheckCircle2,
  Image as ImageIcon,
  Flame,
  Globe,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CompetitionCard } from '@/components/cards/CompetitionCard';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { WinnerCard } from '@/components/cards/WinnerCard';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { LightboxModal } from '@/components/gallery/LightboxModal';
import { Button } from '@/components/ui/Button';
import {
  MOCK_COMPETITIONS,
  MOCK_GALLERY_PHOTOS,
  MOCK_WINNERS,
  MOCK_ARTICLES,
  MOCK_TENANTS,
} from '@/lib/mock-data';
import { Photo } from '@/lib/types';

export default function HomePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const activeCompetitions = MOCK_COMPETITIONS.filter(
    (c) => c.status === 'active' || c.status === 'judging'
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Ambient Glows & Patterns */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-primary-300 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
              <span>Multi-Tenant Photography Competition Infrastructure</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.1] text-white">
              Capture. Compete. <br />
              <span className="text-gradient">Create History.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The premier platform where global photographic societies host prestigious contests.
              Powered by deep vision AI preliminary evaluation and verified master juror panels.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link href="/competitions" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Competitions
                </Button>
              </Link>
              <Link href="/winners" className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="w-full justify-center" leftIcon={<Trophy className="w-4 h-4" />}>
                  View Hall of Fame
                </Button>
              </Link>
            </div>

            {/* Multi-Tenant Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-400">
                Partnered Organizations:
              </span>
              {MOCK_TENANTS.map((t) => (
                <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.logo} alt={t.name} className="w-4 h-4 rounded object-cover" />
                  <span className="text-slate-300 font-medium">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="border-y border-slate-900 bg-slate-950/60 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">50+</p>
              <p className="text-xs text-slate-400 font-medium">Global Competitions</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-primary-400 tracking-tight">12,000+</p>
              <p className="text-xs text-slate-400 font-medium">Verified Photographers</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tracking-tight">38,000+</p>
              <p className="text-xs text-slate-400 font-medium">Curated Submissions</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">150+</p>
              <p className="text-xs text-slate-400 font-medium">International Jurors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Competitions Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Current Contests</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              Active Photography Competitions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Strict 1 photo submission per entrant per competition.
            </p>
          </div>

          <Link href="/competitions">
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              View All Contests
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              System Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              How Pixel-Prize Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A transparent, two-stage evaluation pipeline combining state-of-the-art vision algorithms with seasoned jury expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up as a photographer, verify your gear and location, and set up your public portfolio profile.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Choose Competition',
                description: 'Browse active contests across landscape, portrait, wildlife, street, and monochrome genres.',
                icon: Trophy,
              },
              {
                step: '03',
                title: 'Upload Photograph',
                description: 'Submit your single best high-res photograph. EXIF camera metadata is automatically validated.',
                icon: Camera,
              },
              {
                step: '04',
                title: 'AI Vision Evaluation',
                description: 'Our proprietary vision engine analyzes sharpness, exposure fidelity, dynamic range, and generates an initial shortlist.',
                icon: Sparkles,
              },
              {
                step: '05',
                title: 'Master Jury Review',
                description: 'Verified industry jurors blind-score shortlisted entries across 5 weighted artistic dimensions.',
                icon: Shield,
              },
              {
                step: '06',
                title: 'Winners Announced',
                description: 'Official laureates receive cash prize disbursements, prestigious trophies, and permanent Hall of Fame induction.',
                icon: Award,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-extrabold font-mono text-slate-400">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Master Gallery */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>Curated Visuals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              Featured Master Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any photograph to inspect shot metadata and camera settings.
            </p>
          </div>

          <Link href="/gallery">
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Open Full Gallery
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GALLERY_PHOTOS.slice(0, 6).map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onSelect={(p) => setSelectedPhoto(p)} />
          ))}
        </div>
      </section>

      {/* Winner Spotlight Section */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Hall of Fame</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                Recent Award Laureates
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Celebrating exceptional visual excellence from the Nature Cup 2026.
              </p>
            </div>

            <Link href="/winners">
              <Button variant="gold" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Explore Hall of Fame
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_WINNERS.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>
        </div>
      </section>

      {/* Photography Guides & Articles */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Jury Insights & Tutorials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              Mastering the Lens
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Field guides, lighting setups, and juror advice to elevate your competition submissions.
            </p>
          </div>

          <Link href="/articles">
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              All Articles
            </Button>
          </Link>
        </div>

        {/* Featured Article */}
        <ArticleCard article={MOCK_ARTICLES[0]} featured />

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {MOCK_ARTICLES.slice(1, 4).map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      <Footer />
    </div>
  );
}
