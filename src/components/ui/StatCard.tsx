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
      className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-4 lg:p-5 backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/95 hover:shadow-lg w-full min-w-0 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono leading-tight min-w-0 break-words flex-1">
          {title}
        </span>
        <div className={`flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg border shrink-0 ${iconColor}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* Value */}
      <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
        <span className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono truncate">
          {value}
        </span>
        {change && (
          <span
            className={`text-[10px] sm:text-xs font-semibold ${
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
        <p className="mt-1 text-[10px] sm:text-xs text-slate-400 leading-snug line-clamp-1">
          {subtitle}
        </p>
      )}

      {/* Subtle corner highlight */}
      <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-slate-800/30 blur-xl pointer-events-none" />
    </div>
  );
};
