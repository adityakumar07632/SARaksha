import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

export interface DemoCredential {
  role: UserRole;
  email: string;
  name: string;
  title: string;
  department: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  token: string;
  authenticatedAt: string;
  expiresAt: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'SUPER_ADMIN',
    email: 'admin@saraksha.demo',
    name: 'Dr. Rajesh Sharma',
    title: 'National Project Director (PMKSY-WDC)',
    department: 'Ministry of Jal Shakti / Department of Land Resources',
  },
  {
    role: 'NORMAL_ADMIN',
    email: 'admin.region@saraksha.demo',
    name: 'Priya Meena',
    title: 'Watershed Nodal Officer (Alwar Division)',
    department: 'Rajasthan Watershed & Soil Conservation Dept',
  },
  {
    role: 'FIELD_OFFICER',
    email: 'field@saraksha.demo',
    name: 'Vikram Singh',
    title: 'Field Verification Officer (Block 3)',
    department: 'Alwar District Watershed Cell',
  },
];

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isDemoMode: boolean;
  login: (emailOrRole: string | UserRole, password?: string) => boolean;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to strictly validate stored session credentials
const validateStoredSession = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const rawSession =
      sessionStorage.getItem('saraksha_auth_session') ||
      localStorage.getItem('saraksha_auth_session');

    if (rawSession) {
      const parsed: AuthSession = JSON.parse(rawSession);
      if (parsed && parsed.userId && parsed.role && parsed.expiresAt) {
        const isExpired = new Date(parsed.expiresAt).getTime() <= Date.now();
        if (!isExpired) {
          const user = MOCK_USERS.find((u) => u.id === parsed.userId && u.role === parsed.role);
          if (user) {
            return user;
          }
        }
      }
    }

    // Strict validation for legacy session keys
    const legacyUserId =
      sessionStorage.getItem('saraksha_user_id') ||
      localStorage.getItem('saraksha_user_id');
    const legacyRole =
      sessionStorage.getItem('saraksha_user_role') ||
      localStorage.getItem('saraksha_user_role');

    if (legacyUserId && legacyRole) {
      const user = MOCK_USERS.find((u) => u.id === legacyUserId && u.role === legacyRole);
      if (user) {
        return user;
      }
    }
  } catch (err) {
    console.warn('[SARaksha Auth] Session validation error:', err);
  }

  // Clear unvalidated / stale session storage
  try {
    sessionStorage.removeItem('saraksha_auth_session');
    sessionStorage.removeItem('saraksha_user_id');
    sessionStorage.removeItem('saraksha_user_role');
    localStorage.removeItem('saraksha_auth_session');
    localStorage.removeItem('saraksha_user_id');
    localStorage.removeItem('saraksha_user_role');
  } catch {}

  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Initial session verification before rendering routes
  useEffect(() => {
    const user = validateStoredSession();
    setCurrentUser(user);
    setIsInitializing(false);

    // Mobile BFCache restoration listener (pageshow)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const restoredUser = validateStoredSession();
        setCurrentUser(restoredUser);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const isDemoMode = true; // Prototype mode
  const role: UserRole = currentUser?.role || 'SUPER_ADMIN';
  const isAuthenticated = !!currentUser;

  const login = (identifier: string | UserRole, _password?: string): boolean => {
    if (!identifier) return false;

    // 1. Check if identifier matches a UserRole directly
    let matchedUser = MOCK_USERS.find((u) => u.role === identifier);

    // 2. Check if identifier matches email
    if (!matchedUser) {
      matchedUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === identifier.toLowerCase()
      );
    }

    // 3. Check if identifier matches demo credentials
    if (!matchedUser) {
      const demoCred = DEMO_CREDENTIALS.find(
        (d) => d.email.toLowerCase() === identifier.toLowerCase()
      );
      if (demoCred) {
        matchedUser = MOCK_USERS.find((u) => u.role === demoCred.role);
      }
    }

    if (matchedUser) {
      const now = new Date();
      const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24-hour validity
      const sessionData: AuthSession = {
        userId: matchedUser.id,
        role: matchedUser.role,
        token: `SARAKSHA-AUTH-${matchedUser.id}-${Date.now()}`,
        authenticatedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
      };

      try {
        sessionStorage.setItem('saraksha_auth_session', JSON.stringify(sessionData));
        sessionStorage.setItem('saraksha_user_id', matchedUser.id);
        sessionStorage.setItem('saraksha_user_role', matchedUser.role);
        localStorage.setItem('saraksha_auth_session', JSON.stringify(sessionData));
        localStorage.setItem('saraksha_user_id', matchedUser.id);
        localStorage.setItem('saraksha_user_role', matchedUser.role);
      } catch (err) {
        console.warn('[SARaksha Auth] Failed to persist session:', err);
      }

      setCurrentUser(matchedUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('saraksha_auth_session');
        sessionStorage.removeItem('saraksha_user_id');
        sessionStorage.removeItem('saraksha_user_role');
        sessionStorage.clear();
        localStorage.removeItem('saraksha_auth_session');
        localStorage.removeItem('saraksha_user_id');
        localStorage.removeItem('saraksha_user_role');
      } catch (err) {
        console.warn('[SARaksha Auth] Failed to clear storage on logout:', err);
      }
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    const user = MOCK_USERS.find((u) => u.role === newRole) || MOCK_USERS[0];
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const sessionData: AuthSession = {
      userId: user.id,
      role: user.role,
      token: `SARAKSHA-AUTH-${user.id}-${Date.now()}`,
      authenticatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    try {
      sessionStorage.setItem('saraksha_auth_session', JSON.stringify(sessionData));
      sessionStorage.setItem('saraksha_user_id', user.id);
      sessionStorage.setItem('saraksha_user_role', user.role);
      localStorage.setItem('saraksha_auth_session', JSON.stringify(sessionData));
      localStorage.setItem('saraksha_user_id', user.id);
      localStorage.setItem('saraksha_user_role', user.role);
    } catch {}

    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isInitializing,
        isDemoMode,
        login,
        logout,
        switchDemoRole,
        allUsers: MOCK_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
