import { describe, it, expect } from 'vitest';
import { hasPermission, canAccessRoute } from './permissions';
import { generateSHA256Hash, evidenceAuditService } from '../evidence/evidenceAuditService';
import { generateEvidenceDossierHTML } from '../reports/evidenceDossierGenerator';
import { MOCK_INTERVENTIONS, MOCK_FIELD_EVIDENCE } from '../../data/mockData';

describe('Phase 6: RBAC, Cryptographic Hashing & Evidence Audit', () => {
  // 1. Role-Based Access Control
  describe('RBAC Permissions & Route Access', () => {
    it('grants Super Admin full permissions including MANAGE_USERS', () => {
      expect(hasPermission('SUPER_ADMIN', 'MANAGE_USERS')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'GENERATE_REPORTS')).toBe(true);
      expect(canAccessRoute('SUPER_ADMIN', '/super-admin/users')).toBe(true);
    });

    it('denies Normal Admin and Field Officer access to user management', () => {
      expect(hasPermission('NORMAL_ADMIN', 'MANAGE_USERS')).toBe(false);
      expect(hasPermission('FIELD_OFFICER', 'MANAGE_USERS')).toBe(false);
      expect(canAccessRoute('NORMAL_ADMIN', '/super-admin/users')).toBe(false);
      expect(canAccessRoute('FIELD_OFFICER', '/super-admin')).toBe(false);
    });

    it('permits Field Officer to upload evidence', () => {
      expect(hasPermission('FIELD_OFFICER', 'UPLOAD_EVIDENCE')).toBe(true);
      expect(canAccessRoute('FIELD_OFFICER', '/field-evidence')).toBe(true);
    });
  });

  // 2. Cryptographic SHA-256 Tamper-Evident Hashing
  describe('SHA-256 Tamper-Evident Hashing', () => {
    it('produces deterministic 64-character hex hash string', () => {
      const hash1 = generateSHA256Hash('CD-012:S2A_32VNJ_20240818_0_L2A:2024-08-18');
      const hash2 = generateSHA256Hash('CD-012:S2A_32VNJ_20240818_0_L2A:2024-08-18');

      expect(hash1).toHaveLength(64);
      expect(hash1).toBe(hash2);
    });

    it('produces different hash for modified evidence payload', () => {
      const original = generateSHA256Hash('CD-012:EVD-101:VERIFIED');
      const tampered = generateSHA256Hash('CD-012:EVD-101:FLAGGED');

      expect(original).not.toBe(tampered);
    });
  });

  // 3. Evidence Audit Trail Logging
  describe('Evidence Audit Trail', () => {
    it('records immutable audit events with timestamps and hashes', () => {
      const initialCount = evidenceAuditService.getAuditTrail('CD-012').length;
      expect(initialCount).toBeGreaterThanOrEqual(1);

      const record = evidenceAuditService.recordEvent({
        entityId: 'CD-012',
        action: 'HUMAN_VERIFICATION_COMPLETED',
        actor: 'Dr. Rajesh Sharma',
        actorRole: 'SUPER_ADMIN',
        details: 'Approved downstream apron structural integrity.',
      });

      expect(record.id).toContain('AUD-');
      expect(record.tamperEvidentHash).toHaveLength(64);
      expect(evidenceAuditService.getAuditTrail('CD-012').length).toBe(initialCount + 1);
    });
  });

  // 4. Evidence Dossier Report Generation
  describe('Evidence Dossier Report Compilation', () => {
    it('compiles comprehensive HTML dossier containing all compliance sections', () => {
      const intervention = MOCK_INTERVENTIONS[0];
      const evidence = MOCK_FIELD_EVIDENCE[0];
      const auditTrail = evidenceAuditService.getAuditTrail(intervention.id);

      const html = generateEvidenceDossierHTML({
        intervention,
        evidence,
        rasterAnalysis: null,
        auditTrail,
        generatedBy: 'Dr. Rajesh Sharma (Super Admin)',
        generatedAt: '2026-08-22T12:00:00Z',
        reportId: 'DOSSIER-CD-012-TEST',
        isRealSatelliteData: true,
      });

      expect(html).toContain('SARaksha Evidence Dossier');
      expect(html).toContain('Check Dam #12');
      expect(html).toContain('REAL ORBITAL SATELLITE DATA');
      expect(html).toContain('Tamper-Evident SHA-256');
      expect(html).toContain('HUMAN SIGNED & LOCKED');
    });
  });
});
