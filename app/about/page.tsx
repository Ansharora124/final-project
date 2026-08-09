import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MOCK_TENANTS } from '@/lib/mock-data';
import { Camera, Shield, Sparkles, Trophy, Globe, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 w-full space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-primary-300 backdrop-blur-xl">
            <Camera className="w-3.5 h-3.5 text-primary-300" />
            <span>Empowering Global Visual Storytellers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white">
            About <span className="text-gradient">Pixel-Prize</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Pixel-Prize is a next-generation multi-tenant platform built for photography societies, magazines, and conservation foundations to host world-class competitive photographic awards.
          </p>
        </div>

        {/* Multi-Tenant Concept Architecture */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-8 backdrop-blur-xl shadow-2xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider font-mono">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The Multi-Tenant Photography Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Different organizations operate their own independent competitions with customized criteria, prize structures, and branded galleries, all powered by Pixel-Prize&apos;s unified vision scoring engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_TENANTS.map((tenant) => (
              <div
                key={tenant.id}
                className="p-6 rounded-2xl bg-black border border-white/[0.08] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tenant.logo}
                    alt={tenant.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/15"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{tenant.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{tenant.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono">{tenant.competitionCount} Competitions</span>
                  <span className="text-emerald-400 font-semibold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-primary-300 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Preliminary Shortlisting</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Objective pixel analysis of sharpness, focus accuracy, exposure dynamic range, and compositional balance to filter out corrupt or low-grade submissions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-amber-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Blind Master Jury</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              World-class jurors score shortlisted entries on five weighted artistic dimensions without seeing the photographer&apos;s identity to ensure 100% merit-based outcomes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Guaranteed Cash Prizes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Transparent prize escrow, international currency disbursements, published score rubrics, and permanent archival induction into the Hall of Fame.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#09090b] border border-primary-500/30 text-center space-y-6 max-w-3xl mx-auto shadow-2xl shadow-primary-500/5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Showcase Your Vision?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            Join 12,000+ passionate photographers from over 85 countries competing in active Pixel-Prize awards.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Free Account
              </Button>
            </Link>
            <Link href="/competitions">
              <Button variant="outline" size="lg">
                Browse Open Contests
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
