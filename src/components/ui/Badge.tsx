import React from 'react';
import { HealthStatus } from '../../types';

interface BadgeProps {
  variant?: 'healthy' | 'moderate' | 'critical' | 'info' | 'neutral' | 'purple';
  status?: HealthStatus | string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  status,
  children,
  size = 'md',
  dot = true,
}) => {
  // Determine variant from status if not explicitly passed
  let resolvedVariant = variant;
  if (!resolvedVariant && status) {
    if (status === 'HEALTHY' || status === 'Active' || status === 'VERIFIED' || status === 'Completed' || status === 'Field Verified') {
      resolvedVariant = 'healthy';
    } else if (status === 'MODERATE' || status === 'Pending' || status === 'PENDING' || status === 'Monitoring' || status === 'Planned') {
      resolvedVariant = 'moderate';
    } else if (status === 'CRITICAL' || status === 'Inactive' || status === 'FLAGGED' || status === 'REJECTED' || status === 'HIGH') {
      resolvedVariant = 'critical';
    } else {
      resolvedVariant = 'neutral';
    }
  }

  const variantStyles = {
    healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50',
    moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50',
    critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700/50',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-700/50',
    neutral: 'bg-slate-700/30 text-slate-300 border-slate-600/40 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
    purple: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-700/50',
  };

  const dotColors = {
    healthy: 'bg-emerald-400 animate-pulse',
    moderate: 'bg-amber-400',
    critical: 'bg-rose-500 animate-ping',
    info: 'bg-cyan-400',
    neutral: 'bg-slate-400',
    purple: 'bg-indigo-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const activeVariant = resolvedVariant || 'neutral';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${variantStyles[activeVariant]} ${sizeStyles[size]}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className={`inline-flex rounded-full h-2 w-2 ${dotColors[activeVariant]}`} />
        </span>
      )}
      <span>{children || status}</span>
    </span>
  );
};
