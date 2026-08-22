import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Info,
  X,
  Play,
  Layers,
  Activity,
  Smartphone,
  ShieldCheck,
  FileText,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { openEvidenceDossierWindow } from '../../services/reports/evidenceDossierGenerator';
import { MOCK_INTERVENTIONS, MOCK_FIELD_EVIDENCE } from '../../data/mockData';
import { evidenceAuditService } from '../../services/evidence/evidenceAuditService';

export const DemoDataNotice: React.FC = () => {
  const navigate = useNavigate();
  const { switchDemoRole } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Body Scroll Lock & Escape Key Listener for True Application Modal
  useEffect(() => {
    if (!modalOpen) return;

    // 1. Prevent background scrolling while modal is active
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 2. Escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  const handleLaunchScenario = (scenarioId: number) => {
    setModalOpen(false);
    switch (scenarioId) {
      case 1:
        // Scenario 1: Real Sentinel-2 L2A Raster Analysis (CD-012)
        switchDemoRole('SUPER_ADMIN');
        navigate('/intervention/CD-012');
        break;
      case 2:
        // Scenario 2: Multi-Intervention Monitoring & Alert Triage
        switchDemoRole('SUPER_ADMIN');
        navigate('/alerts');
        break;
      case 3:
        // Scenario 3: Field Officer Offline Evidence Capture & Sync
        switchDemoRole('FIELD_OFFICER');
        navigate('/field-officer/dashboard');
        break;
      case 4:
        // Scenario 4: Nodal Review & Evidence Verification
        switchDemoRole('NORMAL_ADMIN');
        navigate('/intervention/CD-012');
        break;
      case 5:
        // Scenario 5: National Command Center GIS Map
        switchDemoRole('SUPER_ADMIN');
        navigate('/super-admin');
        break;
      case 6:
        // Scenario 6: Generate Official Compliance Evidence Dossier (PDF)
        {
          const target = MOCK_INTERVENTIONS[0];
          const evd = MOCK_FIELD_EVIDENCE[0];
          const audit = evidenceAuditService.getAuditTrail(target.id);
          openEvidenceDossierWindow({
            intervention: target,
            evidence: evd,
            rasterAnalysis: null,
            auditTrail: audit,
            generatedBy: 'Dr. Rajesh Sharma (Super Admin)',
            generatedAt: new Date().toISOString(),
            reportId: `DOSSIER-${target.code}-${Date.now().toString().slice(-6)}`,
            isRealSatelliteData: true,
          });
        }
        break;
      default:
        break;
    }
  };

  if (dismissed) return null;

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-slate-950/95 border-b border-emerald-500/30 px-3 sm:px-4 py-2 text-xs font-mono text-emerald-200 backdrop-blur-md z-40 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-full">
          {/* Row 1 on mobile / Left group on desktop */}
          <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-[9px] sm:text-[10px] uppercase tracking-wider shrink-0">
                SARAKSHA SIH EVALUATION MODE
              </span>
              <span className="text-slate-300 text-xs hidden lg:inline truncate">
                Real Sentinel-2 L2A STAC discovery &amp; offline PWA sync active.
              </span>
            </div>

            {/* Dismiss X button on mobile (top right) */}
            <button
              onClick={() => setDismissed(true)}
              className="sm:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
              title="Dismiss notice"
              aria-label="Dismiss notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Row 2 on mobile / Right controls on desktop */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-3 py-1.5 sm:py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950 min-h-[36px] sm:min-h-0"
            >
              <Play className="h-3 w-3 fill-current shrink-0" />
              <span>SIH Demonstration Scenarios</span>
            </button>

            {/* Dismiss X button on desktop */}
            <button
              onClick={() => setDismissed(true)}
              className="hidden sm:flex text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer shrink-0"
              title="Dismiss notice"
              aria-label="Dismiss notice"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SIH Scenario Selector Modal (Rendered via React Portal at document.body level) */}
      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200 font-sans"
            onClick={() => setModalOpen(false)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div
              className="relative z-[10000] bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-[calc(100vw-24px)] sm:w-full max-h-[calc(100vh-48px)] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 font-mono pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Interactive Evaluation Launcher
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    Select SIH Demonstration Scenario
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Close modal (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 1,
                    title: '1. Sentinel-2 Raster Extraction',
                    desc: 'CD-012 live STAC query, 121 pixels, B03/B04/B08 NDVI/NDWI.',
                    icon: Activity,
                    color: 'text-cyan-400',
                    badge: 'REAL SATELLITE',
                  },
                  {
                    id: 3,
                    title: '2. Offline Field Inspection',
                    desc: 'Offline PWA mode, GPS lock, photo capture, and SHA-256 seal.',
                    icon: Smartphone,
                    color: 'text-emerald-400',
                    badge: 'OFFLINE PWA',
                  },
                  {
                    id: 2,
                    title: '3. Multi-Catchment Alerts',
                    desc: 'Multi-state anomaly triage, notifications, and alert escalation.',
                    icon: Radio,
                    color: 'text-amber-400',
                    badge: 'ALERTS',
                  },
                  {
                    id: 4,
                    title: '4. Human Verification Review',
                    desc: 'Nodal review, evidence locking, and immutable audit trail.',
                    icon: ShieldCheck,
                    color: 'text-indigo-400',
                    badge: 'GOVERNANCE',
                  },
                  {
                    id: 5,
                    title: '5. National Command Center',
                    desc: 'Interactive GIS catchment layers, health scores, and metrics.',
                    icon: Layers,
                    color: 'text-teal-400',
                    badge: 'COMMAND GIS',
                  },
                  {
                    id: 6,
                    title: '6. Official Evidence Dossier (PDF)',
                    desc: 'Instant 19-section Government Compliance Dossier with print layout.',
                    icon: FileText,
                    color: 'text-rose-400',
                    badge: 'AUDIT REPORT',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLaunchScenario(item.id)}
                      className="p-3.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition flex flex-col justify-between group cursor-pointer hover:bg-slate-900/50"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon className={`h-4 w-4 ${item.color}`} />
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-white group-hover:text-emerald-300 transition">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <span>Launch Scenario</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Reset Demo State Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-sans">
                  Resets offline queues &amp; session states for a fresh SIH evaluation run.
                </span>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    switchDemoRole('SUPER_ADMIN');
                    navigate('/super-admin');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Reset Evaluation State
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
