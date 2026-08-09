'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Camera,
  Menu,
  X,
  Trophy,
  Compass,
  BookOpen,
  Image as ImageIcon,
  User,
  Shield,
  Gavel,
  Bell,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { CURRENT_USER } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsRoleMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-transparent border-b border-white/5 py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Pixel<span className="text-primary-400">Prize</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-widest">
                Multi-Tenant
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono -mt-1 hidden sm:inline-block">
              AI + Jury Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Role Switcher */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Portal Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span>Switch Portal</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Demo Workspace
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Photographer</p>
                    <p className="text-[10px] text-slate-400">Upload & track entries</p>
                  </div>
                </Link>
                <Link
                  href="/judge"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Gavel className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-semibold">Judge Portal</p>
                    <p className="text-[10px] text-slate-400">Score shortlisted photos</p>
                  </div>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Shield className="w-4 h-4 text-primary-400" />
                  <div>
                    <p className="font-semibold">Admin Panel</p>
                    <p className="text-[10px] text-slate-400">Manage contests & tenants</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* User Dashboard / Login buttons */}
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            aria-label="User profile"
          >
            <User className="w-4 h-4 text-primary-400" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between',
                    isActive
                      ? 'bg-primary-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
              Role Portals
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/dashboard"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center"
              >
                <User className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-xs font-medium text-slate-200">User</span>
              </Link>
              <Link
                href="/judge"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center"
              >
                <Gavel className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-xs font-medium text-slate-200">Judge</span>
              </Link>
              <Link
                href="/admin"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center"
              >
                <Shield className="w-4 h-4 text-primary-400 mb-1" />
                <span className="text-xs font-medium text-slate-200">Admin</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="primary" className="w-full justify-center">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
