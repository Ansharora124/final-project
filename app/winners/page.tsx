'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WinnerCard } from '@/components/cards/WinnerCard';
import { Button } from '@/components/ui/Button';
import { MOCK_WINNERS, MOCK_COMPETITIONS } from '@/lib/mock-data';
import { Trophy, Award, Sparkles, Star, ChevronRight, Crown } from 'lucide-react';

export default function WinnersHallOfFamePage() {
  const publishedCompetitions = MOCK_COMPETITIONS.filter(
    (c) => c.status === 'results_published'
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden border-b border-white/[0.08] bg-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300 shadow-xl backdrop-blur-xl">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Official Hall of Fame</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white">
            Winner Showcase & <br />
            <span className="text-gradient-gold">Master Laureates</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Honoring the pinnacle of artistic vision and technical mastery. Explore certified 1st, 2nd, and 3rd place laureates scored by our international jury panels.
          </p>
        </div>
      </section>

      {/* Main Winner Showcase Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Featured Laureates Podium Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Latest Results · Nature Through Your Lens 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Championship Podiums
              </h2>
            </div>
            <Link href="/competitions/comp-nature-lens-2026">
              <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Contest Archive
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_WINNERS.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>
        </div>

        {/* Hall of Fame Legacy Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-8 backdrop-blur-xl shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              Pixel-Prize Archive
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Permanent Hall of Fame
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every gold medalist is immortalized in our annual print anthology and showcased in our worldwide traveling gallery exhibitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-6 rounded-2xl bg-black border border-white/[0.08] space-y-2">
              <p className="text-3xl font-extrabold font-mono text-amber-400">$145,000+</p>
              <p className="text-xs text-zinc-300 font-semibold">Total Prize Capital Awarded</p>
            </div>
            <div className="p-6 rounded-2xl bg-black border border-white/[0.08] space-y-2">
              <p className="text-3xl font-extrabold font-mono text-primary-300">42 Laureates</p>
              <p className="text-xs text-zinc-300 font-semibold">Gold, Silver & Bronze Winners</p>
            </div>
            <div className="p-6 rounded-2xl bg-black border border-white/[0.08] space-y-2">
              <p className="text-3xl font-extrabold font-mono text-emerald-400">100% Verified</p>
              <p className="text-xs text-zinc-300 font-semibold">EXIF & Originality Authenticated</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
