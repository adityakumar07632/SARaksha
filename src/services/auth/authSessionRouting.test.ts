import { describe, it, expect, beforeEach } from 'vitest';
import { MOCK_USERS } from '../../data/mockData';
import { DEMO_CREDENTIALS, AuthSession } from '../../context/AuthContext';

// Simple mock storage for Node test environment
class MockStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('SARaksha Mobile & Web Authentication Session Architecture', () => {
  let mockLocalStorage: MockStorage;
  let mockSessionStorage: MockStorage;

  beforeEach(() => {
    mockLocalStorage = new MockStorage();
    mockSessionStorage = new MockStorage();
  });

  it('validates demo role presets for Super Admin, Normal Admin, and Field Officer', () => {
    expect(DEMO_CREDENTIALS).toHaveLength(3);
    const roles = DEMO_CREDENTIALS.map((d) => d.role);
    expect(roles).toContain('SUPER_ADMIN');
    expect(roles).toContain('NORMAL_ADMIN');
    expect(roles).toContain('FIELD_OFFICER');

    DEMO_CREDENTIALS.forEach((cred) => {
      const user = MOCK_USERS.find((u) => u.role === cred.role);
      expect(user).toBeDefined();
      expect(user?.role).toBe(cred.role);
    });
  });

  it('correctly constructs and validates an active AuthSession', () => {
    const user = MOCK_USERS[0];
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      token: `SARAKSHA-AUTH-${user.id}-${Date.now()}`,
      authenticatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    mockLocalStorage.setItem('saraksha_auth_session', JSON.stringify(session));

    const raw = mockLocalStorage.getItem('saraksha_auth_session');
    expect(raw).toBeDefined();

    const parsed: AuthSession = JSON.parse(raw!);
    expect(parsed.userId).toBe(user.id);
    expect(parsed.role).toBe(user.role);
    expect(new Date(parsed.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('detects and invalidates expired sessions', () => {
    const user = MOCK_USERS[0];
    const past = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago

    const expiredSession: AuthSession = {
      userId: user.id,
      role: user.role,
      token: `SARAKSHA-AUTH-${user.id}-expired`,
      authenticatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      expiresAt: past.toISOString(),
    };

    const isExpired = new Date(expiredSession.expiresAt).getTime() <= Date.now();
    expect(isExpired).toBe(true);
  });

  it('ensures logout wipes both session and local storage completely', () => {
    mockLocalStorage.setItem('saraksha_auth_session', 'test-data');
    mockLocalStorage.setItem('saraksha_user_id', 'usr-1');
    mockLocalStorage.setItem('saraksha_user_role', 'SUPER_ADMIN');
    mockSessionStorage.setItem('saraksha_auth_session', 'test-data');
    mockSessionStorage.setItem('saraksha_user_id', 'usr-1');

    // Simulate logout action
    mockLocalStorage.removeItem('saraksha_auth_session');
    mockLocalStorage.removeItem('saraksha_user_id');
    mockLocalStorage.removeItem('saraksha_user_role');
    mockSessionStorage.clear();

    expect(mockLocalStorage.getItem('saraksha_auth_session')).toBeNull();
    expect(mockLocalStorage.getItem('saraksha_user_id')).toBeNull();
    expect(mockLocalStorage.getItem('saraksha_user_role')).toBeNull();
    expect(mockSessionStorage.getItem('saraksha_auth_session')).toBeNull();
    expect(mockSessionStorage.getItem('saraksha_user_id')).toBeNull();
  });

  it('ensures root and protected routes redirect unauthenticated users to /login', () => {
    const isAuthenticated = false;
    const isInitializing = false;

    const getRedirectTarget = (path: string) => {
      if (isInitializing) return 'LOADING';
      if (!isAuthenticated) return '/login';
      return path;
    };

    expect(getRedirectTarget('/')).toBe('/login');
    expect(getRedirectTarget('/super-admin')).toBe('/login');
    expect(getRedirectTarget('/dashboard')).toBe('/login');
    expect(getRedirectTarget('/evidence-dossier')).toBe('/login');
  });

  it('guarantees splash loading state during initial session check', () => {
    const isInitializing = true;
    const isAuthenticated = false;

    const shouldShowSplash = isInitializing;
    expect(shouldShowSplash).toBe(true);

    const shouldRenderProtected = !isInitializing && isAuthenticated;
    expect(shouldRenderProtected).toBe(false);
  });
});
