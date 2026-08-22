import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Filter,
  Search,
  Eye,
  MapPin,
  Layers,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Send,
  Radio,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const AlertsCenter: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { alerts, resolveAlert } = useData();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [escalatedAlerts, setEscalatedAlerts] = useState<Record<string, boolean>>({});

  const handleEscalate = (alertId: string) => {
    setEscalatedAlerts((prev) => ({ ...prev, [alertId]: true }));
  };

  const filtered = alerts.filter((a) => {
    const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchState = stateFilter === 'ALL' || a.state === stateFilter;
    return matchSeverity && matchState;
  });

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-rose-500/30 uppercase shrink-0">
              EARLY WARNING &amp; ESCALATION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">Automated Multi-Spectral Triage</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight mt-1">
            Watershed Alert &amp; Incident Command Center
          </h1>
        </div>
      </div>

      {/* Multi-Tier Filter Toolbar */}
      <div className="flex flex-wrap gap-3 bg-slate-900/80 p-3 sm:p-3.5 rounded-2xl border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold shrink-0">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High Priority (Δ ≤ -10%)</option>
            <option value="MEDIUM">Medium Priority (-5% to -10%)</option>
            <option value="LOW">Low / Stable</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold shrink-0">State:</span>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
          >
            <option value="ALL">All States</option>
            <option value="Rajasthan">Rajasthan (Alwar North)</option>
            <option value="Maharashtra">Maharashtra (Pune South)</option>
            <option value="Madhya Pradesh">Madhya Pradesh (Ujjain West)</option>
          </select>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3 font-mono">
        {filtered.map((alert) => {
          const isHigh = alert.severity === 'HIGH';
          const isMedium = alert.severity === 'MEDIUM';
          const isEscalated = escalatedAlerts[alert.id];

          return (
            <div
              key={alert.id}
              className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                alert.isResolved
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : isHigh
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : isMedium
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isMedium
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {alert.severity} PRIORITY
                  </span>
                  {isEscalated && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase shrink-0">
                      ⚡ ESCALATED
                    </span>
                  )}
                  <span className="text-xs font-bold text-white">
                    {alert.state} &bull; {alert.watershedName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-cyan-400 flex items-center gap-1 text-[10px]">
                    <Send className="h-3 w-3" />
                    NOTIFIED (SENT)
                  </span>
                  <span>&bull;</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white">{alert.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                {alert.description}
              </p>

              {alert.interventionName && (
                <div className="mt-2 text-xs text-emerald-400">
                  Target Asset: <strong>{alert.interventionName}</strong> ({alert.interventionId})
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap gap-2">
                  {alert.interventionId && (
                    <button
                      onClick={() => navigate(`/intervention/${alert.interventionId}`)}
                      className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Open Intervention Dossier</span>
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>GIS Map</span>
                  </button>
                  <button
                    onClick={() => navigate('/field-evidence')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Field Evidence</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {!isEscalated && !alert.isResolved && (
                    <button
                      onClick={() => handleEscalate(alert.id)}
                      className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>Escalate Alert</span>
                    </button>
                  )}

                  {!alert.isResolved ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
