'use client';

import React, { useState } from 'react';
import { Sliders, Sparkles, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminContentManagementPage() {
  const { showToast } = useToast();

  const [heroHeadline, setHeroHeadline] = useState('Capture. Compete. Create History.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'The premier platform where global photographic societies host prestigious contests. Powered by deep vision AI preliminary evaluation and verified master juror panels.'
  );
  const [announcement, setAnnouncement] = useState('🚨 Nature Through Your Lens 2026 laureates officially published in the Hall of Fame!');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Homepage Content Published', 'Changes are now active on the public storefront.', 'success');
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Homepage & Content Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Customize featured hero banners, announcements, and featured curator spotlights.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span>Hero Headline & Tagline</span>
          </h3>

          <Input
            label="Hero Main Headline"
            value={heroHeadline}
            onChange={(e) => setHeroHeadline(e.target.value)}
          />

          <Textarea
            label="Hero Supporting Paragraph"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={3}
          />
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Top Announcement Ticker</span>
          </h3>

          <Input
            label="Announcement Message"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving} rightIcon={<Save className="w-4 h-4" />}>
            Publish Content Updates
          </Button>
        </div>
      </form>
    </div>
  );
}
