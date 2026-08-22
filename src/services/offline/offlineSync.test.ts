import { describe, it, expect, beforeEach } from 'vitest';
import { networkStateService } from './networkStateService';
import { offlineStore } from './offlineStore';

describe('Phase 8: Offline-First Field Evidence Capture & Sync', () => {
  beforeEach(() => {
    networkStateService.setSimulatedOffline(false);
    offlineStore.clearSyncedRecords();
  });

  // 1. Network State Detection
  describe('Network State Monitor', () => {
    it('detects online and offline status correctly', () => {
      expect(networkStateService.isOnline()).toBe(true);

      networkStateService.setSimulatedOffline(true);
      expect(networkStateService.isOffline()).toBe(true);
      expect(networkStateService.getStatus()).toBe('OFFLINE');

      networkStateService.setSimulatedOffline(false);
      expect(networkStateService.isOnline()).toBe(true);
    });
  });

  // 2. Offline Evidence Sealing & Local Persistence
  describe('Offline Evidence Capture & SHA-256 Sealing', () => {
    it('creates local evidence record with deterministic SHA-256 hash when offline', () => {
      networkStateService.setSimulatedOffline(true);

      const record = offlineStore.createEvidenceRecord({
        interventionId: 'CD-012',
        interventionName: 'Check Dam #12',
        watershedId: 'WS-001',
        watershedName: 'Alwar North Catchment',
        officerId: 'USR-003',
        officerName: 'Vikram Singh',
        latitude: 27.568401,
        longitude: 76.612803,
        gpsAccuracy: '±4.8m (Dual GNSS Lock)',
        condition: 'HEALTHY',
        notes: 'Masonry wall intact, normal seasonal ponding.',
      });

      expect(record.localEvidenceId).toContain('LOCAL-EVD-');
      expect(record.sha256Hash).toHaveLength(64);
      expect(record.createdOffline).toBe(true);
      expect(record.syncStatus).toBe('PENDING');
      expect(offlineStore.getPendingCount()).toBeGreaterThanOrEqual(1);
    });
  });

  // 3. Automated Sync Lifecycle
  describe('Sync Lifecycle Transition', () => {
    it('transitions pending records to SYNCED upon network restoration', async () => {
      networkStateService.setSimulatedOffline(true);

      const record = offlineStore.createEvidenceRecord({
        interventionId: 'CD-012',
        interventionName: 'Check Dam #12',
        watershedId: 'WS-001',
        watershedName: 'Alwar North Catchment',
        officerId: 'USR-003',
        officerName: 'Vikram Singh',
        latitude: 27.568401,
        longitude: 76.612803,
        gpsAccuracy: '±4.8m (Dual GNSS Lock)',
        condition: 'HEALTHY',
        notes: 'Pre-sync verification test.',
      });

      expect(record.syncStatus).toBe('PENDING');

      // Restore network
      networkStateService.setSimulatedOffline(false);
      const syncResult = await offlineStore.syncAllPending();

      expect(syncResult.succeeded).toBeGreaterThanOrEqual(1);
      expect(offlineStore.getSyncedCount()).toBeGreaterThanOrEqual(1);
    });
  });

  // 4. Cached Interventions Scoping
  describe('Cached Interventions for Offline Use', () => {
    it('returns assigned interventions for active field officer', () => {
      const officerAssets = offlineStore.getCachedInterventions('USR-003');
      expect(officerAssets.length).toBeGreaterThanOrEqual(1);
      expect(officerAssets.some((i) => i.id === 'CD-012')).toBe(true);
    });
  });
});
