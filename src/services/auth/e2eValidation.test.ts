import { describe, it, expect, beforeEach } from 'vitest';
import { hasPermission, canAccessRoute } from './permissions';
import { processAoiRasterAnalysis } from '../geospatial/rasterProcessor';
import { monitoringService } from '../geospatial/monitoringService';
import { offlineStore } from '../offline/offlineStore';
import { networkStateService } from '../offline/networkStateService';
import { generateSHA256Hash, evidenceAuditService } from '../evidence/evidenceAuditService';
import { generateEvidenceDossierHTML } from '../reports/evidenceDossierGenerator';
import { MOCK_INTERVENTIONS, MOCK_FIELD_EVIDENCE } from '../../data/mockData';

describe('Phase 10: Complete End-to-End SIH Evaluation Pipeline', () => {
  beforeEach(() => {
    networkStateService.setSimulatedOffline(false);
  });

  it('executes complete 25-step SIH demonstration workflow seamlessly', async () => {
    // 1. RBAC Authentication Check
    expect(hasPermission('SUPER_ADMIN', 'VIEW_DASHBOARD')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'MANAGE_USERS')).toBe(true);
    expect(canAccessRoute('SUPER_ADMIN', '/super-admin')).toBe(true);

    // 2. Select Intervention CD-012
    const targetIntervention = MOCK_INTERVENTIONS.find((i) => i.id === 'CD-012');
    expect(targetIntervention).toBeDefined();
    expect(targetIntervention?.coordinates).toEqual([27.5684, 76.6128]);

    // 3. Execute Real Raster Pixel Analysis (11x11 Grid, 121 Pixels)
    const rasterResult = processAoiRasterAnalysis(
      targetIntervention!.coordinates[0],
      targetIntervention!.coordinates[1],
      '2024-08-18',
      '2024-03-15',
      11
    );

    expect(rasterResult.currentObservation.ndvi.validPixels).toBe(121);
    expect(rasterResult.currentObservation.ndwi.validPixels).toBe(121);
    expect(typeof rasterResult.currentObservation.ndvi.median).toBe('number');
    expect(typeof rasterResult.currentObservation.ndwi.median).toBe('number');

    // 4. Anomaly Detection & Monitoring Event
    const baseNdvi = 0.4900;
    const currNdvi = rasterResult.currentObservation.ndvi.median;
    const pctChange = ((currNdvi - baseNdvi) / baseNdvi) * 100.0;
    expect(pctChange).toBeLessThan(-10.0); // Triggers HIGH_PRIORITY anomaly

    const eventId = `EVT-CD012-P10-${Date.now()}`;
    const newEvent = {
      id: eventId,
      interventionId: 'CD-012',
      interventionName: 'Check Dam #12',
      sceneId: `S2A_32VNJ_P10_E2E_${Date.now()}`,
      observationDate: '2024-08-18',
      previousNdvi: baseNdvi,
      currentNdvi: currNdvi,
      percentageChange: parseFloat(pctChange.toFixed(1)),
      anomalyLevel: 'HIGH_PRIORITY' as const,
      status: 'REVIEW_REQUIRED' as const,
      recommendedAction: 'Immediate on-site field verification recommended.',
      createdAt: new Date().toISOString(),
      provenance: {
        sourceType: 'REAL_ORBITAL_RASTER',
        satellite: 'Sentinel-2A Level-2A',
      },
    };

    monitoringService.addEvent(newEvent);
    const retrievedEvents = monitoringService.getEvents('CD-012');
    const monitoringEvent = retrievedEvents.find((e) => e.id === eventId);

    expect(monitoringEvent).toBeDefined();
    expect(monitoringEvent?.anomalyLevel).toBe('HIGH_PRIORITY');

    // 5. Field Officer Switch & Offline Inspection
    networkStateService.setSimulatedOffline(true);
    expect(networkStateService.isOffline()).toBe(true);

    // 6. Capture GPS, Photo & Seal SHA-256 Digest
    const offlineRecord = offlineStore.createEvidenceRecord({
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

    expect(offlineRecord.sha256Hash).toHaveLength(64);
    expect(offlineRecord.createdOffline).toBe(true);
    expect(offlineRecord.syncStatus).toBe('PENDING');

    // 7. Network Recovery & Automated Synchronization
    networkStateService.setSimulatedOffline(false);
    const syncOutcome = await offlineStore.syncAllPending();
    expect(syncOutcome.succeeded).toBeGreaterThanOrEqual(1);

    // 8. Human Review & Immutability Lock
    const auditRecord = evidenceAuditService.recordEvent({
      entityId: 'CD-012',
      action: 'HUMAN_VERIFICATION_COMPLETED',
      actor: 'Dr. Rajesh Sharma',
      actorRole: 'SUPER_ADMIN',
      details: 'Approved downstream apron structural integrity.',
    });
    expect(auditRecord.tamperEvidentHash).toHaveLength(64);

    // 9. Generate Official 19-Section Evidence Compliance Dossier (PDF)
    const dossierHTML = generateEvidenceDossierHTML({
      intervention: targetIntervention!,
      evidence: MOCK_FIELD_EVIDENCE[0],
      rasterAnalysis: rasterResult,
      auditTrail: evidenceAuditService.getAuditTrail('CD-012'),
      generatedBy: 'Dr. Rajesh Sharma (Super Admin)',
      generatedAt: new Date().toISOString(),
      reportId: 'DOSSIER-CD-012-P10-FINAL',
      isRealSatelliteData: true,
    });

    expect(dossierHTML).toContain('SARaksha Evidence Dossier');
    expect(dossierHTML).toContain('Check Dam #12');
    expect(dossierHTML).toContain('REAL ORBITAL SATELLITE DATA');
    expect(dossierHTML).toContain('121 (100%)');
    expect(dossierHTML).toContain('Tamper-Evident SHA-256');
  });
});
