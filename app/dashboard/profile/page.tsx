'use client';

import React, { useState } from 'react';
import { Camera, MapPin, Globe, Instagram, Trophy, Award, Sparkles, CheckCircle2, Edit3, Save } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { useToast } from '@/components/ui/ToastContext';
import { CURRENT_USER, MOCK_GALLERY_PHOTOS } from '@/lib/mock-data';

export default function PhotographerProfilePage() {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(CURRENT_USER.name);
  const [bio, setBio] = useState(CURRENT_USER.bio || '');
  const [location, setLocation] = useState(CURRENT_USER.location || '');
  const [cameraBody, setCameraBody] = useState(CURRENT_USER.cameraGear?.body || '');
  const [lens, setLens] = useState(CURRENT_USER.cameraGear?.favoriteLens || '');
  const [portfolio, setPortfolio] = useState(CURRENT_USER.portfolioUrl || '');
  const [instagram, setInstagram] = useState(CURRENT_USER.instagram || '');

  const userPhotos = MOCK_GALLERY_PHOTOS.filter(
    (p) => p.photographerName === CURRENT_USER.name
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('Profile Updated', 'Your photographer profile and gear changes have been saved.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Artist
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location}</span>
              </p>
              <p className="text-xs text-slate-400">
                Joined Pixel-Prize {CURRENT_USER.joinedDate}
              </p>
            </div>
          </div>

          <Button
            variant={isEditing ? 'ghost' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <p className="text-xl font-bold font-mono text-white">{CURRENT_USER.stats.competitionsEntered}</p>
            <p className="text-[10px] uppercase text-slate-400">Contests Entered</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <p className="text-xl font-bold font-mono text-primary-400">{CURRENT_USER.stats.shortlistsCount}</p>
            <p className="text-[10px] uppercase text-slate-400">AI Shortlists</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <p className="text-xl font-bold font-mono text-amber-400">{CURRENT_USER.stats.winsCount}</p>
            <p className="text-[10px] uppercase text-slate-400">Podium Wins</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <p className="text-xl font-bold font-mono text-emerald-400">96.0</p>
            <p className="text-[10px] uppercase text-slate-400">Highest Jury Score</p>
          </div>
        </div>
      </div>

      {/* Edit Form or Static Details */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white">Edit Profile & Camera Gear</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <div className="sm:col-span-2">
              <Textarea label="Artist Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </div>
            <Input label="Camera Body" value={cameraBody} onChange={(e) => setCameraBody(e.target.value)} />
            <Input label="Favorite Lens" value={lens} onChange={(e) => setLens(e.target.value)} />
            <Input label="Portfolio Website" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
            <Input label="Instagram Handle" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bio & Socials */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Artist Bio</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{bio}</p>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-primary-400" />
                <a href={portfolio} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline">
                  {portfolio}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Instagram className="w-4 h-4 text-rose-400" />
                <span>{instagram}</span>
              </div>
            </div>
          </div>

          {/* Camera Gear */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Camera Gear Setup</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Primary Body</p>
                <p className="font-semibold text-slate-200 mt-0.5">{cameraBody}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Primary Telephoto / Prime Lens</p>
                <p className="font-semibold text-slate-200 mt-0.5">{lens}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Photographs Showcase */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white">Photographs in Competition</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPhotos.map((p) => (
            <PhotoCard key={p.id} photo={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
