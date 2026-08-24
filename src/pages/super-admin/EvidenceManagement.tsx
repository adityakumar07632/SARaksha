import React, { useState } from 'react';
import { Camera, CheckCircle2, Clock, AlertTriangle, Filter, Sparkles, MapPin, Calendar, Check, X } from 'lucide-react';
import { MOCK_FIELD_EVIDENCE } from '../../data/mockData';
import { FieldEvidence } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { EvidenceImage } from '../../components/ui/EvidenceImage';

import { useData } from '../../context/DataContext';

export const EvidenceManagement: React.FC = () => {
  const { evidenceList, approveEvidence, flagEvidence, totalEvidenceCount, pendingVerificationCount } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = statusFilter === 'ALL'
    ? evidenceList
    : evidenceList.filter((e) => e.verificationStatus === statusFilter);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
            Field Evidence Verification Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geo-tagged photographic audit trail with assistive AI model diagnostics.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Evidence"
          value={evidenceList.length.toString()}
          subtitle="All recorded surveys"
          icon={Camera}
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="Verified"
          value={evidenceList.filter((e) => e.verificationStatus === 'VERIFIED').length.toString()}
          subtitle="Human signed-off"
          icon={CheckCircle2}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Pending Audit"
          value={pendingVerificationCount.toString()}
          subtitle="Awaiting sign-off"
          icon={Clock}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          title="Flagged"
          value={evidenceList.filter((e) => e.verificationStatus === 'FLAGGED').length.toString()}
          subtitle="Requires field re-inspection"
          icon={AlertTriangle}
          iconColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />
      </div>

      {/* Evidence Pipeline Workflow Visualizer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 sm:p-4">
        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-2">
          Evidence Ingestion &amp; Verification Workflow
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block text-[11px] sm:text-xs">1. Field Upload</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400">GNSS &amp; Timestamp</span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-indigo-400 font-bold block text-[11px] sm:text-xs">2. AI Inference</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400">Structure &amp; Silt</span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950 border border-amber-500/40">
            <span className="text-amber-400 font-bold block text-[11px] sm:text-xs">3. Pending Queue</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400">Officer Verification</span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40">
            <span className="text-emerald-400 font-bold block text-[11px] sm:text-xs">4. Verified Ledger</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400">Locked to Chain</span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-rose-400 font-bold block text-[11px] sm:text-xs">5. Action</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400">Alert Dispatched</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'VERIFIED', 'PENDING', 'FLAGGED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              statusFilter === tab
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video bg-black">
                <EvidenceImage
                  src={item.photoUrl}
                  alt={item.caption}
                  coordinates={item.coordinates}
                  structureCode={item.interventionId}
                  provenanceLabel="DEMO FIELD EVIDENCE"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 z-10">
                  <Badge status={item.verificationStatus} size="sm" />
                </div>
                <div className="absolute bottom-2 left-2 z-10 bg-black/80 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-300 backdrop-blur-xs">
                  📍 {item.coordinates[0].toFixed(4)}° N, {item.coordinates[1].toFixed(4)}° E
                </div>
              </div>

              <div className="p-4 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">
                    {item.interventionName} ({item.interventionId})
                  </span>
                  <p className="text-slate-300 text-xs mt-0.5 font-sans leading-snug">
                    {item.caption}
                  </p>
                </div>

                {/* AI Analysis Snippet */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-indigo-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Prediction:
                    </span>
                    <span>{item.aiAnalysis.confidenceScore}% conf</span>
                  </div>
                  <p className="text-slate-400 text-[10px]">
                    {item.aiAnalysis.structureDetected} &bull; Issue: {item.aiAnalysis.potentialIssue}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Actions */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                By: {item.uploadedBy.name}
              </span>
              <div className="flex gap-2">
                {item.verificationStatus !== 'VERIFIED' && (
                  <button
                    onClick={() => approveEvidence(item.id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold font-mono transition flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    <span>Approve</span>
                  </button>
                )}
                {item.verificationStatus !== 'FLAGGED' && (
                  <button
                    onClick={() => flagEvidence(item.id)}
                    className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded text-[11px] font-bold font-mono transition flex items-center gap-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    <span>Flag</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
