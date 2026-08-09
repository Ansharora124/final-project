'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Send, Sparkles, Heart, Shield, Globe, Award } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';
import { Button } from '@/components/ui/Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed Successfully! 🎉', 'You will receive monthly curated photo contest briefs and judge insights.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-black border-t border-white/[0.08] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-lg backdrop-blur-xl">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Pixel<span className="text-primary-300">Prize</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              The world&apos;s leading multi-tenant photography competition platform. Empowering global photographic societies to host prestigious awards powered by AI preliminary evaluation and verified master juror panels.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09090b] border border-white/[0.08] text-xs text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXIF Verified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09090b] border border-white/[0.08] text-xs text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-primary-300" />
                <span>AI Vision Engine</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/competitions" className="hover:text-white transition-colors">
                  All Competitions
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Master Gallery
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Hall of Fame</span>
                  <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[10px] rounded">New</span>
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Photography Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About & Tenants
                </Link>
              </li>
            </ul>
          </div>

          {/* Workspaces & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors text-emerald-400/90 font-medium">
                  Photographer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/judge" className="hover:text-white transition-colors text-amber-400/90 font-medium">
                  Judge Scoring Suite
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-primary-300/90 font-medium">
                  Admin Control Panel
                </Link>
              </li>
              <li>
                <Link href="/competitions/comp-wildlife-2026/submit" className="hover:text-white transition-colors">
                  Submit an Entry
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Curator Brief
            </h4>
            <p className="text-xs text-zinc-400">
              Receive notifications for upcoming competition deadlines and jury analyses.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="photographer@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="w-full justify-center text-xs" rightIcon={<Send className="w-3 h-3" />}>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Pixel-Prize Platform Inc. All photographic copyrights remain with respective artists.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Contest Rules
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Tenant Licensing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
