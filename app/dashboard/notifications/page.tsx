'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, Sparkles, Trophy, Clock, Shield, ChevronRight } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function NotificationsCenterPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All Marked as Read', 'All notifications have been marked as seen.', 'info');
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Jury feedback alerts, AI shortlist notifications, and competition updates.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.read
                ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                : 'bg-slate-900 border-primary-500/30 text-white shadow-md'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-primary-400 shrink-0 mt-0.5">
                {item.type === 'ai_review' && <Sparkles className="w-4 h-4 text-purple-400" />}
                {item.type === 'judging' && <Shield className="w-4 h-4 text-amber-400" />}
                {item.type === 'deadline' && <Clock className="w-4 h-4 text-rose-400" />}
                {item.type === 'award' && <Trophy className="w-4 h-4 text-amber-300" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.message}</p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
            </div>

            {item.link && (
              <Link href={item.link} className="shrink-0">
                <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                  View Details
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
