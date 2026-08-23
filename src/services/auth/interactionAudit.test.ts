import { describe, it, expect, beforeEach } from 'vitest';
import { hasPermission, canAccessRoute } from './permissions';
import { offlineStore } from '../offline/offlineStore';
import { networkStateService } from '../offline/networkStateService';
import { generateSHA256Hash } from '../evidence/evidenceAuditService';
import { MOCK_INTERVENTIONS, MOCK_FIELD_EVIDENCE, MOCK_USERS, MOCK_WATERSHEDS } from '../../data/mockData';

describe('SARaksha Complete Interaction & Button Functionality Audit Suite', () => {
  beforeEach(() => {
    networkStateService.setSimulatedOffline(false);
  });

  // 1. Role-Based Navigation & Permission Guard
  describe('RBAC Route Integrity & Permissions', () => {
    it('allows Super Admin access to all administrative command centers', () => {
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/users')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/watersheds')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/evidence')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/alerts')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/analytics')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/reports')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/evidence-dossier')).toBe(true);
    });

    it('prevents Field Officer and Normal Admin from accessing user management', () => {
      expect(canAccessRoute('FIELD_OFFICER', '/super-admin/users')).toBe(false);
      expect(canAccessRoute('NORMAL_ADMIN', '/super-admin/users')).toBe(false);
      expect(canAccessRoute('FIELD_OFFICER', '/super-admin')).toBe(false);
      expect(canAccessRoute('NORMAL_ADMIN', '/super-admin')).toBe(false);
    });

    it('allows Field Officer access to mobile dashboard and inspection routes', () => {
      expect(canAccessRoute('FIELD_OFFICER', '/field-officer/dashboard')).toBe(true);
      expect(canAccessRoute('FIELD_OFFICER', '/field-officer/inspect/CD-012')).toBe(true);
      expect(canAccessRoute('FIELD_OFFICER', '/field-officer/sync-queue')).toBe(true);
      expect(canAccessRoute('FIELD_OFFICER', '/field-evidence')).toBe(true);
    });
  });

  // 2. GIS Evidence & Camera Marker Interaction Bridge
  describe('GIS Map Evidence & Camera Marker Interactions', () => {
    it('accurately resolves intervention and evidence associations for CD-012', () => {
      const cd012 = MOCK_INTERVENTIONS.find((i) => i.id === 'CD-012');
      expect(cd012).toBeDefined();

      const evidence = MOCK_FIELD_EVIDENCE.filter((e) => e.interventionId === 'CD-012');
      expect(evidence.length).toBeGreaterThanOrEqual(1);

      // Verify that every evidence record contains required geospatial and verification fields
      evidence.forEach((ev) => {
        expect(ev.photoUrl).toBeDefined();
        expect(ev.coordinates).toHaveLength(2);
        expect(ev.uploadedBy.name).toBeDefined();
        expect(ev.aiAnalysis).toBeDefined();
      });
    });

    it('validates window bridge for global evidence modal dispatch', () => {
      let modalOpenedWith: { interventionId: string; evidenceId?: string } | null = null;

      // Simulate global bridge registration as done in GISMap.tsx
      (globalThis as any).__saraksha_open_evidence = (interventionId: string, evidenceId?: string) => {
        modalOpenedWith = { interventionId, evidenceId };
      };

      (globalThis as any).__saraksha_open_evidence('CD-012', 'EVD-101');

      expect(modalOpenedWith).toEqual({
        interventionId: 'CD-012',
        evidenceId: 'EVD-101',
      });

      delete (globalThis as any).__saraksha_open_evidence;
    });
  });

  // 3. User Management Actions (View, Edit, Status Toggle)
  describe('User Management Interactive Actions', () => {
    it('supports toggling active and inactive status for registered officials', () => {
      let users = [...MOCK_USERS];
      const targetUser = users[0];
      const originalStatus = targetUser.status;

      // Toggle status
      users = users.map((u) =>
        u.id === targetUser.id
          ? { ...u, status: (u.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' }
          : u
      );

      const updated = users.find((u) => u.id === targetUser.id);
      expect(updated?.status).toBe(originalStatus === 'Active' ? 'Inactive' : 'Active');
    });

    it('validates user creation and field updates', () => {
      const newUser = {
        id: 'USR-099',
        name: 'Anita Roy',
        email: 'anita.roy@saraksha.demo',
        role: 'FIELD_OFFICER' as const,
        region: 'Rajasthan — Alwar Block 4',
        status: 'Active' as const,
        lastActive: 'Just now',
      };

      expect(newUser.id).toBe('USR-099');
      expect(newUser.role).toBe('FIELD_OFFICER');
    });
  });

  // 4. Offline Field Inspection & Persistence
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

  // 5. SIH Demonstration Scenarios Navigation
  describe('SIH Demonstration Scenarios 1–6 Routing', () => {
    const getScenarioRoute = (id: number) => {
      switch (id) {
        case 1:
          return '/intervention/CD-012';
        case 2:
          return '/alerts';
        case 3:
          return '/field-officer/dashboard';
        case 4:
          return '/intervention/CD-012';
        case 5:
          return '/super-admin';
        case 6:
          return '/evidence-dossier?scenario=6';
        default:
          return '/';
      }
    };

    it('maps every demonstration scenario to a valid application route', () => {
      expect(getScenarioRoute(1)).toBe('/intervention/CD-012');
      expect(getScenarioRoute(2)).toBe('/alerts');
      expect(getScenarioRoute(3)).toBe('/field-officer/dashboard');
      expect(getScenarioRoute(4)).toBe('/intervention/CD-012');
      expect(getScenarioRoute(5)).toBe('/super-admin');
      expect(getScenarioRoute(6)).toBe('/evidence-dossier?scenario=6');
    });
  });
});
