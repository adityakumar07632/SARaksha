import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Compass,
  FileText
} from 'lucide-react';
import { MOCK_WATERSHEDS, MOCK_INTERVENTIONS, MOCK_ALERTS, MOCK_HEALTH_BREAKDOWN_CD012 } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { HealthScoreGauge } from '../../components/ui/HealthScoreGauge';
import { GISMap } from '../../components/gis/GISMap';

import { useData } from '../../context/DataContext';

export const WatershedDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { watersheds, interventions: allInterventions, alerts: allAlerts } = useData();

  const watershed = watersheds.find((w) => w.id === id || w.code === id) || watersheds[0];
  const interventions = allInterventions.filter((i) => i.watershedId === watershed.id);
  const alerts = allAlerts.filter((a) => a.watershedId === watershed.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase shrink-0">
              WATERSHED FILE: {watershed.code}
            </span>
            <Badge status={watershed.status} size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight mt-1">
            {watershed.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {watershed.state} &bull; {watershed.district} &bull; Sub-district: {watershed.subDistrict} &bull; Area: {watershed.areaHa} Ha
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-semibold transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Health Score"
          value={`${watershed.healthScore}/100`}
          subtitle="Multi-temporal vegetation & water index"
          icon={ShieldCheck}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Interventions"
          value={watershed.totalInterventions}
          subtitle="Total planned & active structures"
          icon={Layers}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
        <StatCard
          title="Active Alerts"
          value={watershed.activeAlerts}
          subtitle="Critical and moderate warnings"
          icon={AlertTriangle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
        <StatCard
          title="Catchment Area"
          value={`${watershed.areaHa} Ha`}
          subtitle="Hydrological boundary polygon"
          icon={Compass}
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />
      </div>

      {/* Map & Health breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          <GISMap
            watersheds={[watershed]}
            interventions={interventions}
            alerts={alerts}
            center={watershed.coordinates}
            zoom={14}
            height="500px"
          />
        </div>

        <div className="lg:col-span-4">
          <HealthScoreGauge
            score={watershed.healthScore}
            breakdown={MOCK_HEALTH_BREAKDOWN_CD012}
            title="Watershed Health Index"
          />
        </div>
      </div>

      {/* Interventions in this Watershed */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Interventions Located in {watershed.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Click any structure to open its 6-tab evidence, satellite, and health dossier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventions.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/intervention/${item.id}`)}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 hover:border-emerald-500/50 hover:bg-slate-900/90 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                <span className="text-xs font-bold text-emerald-400 font-mono group-hover:text-emerald-300">
                  {item.code}
                </span>
                <Badge status={item.lifecycleStage} size="sm" />
              </div>

              <h4 className="text-sm font-bold text-white font-mono group-hover:text-emerald-400 transition">
                {item.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {item.type} &bull; Budget: ₹{item.budgetAllocatedLakhs}L
              </p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
                <span className="text-xs font-bold text-slate-300 font-mono">
                  Health: <strong className={item.healthScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}>{item.healthScore}/100</strong>
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Dossier &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
