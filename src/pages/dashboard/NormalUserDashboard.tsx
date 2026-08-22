import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Layers,
  AlertTriangle,
  Clock,
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Compass
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { HealthScoreGauge } from '../../components/ui/HealthScoreGauge';
import { GISMap } from '../../components/gis/GISMap';
import { useData } from '../../context/DataContext';
import { MOCK_HEALTH_BREAKDOWN_CD012 } from '../../data/mockData';

export const NormalUserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { watersheds, interventions, alerts, evidenceList } = useData();

  // Assigned watershed: WS-001 (Alwar North Catchment)
  const assignedWatershed = watersheds[0];
  const assignedInterventions = interventions.filter(
    (i) => i.watershedId === assignedWatershed.id
  );
  const assignedAlerts = alerts.filter(
    (a) => a.watershedId === assignedWatershed.id && !a.isResolved
  );
  const assignedEvidence = evidenceList.filter(
    (e) => e.watershedId === assignedWatershed.id
  );

  const [selectedInterventionId, setSelectedInterventionId] = useState<string>('CD-012');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Prominent Watershed Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase shrink-0">
                {assignedWatershed.code} &bull; ASSIGNED JURISDICTION
              </span>
              <Badge status={assignedWatershed.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white font-mono tracking-tight mt-1">
              {assignedWatershed.name.toUpperCase()}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {assignedWatershed.state} &bull; {assignedWatershed.district} District &bull; Sub-district: {assignedWatershed.subDistrict} &bull; Area: {assignedWatershed.areaHa} Ha
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/field-evidence')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-semibold transition cursor-pointer"
            >
              <Camera className="h-4 w-4 text-emerald-400" />
              <span>Evidence ({assignedEvidence.length})</span>
            </button>
            <button
              onClick={() => navigate(`/intervention/CD-012`)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <span>Investigate CD-012</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Health Score</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5 block">
              {assignedWatershed.healthScore} / 100 (HEALTHY)
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Interventions</span>
            <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">
              {assignedWatershed.totalInterventions} Units Monitored
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Active Alerts</span>
            <span className="text-lg sm:text-xl font-bold text-rose-400 mt-0.5 block">
              {assignedAlerts.length} Anomaly Warning(s)
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Last Monitoring Pass</span>
            <span className="text-lg sm:text-xl font-bold text-cyan-400 mt-0.5 block">
              18 Aug 2026
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Interactive GIS Map + Map-Side Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GIS Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Watershed Interactive GIS Spatial View
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Click any marker to inspect intervention
            </span>
          </div>

          <GISMap
            watersheds={[assignedWatershed]}
            interventions={assignedInterventions}
            alerts={assignedAlerts}
            evidenceList={assignedEvidence}
            selectedInterventionId={selectedInterventionId}
            onSelectIntervention={(id) => setSelectedInterventionId(id)}
            center={assignedWatershed.coordinates}
            zoom={14}
            height="580px"
          />
        </div>

        {/* Map-Side Summary Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <HealthScoreGauge
            score={assignedWatershed.healthScore}
            breakdown={MOCK_HEALTH_BREAKDOWN_CD012}
            title="Jurisdiction Health Index"
          />

          {/* Quick Intervention Navigator */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Focus Interventions
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">
                {assignedInterventions.length} Units
              </span>
            </div>

            <div className="space-y-2">
              {assignedInterventions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/intervention/${item.id}`)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    item.id === selectedInterventionId
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      {item.name}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        item.healthScore >= 75
                          ? 'text-emerald-400'
                          : item.healthScore >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {item.healthScore}/100
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{item.type}</span>
                    <Badge status={item.lifecycleStage} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
