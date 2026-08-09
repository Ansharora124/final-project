'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sparkles, Building, Save } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  const [aiCutoff, setAiCutoff] = useState('90.0');
  const [maxUploadMB, setMaxUploadMB] = useState('50');
  const [tenantName, setTenantName] = useState('Pixel-Prize Global');
  const [escrowCurrency, setEscrowCurrency] = useState('USD');
  const [blindJudgingRequired, setBlindJudgingRequired] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Platform parameters and AI scoring thresholds updated.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Platform & Tenant Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure AI vision cutoff thresholds, multi-tenant isolation, and default judging rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Engine Thresholds */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span>AI Preliminary Evaluation Engine</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="AI Shortlist Cutoff Score (0-100)"
              type="number"
              value={aiCutoff}
              onChange={(e) => setAiCutoff(e.target.value)}
              helperText="Submissions scoring above this threshold advance to the Master Jury."
            />
            <Input
              label="Max Photograph File Size (MB)"
              type="number"
              value={maxUploadMB}
              onChange={(e) => setMaxUploadMB(e.target.value)}
            />
          </div>
        </div>

        {/* Tenant Configuration */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Multi-Tenant Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tenant Display Name"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />
            <Select
              label="Prize Escrow Currency"
              value={escrowCurrency}
              onChange={(e) => setEscrowCurrency(e.target.value)}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
              ]}
            />
          </div>
        </div>

        {/* Judging Policies */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Judging Standards</span>
          </h3>

          <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-slate-200">
            <input
              type="checkbox"
              checked={blindJudgingRequired}
              onChange={(e) => setBlindJudgingRequired(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-primary-600 focus:ring-primary-500"
            />
            <span>Enforce default Blind Judging (photographer identity hidden until scoring closes)</span>
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" rightIcon={<Save className="w-4 h-4" />}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
