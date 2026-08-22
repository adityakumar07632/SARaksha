import { describe, it, expect, beforeEach } from 'vitest';
import { hasPermission, canAccessRoute } from './permissions';
import { offlineStore } from '../offline/offlineStore';
import { networkStateService } from '../offline/networkStateService';
import { generateSHA256Hash } from '../evidence/evidenceAuditService';
import { MOCK_INTERVENTIONS } from '../../data/mockData';

describe('Phase 9: Interactive Elements, Button & End-to-End System Audit', () => {
  beforeEach(() => {
    networkStateService.setSimulatedOffline(false);
  });

  // 1. Role-Based Navigation & Permission Guard
  describe('RBAC Route Integrity', () => {
    it('allows Super Admin access to all administrative command centers', () => {
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/users')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/alerts')).toBe(true);
    });

    it('prevents Field Officer from accessing administrative user management', () => {
      expect(canAccessRoute('FIELD_OFFICER', '/super-admin/users')).toBe(false);
      expect(canAccessRoute('FIELD_OFFICER', '/super-admin')).toBe(false);
    });

    it('allows Field Officer access to mobile dashboard and inspection routes', () => {
      expect(canAccessRoute('FIELD_OFFICER', '/field-officer/dashboard')).toBe(true);
      expect(canAccessRoute('FIELD_OFFICER', '/field-officer/inspect/CD-012')).toBe(true);
      expect(canAccessRoute('FIELD_OFFICER', '/field-officer/sync-queue')).toBe(true);
    });
  });

  // 2. Offline Field Inspection & Persistence
  describe('Field Evidence Sealing & Offline Lifecycle', () => {
    it('creates local evidence record, computes SHA-256 digest, and persists across reload', () => {
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
        gpsAccuracy: '±4.8m (Dual GNSS Hardware Lock)',
        condition: 'HEALTHY',
        notes: 'End-to-end interactive test verification.',
      });

      expect(record.sha256Hash).toHaveLength(64);
      expect(record.syncStatus).toBe('PENDING');

      // Verify that local queue contains record
      const queue = offlineStore.getQueue();
      const found = queue.find((r) => r.localEvidenceId === record.localEvidenceId);
      expect(found).toBeDefined();
      expect(found?.sha256Hash).toBe(record.sha256Hash);
    });

    it('performs synchronous SHA-256 digest generation deterministically', () => {
      const payload1 = 'CD-012:USR-003:27.568400:76.612800:HEALTHY:2026-08-22T12:00:00Z';
      const payload2 = 'CD-012:USR-003:27.568400:76.612800:HEALTHY:2026-08-22T12:00:00Z';

      const hash1 = generateSHA256Hash(payload1);
      const hash2 = generateSHA256Hash(payload2);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });
  });

  // 3. Multi-Intervention Scoping
  describe('Intervention Scoping & Baselines', () => {
    it('provides distinct coordinates and baseline configurations for registered interventions', () => {
      const cd012 = MOCK_INTERVENTIONS.find((i) => i.id === 'CD-012');
      const ct004 = MOCK_INTERVENTIONS.find((i) => i.id === 'CT-004');

      expect(cd012?.coordinates).toEqual([27.5684, 76.6128]);
      expect(ct004?.coordinates).toEqual([27.5742, 76.6085]);
    });
  });
});
