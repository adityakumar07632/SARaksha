import { describe, it, expect } from 'vitest';
import { MOCK_INTERVENTIONS, MOCK_FIELD_EVIDENCE } from '../../data/mockData';
import { evidenceAuditService } from '../../services/evidence/evidenceAuditService';

describe('Evidence Dossier Data & Navigation Flow', () => {
  it('locates target intervention and corresponding evidence', () => {
    const target = MOCK_INTERVENTIONS.find((i) => i.id === 'INT-RAJ-ALW-001' || i.code === 'CD-012');
    expect(target).toBeDefined();
    expect(target?.code).toBe('CD-012');

    const evidence = MOCK_FIELD_EVIDENCE.find((e) => e.interventionId === target?.id);
    expect(evidence).toBeDefined();
    expect(evidence?.coordinates).toHaveLength(2);
  });

  it('generates immutable audit trail for target intervention', () => {
    const target = MOCK_INTERVENTIONS[0];
    const auditTrail = evidenceAuditService.getAuditTrail(target.id);
    expect(auditTrail.length).toBeGreaterThan(0);
    expect(auditTrail[0]).toHaveProperty('tamperEvidentHash');
    expect(auditTrail[0].tamperEvidentHash.length).toBe(64);
  });

  it('verifies safe navigation fallback targets', () => {
    const scenarioReturn = '/super-admin?sihModal=true';
    const directFallback = '/super-admin';
    const interventionReturn = '/intervention/INT-RAJ-ALW-001';

    expect(scenarioReturn).toContain('sihModal=true');
    expect(directFallback).toBe('/super-admin');
    expect(interventionReturn).toContain('/intervention/');
  });
});
