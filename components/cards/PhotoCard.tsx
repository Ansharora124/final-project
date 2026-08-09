'use client';

import React, { useState } from 'react';
import { Heart, Eye, Maximize2, Award } from 'lucide-react';
import { Photo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PhotoCardProps {
  photo: Photo;
  onSelect?: (photo: Photo) => void;
  className?: string;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onSelect, className }) => {
  const [likes, setLikes] = useState(photo.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div
      onClick={() => onSelect?.(photo)}
      className={cn(
        'group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 cursor-pointer transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1',
        className
      )}
    >
      {/* Photo Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
          {photo.award ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-slate-950 shadow-md backdrop-blur-md flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{photo.award}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-950/70 text-slate-300 backdrop-blur-md border border-white/10">
              {photo.category}
            </span>
          )}

          <button
            onClick={handleLike}
            className={cn(
              'p-2 rounded-full backdrop-blur-md border transition-all duration-200',
              hasLiked
                ? 'bg-rose-500/90 border-rose-400 text-white scale-110'
                : 'bg-slate-950/60 border-white/10 text-white hover:bg-slate-900/80 hover:text-rose-400'
            )}
            aria-label="Like photo"
          >
            <Heart className={cn('w-3.5 h-3.5', hasLiked && 'fill-current')} />
          </button>
        </div>

        {/* Bottom Details Overlay on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
          <p className="text-xs text-primary-300 font-medium mb-0.5">{photo.competitionTitle}</p>
          <h4 className="text-sm font-bold truncate">{photo.title}</h4>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.photographerAvatar}
                alt={photo.photographerName}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30"
              />
              <span className="truncate max-w-[120px]">{photo.photographerName}</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" />
                {likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-400" />
                {photo.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
