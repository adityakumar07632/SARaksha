import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
  ShieldCheck,
  ArrowRight,
  Calendar,
  MapPin,
  Compass,
  Droplets,
  Leaf,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Eye,
  FileText,
  Printer,
  Check,
  Info,
  ShieldAlert,
  BarChart3,
  Clock,
  Lock,
  Share2,
  Globe2,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Intervention,
  FieldEvidence,
  ImpactAnalysisRecord,
  ImpactClassification,
} from '../../types';
import {
  MOCK_IMPACT_ANALYSIS,
  getImpactAnalysis,
  getImpactClassificationMeta,
  classifyImpactScore,
} from '../../data/mockData';
import { Badge } from '../ui/Badge';
import { DataSourceBadge } from '../ui/DataSourceBadge';

interface WatershedImpactAnalysisProps {
  intervention: Intervention;
  evidenceList?: FieldEvidence[];
  onOpenEvidenceModal?: (evidence: FieldEvidence) => void;
}

export const WatershedImpactAnalysis: React.FC<WatershedImpactAnalysisProps> = ({
  intervention,
  evidenceList = [],
  onOpenEvidenceModal,
}) => {
  const navigate = useNavigate();

  // Retrieve structured impact analysis record for this intervention (or fallback to CD-012)
  const impactData: ImpactAnalysisRecord =
    getImpactAnalysis(intervention.id) || MOCK_IMPACT_ANALYSIS['CD-012'];

  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'field-photos'>('slider');

  const meta = getImpactClassificationMeta(impactData.classification);

  // Derived change metrics
  const vegDelta = impactData.after.vegetationPercent - impactData.before.vegetationPercent;
  const waterDelta = impactData.after.waterPresencePercent - impactData.before.waterPresencePercent;
  const barrenDelta = impactData.after.barrenAreaPercent - impactData.before.barrenAreaPercent;
  const ndviDelta = Number((impactData.after.ndvi - impactData.before.ndvi).toFixed(2));
  const healthDelta = impactData.after.healthScore - impactData.before.healthScore;
  const waterAreaDeltaPct = Math.round(
    ((impactData.after.waterSurfaceAreaKm2 - impactData.before.waterSurfaceAreaKm2) /
      (impactData.before.waterSurfaceAreaKm2 || 0.01)) *
      100
  );

  // LULC Data formatted for Recharts
  const lulcChartData = [
    {
      category: 'Vegetation Cover',
      Before: impactData.lulc.before.vegetation,
      After: impactData.lulc.after.vegetation,
      unit: '%',
    },
    {
      category: 'Water Body',
      Before: impactData.lulc.before.water,
      After: impactData.lulc.after.water,
      unit: '%',
    },
    {
      category: 'Agriculture',
      Before: impactData.lulc.before.agriculture,
      After: impactData.lulc.after.agriculture,
      unit: '%',
    },
    {
      category: 'Barren / Degraded',
      Before: impactData.lulc.before.barren,
      After: impactData.lulc.after.barren,
      unit: '%',
    },
  ];

  // Navigate to Impact Report Dossier
  const handleGenerateReport = () => {
    navigate(`/evidence-dossier?mode=impact&interventionId=${intervention.id}`);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* 1. Header Banner & Location Identity */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                SPATIAL &amp; TEMPORAL CHANGE DETECTION
              </span>
              <DataSourceBadge
                type="DEMO_DATA"
                sourceText="DEMO ANALYSIS — REPRESENTATIVE DATA"
                size="sm"
              />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">
              Watershed Impact Analysis &amp; Change Detection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              Compare historical baseline and current conditions to measure intervention impact across identical geographic coordinates.
            </p>
          </div>

          {/* Action: Generate Impact Report */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-mono font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[44px]"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Impact Report</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Guaranteed Same Location Coordinate Anchor */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Intervention Zone</span>
            <strong className="text-white truncate block">{impactData.locationName}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Coordinates</span>
            <span className="text-emerald-400 font-bold">
              {impactData.coordinates[0].toFixed(4)}° N, {impactData.coordinates[1].toFixed(4)}° E
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Area Monitored</span>
            <span className="text-cyan-400 font-bold">{impactData.areaKm2} km²</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Before Baseline</span>
            <span className="text-amber-300 font-bold">{impactData.before.date}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">After Assessment</span>
            <span className="text-emerald-300 font-bold">{impactData.after.date}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Data Sensor</span>
            <span className="text-indigo-300 font-bold">Sentinel-2 MSI (10m)</span>
          </div>
        </div>
      </div>

      {/* 2. Impact Score & Health Improvement Banner */}
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Overall Impact Score
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border ${meta.bg} ${meta.color} ${meta.border}`}>
                  {meta.label.toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {healthDelta > 0 ? `+${healthDelta}` : healthDelta}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Points ({impactData.before.healthScore}/100 &rarr; {impactData.after.healthScore}/100)
                </span>
              </div>
            </div>
          </div>

          {/* Classification thresholds key */}
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono bg-slate-950/70 p-2 rounded-xl border border-slate-800">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              &ge; +15: Significant
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
              +5 to +14: Positive
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              -4 to +4: Minimal
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              &le; -5: Negative
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5 font-mono">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Baseline Health: <strong className="text-amber-400">{impactData.before.healthScore}</strong></span>
            <span>Current Monitored Health: <strong className="text-emerald-400">{impactData.after.healthScore}</strong></span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
            {/* Before marker */}
            <div
              className="absolute top-0 bottom-0 bg-amber-500/60 transition-all duration-500"
              style={{ width: `${impactData.before.healthScore}%` }}
            />
            {/* After delta */}
            <div
              className="absolute top-0 bottom-0 bg-emerald-500 transition-all duration-500"
              style={{
                left: `${Math.min(impactData.before.healthScore, impactData.after.healthScore)}%`,
                width: `${Math.abs(healthDelta)}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            {meta.description}
          </p>
        </div>
      </div>

      {/* 3. Interactive Before / After Satellite Comparison Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-emerald-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
              High-Resolution Satellite Optical Comparison
            </h3>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 gap-1 font-mono text-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            {impactData.fieldPhotos && (
              <button
                onClick={() => setViewMode('field-photos')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  viewMode === 'field-photos'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ground Field Photos
              </button>
            )}
          </div>
        </div>

        {/* View Mode 1: Interactive Draggable Slider */}
        {viewMode === 'slider' && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 aspect-video bg-black select-none max-w-4xl mx-auto shadow-2xl">
              {/* AFTER IMAGE (Base Layer) */}
              <img
                src={impactData.after.image}
                alt={`After intervention (${impactData.after.date})`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-950/90 border border-emerald-500/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono text-emerald-300 font-bold shadow-xl backdrop-blur-sm">
                AFTER &bull; {impactData.after.date} (Current)
              </div>

              {/* BEFORE IMAGE (Clipped Layer) */}
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={impactData.before.image}
                  alt={`Before intervention (${impactData.before.date})`}
                  className="w-full h-full object-cover filter saturate-75 brightness-90 max-w-none"
                  style={{ width: '100%', minWidth: '100%' }}
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-950/90 border border-amber-500/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono text-amber-300 font-bold shadow-xl backdrop-blur-sm">
                  BEFORE &bull; {impactData.before.date} (Baseline)
                </div>
              </div>

              {/* Slider Handle Divider */}
              <div
                className="absolute top-0 bottom-0 flex items-center justify-center -ml-5 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="h-10 w-10 rounded-full bg-white shadow-2xl flex items-center justify-center text-slate-900 font-bold text-xs border-2 border-emerald-500">
                  &harr;
                </div>
              </div>

              {/* Transparent Range Input Overlay for Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20 touch-none"
                aria-label="Before versus After comparison slider"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono text-slate-400 max-w-4xl mx-auto px-1">
              <span>&larr; Drag left to reveal <strong>Current Assessment ({impactData.after.date})</strong></span>
              <span>Drag right to inspect <strong>Baseline ({impactData.before.date})</strong> &rarr;</span>
            </div>
          </div>
        )}

        {/* View Mode 2: Side-by-Side (Desktop) / Stacked (Mobile) */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Before Card */}
            <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  BEFORE: {impactData.before.periodLabel}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{impactData.before.date}</span>
              </div>
              <div className="rounded-lg overflow-hidden aspect-video relative border border-slate-800">
                <img
                  src={impactData.before.image}
                  alt="Before satellite baseline"
                  className="w-full h-full object-cover filter saturate-75 brightness-90"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-300 text-center pt-1">
                <div className="bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-500 block">NDVI</span>
                  <strong>{impactData.before.ndvi}</strong>
                </div>
                <div className="bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-500 block">Vegetation</span>
                  <strong>{impactData.before.vegetationPercent}%</strong>
                </div>
                <div className="bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-500 block">Water</span>
                  <strong>{impactData.before.waterPresencePercent}%</strong>
                </div>
              </div>
            </div>

            {/* After Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  AFTER: {impactData.after.periodLabel}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{impactData.after.date}</span>
              </div>
              <div className="rounded-lg overflow-hidden aspect-video relative border border-slate-800">
                <img
                  src={impactData.after.image}
                  alt="After satellite assessment"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-300 text-center pt-1">
                <div className="bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-500 block">NDVI</span>
                  <strong className="text-emerald-400">{impactData.after.ndvi}</strong>
                </div>
                <div className="bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-500 block">Vegetation</span>
                  <strong className="text-emerald-400">{impactData.after.vegetationPercent}%</strong>
                </div>
                <div className="bg-slate-900 p-1.5 rounded">
                  <span className="text-slate-500 block">Water</span>
                  <strong className="text-cyan-400">{impactData.after.waterPresencePercent}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: Ground Field Photographs */}
        {viewMode === 'field-photos' && impactData.fieldPhotos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {impactData.fieldPhotos.before && (
              <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    FIELD PHOTO &bull; BEFORE CONSTRUCTION
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{impactData.fieldPhotos.before.date}</span>
                </div>
                <div className="rounded-lg overflow-hidden aspect-video border border-slate-800">
                  <img
                    src={impactData.fieldPhotos.before.url}
                    alt={impactData.fieldPhotos.before.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                  {impactData.fieldPhotos.before.caption}
                </p>
              </div>
            )}

            {impactData.fieldPhotos.after && (
              <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    FIELD PHOTO &bull; AFTER VERIFICATION
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{impactData.fieldPhotos.after.date}</span>
                </div>
                <div className="rounded-lg overflow-hidden aspect-video border border-slate-800">
                  <img
                    src={impactData.fieldPhotos.after.url}
                    alt={impactData.fieldPhotos.after.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                  {impactData.fieldPhotos.after.caption}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Core Change Metrics Grid (Visual Change Indicators) */}
      <div className="space-y-3 font-mono">
        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          Multi-Spectral Environmental Indicator Delta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* A. Vegetation Indicator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-emerald-400" />
                Vegetation Cover
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                {vegDelta > 0 ? 'IMPROVED' : 'DECLINED'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-slate-500 text-[10px] block">Baseline &rarr; Current</span>
                <span className="text-sm font-bold text-slate-300">
                  {impactData.before.vegetationPercent}% &rarr; {impactData.after.vegetationPercent}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400">
                  {vegDelta > 0 ? `+${vegDelta}%` : `${vegDelta}%`}
                </span>
                <span className="text-[10px] text-slate-500 block">percentage points</span>
              </div>
            </div>
          </div>

          {/* B. Water Presence Indicator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-cyan-400" />
                Surface Water Presence
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                {waterDelta > 0 ? 'IMPROVED' : 'DECLINED'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-slate-500 text-[10px] block">Baseline &rarr; Current</span>
                <span className="text-sm font-bold text-slate-300">
                  {impactData.before.waterPresencePercent}% &rarr; {impactData.after.waterPresencePercent}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-cyan-400">
                  {waterDelta > 0 ? `+${waterDelta}%` : `${waterDelta}%`}
                </span>
                <span className="text-[10px] text-slate-500 block">percentage points</span>
              </div>
            </div>
          </div>

          {/* C. Barren / Degraded Area Reduction */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-400" />
                Barren / Degraded Footprint
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                {barrenDelta < 0 ? 'REDUCED (-12%)' : 'INCREASED'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-slate-500 text-[10px] block">Baseline &rarr; Current</span>
                <span className="text-sm font-bold text-slate-300">
                  {impactData.before.barrenAreaPercent}% &rarr; {impactData.after.barrenAreaPercent}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400">
                  {barrenDelta > 0 ? `+${barrenDelta}%` : `${barrenDelta}%`}
                </span>
                <span className="text-[10px] text-slate-500 block">reduction</span>
              </div>
            </div>
          </div>

          {/* D. NDVI Vegetative Vigour */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-400" />
                Mean NDVI
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30 uppercase">
                {ndviDelta > 0 ? `+${ndviDelta}` : ndviDelta}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-slate-500 text-[10px] block">Baseline &rarr; Current</span>
                <span className="text-sm font-bold text-slate-300">
                  {impactData.before.ndvi} &rarr; {impactData.after.ndvi}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-teal-400">
                  {ndviDelta > 0 ? `+${ndviDelta}` : ndviDelta}
                </span>
                <span className="text-[10px] text-slate-500 block">spectral delta</span>
              </div>
            </div>
          </div>

          {/* E. Soil / Erosion Risk */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Soil / Erosion Risk
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                IMPROVED
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-slate-500 text-[10px] block">Baseline Risk</span>
                <span className="text-sm font-bold text-rose-400">{impactData.before.erosionRisk}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500" />
              <div className="text-right">
                <span className="text-slate-500 text-[10px] block">Current Risk</span>
                <span className="text-sm font-bold text-emerald-400">{impactData.after.erosionRisk}</span>
              </div>
            </div>
          </div>

          {/* F. Overall Health Score */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400" />
                Catchment Health Score
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                +{healthDelta} PTS
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-slate-500 text-[10px] block">Baseline &rarr; Current</span>
                <span className="text-sm font-bold text-slate-300">
                  {impactData.before.healthScore} &rarr; {impactData.after.healthScore}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400">
                  +{healthDelta}/100
                </span>
                <span className="text-[10px] text-slate-500 block">health index</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Detailed NDVI Analysis & Scale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* NDVI Card (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-teal-400" />
              NDVI Vegetation Vigour Scale
            </h4>
            <span className="text-xs font-bold text-teal-400">
              Delta: {ndviDelta > 0 ? `+${ndviDelta}` : ndviDelta}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">NDVI Before</span>
              <strong className="text-base text-amber-400">{impactData.before.ndvi}</strong>
              <span className="text-[9px] text-slate-500 block mt-0.5">Moderate/Sparse</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">NDVI After</span>
              <strong className="text-base text-emerald-400">{impactData.after.ndvi}</strong>
              <span className="text-[9px] text-emerald-400/80 block mt-0.5">Healthy Biomass</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Net Change</span>
              <strong className="text-base text-cyan-400">+{ndviDelta}</strong>
              <span className="text-[9px] text-cyan-400/80 block mt-0.5">+34.2% Growth</span>
            </div>
          </div>

          {/* Visual gradient scale */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.0 (Barren/Rock)</span>
              <span>0.5 (Dense Vegetation)</span>
              <span>1.0 (Lush Canopy)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-amber-800 via-yellow-600 to-emerald-500 relative border border-slate-700">
              {/* Before pointer */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg -mt-1 -mb-1"
                style={{ left: `${impactData.before.ndvi * 100}%` }}
                title={`Before NDVI: ${impactData.before.ndvi}`}
              />
              {/* After pointer */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-emerald-200 shadow-xl -mt-1.5 -mb-1.5"
                style={{ left: `${impactData.after.ndvi * 100}%` }}
                title={`After NDVI: ${impactData.after.ndvi}`}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 pt-1">
              <span>&bull; Before Marker ({impactData.before.ndvi})</span>
              <span className="text-emerald-400 font-bold">&bull; Current Monitored ({impactData.after.ndvi})</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
            &bull; <strong>Interpretation:</strong> Vegetation vigour increased markedly within the intervention influence zone, consistent with enhanced soil moisture retention behind the structure.
          </p>
        </div>

        {/* Dedicated Water Analysis (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-cyan-400" />
              Surface Water &amp; Moisture Dynamics
            </h4>
            <span className="text-xs font-bold text-cyan-400">
              Area: +{waterAreaDeltaPct}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Surface Water Extent</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-white">{impactData.after.waterSurfaceAreaKm2} km²</span>
                <span className="text-xs text-slate-400">(was {impactData.before.waterSurfaceAreaKm2} km²)</span>
              </div>
              <span className="text-[10px] text-emerald-400 block font-bold">+{waterAreaDeltaPct}% Expansion</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Detection Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-cyan-400">{impactData.after.waterConfidence}%</span>
                <span className="text-xs text-slate-400">(was {impactData.before.waterConfidence}%)</span>
              </div>
              <span className="text-[10px] text-slate-400 block">High Spectral Signal</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Estimated Soil Moisture:</span>
              <span className="text-cyan-400 font-bold">{impactData.after.soilMoisture}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Hydrological Connectivity:</span>
              <span className="text-emerald-400 font-bold">Restored Perennial Flow</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
            &bull; <strong>Interpretation:</strong> Significant increase in detected surface water within the monitored zone. Post-monsoon retention extended by approx. 70 days.
          </p>
        </div>
      </div>

      {/* 6. Land Use / Land Cover (LULC) Change Analysis Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              Land Use / Land Cover (LULC) Compositional Shift
            </h3>
            <p className="text-[11px] text-slate-400">
              Multi-temporal class classification based on ISRO Bhuvan 1:50K &amp; Sentinel-2 MSI
            </p>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            Total Monitored Footprint: 100%
          </span>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={lulcChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 80]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Before" fill="#f59e0b" name="2022 Baseline (%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="After" fill="#10b981" name="2026 Assessment (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LULC Shift Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <th className="py-2 px-3">LULC Category</th>
                <th className="py-2 px-3 text-center">Before (2022)</th>
                <th className="py-2 px-3 text-center">After (2026)</th>
                <th className="py-2 px-3 text-center">Net Delta</th>
                <th className="py-2 px-3">Ecological Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Vegetation</td>
                <td className="py-2.5 px-3 text-center text-amber-400">{impactData.lulc.before.vegetation}%</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{impactData.lulc.after.vegetation}%</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">+{impactData.lulc.after.vegetation - impactData.lulc.before.vegetation}%</td>
                <td className="py-2.5 px-3 text-slate-300">Significant riparian &amp; terraced canopy expansion</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Water Bodies</td>
                <td className="py-2.5 px-3 text-center text-amber-400">{impactData.lulc.before.water}%</td>
                <td className="py-2.5 px-3 text-center text-cyan-400 font-bold">{impactData.lulc.after.water}%</td>
                <td className="py-2.5 px-3 text-center text-cyan-400 font-bold">+{impactData.lulc.after.water - impactData.lulc.before.water}%</td>
                <td className="py-2.5 px-3 text-slate-300">Expanded check dam ponding pool &amp; seepage channel</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Agriculture</td>
                <td className="py-2.5 px-3 text-center text-amber-400">{impactData.lulc.before.agriculture}%</td>
                <td className="py-2.5 px-3 text-center text-slate-300">{impactData.lulc.after.agriculture}%</td>
                <td className="py-2.5 px-3 text-center text-slate-400">{impactData.lulc.after.agriculture - impactData.lulc.before.agriculture}%</td>
                <td className="py-2.5 px-3 text-slate-300">Stable agricultural footprint with enhanced multi-cropping</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-white">Barren / Degraded</td>
                <td className="py-2.5 px-3 text-center text-rose-400">{impactData.lulc.before.barren}%</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{impactData.lulc.after.barren}%</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{impactData.lulc.after.barren - impactData.lulc.before.barren}%</td>
                <td className="py-2.5 px-3 text-slate-300">12% reduction in exposed rocky wasteland &amp; erosion gullies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Field Evidence & Satellite Cross-Correlation */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Field Evidence &amp; Satellite Multi-Modal Correlation
            </h3>
            <p className="text-[11px] text-slate-400">
              Cross-validating remote orbital spectral signatures against geo-tagged on-ground inspection records.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
            ✓ DIRECTIONALLY CONSISTENT
          </span>
        </div>

        <div className="space-y-3">
          {impactData.fieldCorrelation.map((corr, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/30 transition space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {corr.metric}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950 rounded border border-emerald-500/20">
                  {corr.consistency}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase block mb-0.5">
                    🛰️ Satellite Observation
                  </span>
                  <p>{corr.satelliteObservation}</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-0.5">
                    📸 Field Survey Ground Truth
                  </span>
                  <p>{corr.fieldFinding}</p>
                </div>
              </div>

              <p className="text-[11px] text-emerald-300/90 pt-0.5">
                &bull; <em>{corr.interpretation}</em>
              </p>
            </div>
          ))}
        </div>

        {/* Linked Field Evidence Cards */}
        {evidenceList.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Associated Verified Ground Evidence Records ({impactData.fieldEvidenceIds.join(', ')})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evidenceList.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvidenceModal?.(ev)}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition cursor-pointer group"
                >
                  <img
                    src={ev.thumbnailUrl || ev.photoUrl}
                    alt={ev.caption}
                    className="h-12 w-16 rounded object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 group-hover:text-emerald-300">
                        {ev.id}
                      </span>
                      <span className="text-[9px] text-slate-400">{ev.capturedAt.split(' ')[0]}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] truncate mt-0.5">{ev.caption}</p>
                    <span className="text-[10px] text-cyan-400 block mt-0.5">
                      AI: {ev.aiAnalysis.structureDetected} ({ev.aiAnalysis.confidenceScore}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 8. Demo Project Impact Timeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              DEMO PROJECT MULTI-YEAR IMPACT TIMELINE
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            2022 &rarr; 2026 (4-Year Lifecycle)
          </span>
        </div>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-4 sm:pl-6 space-y-4">
          {impactData.timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[21px] sm:-left-[29px] top-1.5 h-3.5 w-3.5 rounded-full bg-slate-950 border-2 border-emerald-400 group-hover:bg-emerald-400 transition" />
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.year}
                </span>
                <span className="text-xs font-bold text-white">{item.title}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 9. AI-Assisted Impact Interpretation & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* AI-Assisted Interpretation (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                AI-ASSISTED IMPACT INTERPRETATION
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Confidence: {impactData.aiInterpretation.confidence}%
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {impactData.aiInterpretation.summary}
          </p>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
            ⚠️ <strong>SCIENTIFIC PRINCIPLE:</strong> {impactData.aiInterpretation.disclaimer}
          </div>
        </div>

        {/* Actionable Recommendations (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              Prescriptive Recommendations
            </h4>
            <span className="text-[10px] text-slate-400">Action Plan</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            {impactData.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};