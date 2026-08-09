'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Camera,
  Menu,
  X,
  User,
  Shield,
  Gavel,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';

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

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsRoleMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className="fixed top-4 left-1/2 z-50 w-[94%] max-w-6xl -translate-x-1/2 transition-all duration-300 ease-out"
      aria-label="Main Navigation"
    >
      <div
        className={cn(
          `flex items-center justify-between
          rounded-[2rem]
          border border-white/20
          px-5 py-2 sm:px-6 sm:py-2.5
          shadow-[0_8px_32px_rgba(0,0,0,0.35),0_1px_2px_rgba(255,255,255,0.08)]
          backdrop-blur-2xl
          backdrop-saturate-150
          transition-all duration-300 ease-out`,
          isScrolled
            ? 'bg-black/75 border-white/25 shadow-[0_12px_45px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25)]'
            : 'bg-white/[0.09] border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
        )}
      >
        {/* Brand Logo with Liquid Bubble Shutter */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform duration-300 ease-out hover:scale-105"
        >
          <div className="relative w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl transition-all duration-300 ease-out group-hover:bg-white/20 group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.25),inset_0_1px_0_rgba(255,255,255,0.45)]">
            <Camera className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-white font-display transition-colors duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              Pixel<span className="text-primary-300 font-normal">Prize</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-amber-300 border border-white/20 uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              Multi-Tenant
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Liquid Bubble Hover Effects */}
        <div className="hidden items-center gap-1.5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-out group rounded-full flex items-center justify-center hover:scale-105 active:scale-[0.98]',
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-white/75 hover:text-white'
                )}
              >
                {/* Expanding Liquid Glass Bubble Background */}
                <span
                  className={cn(
                    'absolute inset-0 rounded-full transition-all duration-300 ease-out pointer-events-none',
                    isActive
                      ? 'bg-gradient-to-b from-white/25 to-white/10 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_20px_rgba(255,255,255,0.15)] opacity-100 scale-100'
                      : 'bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_rgba(255,255,255,0.06)] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                  )}
                />

                {/* Text Label with Soft Inner Radiance */}
                <span
                  className={cn(
                    'relative z-10 transition-all duration-300 ease-out',
                    isActive
                      ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                      : 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]'
                  )}
                >
                  {link.label}
                </span>

                {/* Subtle active indicator reflection */}
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-0.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Portal Switcher & Sign In with Light Sweep */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Quick Portal Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className={cn(
                'group relative flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all duration-300 ease-out hover:scale-105 hover:bg-white/20 hover:border-white/35 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_16px_rgba(255,255,255,0.12)]',
                isRoleMenuOpen && 'bg-white/20 border-white/40 text-white'
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-300 transition-transform duration-300 group-hover:rotate-12" />
              <span>Portals</span>
              <ChevronDown
                className={cn(
                  'w-3 h-3 text-white/70 transition-transform duration-300',
                  isRoleMenuOpen && 'rotate-180 text-white'
                )}
              />
            </button>

            {/* Portal Switcher Glass Menu */}
            {isRoleMenuOpen && (
              <div
                className="absolute right-0 mt-2.5 w-60 rounded-3xl border border-white/20 bg-black/85 p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
                onClick={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-white/50 uppercase tracking-wider border-b border-white/10">
                  Switch Demo Workspace
                </div>
                <div className="space-y-1 pt-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs text-white/90 hover:bg-white/15 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 group"
                  >
                    <User className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-white">Photographer</p>
                      <p className="text-[10px] text-white/60">Upload & track entries</p>
                    </div>
                  </Link>
                  <Link
                    href="/judge"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs text-white/90 hover:bg-white/15 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 group"
                  >
                    <Gavel className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-white">Judge Portal</p>
                      <p className="text-[10px] text-white/60">Score shortlisted photos</p>
                    </div>
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs text-white/90 hover:bg-white/15 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 group"
                  >
                    <Shield className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-white">Admin Panel</p>
                      <p className="text-[10px] text-white/60">Manage contests & tenants</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sign In CTA Button with Liquid Glass Reflection */}
          <Link href="/login">
            <button
              className="
                group
                relative
                overflow-hidden
                rounded-full
                border border-white/20
                bg-white/15
                px-5 py-2
                text-sm font-medium
                text-white
                shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.2)]
                backdrop-blur-xl
                transition-all duration-300 ease-out
                hover:scale-105
                hover:bg-white/25
                hover:border-white/40
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_24px_rgba(255,255,255,0.2)]
                active:scale-95
              "
            >
              {/* Light Reflection Sweeping Highlight */}
              <span
                className="
                  absolute inset-0
                  -translate-x-full
                  bg-gradient-to-r from-transparent via-white/30 to-transparent
                  transition-transform duration-700 ease-in-out
                  group-hover:translate-x-full
                  pointer-events-none
                "
              />
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                Sign In
              </span>
            </button>
          </Link>
        </div>

        {/* Mobile Toggle Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/dashboard"
            className="p-2 rounded-full bg-white/15 border border-white/20 text-white hover:bg-white/25 transition-colors"
            aria-label="User profile"
          >
            <User className="w-4 h-4 text-primary-300" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-white/15 border border-white/20 text-white hover:bg-white/25 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Liquid Glass Styling */}
      {isMobileMenuOpen && (
        <div className="mt-2 rounded-3xl border border-white/20 bg-black/85 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] p-4 space-y-3 animate-in slide-in-from-top-2 duration-200 md:hidden">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-sm font-medium flex items-center justify-between transition-all duration-200',
                    isActive
                      ? 'bg-white/20 text-white font-semibold border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2">
              Role Portals
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/dashboard"
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 border border-white/15 text-center hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[11px] font-medium text-white">User</span>
              </Link>
              <Link
                href="/judge"
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 border border-white/15 text-center hover:bg-white/20 transition-colors"
              >
                <Gavel className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-[11px] font-medium text-white">Judge</span>
              </Link>
              <Link
                href="/admin"
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 border border-white/15 text-center hover:bg-white/20 transition-colors"
              >
                <Shield className="w-4 h-4 text-primary-400 mb-1" />
                <span className="text-[11px] font-medium text-white">Admin</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" className="w-full">
              <button className="w-full rounded-full border border-white/20 bg-white/15 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-white/25 transition-all">
                Sign In
              </button>
            </Link>
            <Link href="/register" className="w-full">
              <button className="w-full rounded-full bg-primary-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500 transition-all">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
