import React from 'react';
import { JudgeSidebar } from '@/components/layout/JudgeSidebar';

export default function JudgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row text-white selection:bg-primary-500 selection:text-white">
      <JudgeSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
