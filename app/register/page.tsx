'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Sparkles, User, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Password Mismatch', 'Your passwords do not match. Please verify.', 'error');
      return;
    }
    if (!agreed) {
      showToast('Terms Agreement', 'Please agree to the platform terms and original photography pledge.', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast('Account Created! 🎉', 'Welcome to Pixel-Prize. Start exploring active contests.', 'success');
      router.push('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/25">
              <Camera className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Join Pixel-Prize
            </h1>
            <p className="text-xs text-slate-400">
              Submit your work, get AI preliminary feedback, and compete for international awards.
            </p>
          </div>

          <form onSubmit={handleRegister} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <Input
              label="Full Name"
              placeholder="e.g. Alex Rivera"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Select
              label="Initial Account Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'user', label: 'Photographer / Entrant (Default)' },
                { value: 'judge', label: 'Juror / Expert Reviewer (Requires verification)' },
              ]}
              helperText="Photographers can enter competitions and build their showcase portfolio."
            />

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-primary-600 focus:ring-primary-500"
                />
                <span>
                  I agree to the <Link href="/about" className="text-primary-400 underline">Terms of Service</Link>, and certify that all photographs I submit are my own authentic copyrighted creations.
                </span>
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
              Create Account
            </Button>

            <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
