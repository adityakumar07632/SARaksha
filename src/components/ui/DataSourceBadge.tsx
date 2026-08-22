import React from 'react';
import { Database, Satellite, User, Sparkles, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export type DataSourceBadgeType =
  | 'DEMO_DATA'
  | 'REAL_DATA'
  | 'CONFIGURED_REFERENCE'
  | 'USER_SUBMITTED'
  | 'AI_ASSISTIVE'
  | 'HUMAN_VERIFIED'
  | 'SENTINEL_2';

interface DataSourceBadgeProps {
  type?: DataSourceBadgeType;
  sourceText?: string;
  resolution?: string;
  isSimulated?: boolean;
  size?: 'sm' | 'md';
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  type = 'DEMO_DATA',
  sourceText,
  resolution,
  isSimulated = true,
  size = 'md',
}) => {
  const configs = {
    DEMO_DATA: {
      label: sourceText || '🟡 DEMO DATA',
      icon: Radio,
      styles: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      dotColor: 'bg-amber-400 animate-pulse',
    },
    REAL_DATA: {
      label: sourceText || '🛰 REAL SATELLITE OBSERVATION',
      icon: Satellite,
      styles: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
      dotColor: 'bg-cyan-400',
    },
    CONFIGURED_REFERENCE: {
      label: sourceText || '⚙ CONFIGURED REFERENCE',
      icon: Database,
      styles: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
      dotColor: 'bg-indigo-400',
    },
    USER_SUBMITTED: {
      label: sourceText || 'FIELD GNSS CAPTURE',
      icon: User,
      styles: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      dotColor: 'bg-emerald-400',
    },
    AI_ASSISTIVE: {
      label: sourceText || 'DEMO AI ASSISTIVE',
      icon: Sparkles,
      styles: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
      dotColor: 'bg-indigo-400',
    },
    HUMAN_VERIFIED: {
      label: sourceText || 'HUMAN VERIFIED',
      icon: CheckCircle2,
      styles: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      dotColor: 'bg-emerald-400',
    },
    SENTINEL_2: {
      label: sourceText || 'SENTINEL-2 MSI (SIMULATED)',
      icon: Satellite,
      styles: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
      dotColor: 'bg-sky-400',
    },
  };

  const current = configs[type] || configs.DEMO_DATA;
  const Icon = current.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider ${
        current.styles
      } ${isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dotColor}`} />
      <Icon className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span className="font-bold">{current.label}</span>
      {resolution && (
        <span className="text-slate-400 border-l border-slate-700 pl-1.5 normal-case font-normal">
          {resolution}
        </span>
      )}
    </span>
  );
};
