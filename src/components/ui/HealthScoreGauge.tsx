import React, { useState } from 'react';
import { HelpCircle, Layers, Droplets, Trees, ShieldAlert, Sparkles, X, Info } from 'lucide-react';
import { HealthScoreBreakdown } from '../../types';

interface HealthScoreGaugeProps {
  score: number;
  breakdown?: HealthScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  showBreakdownBars?: boolean;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  breakdown = {
    vegetation: 86,
    water: 80,
    interventionCondition: 82,
    landDegradation: 72,
    explanation: 'Prototype multi-temporal calculation combining optical Sentinel-2 vegetation indices (NDVI/NDWI) with on-site verified condition metrics.',
  },
  size = 'md',
  title = 'Watershed Health Score',
  showBreakdownBars = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Status mapping
  const getStatus = (s: number) => {
    if (s >= 75) return { text: 'HEALTHY', color: 'text-emerald-400', stroke: '#10B981', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (s >= 50) return { text: 'MODERATE', color: 'text-amber-400', stroke: '#F59E0B', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { text: 'CRITICAL', color: 'text-rose-400', stroke: '#EF4444', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const status = getStatus(score);

  // Radial calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            {title}
          </h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/20"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Why this score?</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
        {/* Radial gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={status.stroke}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white font-mono">{score}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">/ 100</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>

        {/* Breakdown bars */}
        {showBreakdownBars && (
          <div className="flex-1 w-full space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Trees className="h-3.5 w-3.5 text-emerald-400" />
                  Vegetation Cover (40%)
                </span>
                <span className="font-bold">{breakdown.vegetation}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.vegetation}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                  Water Retention (30%)
                </span>
                <span className="font-bold">{breakdown.water}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.water}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  Structure Condition (20%)
                </span>
                <span className="font-bold">{breakdown.interventionCondition}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.interventionCondition}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  Land Degradation (10%)
                </span>
                <span className="font-bold">{breakdown.landDegradation}/100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.landDegradation}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Dialog "Why this score?" */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-400" />
                <h4 className="text-lg font-bold text-white font-mono">
                  Health Score Calculation Methodology
                </h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-amber-300 text-xs font-mono">
                ⚠️ <strong>PROTOTYPE METHODOLOGY (DEMO DATA):</strong> This score is calculated via automated multi-spectral feature weights for simulation purposes. Real algorithms will interface with National Remote Sensing Centre (NRSC) models.
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">Weight Distribution Formula:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>• Vegetation Index (NDVI): <strong className="text-emerald-400">40%</strong></div>
                  <div>• Water Retention (NDWI): <strong className="text-cyan-400">30%</strong></div>
                  <div>• Structure Field Condition: <strong className="text-indigo-400">20%</strong></div>
                  <div>• Land Degradation Metric: <strong className="text-amber-400">10%</strong></div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-1">Current Evaluation Rationale:</h5>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-700">
                  {breakdown.explanation}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                >
                  Understood & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
