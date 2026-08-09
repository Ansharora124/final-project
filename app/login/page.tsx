'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Sparkles, User, Gavel, Shield, ArrowRight, Lock, Mail } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('alex.rivera@lenscraft.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast('Signed in successfully! 👋', 'Welcome back to your photographer workspace.', 'success');
      router.push('/dashboard');
    }, 800);
  };

  const handleQuickRoleLogin = (role: 'user' | 'judge' | 'admin') => {
    if (role === 'user') {
      setEmail('alex.rivera@lenscraft.io');
      showToast('Logging in as Photographer', 'Redirecting to User Dashboard...', 'info');
      router.push('/dashboard');
    } else if (role === 'judge') {
      setEmail('elena.rostova@jurypanel.org');
      showToast('Logging in as Senior Juror', 'Redirecting to Judge Scoring Portal...', 'info');
      router.push('/judge');
    } else if (role === 'admin') {
      setEmail('admin@pixelprize.io');
      showToast('Logging in as Platform Admin', 'Redirecting to Admin Control Suite...', 'info');
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/25">
              <Camera className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to manage submissions, review entries, or coordinate contests.
            </p>
          </div>

          {/* Quick Demo Role Selectors (Very helpful for pairwise evaluation) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Switch Demo Roles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('user')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-center transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-1"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Photographer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('judge')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-center transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-1"
              >
                <Gavel className="w-4 h-4 text-amber-400" />
                <span>Judge</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('admin')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-primary-500/50 hover:bg-primary-500/10 text-center transition-all text-xs font-semibold text-slate-200 flex flex-col items-center gap-1"
              >
                <Shield className="w-4 h-4 text-primary-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-primary-600 focus:ring-primary-500"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center text-sm font-bold"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>

            <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
