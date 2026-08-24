import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Camera,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Globe,
  ArrowRight,
  ChevronRight,
  Compass,
  Filter
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { GISMap } from '../../components/gis/GISMap';
import { useData } from '../../context/DataContext';
import { getNationalImpactSummary } from '../../data/mockData';
import { Sparkles, TrendingUp, GitCompare } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    watersheds,
    interventions,
    alerts,
    evidenceList,
    pendingVerificationCount,
    activeAlertsCount,
    verificationRatePercent,
    totalEvidenceCount
  } = useData();

  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>('CD-012');

  // Filtered watersheds based on state drilldown
  const filteredWatersheds =
    selectedState === 'ALL'
      ? watersheds
      : watersheds.filter((w) => w.state.toLowerCase() === selectedState.toLowerCase());

  // Compute dynamic state summaries from actual watersheds and interventions
  const statesList = Array.from(new Set(watersheds.map((w) => w.state)));
  const stateCenterMap: Record<string, [number, number]> = {
    'Rajasthan': [27.2, 76.2],
    'Madhya Pradesh': [23.6, 78.5],
    'Maharashtra': [19.0, 77.0],
    'Karnataka': [13.34, 78.21]
  };

  const stateSummaries = statesList.map((stName) => {
    const wsInState = watersheds.filter((w) => w.state === stName);
    const intInState = interventions.filter((i) => i.state === stName);
    const avgHealth = Math.round(
      wsInState.reduce((acc, curr) => acc + curr.healthScore, 0) / (wsInState.length || 1)
    );
    const status: 'HEALTHY' | 'MODERATE' | 'CRITICAL' =
      avgHealth >= 75 ? 'HEALTHY' : avgHealth >= 50 ? 'MODERATE' : 'CRITICAL';

    return {
      name: stName,
      watersheds: wsInState.length,
      interventions: intInState.length,
      health: avgHealth,
      status,
      center: stateCenterMap[stName] || ([22.5, 78.0] as [number, number])
    };
  });

  const verifiedInterventionsCount = interventions.filter((i) => i.isFieldVerified).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title & System Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight leading-tight">
              National Watershed Command Center
            </h1>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase shrink-0">
              LIVE SYSTEM MONITOR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            System-wide multi-state GIS monitoring &amp; evidence-based decision intelligence.
          </p>
        </div>

        {/* Drill-down state selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5 text-emerald-400" />
            State Filter:
          </span>
          <div className="flex flex-wrap rounded-lg bg-slate-900 border border-slate-800 p-1 gap-1">
            <button
              onClick={() => setSelectedState('ALL')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs font-mono rounded-md font-semibold transition cursor-pointer min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                selectedState === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All India
            </button>
            {stateSummaries.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedState(s.name)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs font-mono rounded-md font-semibold transition cursor-pointer min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                  selectedState === s.name
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 6 Dynamic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 w-full min-w-0">
        <StatCard
          title="Watersheds"
          value={watersheds.length.toString()}
          subtitle={`${statesList.length} States active`}
          icon={Globe}
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
          onClick={() => navigate('/super-admin/watersheds')}
        />
        <StatCard
          title="Interventions"
          value={interventions.length.toString()}
          subtitle={`${verifiedInterventionsCount} Verified`}
          icon={Layers}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          onClick={() => navigate('/super-admin/watersheds')}
        />
        <StatCard
          title="Evidence Records"
          value={totalEvidenceCount.toLocaleString()}
          subtitle={`Audit Pipeline`}
          icon={Camera}
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
          onClick={() => navigate('/super-admin/evidence')}
        />
        <StatCard
          title="Active Alerts"
          value={activeAlertsCount}
          subtitle="Real-time anomalies"
          icon={AlertTriangle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
          onClick={() => navigate('/super-admin/alerts')}
        />
        <StatCard
          title="Pending Verification"
          value={pendingVerificationCount}
          subtitle="Awaiting nodal sign-off"
          icon={Clock}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
          onClick={() => navigate('/super-admin/evidence')}
        />
        <StatCard
          title="Verification Rate"
          value={`${verificationRatePercent}%`}
          subtitle="Live ground integrity"
          icon={CheckCircle2}
          iconColor="text-teal-400 bg-teal-500/10 border-teal-500/20"
          onClick={() => navigate('/super-admin/evidence')}
        />
      </div>

      {/* Main Command Center Layout: Left GIS Map, Right Regional Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start w-full min-w-0">
        {/* Main Map Box (8 cols) */}
        <div className="lg:col-span-8 space-y-3 min-w-0">
          <div className="flex items-center justify-between min-w-0 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="h-4 w-4 text-emerald-400 shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider truncate">
                System-Wide Interactive GIS Map &bull; Regional Distribution
              </h2>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 shrink-0">
              Showing <strong className="text-emerald-400">{filteredWatersheds.length}</strong> Watersheds
            </span>
          </div>

          <GISMap
            watersheds={filteredWatersheds}
            interventions={interventions}
            alerts={alerts}
            evidenceList={evidenceList}
            selectedInterventionId={selectedInterventionId}
            onSelectIntervention={(id) => setSelectedInterventionId(id)}
            center={
              selectedState !== 'ALL' && stateCenterMap[selectedState]
                ? stateCenterMap[selectedState]
                : [22.8, 77.0]
            }
            zoom={selectedState === 'ALL' ? 6 : 9}
            height="520px"
          />
        </div>

        {/* State Summaries & Priority Alerts (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5 min-w-0">
          {/* State Performance Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 min-w-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                State Performance Indices
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Avg Health</span>
            </div>

            <div className="space-y-2.5">
              {stateSummaries.map((state) => (
                <div
                  key={state.name}
                  onClick={() => setSelectedState(state.name)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono group-hover:text-emerald-400 transition">
                        {state.name}
                      </span>
                      <Badge status={state.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {state.watersheds} Watersheds &bull; {state.interventions} Interventions
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-white font-mono">
                      {state.health}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts Stream */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Critical Escalations
                </h3>
              </div>
              <button
                onClick={() => navigate('/super-admin/alerts')}
                className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
              >
                View All ({alerts.filter((a) => !a.isResolved).length})
              </button>
            </div>

            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/super-admin/alerts')}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-rose-400 font-mono uppercase">
                      {alert.severity} PRIORITY
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp.split(' ')[0]}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">{alert.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {alert.watershedName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* National Watershed Impact & Change Detection Summary */}
      {(() => {
        const impactSummary = getNationalImpactSummary();
        return (
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-4 sm:p-5 shadow-xl font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    National Watershed Impact &amp; Multi-Temporal Change Detection
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Aggregate multi-year satellite before-vs-after evaluation across all monitored interventions
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold self-start sm:self-auto">
                {impactSummary.totalAssessed} SITES ASSESSED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Positive Impact</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-emerald-400">{impactSummary.positiveImpact}</span>
                  <span className="text-[10px] text-slate-400">sites ({Math.round((impactSummary.positiveImpact / impactSummary.totalAssessed) * 100)}%)</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Avg Health Delta</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-teal-400">+{impactSummary.avgHealthImprovement}</span>
                  <span className="text-[10px] text-slate-400">points</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Minimal Change</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-slate-300">{impactSummary.minimalChange}</span>
                  <span className="text-[10px] text-slate-400">sites</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Needs Field Review</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-black text-amber-400">{impactSummary.needsReview}</span>
                  <span className="text-[10px] text-slate-400">site (silt choke)</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Featured Watersheds Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono tracking-tight">
              Watershed Directory & Health Overview
            </h3>
            <p className="text-xs text-slate-400">
              Select any watershed to drill into local GIS layers, interventions, and satellite indicators.
            </p>
          </div>
          <button
            onClick={() => navigate('/super-admin/watersheds')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
          >
            <span>Manage All Watersheds</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Watershed ID</th>
                <th className="pb-3 px-3">Name</th>
                <th className="pb-3 px-3">State / District</th>
                <th className="pb-3 px-3 text-center">Interventions</th>
                <th className="pb-3 px-3 text-center">Health Score</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-center">Alerts</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredWatersheds.map((ws) => (
                <tr
                  key={ws.id}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                  onClick={() => navigate(`/watershed/${ws.id}`)}
                >
                  <td className="py-3 px-3 font-bold text-emerald-400">{ws.code}</td>
                  <td className="py-3 px-3 font-semibold text-white">{ws.name}</td>
                  <td className="py-3 px-3 text-slate-300">{ws.state} &bull; {ws.district}</td>
                  <td className="py-3 px-3 text-center text-slate-200">{ws.totalInterventions}</td>
                  <td className="py-3 px-3 text-center font-bold text-white">
                    <span className={ws.healthScore >= 75 ? 'text-emerald-400' : ws.healthScore >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                      {ws.healthScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={ws.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    {ws.activeAlerts > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] border border-rose-500/30">
                        {ws.activeAlerts} Alerts
                      </span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/watershed/${ws.id}`);
                      }}
                      className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
