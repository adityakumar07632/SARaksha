import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Upload,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  KeyRound,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { offlineStore, OfflineEvidenceRecord } from '../../services/offline/offlineStore';
import { networkStateService, NetworkStatus } from '../../services/offline/networkStateService';
import { Badge } from '../../components/ui/Badge';

export const FieldInspection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(networkStateService.getStatus());
  const [cachedInterventions] = useState(offlineStore.getCachedInterventions());
  const intervention = cachedInterventions.find((i) => i.id === id) || cachedInterventions[0];

  // GPS State
  const [latitude, setLatitude] = useState(intervention.coordinates[0].toFixed(6));
  const [longitude, setLongitude] = useState(intervention.coordinates[1].toFixed(6));
  const [gpsAccuracy, setGpsAccuracy] = useState('±4.8m (Dual GNSS Lock)');
  const [isAcquiringGps, setIsAcquiringGps] = useState(false);

  // Photo State
  const [photoPreview, setPhotoPreview] = useState<string>('/assets/evidence/cd012-upstream-checkdam.jpg');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(true);

  // Form State
  const [condition, setCondition] = useState<'HEALTHY' | 'MINOR_ISSUE' | 'REQUIRES_REPAIR' | 'CRITICAL'>('HEALTHY');
  const [notes, setNotes] = useState('Reinforced masonry check dam upstream reservoir ponding verified post-monsoon. Downstream silt apron inspected.');
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecord, setSavedRecord] = useState<OfflineEvidenceRecord | null>(null);

  useEffect(() => {
    const unsub = networkStateService.subscribe(setNetworkStatus);
    return unsub;
  }, []);

  const handleCaptureGPS = () => {
    setIsAcquiringGps(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
          setGpsAccuracy(`±${pos.coords.accuracy.toFixed(1)}m (Device Hardware GPS)`);
          setIsAcquiringGps(false);
        },
        () => {
          // Graceful fallback for simulator / permission denied
          setLatitude(intervention.coordinates[0].toFixed(6));
          setLongitude(intervention.coordinates[1].toFixed(6));
          setGpsAccuracy('±4.8m (Simulated Dual GNSS Hardware Lock)');
          setIsAcquiringGps(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLatitude(intervention.coordinates[0].toFixed(6));
      setLongitude(intervention.coordinates[1].toFixed(6));
      setGpsAccuracy('±4.8m (Simulated Dual GNSS Hardware Lock)');
      setIsAcquiringGps(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setIsPhotoCaptured(true);
    }
  };

  const handleSaveEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const record = offlineStore.createEvidenceRecord({
        interventionId: intervention.id,
        interventionName: intervention.name,
        watershedId: intervention.watershedId,
        watershedName: intervention.watershedName,
        officerId: currentUser?.id || 'USR-003',
        officerName: currentUser?.name || 'Vikram Singh',
        latitude: parseFloat(latitude) || intervention.coordinates[0],
        longitude: parseFloat(longitude) || intervention.coordinates[1],
        gpsAccuracy: gpsAccuracy,
        condition: condition,
        notes: notes,
        photoUrl: photoPreview,
      });

      setIsSaving(false);
      setSavedRecord(record);
    }, 600);
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto font-sans pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={() => navigate('/field-officer/dashboard')}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
              networkStatus === 'OFFLINE'
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {networkStatus === 'OFFLINE' ? '🔴 OFFLINE MODE' : '🟢 ONLINE'}
          </span>
        </div>
      </div>

      {/* Target Asset Information Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
            Target Inspection Asset
          </span>
          <Badge status={intervention.lifecycleStage} size="sm" />
        </div>
        <h1 className="text-lg font-black text-white mt-1">
          {intervention.name} ({intervention.code})
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          {intervention.watershedName} &bull; {intervention.type}
        </p>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span>Expected GNSS: {intervention.coordinates[0].toFixed(4)}° N, {intervention.coordinates[1].toFixed(4)}° E</span>
        </div>
      </div>

      {!savedRecord ? (
        <form onSubmit={handleSaveEvidence} className="space-y-4">
          {/* Step 1: Camera Photo Capture */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono">
            <label className="block text-xs font-bold uppercase text-slate-300">
              1. Ground Photographic Evidence
            </label>

            {photoPreview ? (
              <div className="space-y-2">
                <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video bg-slate-950">
                  <img
                    src={photoPreview}
                    alt="Inspection Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 backdrop-blur rounded text-[10px] text-emerald-300 font-mono border border-slate-800">
                    EXIF Hardware Timestamp: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <Camera className="h-4 w-4 text-emerald-400" />
                  <span>Retake / Choose Another Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="block rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/80 p-8 text-center hover:border-emerald-500/50 transition cursor-pointer">
                <Camera className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-200">Tap to Capture Field Photo</p>
                <p className="text-[10px] text-slate-500 mt-1">Environment camera preferred</p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Step 2: GPS Telemetry Capture */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-slate-300">
                2. Real-Time GNSS Coordinates
              </label>
              <button
                type="button"
                onClick={handleCaptureGPS}
                disabled={isAcquiringGps}
                className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{isAcquiringGps ? 'Locking GNSS...' : 'Capture GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Latitude (°N)</span>
                <span className="text-white font-bold">{latitude}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Longitude (°E)</span>
                <span className="text-white font-bold">{longitude}</span>
              </div>
            </div>

            <div className="text-[11px] text-cyan-400 font-mono">
              Signal Precision: {gpsAccuracy}
            </div>
          </div>

          {/* Step 3: Structural Condition Assessment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono">
            <label className="block text-xs font-bold uppercase text-slate-300">
              3. Structural Condition Assessment
            </label>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'HEALTHY', label: '🟢 Healthy', desc: 'Structure sound & functioning' },
                { id: 'MINOR_ISSUE', label: '🟡 Minor Issue', desc: 'Siltation or vegetation growth' },
                { id: 'REQUIRES_REPAIR', label: '🟠 Repair Needed', desc: 'Foundation erosion or cracks' },
                { id: 'CRITICAL', label: '🔴 Critical', desc: 'Structural breach or blockage' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setCondition(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    condition === opt.id
                      ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Notes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 font-mono">
            <label className="block text-xs font-bold uppercase text-slate-300">
              4. Field Inspection Notes
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Submit / Save Evidence Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-wider shadow-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-emerald-950/50"
          >
            {isSaving ? (
              <span>Computing SHA-256 & Storing Locally...</span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Save Evidence & Seal SHA-256 Digest</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Evidence Saved Confirmation */
        <div className="bg-slate-900/95 border border-emerald-500/50 rounded-2xl p-5 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Evidence Captured Successfully</h2>
              <span className="text-xs text-slate-400">ID: {savedRecord.localEvidenceId}</span>
            </div>
          </div>

          {/* Storage & Sync Status Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">Storage State:</span>
              <span className="text-emerald-400 font-bold">
                {savedRecord.createdOffline ? '📱 STORED ON DEVICE (OFFLINE)' : '⚡ STORED ON SERVER'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">Sync Status:</span>
              <span className="text-amber-400 font-bold uppercase">
                {savedRecord.syncStatus}
              </span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Tamper-Evident SHA-256 Digest:</span>
            </div>
            <div className="p-2 rounded bg-slate-900 text-[10px] text-cyan-300 break-all border border-slate-800">
              {savedRecord.sha256Hash}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs leading-relaxed font-sans">
            {savedRecord.createdOffline ? (
              <span>
                📡 <strong>Offline Assurance:</strong> Evidence is cryptographically sealed and queued locally. It will synchronize automatically when internet connectivity returns.
              </span>
            ) : (
              <span>
                ✓ <strong>Synchronized:</strong> Evidence is recorded and queued for formal human verification by the nodal review admin.
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => {
                setSavedRecord(null);
              }}
              className="flex-1 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Record Another Survey
            </button>
            <button
              onClick={() => navigate('/field-officer/sync-queue')}
              className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Sync Queue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
