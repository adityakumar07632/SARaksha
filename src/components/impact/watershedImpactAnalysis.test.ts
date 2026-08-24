import { describe, it, expect } from 'vitest';
import {
  MOCK_IMPACT_ANALYSIS,
  getImpactAnalysis,
  classifyImpactScore,
  getImpactClassificationMeta,
  getNationalImpactSummary,
  MOCK_INTERVENTIONS,
  MOCK_FIELD_EVIDENCE,
} from '../../data/mockData';

describe('Watershed Impact Analysis & Change Detection Suite', () => {
  it('contains comprehensive impact dataset with CD-012 as benchmark', () => {
    const cd012Impact = getImpactAnalysis('CD-012');
    expect(cd012Impact).toBeDefined();
    if (!cd012Impact) return;

    // CD-012 Specific Verification
    expect(cd012Impact.interventionId).toBe('CD-012');
    expect(cd012Impact.impactScore).toBe(18);
    expect(cd012Impact.classification).toBe('SIGNIFICANT_IMPROVEMENT');

    // Baseline (2022) vs Monitored (2026) exact metrics
    expect(cd012Impact.before.vegetationPercent).toBe(42);
    expect(cd012Impact.after.vegetationPercent).toBe(61);
    expect(cd012Impact.after.vegetationPercent - cd012Impact.before.vegetationPercent).toBe(19);

    expect(cd012Impact.before.waterPresencePercent).toBe(28);
    expect(cd012Impact.after.waterPresencePercent).toBe(47);
    expect(cd012Impact.after.waterPresencePercent - cd012Impact.before.waterPresencePercent).toBe(19);

    expect(cd012Impact.before.barrenAreaPercent).toBe(31);
    expect(cd012Impact.after.barrenAreaPercent).toBe(19);
    expect(cd012Impact.after.barrenAreaPercent - cd012Impact.before.barrenAreaPercent).toBe(-12);

    expect(cd012Impact.before.ndvi).toBe(0.38);
    expect(cd012Impact.after.ndvi).toBe(0.51);

    expect(cd012Impact.before.healthScore).toBe(58);
    expect(cd012Impact.after.healthScore).toBe(76);

    expect(cd012Impact.before.waterSurfaceAreaKm2).toBe(0.18);
    expect(cd012Impact.after.waterSurfaceAreaKm2).toBe(0.31);
    expect(cd012Impact.areaKm2).toBe(2.4);
  });

  it('verifies same geographical location coordinates guarantee', () => {
    const cd012 = MOCK_INTERVENTIONS.find((i) => i.id === 'CD-012');
    const cd012Impact = getImpactAnalysis('CD-012');

    expect(cd012).toBeDefined();
    expect(cd012Impact).toBeDefined();
    if (!cd012 || !cd012Impact) return;

    expect(cd012Impact.coordinates[0]).toBeCloseTo(cd012.coordinates[0], 4);
    expect(cd012Impact.coordinates[1]).toBeCloseTo(cd012.coordinates[1], 4);
  });

  it('correctly classifies impact score ranges according to specification', () => {
    // >= +15: Significant Improvement
    expect(classifyImpactScore(22)).toBe('SIGNIFICANT_IMPROVEMENT');
    expect(classifyImpactScore(15)).toBe('SIGNIFICANT_IMPROVEMENT');

    // +5 to +14: Positive Improvement
    expect(classifyImpactScore(14)).toBe('POSITIVE_IMPROVEMENT');
    expect(classifyImpactScore(9)).toBe('POSITIVE_IMPROVEMENT');
    expect(classifyImpactScore(5)).toBe('POSITIVE_IMPROVEMENT');

    // -4 to +4: Minimal Change
    expect(classifyImpactScore(4)).toBe('MINIMAL_CHANGE');
    expect(classifyImpactScore(0)).toBe('MINIMAL_CHANGE');
    expect(classifyImpactScore(-4)).toBe('MINIMAL_CHANGE');

    // -5 to -14: Negative Trend
    expect(classifyImpactScore(-5)).toBe('NEGATIVE_TREND');
    expect(classifyImpactScore(-7)).toBe('NEGATIVE_TREND');
    expect(classifyImpactScore(-14)).toBe('NEGATIVE_TREND');

    // <= -15: Significant Degradation
    expect(classifyImpactScore(-15)).toBe('SIGNIFICANT_DEGRADATION');
    expect(classifyImpactScore(-25)).toBe('SIGNIFICANT_DEGRADATION');
  });

  it('returns valid metadata and badges for all impact classifications', () => {
    const metaSig = getImpactClassificationMeta('SIGNIFICANT_IMPROVEMENT');
    expect(metaSig.label).toBe('Significant Improvement');
    expect(metaSig.color).toContain('emerald');

    const metaPos = getImpactClassificationMeta('POSITIVE_IMPROVEMENT');
    expect(metaPos.label).toBe('Positive Improvement');
    expect(metaPos.color).toContain('teal');

    const metaMin = getImpactClassificationMeta('MINIMAL_CHANGE');
    expect(metaMin.label).toBe('Minimal Change');

    const metaNeg = getImpactClassificationMeta('NEGATIVE_TREND');
    expect(metaNeg.label).toBe('Negative Trend');
    expect(metaNeg.color).toContain('amber');

    const metaDeg = getImpactClassificationMeta('SIGNIFICANT_DEGRADATION');
    expect(metaDeg.label).toBe('Significant Degradation');
    expect(metaDeg.color).toContain('rose');
  });

  it('calculates national impact summary metrics correctly', () => {
    const summary = getNationalImpactSummary();

    expect(summary.totalAssessed).toBeGreaterThanOrEqual(7);
    expect(summary.positiveImpact).toBeGreaterThan(0);
    expect(summary.needsReview).toBeGreaterThanOrEqual(1); // CD-015 silt choked
    expect(summary.avgHealthImprovement).toBeGreaterThan(0);
    expect(summary.positiveImpact + summary.minimalChange + summary.needsReview).toBe(summary.totalAssessed);
  });

  it('ensures field evidence cross-correlation references valid evidence IDs', () => {
    const cd012Impact = getImpactAnalysis('CD-012');
    expect(cd012Impact).toBeDefined();
    if (!cd012Impact) return;

    for (const evId of cd012Impact.fieldEvidenceIds) {
      const foundEv = MOCK_FIELD_EVIDENCE.find((e) => e.id === evId);
      expect(foundEv).toBeDefined();
      expect(foundEv?.interventionId).toBe('CD-012');
    }
  });

  it('ensures AI interpretation includes safety disclaimers and confidence score', () => {
    const allAnalyses = Object.values(MOCK_IMPACT_ANALYSIS);

    for (const record of allAnalyses) {
      expect(record.aiInterpretation.confidence).toBeGreaterThan(0);
      expect(record.aiInterpretation.confidence).toBeLessThanOrEqual(100);
      expect(record.aiInterpretation.disclaimer).toBeDefined();
      expect(record.aiInterpretation.disclaimer.length).toBeGreaterThan(20);
      expect(record.recommendations.length).toBeGreaterThan(0);
      expect(record.timeline.length).toBeGreaterThanOrEqual(3);
    }
  });
});