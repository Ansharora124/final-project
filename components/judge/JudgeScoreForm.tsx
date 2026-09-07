'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  EyeOff,
  Eye,
  CheckCircle2,
  Send,
  Award,
  Info,
  HelpCircle,
  Camera,
} from 'lucide-react';
import { Submission, ScoreCriterion } from '@/lib/types';
import { Slider } from '@/components/ui/Slider';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

interface JudgeScoreFormProps {
  submission: Submission;
  criteria: ScoreCriterion[];
  onScoreSubmitted?: (finalScore: number, feedback: string) => void;
}

export const JudgeScoreForm: React.FC<JudgeScoreFormProps> = ({
  submission,
  criteria,
  onScoreSubmitted,
}) => {
  const { showToast } = useToast();
  const router = useRouter();

  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [isBlindJudging, setIsBlindJudging] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScoreChange = (criterionId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: value,
    }));
  };

  // Calculate live total
  const totalScore = criteria.reduce((sum, criterion) => sum + (scores[criterion.id] ?? 0), 0);
  const allScored = criteria.every(criterion => scores[criterion.id] !== undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allScored || !comments.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast(
        'Score Submitted Successfully! 🏆',
        `Official jury evaluation of ${totalScore}/100 recorded for "${submission.title}".`,
        'success'
      );
      onScoreSubmitted?.(totalScore, comments);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Blind Judging & AI Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blind Judging Toggle */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              {isBlindJudging ? (
                <EyeOff className="w-4 h-4 text-amber-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
              <span>Blind Judging Mode</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isBlindJudging
                ? 'Photographer identity hidden to prevent unconscious bias.'
                : 'Photographer identity revealed.'}
            </p>
          </div>

          <button
            onClick={() => setIsBlindJudging(!isBlindJudging)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            {isBlindJudging ? 'Reveal Artist' : 'Hide Artist'}
          </button>
        </div>

        {/* AI Benchmark Score Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-primary-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-300">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>AI Evaluation Benchmark</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Vision Engine Score · Shortlist Rank #{submission.aiEvaluation.rank}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-mono font-extrabold text-primary-400">
              {submission.aiEvaluation.overallScore}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / 100</span>
          </div>
        </div>
      </div>

      {/* Photographer Info (when not blind) */}
      {!isBlindJudging && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 animate-in fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={submission.photographerAvatar}
            alt={submission.photographerName}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{submission.photographerName}</h4>
            <p className="text-xs text-slate-400">{submission.photographerLocation || 'Global Entrant'}</p>
          </div>
        </div>
      )}

      {/* Scoring Sliders */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Scoring Rubric Dimensions</h3>
              <p className="text-xs text-slate-400">
                Adjust each criterion slider according to competition guidelines.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Your Score</p>
              <p className="text-xl font-bold font-mono text-amber-400">{totalScore} / 100</p>
            </div>
          </div>

          <div className="space-y-6">
            {criteria.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <Slider
                  label={item.name}
                  weightLabel={`${item.weight}% weight`}
                  value={scores[item.id] ?? 0}
                  max={item.maxScore}
                  min={0}
                  onChange={(val) => handleScoreChange(item.id, val)}
                  disabled={isSubmitted}
                />
                <p className="text-xs text-slate-400 mt-2">{item.description}</p>
                {scores[item.id] === undefined && <button type="button" className="text-xs text-amber-300 mt-2" onClick={() => handleScoreChange(item.id, 0)}>Not yet scored — confirm 0 or adjust the slider</button>}
              </div>
            ))}
          </div>

          {/* Qualitative Written Review */}
          <div className="pt-2">
            <Textarea
              label="Juror Written Feedback & Critical Notes"
              placeholder="Provide constructive feedback on lighting, tonal fidelity, narrative emotion, or technical execution..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              disabled={isSubmitted}
              helperText="This review will be published to the photographer dashboard upon results finalization."
            />
          </div>
        </div>

        {/* Action Button */}
        {isSubmitted ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-emerald-300">Score Successfully Submitted</p>
                <p className="text-xs text-slate-400">Total Score: {totalScore} pts recorded.</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/judge/review')}
            >
              Next Entry in Queue
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => router.push('/judge/review')}
            >
              Skip to Next
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              disabled={!allScored || !comments.trim()}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Submit Official Review ({totalScore} pts)
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
