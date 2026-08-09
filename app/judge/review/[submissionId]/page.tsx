'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Gavel,
  Sparkles,
  ArrowLeft,
  Camera,
  Layers,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Maximize2,
} from 'lucide-react';
import { JudgeScoreForm } from '@/components/judge/JudgeScoreForm';
import { Button } from '@/components/ui/Button';
import { MOCK_SUBMISSIONS, MOCK_COMPETITIONS } from '@/lib/mock-data';
import { DEFAULT_SCORING_CRITERIA } from '@/lib/constants';

export default function JudgeScoringWorkstationPage() {
  const params = useParams();
  const submissionId = params?.submissionId as string;
  const router = useRouter();

  const submission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) || MOCK_SUBMISSIONS[0];
  const competition = MOCK_COMPETITIONS.find((c) => c.id === submission.competitionId);

  const criteria = competition?.criteria || DEFAULT_SCORING_CRITERIA;

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/judge/review"
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Review Queue</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {submission.competitionTitle}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Evaluate Entry: {submission.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Category: <strong className="text-white">{submission.category}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: High-Res Photograph & EXIF Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Inspection View */}
          <div className="p-3 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={submission.imageUrl}
                alt={submission.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-2 space-y-2">
              <h3 className="text-base font-bold text-white">{submission.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{submission.description}&rdquo;
              </p>
            </div>
          </div>

          {/* EXIF Data Panel */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary-400" />
              <span>Verified Capture Parameters</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Camera</p>
                <p className="font-semibold text-slate-200 mt-0.5 truncate">{submission.exif.camera}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Lens</p>
                <p className="font-semibold text-slate-200 mt-0.5 truncate">{submission.exif.lens}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Aperture</p>
                <p className="font-mono font-semibold text-slate-200 mt-0.5">{submission.exif.aperture}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase">Shutter / ISO</p>
                <p className="font-mono font-semibold text-slate-200 mt-0.5">
                  {submission.exif.shutterSpeed} · ISO {submission.exif.iso}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Scoring Sliders & Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <JudgeScoreForm
              submission={submission}
              criteria={criteria}
              onScoreSubmitted={(score) => {
                // success feedback handled in component
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
