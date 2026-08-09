'use client';

import React from 'react';
import { MOCK_ADMIN_STATS } from '@/lib/mock-data';
import { Sparkles, TrendingUp, Layers, PieChart } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const maxGrowth = Math.max(...MOCK_ADMIN_STATS.submissionGrowth.map((g) => g.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Submission Growth Chart */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              <span>Platform Submissions Velocity</span>
            </h3>
            <p className="text-xs text-slate-400">Monthly total photographic entries submitted worldwide</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary-500/10 text-primary-300 border border-primary-500/20">
            +38.4% YoY
          </span>
        </div>

        {/* CSS/SVG Bar Graph */}
        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-800 pb-2">
            {MOCK_ADMIN_STATS.submissionGrowth.map((item) => {
              const heightPercent = Math.round((item.count / maxGrowth) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(item.count / 1000).toFixed(1)}k
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-primary-700 via-primary-500 to-indigo-400 rounded-t-lg group-hover:brightness-125 transition-all duration-300 relative"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t-lg transition-opacity" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              <span>Category Volume</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Total 38.4k</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Breakdown by photographic genres</p>
        </div>

        <div className="space-y-4">
          {MOCK_ADMIN_STATS.categoryDistribution.map((cat, idx) => (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">{cat.category}</span>
                <span className="font-mono text-slate-400">
                  {cat.percentage}% ({cat.count.toLocaleString()})
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    idx === 0
                      ? 'bg-emerald-400'
                      : idx === 1
                      ? 'bg-primary-500'
                      : idx === 2
                      ? 'bg-amber-400'
                      : idx === 3
                      ? 'bg-purple-400'
                      : 'bg-sky-400'
                  }`}
                  style={{ width: `${cat.percentage * 2.5}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>AI Vision shortlisting threshold</span>
          <span className="font-mono text-emerald-400 font-bold">90.0+ Cutoff</span>
        </div>
      </div>
    </div>
  );
};
