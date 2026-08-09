import React from 'react';
import { ScoreCriterion } from '@/lib/types';
import { Sparkles, Layers, Sliders } from 'lucide-react';

interface ScoringCriteriaBreakdownProps {
  criteria: ScoreCriterion[];
}

export const ScoringCriteriaBreakdown: React.FC<ScoringCriteriaBreakdownProps> = ({ criteria }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-bold font-mono flex items-center justify-center">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/20 text-xs font-bold font-mono">
                {item.weight}% Weight
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-600 to-indigo-400 h-full rounded-full"
                style={{ width: `${item.weight * 3.5}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Scoring Rubric: 5 Weighted Dimensions totaling 100 maximum jury points.
        </span>
        <span className="font-mono font-bold text-emerald-400">Total: 100%</span>
      </div>
    </div>
  );
};
