import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { networkStateService, NetworkStatus } from '../../services/offline/networkStateService';
import { offlineStore, OfflineEvidenceRecord } from '../../services/offline/offlineStore';
import { Badge } from '../../components/ui/Badge';

export const FieldOfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { interventions } = useData();

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(networkStateService.getStatus());
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(networkStateService.isSimulatedOffline());
  const [queue, setQueue] = useState<OfflineEvidenceRecord[]>(offlineStore.getQueue());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsub = networkStateService.subscribe((status) => {
      setNetworkStatus(status);
      setIsSimulatedOffline(networkStateService.isSimulatedOffline());
      setQueue(offlineStore.getQueue());
    });
    return unsub;
  }, []);

  const assignedInterventions = offlineStore.getCachedInterventions(currentUser?.id);

  const pendingCount = queue.filter((r) => r.syncStatus === 'PENDING' || r.syncStatus === 'FAILED').length;
  const syncedCount = queue.filter((r) => r.syncStatus === 'SYNCED').length;

  const handleToggleOffline = () => {
    const next = !isSimulatedOffline;
    networkStateService.setSimulatedOffline(next);
    setIsSimulatedOffline(next);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await offlineStore.syncAllPending();
    setQueue(offlineStore.getQueue());
    setIsSyncing(false);
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto font-sans pb-12">
      {/* Mobile Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                FIELD OFFICER PWA
              </span>
              <h1 className="text-base font-black text-white font-mono">
                {currentUser?.name || 'Vikram Singh'}
              </h1>
            </div>
          </div>

          {/* Network Status Toggle / Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleOffline}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                networkStatus === 'OFFLINE'
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                  : networkStatus === 'SYNCING'
                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {networkStatus === 'OFFLINE' ? (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-rose-400" />
                  <span>OFFLINE (SIM)</span>
                </>
              ) : networkStatus === 'SYNCING' ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                  <span>SYNCING</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  <span>ONLINE</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Assigned Block: <strong>Alwar Block 3 (Rajasthan)</strong></span>
          <span className="text-emerald-400 font-bold">{assignedInterventions.length} Monitored Assets</span>
        </div>
      </div>

      {/* Sync Queue Banner Widget */}
      {pendingCount > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 shadow-lg flex items-center justify-between font-mono">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Clock className="h-4 w-4" />
              <span>{pendingCount} Evidence Record{pendingCount > 1 ? 's' : ''} Queued Locally</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 font-sans">
              Stored securely on device with SHA-256 integrity seal.
            </p>
          </div>
          <button
            onClick={networkStatus === 'ONLINE' ? handleManualSync : () => navigate('/field-officer/sync-queue')}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : networkStatus === 'ONLINE' ? 'Sync Now' : 'View Queue'}</span>
          </button>
        </div>
      )}

      {/* Today's Assigned Inspections List */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>Today's Assigned Inspections</span>
          </h2>
          <span className="text-[10px] text-slate-500">Auto-Cached for Offline</span>
        </div>

        {assignedInterventions.map((item) => {
          const isPrimaryAnomaly = item.id === 'CD-012';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isPrimaryAnomaly
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-xl'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {item.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {item.watershedName} &bull; {item.type}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400">{item.healthScore}/100</span>
                  <span className="text-[9px] text-slate-500 uppercase block">Health</span>
                </div>
              </div>

              {/* Priority Spectral Anomaly Alert Tag */}
              {isPrimaryAnomaly && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>PRIORITY INSPECTION: -80.6% Spectral Anomaly</span>
                  </span>
                  <span className="text-[10px] font-bold bg-rose-500/20 px-1.5 py-0.5 rounded">
                    S2C L2A
                  </span>
                </div>
              )}

              {/* Location Coordinates */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{item.coordinates[0].toFixed(4)}° N, {item.coordinates[1].toFixed(4)}° E</span>
                </span>
                <Badge status={item.lifecycleStage} size="sm" />
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => navigate(`/field-officer/inspect/${item.id}`)}
                className={`mt-3 w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isPrimaryAnomaly
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>Start Offline Field Inspection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sync Queue Link Button */}
      <div className="pt-2">
        <Link
          to="/field-officer/sync-queue"
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-bold transition flex items-center justify-between"
        >
          <span>View Local Sync Queue ({queue.length} Total Records)</span>
          <span className="text-emerald-400 font-bold">{syncedCount} Synced &bull; {pendingCount} Pending &rarr;</span>
        </Link>
      </div>
    </div>
  );
};
