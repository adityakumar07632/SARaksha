import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Satellite,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Info,
  X,
  Compass
} from 'lucide-react';
import { Intervention, FieldEvidence, SatelliteData } from '../../types';

interface EvidenceChainProps {
  intervention: Intervention;
  evidence?: FieldEvidence;
  satelliteData?: SatelliteData;
  onNavigateTab?: (tab: 'overview' | 'evidence' | 'satellite' | 'before-after' | 'health' | 'alerts') => void;
  isVerified?: boolean;
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({
  intervention,
  evidence,
  satelliteData,
  onNavigateTab,
  isVerified = true,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showGpsModal, setShowGpsModal] = useState<boolean>(false);

  const chainSteps = [
    {
      id: 0,
      tab: 'evidence' as const,
      title: 'Field Photograph',
      icon: Camera,
      badge: '📸 Geo-Tagged Photo',
      status: isVerified ? 'VERIFIED' : 'PENDING REVIEW',
      summary: 'High-resolution on-site imagery captured at check dam spillway.',
      details: {
        'Evidence ID': evidence?.id || 'EVD-101',
        'Uploaded By': evidence?.uploadedBy?.name || 'Vikram Singh (Field Officer)',
        'Capture Time': evidence?.capturedAt || '18 Aug 2026 10:42 AM IST',
        'AI Structural Verification': 'Check Dam (Masonry) - 87% confidence',
        'Human Status': isVerified ? '✓ Human Verified (Dr. Rajesh Sharma)' : '⚠ Pending Nodal Verification',
      }
    },
    {
      id: 1,
      tab: 'overview' as const,
      title: 'GPS Coordinates',
      icon: MapPin,
      badge: '📍 Dual GNSS Lock',
      status: 'VERIFIED',
      summary: `${intervention.coordinates[0].toFixed(4)}° N, ${intervention.coordinates[1].toFixed(4)}° E (Accuracy: ±5m)`,
      details: {
        'Latitude': `${intervention.coordinates[0]}° N`,
        'Longitude': `${intervention.coordinates[1]}° E`,
        'Accuracy Radius': '±5m (Simulated GNSS Data)',
        'Hydrological Basin': 'Alwar North Catchment (WS-001)',
      }
    },
    {
      id: 2,
      tab: 'overview' as const,
      title: 'Temporal Stamp',
      icon: Calendar,
      badge: '📅 Timeline Audit',
      status: 'RECORDED',
      summary: `Commissioned: ${intervention.constructionDate} &bull; Inspected: ${intervention.lastInspectedDate}`,
      details: {
        'Commissioning Date': intervention.constructionDate,
        'Latest Audit Date': intervention.lastInspectedDate,
        'Lifecycle Phase': intervention.lifecycleStage,
        'Monitoring Horizon': '2023 - 2026 (Continuous)',
      }
    },
    {
      id: 3,
      tab: 'satellite' as const,
      title: 'Satellite Pass',
      icon: Satellite,
      badge: '🛰️ Sentinel-2 / Landsat',
      status: 'ANALYZED',
      summary: `Spectral reflectance verified on pass ${satelliteData?.lastPassDate || '19 Aug 2026'}.`,
      details: {
        'Satellite Sensor': 'Sentinel-2 MSI (Simulated Data)',
        'Spatial Resolution': '10m Surface Reflectance',
        'Current NDVI (Vegetation)': `${satelliteData?.currentNdvi || 0.42} (Healthy Green)`,
        'Current NDWI (Water)': `${satelliteData?.currentNdwi || 0.24} (Active Storage)`,
      }
    },
    {
      id: 4,
      tab: 'before-after' as const,
      title: 'Observed Impact',
      icon: TrendingUp,
      badge: '📊 Multi-Year Gains',
      status: 'ANALYZED',
      summary: '+18% Vegetation Biomass & +12% Surface Water expansion since 2024 baseline.',
      details: {
        'Simulated Vegetation Change': '+18% Biomass Increase',
        'Simulated Water Surface Expansion': '+12% Retention Pool Area',
        'Sediment Interception': 'Est. 1,450 tonnes/season',
        'Groundwater Table Response': '+2.1m average rise in catchment wells',
      }
    },
    {
      id: 5,
      tab: 'health' as const,
      title: 'Verified Health Score',
      icon: BrainCircuit,
      badge: '🧠 82 / 100 HEALTHY',
      status: 'CALCULATED',
      summary: 'Deterministic composite score backed by complete immutable audit trail.',
      details: {
        'Composite Score': `${intervention.healthScore}/100 (HEALTHY)`,
        'Vegetation Weight (40%)': '86 / 100',
        'Water Weight (30%)': '80 / 100',
        'Condition Weight (20%)': '82 / 100',
        'Degradation Weight (10%)': '72 / 100',
      }
    }
  ];

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (index === 1) {
      setShowGpsModal(true);
    } else if (onNavigateTab) {
      onNavigateTab(chainSteps[index].tab);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md space-y-4">
      {/* Header with Traceability statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white font-mono tracking-tight uppercase">
                Traceable Evidence Chain
              </h3>
              {isVerified ? (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Evidence Chain Complete
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40 uppercase flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Verification Required
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              "Every assessment in SARaksha is designed to remain traceable to supporting evidence."
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          Audit File: <strong className="text-white">{intervention.name}</strong> ({intervention.code})
        </div>
      </div>

      {/* 6 Step Interactive Timeline Chain */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {chainSteps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-xl shadow-emerald-950/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  0{idx + 1}
                </span>
              </div>
              <span className="text-xs font-bold font-mono line-clamp-1">
                {step.title}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5 line-clamp-1">
                {step.badge}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Step Details Sub-panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Step 0{activeStep + 1}: {chainSteps[activeStep].title} Evidence Audit
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
              {chainSteps[activeStep].status}
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab(chainSteps[activeStep].tab)}
                className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-semibold"
              >
                <span>Jump to Tab &rarr;</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-3 font-mono">
          {chainSteps[activeStep].summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {Object.entries(chainSteps[activeStep].details).map(([key, val]) => (
            <div key={key} className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                {key}
              </span>
              <span className="text-xs font-semibold text-slate-100 font-mono mt-0.5 block truncate">
                {String(val)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GPS GNSS Modal */}
      {showGpsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  GNSS Geolocation Audit Lock
                </h3>
              </div>
              <button
                onClick={() => setShowGpsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Structure:</span>
                  <span className="text-white font-bold">{intervention.name} ({intervention.code})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latitude:</span>
                  <span className="text-emerald-400 font-bold">{intervention.coordinates[0].toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longitude:</span>
                  <span className="text-emerald-400 font-bold">{intervention.coordinates[1].toFixed(6)}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Horizontal Precision:</span>
                  <span className="text-cyan-400 font-bold">Accuracy ±5m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Elevation Datum:</span>
                  <span className="text-slate-200">284m MSL (WGS84)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                ℹ️ <strong>SIMULATED GNSS DATA:</strong> Dual GNSS receiver coordinates recorded during field ground inspection with anti-spoofing timestamp hashing.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowGpsModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono"
              >
                Close GNSS Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
