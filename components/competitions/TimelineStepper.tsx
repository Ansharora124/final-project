import React from 'react';
import { CheckCircle2, Clock, Calendar, Sparkles, Award } from 'lucide-react';
import { CompetitionTimeline } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TimelineStepperProps {
  timeline: CompetitionTimeline;
}

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ timeline }) => {
  const steps = [
    {
      title: 'Registration & Submissions Open',
      date: timeline.registrationOpen,
      icon: Calendar,
      description: 'Call for entries open worldwide across all eligible categories.',
    },
    {
      title: 'Submission Deadline',
      date: timeline.submissionDeadline,
      icon: Clock,
      description: 'Last call for photograph uploads and EXIF verification.',
    },
    {
      title: 'AI Preliminary Evaluation',
      date: timeline.aiEvaluationComplete,
      icon: Sparkles,
      description: 'Vision engine evaluates composition, sharpness, and generates shortlist.',
    },
    {
      title: 'Expert Juror Scoring',
      date: timeline.judgingDeadline,
      icon: CheckCircle2,
      description: 'Distinguished jury panel scores shortlisted entries on 5 weighted dimensions.',
    },
    {
      title: 'Official Winners Announced',
      date: timeline.resultsAnnouncement,
      icon: Award,
      description: 'Gold, Silver, Bronze podium laureates published to the Hall of Fame.',
    },
  ];

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isPast = new Date(step.date).getTime() < new Date().getTime();

        return (
          <div key={idx} className="relative group">
            {/* Step Node */}
            <div
              className={cn(
                'absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-xs transition-all shadow-md',
                isPast
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:border-primary-400 group-hover:text-primary-400'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>

            {/* Step Body */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                  {step.title}
                </h4>
                <span className="font-mono text-xs text-primary-400 font-semibold">
                  {formatDate(step.date)}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
