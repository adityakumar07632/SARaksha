import { describe, it, expect } from 'vitest';
import { riskAssessmentService } from './riskAssessmentService';
import { evidenceAuditService } from '../evidence/evidenceAuditService';

describe('Risk Assessment & Decision Intelligence Service', () => {
  it('calculates an explainable rule-based demonstration risk score for CD-012', () => {
    const assessment = riskAssessmentService.calculateRiskScore({
      interventionId: 'CD-012',
      interventionCode: 'CD-012',
      ndviDeviationPercent: -80.6,
      isRealSatelliteData: true,
      hasFieldEvidence: true,
      fieldVerified: true,
    });

    expect(assessment.interventionId).toBe('CD-012');
    expect(assessment.compositeRiskScore).toBeGreaterThanOrEqual(0);
    expect(assessment.compositeRiskScore).toBeLessThanOrEqual(100);
    expect(assessment.isDemonstrationScore).toBe(true);
    expect(assessment.modelLabel).toBe('Rule-Based Demonstration Risk Score');
    expect(assessment.factors).toHaveLength(5);

    // Verify weights sum to 100%
    const totalWeight = assessment.factors.reduce((sum, f) => sum + f.weightPercent, 0);
    expect(totalWeight).toBe(100);

    // Verify factor categories
    const categories = assessment.factors.map((f) => f.category);
    expect(categories).toContain('SATELLITE');
    expect(categories).toContain('LULC');
    expect(categories).toContain('FIELD');
    expect(categories).toContain('HISTORICAL');
    expect(categories).toContain('DATA_QUALITY');

    // High anomaly should yield High Priority
    expect(assessment.priorityLevel).toBe('HIGH_PRIORITY');
  });

  it('generates transparent, actionable decision recommendations for human review', () => {
    const assessment = riskAssessmentService.calculateRiskScore({
      interventionId: 'CD-012',
      interventionCode: 'CD-012',
      ndviDeviationPercent: -80.6,
    });

    const recommendation = riskAssessmentService.generateRecommendation(assessment);

    expect(recommendation.interventionId).toBe('CD-012');
    expect(recommendation.recommendedAction).toContain('Desiltation');
    expect(recommendation.humanReviewRequired).toBe(true);
    expect(recommendation.label).toBe('Recommendation for Human Review');
    expect(recommendation.contributingEvidence.satellite).toBeDefined();
    expect(recommendation.contributingEvidence.bhuvanLulc).toBeDefined();
    expect(recommendation.contributingEvidence.fieldEvidence).toBeDefined();
    expect(recommendation.contributingEvidence.riskScore).toBeDefined();
  });

  it('records human nodal decisions with SHA-256 integrity seal and updates audit trail', () => {
    const initialEventsCount = evidenceAuditService.getAuditTrail('CD-012').length;

    const decisionRecord = riskAssessmentService.recordHumanDecision({
      interventionId: 'CD-012',
      interventionCode: 'CD-012',
      decision: 'APPROVED',
      reviewerName: 'Dr. Rajesh Sharma',
      reviewerRole: 'SUPER_ADMIN',
      justification: 'Satellite spectral anomaly verified against ground inspection photos and downstream LULC risk.',
      evidenceReferences: ['EVD-101', 'S2C_43RFL_20241219_2_L2A', 'BHUVAN-LULC-RJ-WS001'],
    });

    expect(decisionRecord.decision).toBe('APPROVED');
    expect(decisionRecord.sha256Seal).toHaveLength(64);
    expect(decisionRecord.reviewerName).toBe('Dr. Rajesh Sharma');

    const updatedEvents = evidenceAuditService.getAuditTrail('CD-012');
    expect(updatedEvents.length).toBe(initialEventsCount + 1);
    expect(updatedEvents[0].action).toBe('HUMAN_VERIFICATION_COMPLETED');
    expect(updatedEvents[0].details).toContain('approved & sanctioned');
  });

  it('maintains strict real vs demo data separation in factor sources', () => {
    const realAssessment = riskAssessmentService.calculateRiskScore({
      interventionId: 'CD-012',
      interventionCode: 'CD-012',
      isRealSatelliteData: true,
    });
    const satRealFactor = realAssessment.factors.find((f) => f.category === 'SATELLITE');
    expect(satRealFactor?.sourceType).toBe('REAL_DATA');

    const demoAssessment = riskAssessmentService.calculateRiskScore({
      interventionId: 'CD-012',
      interventionCode: 'CD-012',
      isRealSatelliteData: false,
    });
    const satDemoFactor = demoAssessment.factors.find((f) => f.category === 'SATELLITE');
    expect(satDemoFactor?.sourceType).toBe('DEMO_DATA');
  });
});
