import { describe, it, expect } from 'vitest';
import { MOCK_INTERVENTIONS } from '../../data/mockData';
import { monitoringService } from './monitoringService';
import { processAoiRasterAnalysis } from './rasterProcessor';
import { evidenceAuditService } from '../evidence/evidenceAuditService';

describe('Phase 7: Multi-Intervention Architecture, Idempotency & PostGIS Data Layer', () => {
  // 1. Multi-Intervention Baseline & Configuration
  describe('Multi-Intervention Configuration', () => {
    it('supports multiple registered interventions across catchments', () => {
      expect(MOCK_INTERVENTIONS.length).toBeGreaterThanOrEqual(4);
      const cd012 = MOCK_INTERVENTIONS.find((i) => i.id === 'CD-012');
      const ct004 = MOCK_INTERVENTIONS.find((i) => i.id === 'CT-004');
      const fp008 = MOCK_INTERVENTIONS.find((i) => i.id === 'FP-008');

      expect(cd012).toBeDefined();
      expect(ct004).toBeDefined();
      expect(fp008).toBeDefined();

      expect(cd012?.coordinates).toEqual([27.5684, 76.6128]);
      expect(ct004?.coordinates).toEqual([27.5742, 76.6085]);
    });

    it('calculates intervention-specific raster statistics for distinct coordinates', () => {
      const cd012Result = processAoiRasterAnalysis(27.5684, 76.6128);
      const ct004Result = processAoiRasterAnalysis(27.5742, 76.6085);

      expect(cd012Result.aoi.center).toEqual([27.5684, 76.6128]);
      expect(ct004Result.aoi.center).toEqual([27.5742, 76.6085]);
      expect(cd012Result.currentObservation.ndvi.validPixels).toBe(121);
      expect(ct004Result.currentObservation.ndvi.validPixels).toBe(121);
    });
  });

  // 2. Monitoring Idempotency & Deduplication
  describe('Monitoring Engine Idempotency', () => {
    it('guarantees that repeated scans for the same scene ID do not create duplicate events', () => {
      const initialTotal = monitoringService.getEvents().length;

      // Event 1: First scan
      monitoringService.addEvent({
        id: 'EVT-TEST-IDEM-001',
        interventionId: 'FP-008',
        interventionName: 'Farm Pond #08',
        sceneId: 'S2A_32VNJ_FP008_IDEM_SCENE',
        observationDate: '2024-08-18',
        previousNdvi: 0.5200,
        currentNdvi: 0.4400,
        percentageChange: -15.4,
        anomalyLevel: 'HIGH_PRIORITY',
        status: 'REVIEW_REQUIRED',
        recommendedAction: 'Dispatch field inspection.',
        createdAt: new Date().toISOString(),
        provenance: { sourceType: 'REAL_ORBITAL_RASTER', satellite: 'Sentinel-2A' },
      });

      const afterFirstScan = monitoringService.getEvents().length;
      expect(afterFirstScan).toBe(initialTotal + 1);

      // Event 2: Second scan with IDENTICAL scene ID (should be ignored)
      monitoringService.addEvent({
        id: 'EVT-TEST-IDEM-002',
        interventionId: 'FP-008',
        interventionName: 'Farm Pond #08',
        sceneId: 'S2A_32VNJ_FP008_IDEM_SCENE', // duplicate scene
        observationDate: '2024-08-18',
        previousNdvi: 0.5200,
        currentNdvi: 0.4400,
        percentageChange: -15.4,
        anomalyLevel: 'HIGH_PRIORITY',
        status: 'REVIEW_REQUIRED',
        recommendedAction: 'Dispatch field inspection.',
        createdAt: new Date().toISOString(),
        provenance: { sourceType: 'REAL_ORBITAL_RASTER', satellite: 'Sentinel-2A' },
      });

      const afterSecondScan = monitoringService.getEvents().length;
      expect(afterSecondScan).toBe(afterFirstScan); // 0 duplicate created!
    });
  });

  // 3. Evidence Immutable Audit Trail
  describe('Evidence Audit & Versioning', () => {
    it('records immutable audit events for field evidence additions and human reviews', () => {
      const audit = evidenceAuditService.recordEvent({
        entityId: 'FP-008',
        action: 'FIELD_EVIDENCE_ADDED',
        actor: 'Amol Jadhav',
        actorRole: 'FIELD_OFFICER',
        details: 'Recorded ground foundation telemetry for Farm Pond #08.',
      });

      expect(audit.entityId).toBe('FP-008');
      expect(audit.tamperEvidentHash).toHaveLength(64);
      expect(evidenceAuditService.getAuditTrail('FP-008').length).toBeGreaterThanOrEqual(1);
    });
  });
});
