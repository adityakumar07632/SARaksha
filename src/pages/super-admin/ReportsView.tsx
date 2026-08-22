import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, Sparkles, MapPin, Calendar } from 'lucide-react';
import { MOCK_WATERSHEDS, MOCK_INTERVENTIONS, MOCK_HEALTH_BREAKDOWN_CD012 } from '../../data/mockData';

export const ReportsView: React.FC = () => {
  const [selectedWatershedId, setSelectedWatershedId] = useState('WS-001');
  const [reportGenerated, setReportGenerated] = useState(false);

  const watershed = MOCK_WATERSHEDS.find((w) => w.id === selectedWatershedId) || MOCK_WATERSHEDS[0];
  const interventions = MOCK_INTERVENTIONS.filter((i) => i.watershedId === watershed.id);

  const handleGenerate = () => {
    setReportGenerated(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
            Watershed Comprehensive Dossier &amp; Audit Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compile traceable evidence packages into official government briefing documents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            value={selectedWatershedId}
            onChange={(e) => {
              setSelectedWatershedId(e.target.value);
              setReportGenerated(false);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          >
            {MOCK_WATERSHEDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.code} - {w.name} ({w.state})
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            className="px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {reportGenerated ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-4 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 max-w-4xl mx-auto font-sans">
          {/* Report Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-emerald-500/40 pb-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                GOVERNMENT OF INDIA &bull; SARaksha EVIDENCE DOSSIER
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                Watershed Impact &amp; Ground Verification Audit
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Jurisdiction: {watershed.name} ({watershed.code}) &bull; {watershed.state} &bull; {watershed.district}
              </p>
            </div>
            <div className="text-left sm:text-right font-mono shrink-0">
              <span className="text-xs text-slate-400">Audit Status:</span>
              <div className="text-emerald-400 font-bold text-sm">COMPLIANT (81/100)</div>
              <span className="text-[10px] text-slate-500">Dated: 22 Aug 2026</span>
            </div>
          </div>

          {/* Report Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Catchment Area</span>
              <span className="text-white font-bold">{watershed.areaHa.toLocaleString()} Ha</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Total Interventions</span>
              <span className="text-white font-bold">{watershed.totalInterventions} Units Monitored</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Primary Focus Structure</span>
              <span className="text-emerald-400 font-bold">Check Dam #12 (CD-012)</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Spectral Vegetation Gain</span>
              <span className="text-cyan-400 font-bold">+18% Post-Monsoon Biomass</span>
            </div>
          </div>

          {/* Evidence Chain Verification Stamp */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 font-mono text-xs text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Cryptographic & Ground Audit Trace Confirmed</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Photographic evidence (14 Aug 2026), dual GNSS locks (27.5684° N, 76.6128° E), and multi-spectral Sentinel-2 indices have been audited by Nodal Authority Dr. Rajesh Sharma.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print Briefing Document</span>
            </button>
            <button
              onClick={() => alert('Demo PDF download simulated!')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <Download className="h-4 w-4" />
              <span>Download Official PDF (Simulated)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center max-w-xl mx-auto space-y-3">
          <FileText className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white font-mono">
            Select a Watershed and Generate Report
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Compiles GIS boundaries, intervention records, field photographs, NDVI/NDWI trends, and health scores into an exportable document.
          </p>
        </div>
      )}
    </div>
  );
};
