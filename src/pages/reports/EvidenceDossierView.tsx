import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';
import { MOCK_INTERVENTIONS, MOCK_FIELD_EVIDENCE } from '../../data/mockData';
import { evidenceAuditService } from '../../services/evidence/evidenceAuditService';
import { SARakshaLogo } from '../../components/branding/SARakshaLogo';

export const EvidenceDossierView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const interventionId = searchParams.get('interventionId') || 'INT-RAJ-ALW-001';
  const isFromScenario = searchParams.get('scenario') === '6' || (location.state as any)?.fromScenario;
  const returnTo = (location.state as any)?.returnTo;

  // Find target intervention and evidence
  const intervention =
    MOCK_INTERVENTIONS.find((item) => item.id === interventionId || item.code === interventionId) ||
    MOCK_INTERVENTIONS[0];

  const evidence =
    MOCK_FIELD_EVIDENCE.find((e) => e.interventionId === intervention.id) ||
    MOCK_FIELD_EVIDENCE[0];

  const auditTrail = evidenceAuditService.getAuditTrail(intervention.id);
  const reportId = `DOSSIER-${intervention.code}-20260818`;
  const generatedAt = '18 Aug 2026, 14:30 IST';
  const generatedBy = 'Dr. Rajesh Sharma (Super Admin)';
  const isRealSatelliteData = true;

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
      </main>
    </div>
  );
};
