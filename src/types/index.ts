export type UserRole = 'SUPER_ADMIN' | 'NORMAL_ADMIN' | 'FIELD_OFFICER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  assignedWatershedId?: string;
  assignedWatershedName?: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
}

export type HealthStatus = 'HEALTHY' | 'MODERATE' | 'CRITICAL';

export interface HealthScoreBreakdown {
  vegetation: number; // 40%
  water: number;      // 30%
  interventionCondition: number; // 20%
  landDegradation: number;        // 10%
  explanation: string;
}

export interface Watershed {
  id: string;
  code: string; // e.g. WS-001
  name: string;
  state: string;
  district: string;
  subDistrict?: string;
  areaHa: number;
  totalInterventions: number;
  healthScore: number;
  status: HealthStatus;
  activeAlerts: number;
  pendingVerificationCount: number;
  coordinates: [number, number]; // [lat, lng]
  boundariesGeoJson?: any;
  lastUpdated: string;
  description: string;
}

export type LifecycleStage = 
  | 'Planned'
  | 'Construction Started'
  | 'Completed'
  | 'Field Verified'
  | 'Monitoring'
  | 'Impact Assessed'
  | 'Under Intervention';

export type InterventionType = 
  | 'Check Dam'
  | 'Contour Trench'
  | 'Farm Pond'
  | 'Percolation Tank'
  | 'Gully Plug'
  | 'Afforestation Area'
  | 'Afforestation Zone'
  | 'Recharge Shaft'
  | 'Contour Bund'
  | 'Desilting Site'
  | 'Stream Restoration'
  | 'Drainage Treatment';

export type ImpactClassification =
  | 'SIGNIFICANT_IMPROVEMENT'
  | 'POSITIVE_IMPROVEMENT'
  | 'MINIMAL_CHANGE'
  | 'NEGATIVE_TREND'
  | 'SIGNIFICANT_DEGRADATION';

export interface PeriodMetrics {
  periodLabel: string;
  date: string;
  image: string;
  ndvi: number;
  vegetationPercent: number;
  waterPresencePercent: number;
  barrenAreaPercent: number;
  healthScore: number;
  waterSurfaceAreaKm2: number;
  waterConfidence: number;
  soilMoisture: string;
  erosionRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface LulcDistribution {
  water: number;
  vegetation: number;
  agriculture: number;
  barren: number;
  builtUp?: number;
}

export interface ImpactTimelineItem {
  year: string;
  stage: string;
  title: string;
  description: string;
  badge?: string;
}

export interface ImpactFieldCorrelation {
  metric: string;
  satelliteObservation: string;
  fieldFinding: string;
  consistency: 'CONSISTENT' | 'PARTIALLY_CONSISTENT' | 'INCONSISTENT';
  interpretation: string;
}

export interface ImpactAnalysisRecord {
  interventionId: string;
  watershedId: string;
  locationName: string;
  coordinates: [number, number];
  areaKm2: number;
  dataClassification: 'DEMO_DATA';
  before: PeriodMetrics;
  after: PeriodMetrics;
  lulc: {
    before: LulcDistribution;
    after: LulcDistribution;
  };
  fieldEvidenceIds: string[];
  fieldPhotos?: {
    before?: { url: string; caption: string; date: string };
    after?: { url: string; caption: string; date: string };
  };
  timeline: ImpactTimelineItem[];
  fieldCorrelation: ImpactFieldCorrelation[];
  impactScore: number; // delta health score e.g. +18
  classification: ImpactClassification;
  aiInterpretation: {
    summary: string;
    confidence: number;
    disclaimer: string;
  };
  recommendations: string[];
}

export interface Intervention {
  id: string;
  code: string; // e.g. CD-012
  name: string;
  watershedId: string;
  watershedName: string;
  state: string;
  district: string;
  type: InterventionType;
  lifecycleStage: LifecycleStage;
  healthScore: number;
  status: HealthStatus;
  coordinates: [number, number]; // [lat, lng]
  constructionDate: string;
  implementingAgency: string;
  budgetAllocatedLakhs: number;
  capacityM3?: number;
  currentCondition: string;
  lastInspectedDate: string;
  isFieldVerified: boolean;
  fieldEvidenceCount: number;
  activeAlertCount: number;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  baselineNdvi?: number;
  monitoringEnabled?: boolean;
}

export interface AIAnalysisResult {
  structureDetected: string;
  structureConfidence: number; // 0-100
  waterDetected: boolean;
  waterConfidence: number;
  vegetationDetected: boolean;
  vegetationConfidence: number;
  potentialIssue: string;
  confidenceScore: number; // 0-100
  recommendation: string;
  requiresHumanReview: boolean;
}

export interface FieldEvidence {
  id: string;
  interventionId: string;
  interventionName: string;
  watershedId: string;
  photoUrl: string;
  thumbnailUrl: string;
  caption: string;
  coordinates: [number, number];
  accuracyM?: string; // e.g. "±5m (Simulated GNSS)"
  capturedAt: string;
  uploadedBy: {
    name: string;
    role: string;
    id: string;
  };
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  aiAnalysis: AIAnalysisResult;
}

export interface InspectionTask {
  id: string;
  interventionId: string;
  interventionName: string;
  watershedId: string;
  watershedName: string;
  reason: string;
  priority: AlertSeverity;
  assignedOfficer: string;
  assignedOfficerId: string;
  dueDate: string;
  status: 'Pending Field Visit' | 'In Progress' | 'Completed';
  createdAt: string;
  alertId?: string;
}

export interface LifecycleStageDetail {
  stage: LifecycleStage;
  date: string;
  status: 'Completed' | 'Current' | 'Pending';
  responsibleAgency: string;
  notes: string;
  supportingEvidenceId?: string;
}

export interface YearlyObservation {
  year: number;
  ndvi: number;
  ndwi: number;
  vegetationCoverPercent: number;
  waterSurfaceAreaHa: number;
  soilMoistureIndex: number;
}

export interface SatelliteData {
  interventionId: string;
  watershedId: string;
  sensor: string; // e.g. "Sentinel-2 / Landsat 8 (Simulated)"
  resolution: string;
  lastPassDate: string;
  currentNdvi: number;
  currentNdwi: number;
  historicalObservations: YearlyObservation[];
  monthlyNdviTrend2025: { month: string; value: number }[];
  monthlyNdwiTrend2025: { month: string; value: number }[];
}

export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertCategory = 
  | 'HEALTH_DROP' 
  | 'STRUCTURAL_DEFECT' 
  | 'VEGETATION_DECLINE' 
  | 'WATER_RECESSION' 
  | 'VERIFICATION_OVERDUE' 
  | 'EROSION_RISK';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  state: string;
  district: string;
  watershedId: string;
  watershedName: string;
  interventionId?: string;
  interventionName?: string;
  timestamp: string;
  isResolved: boolean;
  resolvedAt?: string;
  assignedOfficer?: string;
}

export interface EvidenceChainStep {
  step: 'PHOTO' | 'GPS' | 'DATE' | 'SATELLITE' | 'IMPACT' | 'SCORE';
  title: string;
  subtitle: string;
  status: 'VERIFIED' | 'ANALYZED' | 'RECORDED' | 'CALCULATED';
  details: Record<string, any>;
  iconName: string;
}

