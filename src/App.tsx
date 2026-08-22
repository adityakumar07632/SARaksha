import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AccessDenied } from './pages/AccessDenied';
import { Loader2 } from 'lucide-react';
import { SARakshaLogo } from './components/branding/SARakshaLogo';

// Lazy-loaded Pages for bundle performance
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const SuperAdminDashboard = lazy(() =>
  import('./pages/super-admin/SuperAdminDashboard').then((m) => ({ default: m.SuperAdminDashboard }))
);
const UsersManagement = lazy(() =>
  import('./pages/super-admin/UsersManagement').then((m) => ({ default: m.UsersManagement }))
);
const WatershedsList = lazy(() =>
  import('./pages/super-admin/WatershedsList').then((m) => ({ default: m.WatershedsList }))
);
const EvidenceManagement = lazy(() =>
  import('./pages/super-admin/EvidenceManagement').then((m) => ({ default: m.EvidenceManagement }))
);
const AlertsCenter = lazy(() =>
  import('./pages/super-admin/AlertsCenter').then((m) => ({ default: m.AlertsCenter }))
);
const AnalyticsView = lazy(() =>
  import('./pages/super-admin/AnalyticsView').then((m) => ({ default: m.AnalyticsView }))
);
const ReportsView = lazy(() =>
  import('./pages/super-admin/ReportsView').then((m) => ({ default: m.ReportsView }))
);

const NormalUserDashboard = lazy(() =>
  import('./pages/dashboard/NormalUserDashboard').then((m) => ({ default: m.NormalUserDashboard }))
);
const WatershedDetail = lazy(() =>
  import('./pages/watershed/WatershedDetail').then((m) => ({ default: m.WatershedDetail }))
);
const InterventionDetail = lazy(() =>
  import('./pages/intervention/InterventionDetail').then((m) => ({ default: m.InterventionDetail }))
);
const FieldOfficerEvidence = lazy(() =>
  import('./pages/field-officer/FieldOfficerEvidence').then((m) => ({ default: m.FieldOfficerEvidence }))
);
const FieldOfficerDashboard = lazy(() =>
  import('./pages/field-officer/FieldOfficerDashboard').then((m) => ({ default: m.FieldOfficerDashboard }))
);
const FieldInspection = lazy(() =>
  import('./pages/field-officer/FieldInspection').then((m) => ({ default: m.FieldInspection }))
);
const SyncQueue = lazy(() =>
  import('./pages/field-officer/SyncQueue').then((m) => ({ default: m.SyncQueue }))
);
const EvidenceDossierView = lazy(() =>
  import('./pages/reports/EvidenceDossierView').then((m) => ({ default: m.EvidenceDossierView }))
);

// Loading Fallback Component
const RouteLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[450px] w-full gap-4 font-mono p-6 select-none">
    <SARakshaLogo variant="icon" size="lg" priority />
    <div className="text-center space-y-1">
      <span className="text-base font-black text-white font-mono tracking-wider block">
        SARaksha
      </span>
      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
        SMART WATERSHED MONITORING SYSTEM
      </span>
      <span className="text-[9px] text-slate-400 font-mono tracking-wider block pt-0.5">
        MONITOR &bull; VERIFY &bull; PROTECT
      </span>
    </div>
    <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
      <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
      <span className="text-[11px] text-slate-400">Loading Geospatial Intelligence...</span>
    </div>
  </div>
);

// Role-based root redirect component
const RootRedirect: React.FC = () => {
  const { isAuthenticated, isInitializing, role } = useAuth();
  if (isInitializing) return <RouteLoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'SUPER_ADMIN') return <Navigate to="/super-admin" replace />;
  if (role === 'NORMAL_ADMIN') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/field-officer/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {/* Public & Root Routes */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* Authenticated Application Shell */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >

                  {/* Super Admin Routes */}
                  <Route
                    path="/super-admin"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <SuperAdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']} requiredPermission="MANAGE_USERS">
                        <UsersManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/watersheds"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <WatershedsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/evidence"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <EvidenceManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/alerts"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <AlertsCenter />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/analytics"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <AnalyticsView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/reports"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <ReportsView />
                      </ProtectedRoute>
                    }
                  />

                  {/* Normal Admin & Shared Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'NORMAL_ADMIN']}>
                        <NormalUserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/watershed/:id"
                    element={
                      <ProtectedRoute>
                        <WatershedDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/intervention/:id"
                    element={
                      <ProtectedRoute>
                        <InterventionDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* Field Officer & Operations Routes */}
                  <Route
                    path="/field-evidence"
                    element={
                      <ProtectedRoute>
                        <FieldOfficerEvidence />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/field-officer/dashboard"
                    element={
                      <ProtectedRoute>
                        <FieldOfficerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/field-officer/inspect/:id"
                    element={
                      <ProtectedRoute>
                        <FieldInspection />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/field-officer/sync-queue"
                    element={
                      <ProtectedRoute>
                        <SyncQueue />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <ProtectedRoute>
                        <AlertsCenter />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <ReportsView />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Standalone Full-Page Dossier View with In-App Navigation */}
                <Route
                  path="/evidence-dossier"
                  element={
                    <ProtectedRoute>
                      <EvidenceDossierView />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Catch-all */}
                <Route path="*" element={<RootRedirect />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
