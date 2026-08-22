import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { generateSHA256Hash, evidenceAuditService } from '../../services/evidence/evidenceAuditService';

export const FieldOfficerEvidence: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { interventions, inspections, addEvidence } = useData();

  // Multi-intervention assignment scoping: Filter interventions assigned to the active user (or all in demo mode)
  const assignedInterventions = interventions.filter(
    (i) => i.assignedOfficerId === currentUser?.id || i.watershedId === 'WS-001'
  );

  // Form State
  const [selectedInterventionId, setSelectedInterventionId] = useState('CD-012');
  const [latitude, setLatitude] = useState('27.5684');
  const [longitude, setLongitude] = useState('76.6128');
  const [accuracy, setAccuracy] = useState('±5m (Dual GNSS Lock)');
  const [physicalCondition, setPhysicalCondition] = useState<'HEALTHY' | 'MINOR_ISSUE' | 'REQUIRES_REPAIR' | 'CRITICAL'>('HEALTHY');
  const [description, setDescription] = useState('Reinforced masonry check dam upstream reservoir ponding verified post-monsoon. Downstream silt apron inspected.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  const selectedIntervention =
    assignedInterventions.find((i) => i.id === selectedInterventionId) ||
    assignedInterventions[0] ||
    interventions[0];

  const handleCaptureGPS = () => {
    setLatitude(selectedIntervention.coordinates[0].toFixed(4));
    setLongitude(selectedIntervention.coordinates[1].toFixed(4));
    setAccuracy('±5m (Dual GNSS Hardware Lock)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const sha256 = generateSHA256Hash(`${selectedIntervention.id}:${description}:${timestamp}`);

    setTimeout(() => {
      const createdEvidence = addEvidence({
        interventionId: selectedIntervention.id,
        interventionName: selectedIntervention.name,
        watershedId: selectedIntervention.watershedId,
        photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
        caption: description,
        coordinates: [parseFloat(latitude) || 27.5684, parseFloat(longitude) || 76.6128],
        accuracyM: accuracy,
        uploadedBy: {
          id: currentUser?.id || 'USR-003',
          name: currentUser?.name || 'Vikram Singh',
          role: 'Field Officer (Alwar Block 3)',
        },
        verificationStatus: 'PENDING',
        notes: `Observed Condition: ${physicalCondition}. Submitted via Mobile Field App.`,
        aiAnalysis: {
          structureDetected: `${selectedIntervention.type} (Masonry)`,
          structureConfidence: 89,
          waterDetected: true,
          waterConfidence: 94,
          vegetationDetected: true,
          vegetationConfidence: 82,
          potentialIssue: physicalCondition === 'HEALTHY' ? 'Structural seal intact; normal seasonal sedimentation.' : 'Requires structural masonry patch.',
          confidenceScore: 91,
          recommendation: 'Queued for human review & sign-off by nodal officer.',
          requiresHumanReview: true,
        },
      });

      // Record audit event
      evidenceAuditService.recordEvent({
        entityId: selectedIntervention.id,
        action: 'FIELD_EVIDENCE_ADDED',
        actor: currentUser?.name || 'Vikram Singh',
        actorRole: 'FIELD_OFFICER',
        details: `Field photograph and GNSS lock recorded for ${selectedIntervention.name}. Condition: ${physicalCondition}.`,
      });

      setIsSubmitting(false);
      setSubmittedResult({ ...createdEvidence, sha256Hash: sha256, physicalCondition });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      {/* Mobile-Friendly Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/30 uppercase">
            FIELD INSPECTION HUB
          </span>
          <span className="text-xs font-mono text-slate-400">
            Assigned Officer: <strong className="text-slate-200">{currentUser?.name || 'Vikram Singh'}</strong> ({assignedInterventions.length} Assigned Assets)
          </span>
        </div>
        <h1 className="text-2xl font-black text-white font-mono tracking-tight mt-1">
          Geo-Tagged Evidence Submission
        </h1>
      </div>

      {/* Assigned Inspection Tasks Section */}
      {inspections.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 font-mono uppercase flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4" />
              Assigned Field Tasks ({inspections.length})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Priority Queue</span>
          </div>

          <div className="space-y-2">
            {inspections.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedInterventionId(task.interventionId)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">{task.interventionName}</span>
                    <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{task.reason}</p>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <span className="text-amber-400 font-bold block">{task.status}</span>
                  <span className="text-slate-500">Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!submittedResult ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Select Intervention */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              1. Select Assigned Intervention
            </label>
            <select
              value={selectedInterventionId}
              onChange={(e) => setSelectedInterventionId(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            >
              {assignedInterventions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name} ({item.watershedName})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Catchment: {selectedIntervention.watershedName}</span>
              <Badge status={selectedIntervention.lifecycleStage} size="sm" />
            </div>
          </div>

          {/* Step 2: Photo Capture / Upload */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              2. Field Photograph Capture
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/80 p-8 text-center hover:border-emerald-500/50 transition cursor-pointer">
              <Camera className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-mono text-slate-200 font-bold">
                Tap to capture or upload ground survey photo
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Hardware EXIF + Dual GNSS coordinates embedded automatically
              </p>
              <div className="mt-3 inline-block px-3.5 py-1.5 bg-slate-900 text-emerald-300 text-xs font-mono rounded-lg border border-slate-700">
                survey_ground_photo_${selectedIntervention.code.toLowerCase()}.jpg
              </div>
            </div>
          </div>

          {/* Step 3: GNSS Lock & Observed Condition */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                3. Precision GNSS Coordinates & Physical Condition
              </label>
              <button
                type="button"
                onClick={handleCaptureGPS}
                className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1 font-semibold cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Acquire GNSS Lock</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">Latitude (°N)</span>
                <input
                  type="text"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">Longitude (°E)</span>
                <input
                  type="text"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-mono block mb-1">Observed Structural Condition</span>
              <select
                value={physicalCondition}
                onChange={(e: any) => setPhysicalCondition(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white"
              >
                <option value="HEALTHY">🟢 HEALTHY — Structure sound, normal storage functioning</option>
                <option value="MINOR_ISSUE">🟡 MINOR ISSUE — Surface siltation or vegetation weed growth</option>
                <option value="REQUIRES_REPAIR">🟠 REQUIRES REPAIR — Foundation erosion or masonry crack</option>
                <option value="CRITICAL">🔴 CRITICAL — Structural breach or severe silt blockage</option>
              </select>
            </div>

            <div className="text-[10px] text-cyan-400 font-mono">
              Signal Lock: {accuracy}
            </div>
          </div>

          {/* Step 4: Notes */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              4. Field Inspection Notes
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-wider shadow-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-emerald-950/50"
          >
            {isSubmitting ? (
              <span>Computing SHA-256 Hash & Transmitting...</span>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Submit Field Evidence & Lock Cryptographic Hash</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Result Confirmation */
        <div className="rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-6 shadow-2xl space-y-5 font-mono">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Evidence Submitted & Cryptographically Sealed</h2>
              <span className="text-xs text-slate-400">Evidence ID: {submittedResult.id} &bull; Status: PENDING HUMAN REVIEW</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
              <KeyRound className="h-4 w-4" />
              <span>Tamper-Evident SHA-256 Digest:</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-cyan-300 break-all border border-slate-800">
              {submittedResult.sha256Hash}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
            ⚠️ <strong>Scientific Separation:</strong> Ground photo is now queued in {selectedIntervention.name}'s dossier. It will become <strong className="text-white">HUMAN VERIFIED</strong> only after formal nodal reviewer sign-off.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setSubmittedResult(null)}
              className="flex-1 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Upload Another Survey
            </button>
            <button
              onClick={() => navigate(`/intervention/${selectedInterventionId}`)}
              className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View in Intervention Dossier</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
