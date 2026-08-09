'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  UploadCloud,
  Users,
  Gavel,
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Sliders,
  Settings,
  Shield,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Competitions', href: '/admin/competitions', icon: Trophy },
  { label: 'Submissions', href: '/admin/submissions', icon: UploadCloud },
  { label: 'Judges Panel', href: '/admin/judges', icon: Gavel },
  { label: 'Photographers', href: '/admin/users', icon: Users },
  { label: 'Homepage Content', href: '/admin/content', icon: Sliders },
  { label: 'Articles CMS', href: '/admin/articles', icon: FileText },
  { label: 'Gallery Moderation', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Results & Awards', href: '/admin/results', icon: CheckSquare },
  { label: 'Tenant & Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-black border-b border-white/[0.08]">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-300 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">Admin Control Suite</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-[#09090b] border border-white/[0.08] text-zinc-300 hover:text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-lg backdrop-blur-xl">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-base font-display">
                  Pixel<span className="text-primary-300">Prize</span>
                </span>
                <span className="block text-[10px] text-primary-300 font-mono">
                  Multi-Tenant Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Create Action */}
          <div className="px-4 pt-4 pb-2">
            <Link
              href="/admin/competitions/create"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Competition</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="p-4 flex-1 space-y-0.5 overflow-y-auto">
            <p className="px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Administration
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-primary-500/15 text-primary-300 font-semibold border border-primary-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-[#09090b]'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-primary-300' : 'text-zinc-400 group-hover:text-zinc-200'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Tenant Status Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#050505]">
            <div className="p-2.5 rounded-2xl bg-[#09090b] border border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-white">Active Tenant</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Pixel-Prize Global
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-black border border-white/[0.08] text-zinc-400 font-mono">
                SuperAdmin
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
