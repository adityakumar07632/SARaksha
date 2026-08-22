import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Trash2,
  Wifi,
  WifiOff,
  Layers,
  MapPin,
  Camera,
} from 'lucide-react';
import { offlineStore, OfflineEvidenceRecord } from '../../services/offline/offlineStore';
import { networkStateService, NetworkStatus } from '../../services/offline/networkStateService';

export const SyncQueue: React.FC = () => {
  const navigate = useNavigate();
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(networkStateService.getStatus());
  const [queue, setQueue] = useState<OfflineEvidenceRecord[]>(offlineStore.getQueue());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsub = networkStateService.subscribe((status) => {
      setNetworkStatus(status);
      setQueue(offlineStore.getQueue());
    });
    return unsub;
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    await offlineStore.syncAllPending();
    setQueue(offlineStore.getQueue());
    setIsSyncing(false);
  };

  const handleClearSynced = () => {
    offlineStore.clearSyncedRecords();
    setQueue(offlineStore.getQueue());
  };

  const pendingRecords = queue.filter((r) => r.syncStatus === 'PENDING' || r.syncStatus === 'FAILED');
  const syncedRecords = queue.filter((r) => r.syncStatus === 'SYNCED');

  return (
    <div className="space-y-5 max-w-xl mx-auto font-sans pb-12">
      {/* Top Header */}
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
            {networkStatus === 'OFFLINE' ? '🔴 OFFLINE' : '🟢 ONLINE'}
          </span>
        </div>
      </div>

      {/* Queue Summary Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 font-mono flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
            Offline Synchronization Queue
          </span>
          <h1 className="text-base font-black text-white mt-0.5">
            {pendingRecords.length} Pending &bull; {syncedRecords.length} Synced
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {pendingRecords.length > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={isSyncing || networkStatus === 'OFFLINE'}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}

          {syncedRecords.length > 0 && (
            <button
              onClick={handleClearSynced}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-xl transition cursor-pointer"
              title="Clear Synced Records"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-3 font-mono">
        {queue.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-xs text-slate-500">
            No evidence records in local queue.
          </div>
        ) : (
          queue.map((item) => {
            const isSynced = item.syncStatus === 'SYNCED';
            const isFailed = item.syncStatus === 'FAILED';
            const isPending = item.syncStatus === 'PENDING';
            const isSyncingItem = item.syncStatus === 'SYNCING';

            return (
              <div
                key={item.localEvidenceId}
                className={`p-4 rounded-2xl border transition-all ${
                  isSynced
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                    : isFailed
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.interventionName}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {item.interventionId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">{item.notes}</p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                      isSynced
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isFailed
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isSyncingItem
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.syncStatus}
                  </span>
                </div>

                {/* Evidence Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[9px] text-slate-500 block">Condition</span>
                    <span className="text-emerald-400 font-bold">{item.condition}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[9px] text-slate-500 block">GNSS Accuracy</span>
                    <span className="text-white font-bold">{item.gpsAccuracy}</span>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Hash Digest */}
                <div className="mt-2 p-2 rounded bg-slate-950 border border-slate-800/80 text-[10px] text-cyan-300 break-all flex items-center gap-1.5">
                  <KeyRound className="h-3 w-3 shrink-0 text-cyan-400" />
                  <span>{item.sha256Hash.slice(0, 24)}...{item.sha256Hash.slice(-8)}</span>
                </div>

                {/* Timestamps & Server Sync ID */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Captured: {new Date(item.capturedAt).toLocaleTimeString()}</span>
                  {item.serverEvidenceId && (
                    <span className="text-emerald-400 font-bold">Server ID: {item.serverEvidenceId}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
