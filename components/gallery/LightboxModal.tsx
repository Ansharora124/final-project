'use client';

import React, { useState } from 'react';
import {
  X,
  Heart,
  Eye,
  Share2,
  Camera,
  MapPin,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Photo, Submission } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

interface LightboxModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ photo, onClose }) => {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  if (!photo) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied!', 'Photo link copied to clipboard.', 'success');
  };

  return (
    <Modal
      isOpen={!!photo}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      className="bg-slate-950 border-slate-800 max-h-[95vh] p-0"
    >
      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Main Photograph Display Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center p-4 sm:p-8 min-h-[350px] lg:min-h-[600px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
          />

          {/* Top Close & Share Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            {photo.award && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-xl flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{photo.award}</span>
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Share photo"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Information Panel */}
        <div className="w-full lg:w-96 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-5">
            {/* Header / Title */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                {photo.competitionTitle}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{photo.title}</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{photo.description}</p>
            </div>

            {/* Photographer Card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.photographerAvatar}
                alt={photo.photographerName}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary-500/30"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{photo.photographerName}</h4>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {photo.exif.location || 'Verified Artist'}
                </span>
              </div>
            </div>

            {/* Camera EXIF Metadata */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-primary-400" />
                <span>Camera & Shot EXIF</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Camera Body</p>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">{photo.exif.camera}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Focal Lens</p>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">{photo.exif.focalLength}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Aperture</p>
                  <p className="font-mono font-semibold text-slate-200 mt-0.5">{photo.exif.aperture}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Shutter / ISO</p>
                  <p className="font-mono font-semibold text-slate-200 mt-0.5">
                    {photo.exif.shutterSpeed} · ISO {photo.exif.iso}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{photo.views.toLocaleString()} Total Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{photo.likes + (isLiked ? 1 : 0)} Appreciations</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isLiked ? 'danger' : 'outline'}
                size="sm"
                className="w-full justify-center"
                leftIcon={<Heart className="w-4 h-4" />}
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? 'Liked' : 'Like Photo'}
              </Button>
              <a href={`/competitions/${photo.competitionId}`}>
                <Button variant="primary" size="sm" className="w-full justify-center" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Contest Page
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
