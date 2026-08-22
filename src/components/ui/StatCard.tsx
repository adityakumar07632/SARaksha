import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/95 hover:shadow-lg ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold ${
              changeType === 'positive'
                ? 'text-emerald-400'
                : changeType === 'negative'
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 line-clamp-1">
          {subtitle}
        </p>
      )}

      {/* Subtle corner highlight */}
      <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-slate-800/30 blur-xl pointer-events-none" />
    </div>
  );
};
