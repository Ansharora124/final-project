'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Star, Flag, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';
import { MOCK_GALLERY_PHOTOS } from '@/lib/mock-data';
import { Photo } from '@/lib/types';

export default function AdminGalleryModerationPage() {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>(MOCK_GALLERY_PHOTOS);

  const toggleFeature = (id: string) => {
    showToast('Showcase Updated', 'Photograph featured status toggled.', 'success');
  };

  const handleRemove = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Photo Removed', 'Photograph unlisted from public gallery.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Gallery Moderation & Curation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Curate homepage hero visuals, review flagged photographs, and moderate showcase tags.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
              <p className="text-xs text-slate-400">{p.photographerName} · {p.category}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-primary-400 font-bold">{p.likes} Likes</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleFeature(p.id)}>
                  Feature
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleRemove(p.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
