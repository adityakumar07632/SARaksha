import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Watershed,
  Intervention,
  FieldEvidence,
  Alert,
  InspectionTask
} from '../types';
import {
  MOCK_WATERSHEDS,
  MOCK_INTERVENTIONS,
  MOCK_FIELD_EVIDENCE,
  MOCK_ALERTS
} from '../data/mockData';

interface DataContextType {
  watersheds: Watershed[];
  interventions: Intervention[];
  evidenceList: FieldEvidence[];
  alerts: Alert[];
  inspections: InspectionTask[];
  approveEvidence: (evidenceId: string, reviewerName?: string) => void;
  flagEvidence: (evidenceId: string, reason?: string) => void;
  addEvidence: (evidence: Omit<FieldEvidence, 'id' | 'capturedAt'>) => FieldEvidence;
  createInspection: (task: Omit<InspectionTask, 'id' | 'createdAt' | 'status'>) => InspectionTask;
  resolveAlert: (alertId: string) => void;
  // Dynamic stats
  pendingVerificationCount: number;
  activeAlertsCount: number;
  verificationRatePercent: number;
  totalEvidenceCount: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watersheds, setWatersheds] = useState<Watershed[]>(MOCK_WATERSHEDS);
  const [interventions, setInterventions] = useState<Intervention[]>(MOCK_INTERVENTIONS);
  const [evidenceList, setEvidenceList] = useState<FieldEvidence[]>(MOCK_FIELD_EVIDENCE);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [inspections, setInspections] = useState<InspectionTask[]>([
    {
      id: 'INS-001',
      interventionId: 'GP-011',
      interventionName: 'Gully Plug #11',
      watershedId: 'WS-012',
      watershedName: 'Ludhiana Canal Catchment (WS-012)',
      reason: 'Structural anchor scour after flash rain',
      priority: 'HIGH',
      assignedOfficer: 'Harpreet Kaur',
      assignedOfficerId: 'USR-004',
      dueDate: '2026-08-25',
      status: 'Pending Field Visit',
      createdAt: '2026-08-21',
      alertId: 'ALT-902',
    }
  ]);

  // Compute dynamic stats
  const pendingEvidence = evidenceList.filter((e) => e.verificationStatus === 'PENDING');
  const verifiedEvidence = evidenceList.filter((e) => e.verificationStatus === 'VERIFIED');
  const pendingVerificationCount = 14 + (pendingEvidence.length - 1); // Baseline 14 + delta
  const totalEvidenceCount = 1248 + (evidenceList.length - MOCK_FIELD_EVIDENCE.length);
  const activeAlertsCount = alerts.filter((a) => !a.isResolved).length;
  const verificationRatePercent = Math.round((verifiedEvidence.length / (evidenceList.length || 1)) * 100);

  // Approve Evidence (Human sign-off)
  const approveEvidence = (evidenceId: string, reviewerName: string = 'Dr. Rajesh Sharma (Super Admin)') => {
    setEvidenceList((prev) =>
      prev.map((e) => {
        if (e.id === evidenceId) {
          return {
            ...e,
            verificationStatus: 'VERIFIED',
            verifiedBy: reviewerName,
            verifiedAt: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            notes: (e.notes ? e.notes + ' | ' : '') + 'Verified & approved by authorized nodal officer.',
          };
        }
        return e;
      })
    );

    // Update intervention verification flag
    const target = evidenceList.find((e) => e.id === evidenceId);
    if (target) {
      setInterventions((prev) =>
        prev.map((inv) =>
          inv.id === target.interventionId ? { ...inv, isFieldVerified: true } : inv
        )
      );
    }
  };

  // Flag Evidence for re-inspection
  const flagEvidence = (evidenceId: string, reason?: string) => {
    setEvidenceList((prev) =>
      prev.map((e) =>
        e.id === evidenceId
          ? {
              ...e,
              verificationStatus: 'FLAGGED',
              notes: (e.notes ? e.notes + ' | ' : '') + (reason || 'Flagged for re-inspection.'),
            }
          : e
      )
    );
  };

  // Add new field evidence (Field Officer submit flow)
  const addEvidence = (evidence: Omit<FieldEvidence, 'id' | 'capturedAt'>): FieldEvidence => {
    const newId = `EVD-${1040 + evidenceList.length + 1}`;
    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    const newRecord: FieldEvidence = {
      ...evidence,
      id: newId,
      capturedAt: timestamp,
    };

    setEvidenceList((prev) => [newRecord, ...prev]);

    // Update intervention evidence count
    setInterventions((prev) =>
      prev.map((inv) =>
        inv.id === evidence.interventionId
          ? { ...inv, fieldEvidenceCount: inv.fieldEvidenceCount + 1 }
          : inv
      )
    );

    return newRecord;
  };

  // Create Field Inspection Task (Decision support flow)
  const createInspection = (
    task: Omit<InspectionTask, 'id' | 'createdAt' | 'status'>
  ): InspectionTask => {
    const newId = `INS-${(inspections.length + 10).toString().padStart(3, '0')}`;
    const timestamp = new Date().toISOString().split('T')[0];

    const newInspection: InspectionTask = {
      ...task,
      id: newId,
      createdAt: timestamp,
      status: 'Pending Field Visit',
    };

    setInspections((prev) => [newInspection, ...prev]);
    return newInspection;
  };

  // Resolve Alert
  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              isResolved: true,
              resolvedAt: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            }
          : a
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        watersheds,
        interventions,
        evidenceList,
        alerts,
        inspections,
        approveEvidence,
        flagEvidence,
        addEvidence,
        createInspection,
        resolveAlert,
        pendingVerificationCount,
        activeAlertsCount,
        verificationRatePercent,
        totalEvidenceCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
