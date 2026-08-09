'use client';

import React from 'react';
import { Trophy, Star, Sparkles, MapPin, Camera } from 'lucide-react';
import { WinnerRecord } from '@/lib/types';
import { getRankBadge } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface WinnerCardProps {
  winner: WinnerRecord;
  onSelectPhoto?: (photoUrl: string) => void;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({ winner, onSelectPhoto }) => {
  const badge = getRankBadge(winner.rank);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#09090b]/95 border border-white/[0.08] hover:border-amber-400/50 transition-all duration-300 group hover:shadow-[0_12px_45px_rgba(245,158,11,0.15)] flex flex-col justify-between backdrop-blur-xl">
      <div>
        {/* Photo Container */}
        <div className="relative h-72 w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={winner.photoUrl}
            alt={winner.photoTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent" />

          {/* Rank Badge Indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xl backdrop-blur-md flex items-center gap-1.5 ${badge.bg}`}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Prize Amount Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold backdrop-blur-md shadow-lg">
            {winner.prizeAmount}
          </div>

          {/* Photo Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              {winner.competitionTitle}
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5 line-clamp-1">
              {winner.photoTitle}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Artist Profile & Score */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={winner.photographerAvatar}
                alt={winner.photographerName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-amber-400/40"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{winner.photographerName}</h4>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  {winner.photographerLocation}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400 justify-end">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-base font-bold font-mono text-white">{winner.finalScore}</span>
                <span className="text-xs text-zinc-500 font-mono">/100</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Jury Score</span>
            </div>
          </div>

          {/* Artist Quote */}
          {winner.quote && (
            <p className="text-xs text-zinc-300 italic leading-relaxed border-l-2 border-amber-400/50 pl-3">
              &ldquo;{winner.quote}&rdquo;
            </p>
          )}

          {/* EXIF Mini Bar */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono pt-1">
            <Camera className="w-3.5 h-3.5 text-primary-300 shrink-0" />
            <span className="truncate">{winner.exif.camera} · {winner.exif.focalLength} · {winner.exif.aperture}</span>
          </div>
        </div>
      </div>

      {/* Card Action */}
      <div className="p-6 pt-0">
        <a href={`/competitions/${winner.competitionId}`}>
          <Button variant="outline" size="sm" className="w-full justify-center text-xs">
            View Competition Archive
          </Button>
        </a>
      </div>
    </div>
  );
};
