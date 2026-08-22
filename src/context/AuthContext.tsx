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
  isDemoMode: boolean;
  login: (emailOrRole: string | UserRole, password?: string) => boolean;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session initialization: check sessionStorage (tab session) or localStorage (persisted session)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUserId =
        sessionStorage.getItem('saraksha_user_id') ||
        localStorage.getItem('saraksha_user_id');
      if (savedUserId) {
        return MOCK_USERS.find((u) => u.id === savedUserId) || null;
      }
    }
    return null;
  });

  const isDemoMode = true; // Prototype mode
  const role: UserRole = currentUser?.role || 'SUPER_ADMIN';
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        sessionStorage.setItem('saraksha_user_id', currentUser.id);
        sessionStorage.setItem('saraksha_user_role', currentUser.role);
        localStorage.setItem('saraksha_user_id', currentUser.id);
        localStorage.setItem('saraksha_user_role', currentUser.role);
      } else {
        sessionStorage.removeItem('saraksha_user_id');
        sessionStorage.removeItem('saraksha_user_role');
        localStorage.removeItem('saraksha_user_id');
        localStorage.removeItem('saraksha_user_role');
      }
    }
  }, [currentUser]);

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
      setCurrentUser(matchedUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('saraksha_user_id');
      sessionStorage.removeItem('saraksha_user_role');
      sessionStorage.clear();
      localStorage.removeItem('saraksha_user_id');
      localStorage.removeItem('saraksha_user_role');
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    const user = MOCK_USERS.find((u) => u.role === newRole) || MOCK_USERS[0];
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
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
