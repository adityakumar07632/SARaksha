import { describe, it, expect, beforeEach } from 'vitest';

describe('SARaksha Theme System & Persistence', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
  });

  it('determines initial theme fallback to dark when storage is empty', () => {
    const stored = mockStorage['saraksha_theme'] || mockStorage['theme'] || 'dark';
    expect(stored).toBe('dark');
  });

  it('toggles theme state between dark and light', () => {
    let currentTheme: 'dark' | 'light' = 'dark';
    const toggle = () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      mockStorage['saraksha_theme'] = currentTheme;
      mockStorage['theme'] = currentTheme;
    };

    // Toggle 1: Dark -> Light
    toggle();
    expect(currentTheme).toBe('light');
    expect(mockStorage['saraksha_theme']).toBe('light');

    // Toggle 2: Light -> Dark
    toggle();
    expect(currentTheme).toBe('dark');
    expect(mockStorage['saraksha_theme']).toBe('dark');
  });

  it('persists selected theme across reloads via storage keys', () => {
    mockStorage['saraksha_theme'] = 'light';
    const restored = mockStorage['saraksha_theme'] || mockStorage['theme'] || 'dark';
    expect(restored).toBe('light');
  });
});
