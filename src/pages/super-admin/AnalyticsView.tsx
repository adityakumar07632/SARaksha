import React from 'react';
import { BarChart3, TrendingUp, Sparkles, Globe, Layers, Droplets } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const stateHealthData = [
    { state: 'Madhya Pradesh', health: 86, interventions: 38, ndvi: 0.46 },
    { state: 'Rajasthan', health: 76, interventions: 88, ndvi: 0.38 },
    { state: 'Gujarat', health: 79, interventions: 26, ndvi: 0.41 },
    { state: 'Haryana', health: 68, interventions: 22, ndvi: 0.35 },
    { state: 'Punjab', health: 48, interventions: 34, ndvi: 0.28 },
  ];

  const multiYearTrend = [
    { year: '2022', ndvi: 0.26, ndwi: 0.14, health: 62 },
    { year: '2023', ndvi: 0.29, ndwi: 0.16, health: 68 },
    { year: '2024', ndvi: 0.34, ndwi: 0.19, health: 74 },
    { year: '2025', ndvi: 0.38, ndwi: 0.22, health: 79 },
    { year: '2026', ndvi: 0.42, ndwi: 0.24, health: 82 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-xl font-black text-white font-mono tracking-tight">
            National Watershed Analytics & Trend Models
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Macro-level multi-spectral indicators, spectral biomass progression, and state-by-state benchmarks.
          </p>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-amber-950/50 px-3 py-1 rounded-lg border border-amber-500/30">
          DEMO DATA / SIMULATED ANALYTICS
        </span>
      </div>

      {/* Chart 1: State Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              State-Wise Health Score Benchmark
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Average Composite Score</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="health" fill="#10b981" radius={[4, 4, 0, 0]} name="Health Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Multi-Year NDVI/NDWI Area Progression */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              National Spectral Index Growth (2022 - 2026)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">+61% Cumulative Growth</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={multiYearTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 0.5]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="ndvi" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="NDVI (Vegetation)" />
                <Area type="monotone" dataKey="ndwi" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="NDWI (Water)" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
