'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  UploadCloud,
  Bell,
  User,
  LogOut,
  Camera,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CURRENT_USER } from '@/lib/mock-data';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Photo Judging', href: '/judge/photos', icon: Camera },
  { label: 'My Competitions', href: '/dashboard/competitions', icon: Trophy },
  { label: 'My Submissions', href: '/dashboard/submissions', icon: UploadCloud },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '2' },
  { label: 'Profile & Gear', href: '/dashboard/profile', icon: User },
];

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-black border-b border-white/[0.08]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">Photographer Portal</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          className="p-2 rounded-xl bg-[#09090b] border border-white/[0.08] text-zinc-300 hover:text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#100e15] border-r border-white/[0.06] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-md backdrop-blur-xl">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-base font-display">
                  Pixel<span className="text-primary-300">Prize</span>
                </span>
                <span className="block text-[10px] text-emerald-400 font-mono">
                  Photographer Space
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 flex-1 space-y-1 overflow-y-auto">
            <p className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-[#d6f58c]/10 text-[#d6f58c] font-semibold border border-[#d6f58c]/20'
                      : 'text-zinc-400 hover:text-white hover:bg-[#09090b]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-[#d6f58c]' : 'text-zinc-400 group-hover:text-zinc-200'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/[0.08]">
              <p className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Quick Shortcuts
              </p>
              <Link
                href="/competitions"
                className="flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs text-zinc-400 hover:text-white hover:bg-[#09090b] transition-colors"
              >
                <span>Browse Contests</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
              <Link
                href="/gallery"
                className="flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs text-zinc-400 hover:text-white hover:bg-[#09090b] transition-colors"
              >
                <span>Explore Gallery</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>

          {/* User Profile Card Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#050505]">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#09090b] border border-white/[0.08]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-500/40"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{CURRENT_USER.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{CURRENT_USER.email}</p>
              </div>
              <Link
                href="/login"
                className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
