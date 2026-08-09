'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gavel,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  LogOut,
  Camera,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_JUDGES } from '@/lib/mock-data';

const judge = MOCK_JUDGES[0]; // Elena Rostova

const NAV_ITEMS = [
  { label: 'Overview', href: '/judge', icon: Layers },
  { label: 'Assigned Competitions', href: '/judge/competitions', icon: Award },
  { label: 'Review Queue', href: '/judge/review', icon: Clock, badge: '6' },
  { label: 'Completed Reviews', href: '/judge/completed', icon: CheckCircle2 },
];

export const JudgeSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <Link href="/judge" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Gavel className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">Judge Scoring Portal</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-900">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-bold">
                <Gavel className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-base font-display">
                  Pixel<span className="text-amber-400">Prize</span>
                </span>
                <span className="block text-[10px] text-amber-400 font-mono">
                  Master Juror Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="p-4 flex-1 space-y-1 overflow-y-auto">
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Jury Actions
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/judge'
                  ? pathname === '/judge'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-900">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Platform
              </p>
              <Link
                href="/winners"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span>Hall of Fame</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Judge Profile Card */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/60">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={judge.avatar}
                alt={judge.name}
                className="w-9 h-9 rounded-lg object-cover ring-1 ring-amber-500/40"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{judge.name}</p>
                <p className="text-[10px] text-amber-400 truncate">Senior Juror</p>
              </div>
              <Link
                href="/login"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
