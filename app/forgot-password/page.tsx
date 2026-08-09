'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      showToast('Reset Instructions Sent', `We sent password reset instructions to ${email}`, 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-primary-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-28 pb-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white mx-auto shadow-lg backdrop-blur-xl">
              <Camera className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Reset Password
            </h1>
            <p className="text-xs text-zinc-400">
              Enter your account email to receive a recovery link.
            </p>
          </div>

          {isSent ? (
            <div className="p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] text-center space-y-4 animate-in zoom-in-95 shadow-2xl backdrop-blur-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
              <p className="text-xs text-zinc-300">
                We sent a secure password reset link to <span className="font-semibold text-white">{email}</span>.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] space-y-4 shadow-2xl backdrop-blur-xl">
              <Input
                label="Registered Email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm font-bold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>

              <div className="pt-4 border-t border-white/[0.06] text-center">
                <Link href="/login" className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
