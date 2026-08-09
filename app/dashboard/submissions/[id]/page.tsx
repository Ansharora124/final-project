'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  Camera,
  Calendar,
  CheckCircle2,
  Trophy,
  ArrowLeft,
  Star,
  Shield,
  Layers,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { SubmissionStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function SubmissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const submission = MOCK_SUBMISSIONS.find((s) => s.id === id);

  if (!submission) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold">Submission Not Found</h2>
        <Link href="/dashboard/submissions">
          <Button variant="primary">Back to Submissions</Button>
        </Link>
      </div>
    );
  }

  const review = submission.judgeReviews[0];

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      {/* Header & Back Link */}
      <div className="space-y-3">
        <Link
          href="/dashboard/submissions"
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Submissions</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              {submission.competitionTitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              {submission.title}
            </h1>
          </div>
          <SubmissionStatusBadge status={submission.status} />
        </div>
      </div>

      {/* Main Photo Card */}
      <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-3 sm:p-4 space-y-4">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={submission.imageUrl}
            alt={submission.title}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs text-slate-300 px-2 leading-relaxed italic">
          &ldquo;{submission.description}&rdquo;
        </p>
      </div>

      {/* 2 Column Details: AI Evaluation vs Master Jury Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: AI Vision Engine Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h3 className="text-base font-bold text-white">AI Vision Evaluation</h3>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-primary-400">
                {submission.aiEvaluation.overallScore}
              </span>
              <span className="text-xs text-slate-500 font-mono"> / 100</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Compositional Balance', score: submission.aiEvaluation.breakdown.composition },
              { label: 'Technical Sharpness', score: submission.aiEvaluation.breakdown.sharpness },
              { label: 'Dynamic Range & Exposure', score: submission.aiEvaluation.breakdown.technicalQuality },
              { label: 'Color Harmony & Tones', score: submission.aiEvaluation.breakdown.colorHarmony },
              { label: 'Originality & Storytelling', score: submission.aiEvaluation.breakdown.creativityEstimate },
            ].map((dim) => (
              <div key={dim.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{dim.label}</span>
                  <span className="font-mono font-bold text-primary-400">{dim.score} pts</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {submission.aiEvaluation.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Master Juror Written Review & Scores */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Official Jury Review</h3>
            </div>
            {submission.finalJudgeScore ? (
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-amber-400">
                  {submission.finalJudgeScore}
                </span>
                <span className="text-xs text-slate-500 font-mono"> / 100</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-400">In Jury Queue</span>
            )}
          </div>

          {review ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={review.judgeAvatar}
                  alt={review.judgeName}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{review.judgeName}</h4>
                  <p className="text-[10px] text-amber-400">{review.judgeTitle}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Juror Written Critique
                </p>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{review.comments}&rdquo;
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {review.criterionScores.map((c) => (
                  <div key={c.criterionId} className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">{c.criterionName}</span>
                    <span className="font-mono font-bold text-amber-400">
                      {c.score} / {c.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 text-xs text-slate-400">
              <Star className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-medium text-slate-300">Jury Scoring Underway</p>
              <p>Scores will be published immediately after the jury review window concludes.</p>
            </div>
          )}
        </div>
      </div>

      {/* EXIF Metadata Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary-400" />
          <span>Camera & EXIF Metadata</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase">Camera Model</p>
            <p className="font-semibold text-slate-200 mt-0.5 truncate">{submission.exif.camera}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase">Lens Model</p>
            <p className="font-semibold text-slate-200 mt-0.5 truncate">{submission.exif.lens}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase">Aperture / Shutter</p>
            <p className="font-mono font-semibold text-slate-200 mt-0.5">
              {submission.exif.aperture} · {submission.exif.shutterSpeed}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase">ISO / Location</p>
            <p className="font-semibold text-slate-200 mt-0.5 truncate">
              ISO {submission.exif.iso} · {submission.exif.location || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
