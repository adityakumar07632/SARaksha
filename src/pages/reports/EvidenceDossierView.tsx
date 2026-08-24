import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Sparkles,
  GitCompare,
  Layers,
  Leaf,
  Droplets,
  Activity,
  ShieldCheck,
  Compass,
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldAlert,
  BarChart3,
  Check,
} from 'lucide-react';
import {
  MOCK_INTERVENTIONS,
  MOCK_FIELD_EVIDENCE,
  MOCK_IMPACT_ANALYSIS,
  getImpactAnalysis,
  getImpactClassificationMeta,
} from '../../data/mockData';
import { evidenceAuditService } from '../../services/evidence/evidenceAuditService';
import { SARakshaLogo } from '../../components/branding/SARakshaLogo';

export const EvidenceDossierView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const interventionId = searchParams.get('interventionId') || 'INT-RAJ-ALW-001';
  const mode = searchParams.get('mode') || 'compliance';
  const isFromScenario = searchParams.get('scenario') === '6' || (location.state as any)?.fromScenario;
  const returnTo = (location.state as any)?.returnTo;

  // Find target intervention and evidence
  const intervention =
    MOCK_INTERVENTIONS.find((item) => item.id === interventionId || item.code === interventionId) ||
    MOCK_INTERVENTIONS[0];

  const evidence =
    MOCK_FIELD_EVIDENCE.find((e) => e.interventionId === intervention.id) ||
    MOCK_FIELD_EVIDENCE[0];

  const impactData = getImpactAnalysis(intervention.id) || MOCK_IMPACT_ANALYSIS['CD-012'];
  const meta = getImpactClassificationMeta(impactData.classification);

  const auditTrail = evidenceAuditService.getAuditTrail(intervention.id);
  const reportId = mode === 'impact' ? `IMPACT-DOSSIER-${intervention.code}-20260824` : `DOSSIER-${intervention.code}-20260818`;
  const generatedAt = '24 Aug 2026, 15:45 IST';
  const generatedBy = 'Dr. Rajesh Sharma (Super Admin)';
  const isRealSatelliteData = false;

  const medianNdvi = 0.0949;
  const medianNdwi = -0.1348;
  const pctChange = -80.6;
  const validPixels = 121;
  const validPct = 100.0;

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo);
    } else if (isFromScenario) {
      navigate('/super-admin?sihModal=true');
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/super-admin');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12 selection:bg-emerald-500 selection:text-white">
      {/* 1. In-App Navigation Bar (Hidden in Print/PDF) */}
      <div className="no-print sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer font-mono text-xs sm:text-sm font-bold min-h-[44px] min-w-[44px] shrink-0"
            aria-label="Back to Evaluation Scenarios"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">
              {isFromScenario ? 'Back to Evaluation Scenarios' : 'Back to Previous View'}
            </span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Title / Branding */}
          <div className="flex items-center gap-2 min-w-0">
            <SARakshaLogo variant="icon" size="sm" priority />
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-black text-white font-mono truncate">
                Evidence Dossier
              </span>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-mono font-semibold truncate hidden sm:block">
                COMPLIANCE &bull; {intervention.code}
              </span>
            </div>
          </div>

          {/* Print / Save as PDF Action */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs sm:text-sm font-bold transition cursor-pointer shadow-lg shadow-emerald-950 min-h-[44px] shrink-0"
            aria-label="Print or Save Dossier as PDF"
          >
            <Printer className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Print / Save as PDF</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      </div>

      {/* 2. Main Evidence Dossier Content Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {mode === 'impact' ? (
          /* ======================================================== */
          /* 17-SECTION WATERSHED IMPACT DOSSIER */
          /* ======================================================== */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="border-b-2 border-emerald-500 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  🟡 DEMO ANALYSIS &bull; REPRESENTATIVE DATA
                </span>
                <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-2">
                  SARaksha Watershed Impact &amp; Change Dossier
                </h1>
                <div className="text-slate-400 text-xs font-mono mt-1 space-y-0.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                  <span>Dossier ID: <strong className="text-slate-200">{reportId}</strong></span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>Generated: {generatedAt}</span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>Signatory: {generatedBy}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Project Overview */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                1. Project Overview &amp; Monitored Hydrological Catchment
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs font-mono">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Watershed Name</span>
                  <span className="text-sm font-bold text-white block mt-1 truncate">{intervention.watershedName}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">State &bull; District</span>
                  <span className="text-sm font-bold text-white block mt-1 truncate">{intervention.state} &bull; {intervention.district}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Monitored AOI</span>
                  <span className="text-sm font-bold text-cyan-400 block mt-1">{impactData.areaKm2} km²</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Overall Status</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-1">{meta.label}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Intervention Details */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                2. Intervention Engineering Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs font-mono">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Structure Code</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-1">{intervention.code}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Structure Type</span>
                  <span className="text-sm font-bold text-white block mt-1 truncate">{intervention.type}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Lifecycle Stage</span>
                  <span className="text-sm font-bold text-white block mt-1">{intervention.lifecycleStage}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 uppercase block">Implementing Agency</span>
                  <span className="text-sm font-bold text-white block mt-1 truncate">{intervention.implementingAgency}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Geographic Location */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                3. Geographic Location &amp; Spatial Anchor
              </h2>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">GNSS Coordinates</span>
                  <strong className="text-emerald-400 text-sm">{intervention.coordinates[0].toFixed(4)}° N, {intervention.coordinates[1].toFixed(4)}° E</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Spatial Influence Zone</span>
                  <span className="text-white font-bold">{impactData.areaKm2} km² Bounding Footprint</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Sensor Resolution</span>
                  <span className="text-indigo-300 font-bold">Sentinel-2 Multi-Spectral (10m BOA)</span>
                </div>
              </div>
            </div>

            {/* Sections 4 & 5: Before and After Satellite Assessment */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                4 &amp; 5. Multi-Temporal Satellite Assessment (Baseline vs Current)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 4. Before Assessment */}
                <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-amber-400 font-bold">
                    <span>4. BEFORE: {impactData.before.periodLabel}</span>
                    <span className="text-[10px] text-slate-400">{impactData.before.date}</span>
                  </div>
                  <img src={impactData.before.image} alt="Before Baseline" className="w-full rounded-lg aspect-video object-cover filter saturate-75 brightness-90 border border-slate-800" />
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px]">
                    <div className="bg-slate-900 p-1.5 rounded"><span className="text-slate-500 block">NDVI</span><strong>{impactData.before.ndvi}</strong></div>
                    <div className="bg-slate-900 p-1.5 rounded"><span className="text-slate-500 block">Vegetation</span><strong>{impactData.before.vegetationPercent}%</strong></div>
                    <div className="bg-slate-900 p-1.5 rounded"><span className="text-slate-500 block">Water</span><strong>{impactData.before.waterPresencePercent}%</strong></div>
                  </div>
                </div>

                {/* 5. After Assessment */}
                <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>5. AFTER: {impactData.after.periodLabel}</span>
                    <span className="text-[10px] text-slate-400">{impactData.after.date}</span>
                  </div>
                  <img src={impactData.after.image} alt="After Current" className="w-full rounded-lg aspect-video object-cover border border-slate-800" />
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px]">
                    <div className="bg-slate-900 p-1.5 rounded"><span className="text-slate-500 block">NDVI</span><strong className="text-emerald-400">{impactData.after.ndvi}</strong></div>
                    <div className="bg-slate-900 p-1.5 rounded"><span className="text-slate-500 block">Vegetation</span><strong className="text-emerald-400">{impactData.after.vegetationPercent}%</strong></div>
                    <div className="bg-slate-900 p-1.5 rounded"><span className="text-slate-500 block">Water</span><strong className="text-cyan-400">{impactData.after.waterPresencePercent}%</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections 6, 7 & 8: Vegetation, Water & NDVI Analysis */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                6, 7 &amp; 8. Multi-Spectral Environmental Dynamics (Vegetation, Water &amp; NDVI)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {/* 6. Vegetation Analysis */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">6. Vegetation Cover</span>
                    <span className="text-emerald-400 font-bold">+{impactData.after.vegetationPercent - impactData.before.vegetationPercent}%</span>
                  </div>
                  <div className="text-lg font-bold text-white">{impactData.before.vegetationPercent}% &rarr; {impactData.after.vegetationPercent}%</div>
                  <p className="text-[11px] text-slate-400 pt-1">Vegetation canopy coverage expanded across riparian and terraced zones.</p>
                </div>

                {/* 7. Water Analysis */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">7. Surface Water Extent</span>
                    <span className="text-cyan-400 font-bold">+{Math.round(((impactData.after.waterSurfaceAreaKm2 - impactData.before.waterSurfaceAreaKm2) / (impactData.before.waterSurfaceAreaKm2 || 0.01)) * 100)}%</span>
                  </div>
                  <div className="text-lg font-bold text-white">{impactData.before.waterSurfaceAreaKm2} km² &rarr; {impactData.after.waterSurfaceAreaKm2} km²</div>
                  <p className="text-[11px] text-slate-400 pt-1">Surface water presence increased from {impactData.before.waterPresencePercent}% to {impactData.after.waterPresencePercent}%.</p>
                </div>

                {/* 8. NDVI Analysis */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">8. Mean NDVI</span>
                    <span className="text-teal-400 font-bold">+{(impactData.after.ndvi - impactData.before.ndvi).toFixed(2)}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{impactData.before.ndvi} &rarr; {impactData.after.ndvi}</div>
                  <p className="text-[11px] text-slate-400 pt-1">Vegetation vigour increased within the intervention influence zone.</p>
                </div>
              </div>
            </div>

            {/* Section 9: Land Use / Land Cover (LULC) Change */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                9. Land Use / Land Cover (LULC) Change Matrix
              </h2>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                      <th className="pb-2">LULC Class</th>
                      <th className="pb-2 text-center">Baseline 2022</th>
                      <th className="pb-2 text-center">Monitored 2026</th>
                      <th className="pb-2 text-center">Net Delta</th>
                      <th className="pb-2">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2 font-bold text-white">Vegetation</td>
                      <td className="py-2 text-center text-amber-400">{impactData.lulc.before.vegetation}%</td>
                      <td className="py-2 text-center text-emerald-400 font-bold">{impactData.lulc.after.vegetation}%</td>
                      <td className="py-2 text-center text-emerald-400 font-bold">+{impactData.lulc.after.vegetation - impactData.lulc.before.vegetation}%</td>
                      <td className="py-2 text-slate-400">Canopy greening &amp; biomass expansion</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">Water Bodies</td>
                      <td className="py-2 text-center text-amber-400">{impactData.lulc.before.water}%</td>
                      <td className="py-2 text-center text-cyan-400 font-bold">{impactData.lulc.after.water}%</td>
                      <td className="py-2 text-center text-cyan-400 font-bold">+{impactData.lulc.after.water - impactData.lulc.before.water}%</td>
                      <td className="py-2 text-slate-400">Extended post-monsoon ponding storage</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">Agriculture</td>
                      <td className="py-2 text-center text-amber-400">{impactData.lulc.before.agriculture}%</td>
                      <td className="py-2 text-center text-slate-300">{impactData.lulc.after.agriculture}%</td>
                      <td className="py-2 text-center text-slate-400">{impactData.lulc.after.agriculture - impactData.lulc.before.agriculture}%</td>
                      <td className="py-2 text-slate-400">Enhanced double-cropping security</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">Barren / Degraded</td>
                      <td className="py-2 text-center text-rose-400">{impactData.lulc.before.barren}%</td>
                      <td className="py-2 text-center text-emerald-400 font-bold">{impactData.lulc.after.barren}%</td>
                      <td className="py-2 text-center text-emerald-400 font-bold">{impactData.lulc.after.barren - impactData.lulc.before.barren}%</td>
                      <td className="py-2 text-slate-400">Erosion gullies reclaimed &amp; stabilized</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 10 & 11: Field Evidence & Multi-Modal Comparison */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                10 &amp; 11. Ground Field Evidence &amp; Multi-Modal Correlation
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {impactData.fieldPhotos?.before && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">10. Ground Baseline Photo (2022)</span>
                    <img src={impactData.fieldPhotos.before.url} alt="Field Before" className="w-full rounded-lg aspect-video object-cover border border-slate-800" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">{impactData.fieldPhotos.before.caption}</p>
                  </div>
                )}
                {impactData.fieldPhotos?.after && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">11. Ground Verified Photo (2026)</span>
                    <img src={impactData.fieldPhotos.after.url} alt="Field After" className="w-full rounded-lg aspect-video object-cover border border-slate-800" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">{impactData.fieldPhotos.after.caption}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 12 & 13: Impact Score & Change Detection Summary */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                12 &amp; 13. Overall Impact Score &amp; Change Detection Summary
              </h2>
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-emerald-400">+{impactData.impactScore} Points</span>
                    <span className="text-xs text-slate-300">({impactData.before.healthScore}/100 &rarr; {impactData.after.healthScore}/100)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                    {meta.label}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed pt-1">
                  13. <strong>Change Detection Summary:</strong> Satellite and field evidence are directionally consistent. Multi-temporal Sentinel-2 spectral indicators corroborate on-ground structural water retention and vegetation recovery.
                </p>
              </div>
            </div>

            {/* Section 14: AI-Assisted Impact Interpretation */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1 mb-3">
                14. AI-Assisted Impact Interpretation
              </h2>
              <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300 font-bold">Assistive Multi-Spectral Inference</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                    Confidence: {impactData.aiInterpretation.confidence}%
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed">{impactData.aiInterpretation.summary}</p>
                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px]">
                  ⚠️ <strong>SCIENTIFIC PRINCIPLE:</strong> {impactData.aiInterpretation.disclaimer}
                </div>
              </div>
            </div>

            {/* Section 15: Recommendations Engine */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                15. Prescriptive Recommendations
              </h2>
              <ul className="space-y-1.5 font-mono text-xs">
                {impactData.recommendations.map((rec, idx) => (
                  <li key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2 text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 16: Cryptographic Evidence Integrity / SHA-256 */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                16. Evidence Integrity &amp; Cryptographic SHA-256 Seal
              </h2>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">✓ IMMUTABLE AUDIT TRAIL LOCKED</span>
                  <span className="text-[10px] text-slate-400">Signatory: {generatedBy}</span>
                </div>
                <div className="text-[10px] text-sky-400 bg-sky-950/40 border border-sky-800/40 p-2 rounded break-all select-all">
                  {auditTrail[0]?.tamperEvidentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>
            </div>

            {/* Section 17: Legal & DEMO DATA Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200 leading-relaxed font-sans">
              ⚖️ <strong>17. DEMO DATA &amp; SCIENTIFIC DISCLAIMER:</strong> This SARaksha Watershed Impact Dossier utilizes representative demonstration data to illustrate multi-temporal satellite change detection and on-ground field evidence correlation. Observed spectral changes describe surface environmental indicators and do not claim causal attribution without local hydrological modeling.
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* ORIGINAL COMPLIANCE EVIDENCE DOSSIER */
          /* ======================================================== */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="border-b-2 border-emerald-500 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                    isRealSatelliteData
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isRealSatelliteData ? '🛰️ REAL ORBITAL SATELLITE DATA' : '🟡 PROTOTYPE DEMONSTRATION DATA'}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-2">
                  SARaksha Evidence Dossier
                </h1>
                <div className="text-slate-400 text-xs font-mono mt-1 space-y-0.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                  <span>
                    Dossier ID: <strong className="text-slate-200">{reportId}</strong>
                  </span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>Generated: {generatedAt}</span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>Signatory: {generatedBy}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Intervention Engineering & Spatial Identity */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                1. Intervention Engineering &amp; Spatial Identity
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Structure ID</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 block mt-1">
                    {intervention.code}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Asset Name</span>
                  <span className="text-sm font-bold text-white block mt-1 truncate">
                    {intervention.name}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Catchment</span>
                  <span className="text-sm font-bold text-white block mt-1 truncate">
                    {intervention.watershedName}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">GNSS Coordinates</span>
                  <span className="text-xs font-bold font-mono text-white block mt-1 truncate">
                    {intervention.coordinates[0].toFixed(4)}° N, {intervention.coordinates[1].toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Sentinel-2 MSI Level-2A Raster Surface Reflectance Analysis */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                2. Sentinel-2 MSI Level-2A Raster Surface Reflectance Analysis (10m Resolution)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Orbital Scene ID</span>
                  <span className="text-xs font-bold font-mono text-white block mt-1 truncate">
                    S2A_32VNJ_20240818
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">AOI Raster Grid</span>
                  <span className="text-xs font-bold font-mono text-white block mt-1">
                    11x11 (121 Pixels)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Validated Pixels</span>
                  <span className="text-xs font-bold font-mono text-emerald-400 block mt-1">
                    {validPixels} ({validPct}%)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Radiometric Scaling</span>
                  <span className="text-xs font-bold font-mono text-white block mt-1">
                    DN / 10,000.0 (BOA)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    🌿 Current Median NDVI (Vegetation Health)
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {medianNdvi}{' '}
                    <span className="text-xs font-normal text-slate-400">(StdDev: ±0.0182)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Baseline: 0.4912 &bull; Multi-temporal Change:{' '}
                    <strong className="text-rose-400">{pctChange}%</strong>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    💧 Current Median NDWI (Moisture Index)
                  </span>
                  <div className="text-xl font-bold font-mono text-cyan-400">
                    {medianNdwi}{' '}
                    <span className="text-xs font-normal text-slate-400">(StdDev: ±0.0145)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Formula: McFeeters 1996 (Band 3 Green - Band 8 NIR) / (Green + NIR)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Spectral Anomaly Engine Interpretation */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                3. SARaksha Anomaly Engine Interpretation
              </h2>
              <div className="bg-slate-950 border border-slate-800 border-l-4 border-l-rose-500 rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-rose-400 font-mono text-xs sm:text-sm">
                    🔴 HIGH PRIORITY SPECTRAL ANOMALY DETECTED
                  </strong>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold">
                    {pctChange}% DEVIATION (vs 0.4900 Ref)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Median NDVI dropped to {medianNdvi} across the 110m x 110m intervention AOI relative to the configured reference baseline (0.4900).
                  <strong className="text-white ml-1">Action Mandate:</strong> Immediate on-site field verification recommended to inspect structural seal integrity, siltation apron, and downstream buffer.
                </p>
              </div>
            </div>

            {/* Section 4: Geo-tagged Field Evidence & Human Verification */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                4. Ground Field Evidence &amp; Human Verification Sign-off
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>Ground Photographic Evidence</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                      🟡 DEMO FIELD EVIDENCE
                    </span>
                  </div>
                  <img
                    src={evidence.photoUrl}
                    alt="Field Evidence"
                    className="w-full rounded-lg aspect-video object-cover border border-slate-800"
                  />
                  <div className="text-[10px] text-slate-400 font-mono">
                    Photo ID: {evidence.id} &bull; GNSS: {evidence.coordinates[0].toFixed(4)}° N, {evidence.coordinates[1].toFixed(4)}° E &bull; Accuracy: {evidence.accuracyM || '±5m'}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Human Verification Record
                    </span>
                    <div className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>HUMAN SIGNED &amp; LOCKED</span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1 leading-relaxed pt-1">
                      <div><strong>Signatory:</strong> Dr. Rajesh Sharma (Super Admin)</div>
                      <div><strong>Role:</strong> National Project Director (PMKSY-WDC)</div>
                      <div><strong>Verification Timestamp:</strong> 18 Aug 2026, 09:15 UTC</div>
                      <div><strong>Finding:</strong> Physical masonry structure intact; minor silt build-up confirmed on upstream pool apron.</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Tamper-Evident SHA-256 Hash
                    </span>
                    <div className="text-[10px] font-mono text-sky-400 bg-sky-950/40 border border-sky-800/40 p-2 rounded break-all select-all">
                      {auditTrail[0]?.tamperEvidentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Traceable Compliance Audit Trail */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1 mb-3">
                5. Traceable Compliance Audit Trail
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                      <th className="pb-2">Timestamp</th>
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Actor</th>
                      <th className="pb-2">Tamper-Evident SHA-256</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {auditTrail.map((a, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/50">
                        <td className="py-2.5 text-slate-400">
                          {a.timestamp.replace('T', ' ').substring(0, 19)}
                        </td>
                        <td className="py-2.5 font-bold text-white">{a.action}</td>
                        <td className="py-2.5 text-slate-300">
                          {a.actor} ({a.actorRole})
                        </td>
                        <td className="py-2.5 text-sky-400 text-[10px]">
                          {a.tamperEvidentHash.substring(0, 20)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 leading-relaxed font-sans">
              ⚖️ <strong>LEGAL &amp; SCIENTIFIC NOTICE:</strong> This SARaksha Evidence Dossier provides cryptographic tamper-evident audit records linking Sentinel-2 Level-2A 10m spectral observations with ground GNSS evidence. Spectral anomalies describe surface vegetation index variations and mandate on-site engineering verification before physical remediation.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
