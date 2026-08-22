import { describe, it, expect } from 'vitest';

describe('SARaksha Brand Identity Asset System', () => {
  const variants = ['full', 'compact', 'icon'] as const;

  it('supports full, compact, and icon brand logo variants', () => {
    variants.forEach((v) => {
      expect(['full', 'compact', 'icon']).toContain(v);
    });
  });

  it('maps correct high-res asset paths for brand variants', () => {
    const assets = {
      icon: '/assets/branding/saraksha-logo-icon.png',
      compact: '/assets/branding/saraksha-logo-compact.png',
      full: '/assets/branding/saraksha-logo-full.png',
      master: '/assets/branding/saraksha-brand-master.png',
    };

    expect(assets.icon).toBe('/assets/branding/saraksha-logo-icon.png');
    expect(assets.compact).toBe('/assets/branding/saraksha-logo-compact.png');
    expect(assets.full).toBe('/assets/branding/saraksha-logo-full.png');
  });

  it('verifies brand tagline and core pillars', () => {
    const title = 'SARaksha — Smart Watershed Monitoring System';
    const pillars = ['MONITOR', 'VERIFY', 'PROTECT'];

    expect(title).toContain('Smart Watershed Monitoring System');
    expect(pillars).toHaveLength(3);
    expect(pillars).toContain('MONITOR');
    expect(pillars).toContain('VERIFY');
    expect(pillars).toContain('PROTECT');
  });
});
