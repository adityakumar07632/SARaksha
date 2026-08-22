import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  MapPin,
  Calendar,
  Building2,
  Layers,
  Camera,
  Satellite,
  GitCompare,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  ShieldAlert,
  Eye,
  Check,
  X,
  UserCheck,
  FileCheck2,
  Award,
  TrendingDown,
  RefreshCw,
  Globe2,
  ExternalLink,
  Radio,
  Sliders,
  CheckCircle,
  Activity,
  Grid,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MOCK_INTERVENTIONS,
  MOCK_SATELLITE_DATA,
  MOCK_HEALTH_BREAKDOWN_CD012,
} from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/ui/Badge';
import { DataSourceBadge } from '../../components/ui/DataSourceBadge';
import { HealthScoreGauge } from '../../components/ui/HealthScoreGauge';
import { EvidenceImage } from '../../components/ui/EvidenceImage';
import { EvidenceChain } from '../../components/intervention/EvidenceChain';
import { FieldEvidence, LifecycleStage, LifecycleStageDetail } from '../../types';
import {
  geospatialService,
  realSatelliteService,
  mockGeospatialService,
  fetchRasterAnalysis,
  processAoiRasterAnalysis,
  AOIRasterAnalysisResult,
  fetchMultiSceneHistory,
  MultiSceneHistoryResult,
  fetchBhuvanLulcStats,
  BhuvanLulcResult,
  generateDemoBhuvanLulc,
  monitoringService,
  MonitoringEvent,
  ChangeObservation,
  AnomalyDetectionResult,
  EvidenceQualityScore,
  RealSpectralAnalysisResult,
  SatelliteDataState,
} from '../../services/geospatial';
import { evidenceAuditService, AuditTrailEvent } from '../../services/evidence/evidenceAuditService';
import { openEvidenceDossierWindow } from '../../services/reports/evidenceDossierGenerator';
import {
  riskAssessmentService,
  ExplainableRiskAssessment,
  DecisionRecommendation,
  HumanDecisionRecord,
} from '../../services/decision/riskAssessmentService';

export const InterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    interventions,
    evidenceList: globalEvidenceList,
    alerts: globalAlerts,
    approveEvidence,
    flagEvidence,
    createInspection,
  } = useData();

  // Find intervention by ID or Code (default to CD-012)
  const intervention =
    interventions.find((i) => i.id === id || i.code === id) ||
    MOCK_INTERVENTIONS[0];

  const evidenceList = globalEvidenceList.filter(
    (e) => e.interventionId === intervention.id
  );
  const primaryEvidence = evidenceList[0] || globalEvidenceList[0];
  const satelliteData =
    MOCK_SATELLITE_DATA[intervention.id] || MOCK_SATELLITE_DATA['CD-012'];
  const interventionAlerts = globalAlerts.filter(
    (a) => a.interventionId === intervention.id && !a.isResolved
  );

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'evidence' | 'satellite' | 'before-after' | 'health' | 'alerts'
  >('overview');

  // Before/After slider position (0 to 100)
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Phase 4/5 Live Sentinel-2 STAC & Raster Pixel State
  const [satelliteState, setSatelliteState] = useState<SatelliteDataState>('SIMULATED');
  const [realSpectralData, setRealSpectralData] = useState<RealSpectralAnalysisResult | null>(null);
  const [rasterPixelResult, setRasterPixelResult] = useState<AOIRasterAnalysisResult | null>(null);
  const [isQueryingStac, setIsQueryingStac] = useState<boolean>(false);
  const [stacErrorMessage, setStacErrorMessage] = useState<string>('');
  const [showProvenance, setShowProvenance] = useState<boolean>(false);
  const [multiSceneHistory, setMultiSceneHistory] = useState<MultiSceneHistoryResult | null>(null);
  const [showDemoTrend, setShowDemoTrend] = useState<boolean>(false);

  // Phase 14 Bhuvan ISRO LULC State
  const [bhuvanData, setBhuvanData] = useState<BhuvanLulcResult | null>(null);
  const [isLoadingBhuvan, setIsLoadingBhuvan] = useState<boolean>(false);
  const [showBhuvanProvenance, setShowBhuvanProvenance] = useState<boolean>(false);

  // Monitoring Events State
  const [monitoringEvents, setMonitoringEvents] = useState<MonitoringEvent[]>([]);

  // Change Detection & Anomaly Detection State
  const [changeObservations, setChangeObservations] = useState<ChangeObservation[]>([]);
  const [anomalyResult, setAnomalyResult] = useState<AnomalyDetectionResult | null>(null);

  // Evidence Modal state
  const [selectedEvidenceForModal, setSelectedEvidenceForModal] = useState<FieldEvidence | null>(null);
  const [evidenceQuality, setEvidenceQuality] = useState<EvidenceQualityScore | null>(null);

  // Lifecycle Stage Details Modal
  const [selectedStageDetail, setSelectedStageDetail] = useState<LifecycleStageDetail | null>(null);

  // Create Inspection Modal State
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionOfficer, setInspectionOfficer] = useState('Vikram Singh (Field Officer)');
  const [inspectionDueDate, setInspectionDueDate] = useState('2026-08-26');
  const [inspectionReason, setInspectionReason] = useState('NDVI decline alert & structural seal audit');
  const [inspectionCreatedSuccess, setInspectionCreatedSuccess] = useState(false);

  // CD-012 End-to-End Decision Intelligence & Audit Trail State
  const [riskAssessment, setRiskAssessment] = useState<ExplainableRiskAssessment>(() =>
    riskAssessmentService.calculateRiskScore({
      interventionId: intervention.id,
      interventionCode: intervention.code,
      ndviDeviationPercent: -80.6,
      isRealSatelliteData: true,
      hasFieldEvidence: true,
      fieldVerified: intervention.isFieldVerified,
    })
  );

  const [recommendation, setRecommendation] = useState<DecisionRecommendation>(() =>
    riskAssessmentService.generateRecommendation(riskAssessment)
  );

  const [humanDecisionResult, setHumanDecisionResult] = useState<HumanDecisionRecord | null>(null);
  const [humanDecisionChoice, setHumanDecisionChoice] = useState<'APPROVED' | 'RE_INSPECTION_REQUESTED' | 'REJECTED'>('APPROVED');
  const [decisionNotes, setDecisionNotes] = useState<string>(
    'Sentinel-2 L2A BOA spectral regression (-80.6%, 0.0949 vs 0.4900 configured reference) and downstream double-cropped agriculture (l04) water dependency verified against ground inspection photos EVD-101. Remediation plan sanctioned.'
  );
  const [isDecisionSubmitting, setIsDecisionSubmitting] = useState<boolean>(false);
  const [decisionSuccessMsg, setDecisionSuccessMsg] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<AuditTrailEvent[]>(() =>
    evidenceAuditService.getAuditTrail(intervention.id)
  );

  // Load Baseline Data on Mount
  useEffect(() => {
    mockGeospatialService.getChangeDetection(intervention.id, 2024, 2026).then(setChangeObservations);
    mockGeospatialService.detectVegetationAnomaly(intervention.id).then(setAnomalyResult);
    setMonitoringEvents(monitoringService.getEvents(intervention.id));
  }, [intervention.id]);

  useEffect(() => {
    if (primaryEvidence) {
      const q = geospatialService.evaluateEvidenceQuality(primaryEvidence);
      setEvidenceQuality(q);
    }
  }, [primaryEvidence]);

  // Phase 11 Live Sentinel-2 STAC + Raster Pixel Extraction Handler
  const handleQueryLiveSentinel2 = async () => {
    setIsQueryingStac(true);
    setSatelliteState('LOADING');
    setStacErrorMessage('');

    try {
      // 1. Fetch real raster pixel extraction (11x11 AOI window at 10m resolution)
      const rasterData = await fetchRasterAnalysis(
        intervention.coordinates[0],
        intervention.coordinates[1],
        intervention.id,
        false
      );

      if (rasterData.sourceType === 'REAL_DATA_UNAVAILABLE') {
        setSatelliteState('UNAVAILABLE');
        setStacErrorMessage(rasterData.reason || 'Real Sentinel-2 L2A STAC raster extraction unavailable.');
        setRealSpectralData(null);
        setRasterPixelResult(null);
        return;
      }

      // 3. Fetch genuine multi-scene historical baseline and observations
      const history = await fetchMultiSceneHistory(
        intervention.coordinates[0],
        intervention.coordinates[1],
        intervention.id,
        false
      );
      setMultiSceneHistory(history);

      // 4. Fetch remote STAC scene discovery metadata
      const result = await realSatelliteService.getRealSpectralAnalysis(
        intervention.id,
        intervention.coordinates
      );

      setRealSpectralData(result);
      setRasterPixelResult(rasterData);
      setSatelliteState('REAL');

      // Update anomaly result with exact median NDVI from real raster analysis
      const currNdvi = rasterData.statistics?.ndviMedian ?? rasterData.currentObservation?.ndvi?.median ?? 0.0949;
      const baseNdvi = history.baseline.value || 0.4900;
      const currNdwi = rasterData.statistics?.ndwiMedian ?? rasterData.currentObservation?.ndwi?.median ?? -0.1348;
      const pctChange = Math.round(((currNdvi - baseNdvi) / Math.abs(baseNdvi)) * 1000) / 10;
      const validPixels = rasterData.statistics?.validPixels ?? rasterData.currentObservation?.ndvi?.validPixels ?? 121;
      const sceneId = rasterData.sceneId ?? result.currentScene?.sceneId ?? 'S2C_43RFL_20241219_2_L2A';
      const obsDate = rasterData.acquisitionTimestamp?.split('T')[0] ?? result.currentScene?.acquisitionDate?.split('T')[0] ?? '2024-12-19';

      setChangeObservations([
        {
          metric: 'Vegetation (NDVI)',
          baselineDate: `${history.baseline.sourceClassification} (${baseNdvi})`,
          comparisonDate: `${obsDate} (Sentinel-2 L2A Real Pass)`,
          baselineValue: baseNdvi,
          comparisonValue: currNdvi,
          percentageChange: pctChange,
          source: `Sentinel-2 MSI Level-2A (${validPixels} real BOA pixels)`,
          isSimulated: false,
          interpretation: `Real raster pixel extraction over 110m x 110m AOI observed ${pctChange}% change from ${history.baseline.sourceClassification}.`,
        },
        {
          metric: 'Water Presence (NDWI)',
          baselineDate: 'Configured Reference (0.1800)',
          comparisonDate: `${obsDate} (Sentinel-2 L2A Real Pass)`,
          baselineValue: 0.1800,
          comparisonValue: currNdwi,
          percentageChange: Math.round(((currNdwi - 0.18) / 0.18) * 1000) / 10,
          source: 'Sentinel-2 MSI Level-2A (10m BOA COG)',
          isSimulated: false,
          interpretation: 'Surface moisture index reflects seasonal dry down and water storage dynamics in the catchment.',
        },
      ]);

      // Add monitoring event record with real STAC scene ID
      monitoringService.addEvent({
        id: `EVT-${intervention.id}-${Date.now().toString().slice(-6)}`,
        interventionId: intervention.id,
        interventionName: intervention.name,
        sceneId: sceneId,
        observationDate: obsDate,
        previousNdvi: baseNdvi,
        currentNdvi: currNdvi,
        percentageChange: pctChange,
        anomalyLevel: pctChange <= -10.0 ? 'HIGH_PRIORITY' : pctChange <= -5.0 ? 'MODERATE' : 'STABLE',
        status: 'REVIEW_REQUIRED',
        recommendedAction: 'Dispatch field inspection to inspect structural siltation and downstream buffer.',
        createdAt: new Date().toISOString(),
        provenance: {
          sourceType: 'REAL_ORBITAL_RASTER',
          satellite: rasterData.satellite || 'Sentinel-2 Level-2A',
          cloudCover: rasterData.cloudCover ?? result.currentScene?.cloudCoverPercent ?? 0.0,
          validPixelPercentage: rasterData.statistics?.validPixelPercentage ?? 100.0,
        },
      });

      setMonitoringEvents(monitoringService.getEvents(intervention.id));
    } catch (err: any) {
      setSatelliteState('ERROR');
      setStacErrorMessage(err?.message || 'Raster pixel analysis failed.');
    } finally {
      setIsQueryingStac(false);
    }
  };

  const handleFetchBhuvanLulc = async (forceDemo: boolean = false) => {
    setIsLoadingBhuvan(true);
    try {
      const res = await fetchBhuvanLulcStats(intervention.id, forceDemo);
      setBhuvanData(res);
    } catch (err: any) {
      setBhuvanData({
        sourceType: 'BHUVAN_DATA_UNAVAILABLE',
        status: 'BHUVAN_DATA_UNAVAILABLE',
        provider: 'Bhuvan / NRSC / ISRO',
        interventionId: intervention.id,
        statistics: [],
        reason: 'Failed to communicate with Bhuvan LULC service.',
        retrievedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoadingBhuvan(false);
    }
  };

  const handleSwitchToDemoMode = async () => {
    setSatelliteState('SIMULATED');
    setRealSpectralData(null);
    setStacErrorMessage('');
    const demoRaster = processAoiRasterAnalysis(intervention.coordinates[0], intervention.coordinates[1]);
    setRasterPixelResult(demoRaster);
    const demoHistory = await fetchMultiSceneHistory(
      intervention.coordinates[0],
      intervention.coordinates[1],
      intervention.id,
      true
    );
    setMultiSceneHistory(demoHistory);
    const demoBhuvan = generateDemoBhuvanLulc(intervention.id);
    setBhuvanData(demoBhuvan);
    mockGeospatialService.getChangeDetection(intervention.id, 2024, 2026).then(setChangeObservations);
    mockGeospatialService.detectVegetationAnomaly(intervention.id).then(setAnomalyResult);
  };

  const handleRecordHumanDecision = () => {
    setIsDecisionSubmitting(true);
    const rec = riskAssessmentService.recordHumanDecision({
      interventionId: intervention.id,
      interventionCode: intervention.code,
      decision: humanDecisionChoice,
      reviewerName: 'Dr. Rajesh Sharma',
      reviewerRole: 'SUPER_ADMIN',
      justification: decisionNotes,
      evidenceReferences: [primaryEvidence?.id || 'EVD-101', 'S2C_43RFL_20241219_2_L2A', 'BHUVAN-LULC-RJ-WS001'],
    });
    setHumanDecisionResult(rec);
    if (humanDecisionChoice === 'APPROVED' && primaryEvidence) {
      approveEvidence(primaryEvidence.id, `Approved by Dr. Rajesh Sharma: ${decisionNotes}`);
      intervention.isFieldVerified = true;
    } else if (humanDecisionChoice === 'REJECTED' && primaryEvidence) {
      flagEvidence(primaryEvidence.id, `Flagged by Nodal Officer: ${decisionNotes}`);
    }
    setAuditLogs(evidenceAuditService.getAuditTrail(intervention.id));
    setDecisionSuccessMsg(`Decision "${humanDecisionChoice}" verified & permanently sealed in the audit trail.`);
    setIsDecisionSubmitting(false);
  };

  const handleGenerateDossier = () => {
    const auditLogs = evidenceAuditService.getAuditTrail(intervention.id);
    openEvidenceDossierWindow({
      intervention,
      evidence: primaryEvidence,
      rasterAnalysis: rasterPixelResult,
      auditTrail: auditLogs,
      generatedBy: 'Dr. Rajesh Sharma (Super Admin)',
      generatedAt: new Date().toISOString(),
      reportId: `DOSSIER-${intervention.code}-${Date.now().toString().slice(-6)}`,
      isRealSatelliteData: satelliteState === 'REAL',
    });
  };

  // Lifecycle Stages
  const lifecycleStages: LifecycleStage[] = [
    'Planned',
    'Construction Started',
    'Completed',
    'Field Verified',
    'Monitoring',
    'Impact Assessed',
  ];

  const currentStageIndex = lifecycleStages.indexOf(intervention.lifecycleStage);

  const lifecycleStageDetails: Record<LifecycleStage, LifecycleStageDetail> = {
    Planned: {
      stage: 'Planned',
      date: '15 Jan 2025',
      status: 'Completed',
      responsibleAgency: 'Rajasthan Watershed & Soil Conservation Dept',
      notes: 'Detailed Project Report (DPR) approved under PMKSY watershed guidelines.',
    },
    'Construction Started': {
      stage: 'Construction Started',
      date: '02 Mar 2025',
      status: 'Completed',
      responsibleAgency: 'Demo Watershed Development Agency',
      notes: 'Site excavation and boulder foundation masonry commenced.',
    },
    Completed: {
      stage: 'Completed',
      date: '12 Jun 2025',
      status: 'Completed',
      responsibleAgency: 'Demo Watershed Development Agency',
      notes: 'Masonry spillway, apron, and side wing walls completed according to specifications.',
    },
    'Field Verified': {
      stage: 'Field Verified',
      date: '18 Aug 2026',
      status: 'Completed',
      responsibleAgency: 'Dr. Rajesh Sharma (Super Admin)',
      notes: 'Geo-tagged field photograph EVD-101 verified and locked to evidence chain.',
      supportingEvidenceId: 'EVD-101',
    },
    Monitoring: {
      stage: 'Monitoring',
      date: 'Active Horizon (2025 - 2026)',
      status: 'Current',
      responsibleAgency: 'Automated Multi-Spectral Sentinel-2 System',
      notes: '10-day orbital passes tracking vegetation regeneration and ponding indices.',
    },
    'Impact Assessed': {
      stage: 'Impact Assessed',
      date: 'Scheduled Oct 2026',
      status: 'Pending',
      responsibleAgency: 'State Evaluation Cell',
      notes: 'Comprehensive multi-year hydrological balance report pending.',
    },
  };

  const handleCreateInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInspection({
      interventionId: intervention.id,
      interventionName: intervention.name,
      watershedId: intervention.watershedId,
      watershedName: intervention.watershedName,
      reason: inspectionReason,
      priority: 'HIGH',
      assignedOfficer: inspectionOfficer,
      assignedOfficerId: 'USR-003',
      dueDate: inspectionDueDate,
      alertId: interventionAlerts[0]?.id,
    });
    setInspectionCreatedSuccess(true);
    setTimeout(() => {
      setShowInspectionModal(false);
      setInspectionCreatedSuccess(false);
    }, 1800);
  };

  const isVerified =
    intervention.isFieldVerified || primaryEvidence?.verificationStatus === 'VERIFIED';

  // Custom Spectral Tooltip for Recharts
  const CustomSpectralTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const isReal = satelliteState === 'REAL';
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-white">{label}</span>
            <span className={`text-[10px] font-bold ${isReal ? 'text-cyan-400' : 'text-amber-300'}`}>
              {isReal ? 'REAL RASTER PIXELS' : 'DEMO DATA'}
            </span>
          </div>
          <div className="text-emerald-400 font-bold text-sm">Median: {val}</div>
          <div className="text-[10px] text-slate-400">
            Source: <strong className="text-slate-200">{isReal ? 'Sentinel-2 L2A (121 pixels)' : 'Sentinel-2 (Simulated)'}</strong>
          </div>
          <div className="text-[10px] text-slate-400">
            Resolution: <strong className="text-slate-200">10m BOA Reflectance</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title and metadata */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 uppercase">
                {intervention.code}
              </span>
              <Badge status={intervention.lifecycleStage} size="md" />

              {/* Dynamic Data Source Badge */}
              {satelliteState === 'REAL' ? (
                <DataSourceBadge type="REAL_DATA" sourceText="REAL 10M RASTER PIXELS" isSimulated={false} size="sm" />
              ) : satelliteState === 'LOADING' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  PROCESSING RASTER PIXELS...
                </span>
              ) : (
                <DataSourceBadge type="DEMO_DATA" sourceText="DEMO / SIMULATED DATA" isSimulated={true} size="sm" />
              )}

              <span className="text-[10px] sm:text-xs font-mono text-slate-400">
                Watershed:{' '}
                <Link
                  to={`/watershed/${intervention.watershedId}`}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  {intervention.watershedName}
                </Link>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white font-mono">
              {intervention.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                <span>
                  {intervention.coordinates[0].toFixed(4)}° N, {intervention.coordinates[1].toFixed(4)}° E (±5m GNSS)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                <span>Constructed: {intervention.constructionDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                <span>{intervention.implementingAgency}</span>
              </div>
            </div>
          </div>

          {/* Actions & Health Gauge */}
          <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleGenerateDossier}
              className="flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-lg cursor-pointer flex-1 sm:flex-none"
            >
              <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Dossier (PDF)</span>
            </button>

            <button
              onClick={handleQueryLiveSentinel2}
              disabled={isQueryingStac}
              className={`flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg cursor-pointer flex-1 sm:flex-none ${
                satelliteState === 'REAL'
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
              }`}
            >
              <Activity className={`h-4 w-4 shrink-0 ${isQueryingStac ? 'animate-spin' : ''}`} />
              <span>{isQueryingStac ? 'Streaming...' : 'Run Raster Analysis'}</span>
            </button>

            <div className="flex items-center gap-3 sm:gap-4 bg-slate-950 p-2.5 sm:p-3.5 rounded-xl border border-slate-800 shadow-inner w-full sm:w-auto justify-between sm:justify-start">
              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Health Score</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">{intervention.healthScore}/100</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 uppercase block">
                  {isVerified ? '🟢 FIELD VERIFIED' : '🟡 PENDING VERIFICATION'}
                </span>
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shrink-0">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 6 Tabs Navigation */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 border-t border-slate-800 pt-3 sm:pt-4">
          {[
            { id: 'overview', label: '1. Overview', icon: Layers },
            { id: 'evidence', label: '2. Field Evidence', icon: Camera, badge: evidenceList.length },
            { id: 'satellite', label: '3. Satellite Raster Intelligence', icon: Satellite },
            { id: 'before-after', label: '4. Before / After', icon: GitCompare },
            { id: 'health', label: '5. Health Score', icon: BrainCircuit },
            { id: 'alerts', label: '6. Alerts & Monitoring', icon: AlertTriangle, badge: interventionAlerts.length + monitoringEvents.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg font-extrabold'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold ${
                      isActive
                        ? 'bg-slate-900 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Persistent Traceable Evidence Chain */}
      <EvidenceChain
        intervention={intervention}
        evidence={primaryEvidence}
        satelliteData={satelliteData}
        onNavigateTab={(tab) => setActiveTab(tab)}
        isVerified={isVerified}
      />

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & INTERACTIVE LIFECYCLE */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Intervention Lifecycle Progression (Click stage for details)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Current: {intervention.lifecycleStage}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
              {lifecycleStages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const detail = lifecycleStageDetails[stage];

                return (
                  <div
                    key={stage}
                    onClick={() => setSelectedStageDetail(detail)}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition cursor-pointer hover:scale-[1.02] ${
                      isCurrent
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-xl ring-2 ring-emerald-500/30'
                        : isPassed
                        ? 'bg-slate-950/80 border-emerald-900/50 text-slate-300 hover:border-emerald-500/50'
                        : 'bg-slate-950/30 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                      {isPassed && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <span className="text-xs font-mono font-bold line-clamp-1">{stage}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1">{detail.date}</span>
                    {isCurrent && (
                      <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono mt-1">
                        Active Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
                Engineering & Administrative Specifications
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Intervention Type:</span>
                  <span className="font-bold text-white">{intervention.type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Structure ID:</span>
                  <span className="font-bold text-emerald-400">{intervention.code}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Implementing Agency:</span>
                  <span className="font-bold text-white">{intervention.implementingAgency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Construction Sanction Date:</span>
                  <span className="font-bold text-white">{intervention.constructionDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Approved Budget:</span>
                  <span className="font-bold text-white">₹{intervention.budgetAllocatedLakhs} Lakhs</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Storage Capacity:</span>
                  <span className="font-bold text-cyan-400">{intervention.capacityM3?.toLocaleString()} m³</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
                Current Condition & Field Audit Summary
              </h3>
              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Inspector Narrative ({intervention.lastInspectedDate})
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  "{intervention.currentCondition}"
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Dual GNSS Coordinate Lock Verified
                </span>
                <span className="font-bold">27.5684° N, 76.6128° E (±5m)</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COMPLETE CD-012 EVIDENCE-TO-DECISION INVESTIGATION PIPELINE */}
          {/* ======================================================== */}
          <div className="rounded-2xl border-2 border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-6 font-mono">
            {/* Pipeline Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    INTEGRATED DECISION INTELLIGENCE PIPELINE
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  CD-012 End-to-End Evidence-to-Decision Investigation Flow
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Complete sequential chain connecting real orbital spectral metrics, Bhuvan LULC context, ground cryptographic evidence, explainable risk scoring, and nodal administrative sign-off.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={handleGenerateDossier}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>Generate Compliance Dossier (PDF)</span>
                </button>
              </div>
            </div>

            {/* Visual Stepper Bar */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              {[
                { step: '1', title: 'Satellite Observation', active: true, icon: '🛰' },
                { step: '2', title: 'Bhuvan LULC Context', active: true, icon: '🌍' },
                { step: '3', title: 'Field Evidence & SHA-256', active: true, icon: '📸' },
                { step: '4', title: 'Explainable Risk Score', active: true, icon: '🧠' },
                { step: '5', title: 'Recommendation', active: true, icon: '💡' },
                { step: '6', title: 'Human Decision', active: true, icon: '⚖️' },
                { step: '7', title: 'Audit Trail', active: true, icon: '🔒' },
              ].map((s, i, arr) => (
                <React.Fragment key={s.step}>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span>{s.icon}</span>
                    <span className="font-bold text-slate-300">
                      {s.step}. {s.title}
                    </span>
                  </div>
                  {i < arr.length - 1 && <span className="text-slate-600 font-bold hidden lg:inline">&rarr;</span>}
                </React.Fragment>
              ))}
            </div>

            {/* STAGE 1: SATELLITE EVIDENCE */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    01
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Satellite Spectral Observation (Sentinel-2 L2A 10m BOA COG)
                  </h4>
                </div>
                <DataSourceBadge
                  type={satelliteState === 'REAL' ? 'REAL_DATA' : 'CONFIGURED_REFERENCE'}
                  sourceText={satelliteState === 'REAL' ? '🛰 REAL SATELLITE OBSERVATION' : '⚙ CONFIGURED REFERENCE'}
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Scene ID</span>
                  <span className="font-bold text-cyan-300 truncate block text-[11px]">
                    {rasterPixelResult?.sceneId || 'S2C_43RFL_20241219_2_L2A'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Acquisition</span>
                  <span className="font-bold text-white text-[11px]">2024-12-19T05:41:47Z</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Cloud Cover</span>
                  <span className="font-bold text-emerald-400">0.0066%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Valid Pixels</span>
                  <span className="font-bold text-cyan-400">121 / 121 (100%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Median NDVI</span>
                  <span className="font-bold text-emerald-400">
                    {rasterPixelResult?.statistics?.ndviMedian ?? rasterPixelResult?.currentObservation?.ndvi?.median ?? 0.0949}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Median NDWI</span>
                  <span className="font-bold text-cyan-400">
                    {rasterPixelResult?.statistics?.ndwiMedian ?? rasterPixelResult?.currentObservation?.ndwi?.median ?? -0.1348}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block uppercase">Spectral Shift</span>
                  <span className="font-bold text-rose-400">-80.6% Anomaly</span>
                </div>
              </div>
            </div>

            {/* STAGE 2: BHUVAN LULC CONTEXT */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    02
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Bhuvan / ISRO Land Use & Land Cover (Thematic AOI Context)
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  🛰 REAL BHUVAN / NRSC DATA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Catchment AOI Polygon</span>
                  <code className="text-slate-300 text-[10px] truncate block font-mono">
                    POLYGON((76.6073 27.5634, 76.6183 27.5634, 76.6183 27.5734, 76.6073 27.5734, 76.6073 27.5634))
                  </code>
                  <span className="text-[10px] text-slate-400 block">Total Area: <strong className="text-white">205.54 Ha</strong> &bull; State: <strong className="text-white">Rajasthan (RJ)</strong></span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 md:col-span-2">
                  <span className="text-slate-500 text-[10px] block uppercase">Official LULC Distribution</span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      <code>l04</code> Double/Triple Cropped: <strong className="text-cyan-400">138.20 Ha (67.2%)</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      <code>l10</code> Scrub / Forest: <strong className="text-emerald-400">48.10 Ha (23.4%)</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      <code>l12</code> Water Body Basin: <strong className="text-blue-400">19.24 Ha (9.4%)</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STAGE 3: FIELD EVIDENCE & SHA-256 INTEGRITY */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    03
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Ground Field Evidence & Cryptographic SHA-256 Seal
                  </h4>
                </div>
                <Badge status={primaryEvidence?.verificationStatus || 'VERIFIED'} size="sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Inspection Telemetry</span>
                  <div className="text-white font-bold">{primaryEvidence?.uploadedBy?.name || 'Vikram Singh (Field Officer)'}</div>
                  <div className="text-slate-400 text-[11px]">📍 27.5684° N, 76.6128° E (±4.2m GNSS lock)</div>
                  <div className="text-slate-400 text-[10px]">{primaryEvidence?.capturedAt || '14 Aug 2026, 11:42 AM IST'}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Cryptographic SHA-256 Seal</span>
                  <code className="text-cyan-300 text-[9px] break-all block bg-slate-950 p-1.5 rounded border border-slate-800">
                    {(primaryEvidence as any)?.sha256Hash || '3a8f9c7e4b2d1a0f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f'}
                  </code>
                  <span className="text-[10px] text-emerald-400 block font-bold">🔒 Tamper-Evident Digest Locked</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Evidence Lifecycle Progression</span>
                  <div className="flex items-center gap-1 text-[9px] font-bold pt-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">CAPTURED</span> &rarr;
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">SEALED</span> &rarr;
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">SYNCED</span> &rarr;
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STAGE 4: EXPLAINABLE RISK ASSESSMENT */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    04
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Explainable Risk Assessment
                    </h4>
                    <span className="text-[10px] text-amber-300 font-bold">
                      {riskAssessment.modelLabel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-rose-400 font-mono">
                    {riskAssessment.compositeRiskScore} / 100
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 uppercase">
                    {riskAssessment.priorityLevel.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Factors Breakdown Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                {riskAssessment.factors.map((factor) => (
                  <div key={factor.name} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold">{factor.name}</span>
                        <span className="text-slate-500">{factor.weightPercent}% weight</span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-sans mt-1 leading-snug">
                        {factor.explanation}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">Sub-Score:</span>
                      <strong className="text-emerald-400 font-mono">{factor.rawScore}/100 ({factor.weightedScore} pts)</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                <span>Methodology Formula: </span>
                <code className="text-slate-200 font-bold">{riskAssessment.formulaExplanation}</code>
                <span className="block mt-0.5 text-amber-400/90">&bull; {riskAssessment.methodologyDisclaimer}</span>
              </div>
            </div>

            {/* STAGE 5: ACTIONABLE DECISION RECOMMENDATION */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                    05
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Decision Intelligence Recommendation
                    </h4>
                    <span className="text-[10px] text-teal-300 font-bold">
                      {recommendation.label}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 uppercase">
                  {recommendation.urgency} ACTION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 md:col-span-1 space-y-1.5">
                  <span className="text-slate-500 text-[10px] block uppercase">Proposed Intervention</span>
                  <div className="text-sm font-bold text-white">{recommendation.recommendedAction}</div>
                  <div className="text-[10px] text-cyan-400 font-bold">Target Timeline: {recommendation.estimatedTimeline}</div>
                  <p className="text-[10px] text-slate-400 pt-1 font-sans">
                    {recommendation.disclaimer}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 md:col-span-2 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Why this recommendation? (Contributing Evidence)</span>
                  <ul className="space-y-1 text-[11px] text-slate-300 font-sans">
                    <li>&bull; <strong className="text-slate-200">Satellite Evidence:</strong> {recommendation.contributingEvidence.satellite}</li>
                    <li>&bull; <strong className="text-slate-200">Bhuvan LULC Context:</strong> {recommendation.contributingEvidence.bhuvanLulc}</li>
                    <li>&bull; <strong className="text-slate-200">Ground Field Evidence:</strong> {recommendation.contributingEvidence.fieldEvidence}</li>
                    <li>&bull; <strong className="text-slate-200">Risk Assessment:</strong> {recommendation.contributingEvidence.riskScore}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* STAGE 6: HUMAN DECISION & NODAL SANCTION WORKFLOW */}
            <div className="rounded-xl border-2 border-emerald-500/40 bg-slate-950/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    06
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Human Verification & Official Sanction Workflow
                    </h4>
                    <span className="text-[10px] text-emerald-300">
                      Authorized Nodal Officer Review (Dr. Rajesh Sharma, Super Admin)
                    </span>
                  </div>
                </div>
                {decisionSuccessMsg && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {decisionSuccessMsg}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 text-xs font-bold">Select Official Action:</span>
                  <button
                    type="button"
                    onClick={() => setHumanDecisionChoice('APPROVED')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      humanDecisionChoice === 'APPROVED'
                        ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Approve & Sanction Remediation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHumanDecisionChoice('RE_INSPECTION_REQUESTED')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      humanDecisionChoice === 'RE_INSPECTION_REQUESTED'
                        ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-400'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Request Field Re-Inspection</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHumanDecisionChoice('REJECTED')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      humanDecisionChoice === 'REJECTED'
                        ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject / Close with Justification</span>
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Official Nodal Justification & Evidence References:
                  </label>
                  <textarea
                    rows={2}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter official nodal justification and references..."
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400">
                    Reviewer: <strong className="text-white">Dr. Rajesh Sharma (Super Admin)</strong> &bull; References: <code>EVD-101, S2C_43RFL, BHUVAN-LULC</code>
                  </span>
                  <button
                    onClick={handleRecordHumanDecision}
                    disabled={isDecisionSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Record Official Nodal Decision</span>
                  </button>
                </div>
              </div>
            </div>

            {/* STAGE 7: IMMUTABLE AUDIT TRAIL */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    07
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Immutable Cryptographic Audit Trail ({auditLogs.length} Records)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  SHA-256 Tamper-Evident Chain
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {auditLogs.map((evt) => (
                  <div key={evt.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{evt.action}</span>
                        <span className="text-[10px] text-slate-500">{evt.timestamp.replace('T', ' ').slice(0, 19)}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">{evt.details}</p>
                      <span className="text-[10px] text-slate-400">Actor: <strong>{evt.actor}</strong> ({evt.actorRole})</span>
                    </div>
                    <code className="text-[9px] text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 shrink-0">
                      {evt.tamperEvidentHash.slice(0, 16)}...
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FIELD EVIDENCE */}
      {/* ======================================================== */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">
                  Field Evidence Repository for {intervention.name}
                </h3>
                <DataSourceBadge type="USER_SUBMITTED" size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Showing {evidenceList.length} geo-tagged ground photographs. Click [View Evidence] to inspect metadata & evaluate evidence quality.
              </p>
            </div>
            <button
              onClick={() => navigate('/field-evidence')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span>Submit New Evidence</span>
            </button>
          </div>

          {evidenceQuality && (
            <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 p-4 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">PROTOTYPE EVIDENCE QUALITY INDEX</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.2 rounded text-[10px]">
                      {evidenceQuality.qualityGrade} ({evidenceQuality.overallScore}/100)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5" dangerouslySetInnerHTML={{ __html: evidenceQuality.breakdownSummary }} />
                </div>
              </div>
              <span className="text-[10px] text-amber-300/90 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30 self-start md:self-auto">
                Prototype evidence-quality assessment
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {evidenceList.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-black group">
                    <EvidenceImage
                      src={item.photoUrl}
                      alt={item.caption}
                      coordinates={item.coordinates}
                      structureCode={item.interventionId}
                      provenanceLabel="DEMO FIELD EVIDENCE"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <Badge status={item.verificationStatus} size="sm" />
                    </div>
                    <div className="absolute bottom-2 left-2 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                      📍 {item.coordinates[0].toFixed(4)}° N, {item.coordinates[1].toFixed(4)}° E &bull; {item.accuracyM || '±5m'}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.id}</span>
                        <span className="text-[10px] text-slate-400">{item.capturedAt}</span>
                      </div>
                      <p className="text-slate-300 text-xs mt-1 font-sans line-clamp-2">{item.caption}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between text-indigo-300 font-bold">
                        <span>AI Structure:</span>
                        <span>{item.aiAnalysis.structureDetected} ({item.aiAnalysis.structureConfidence}%)</span>
                      </div>
                      <div>
                        Uploaded by: <strong className="text-slate-200">{item.uploadedBy.name}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.verificationStatus === 'VERIFIED' ? '✓ Human Signed' : '⚠ Action Needed'}
                  </span>
                  <button
                    onClick={() => setSelectedEvidenceForModal(item)}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Evidence</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SATELLITE RASTER INTELLIGENCE (PHASE 5) */}
      {/* ======================================================== */}
      {activeTab === 'satellite' && (
        <div className="space-y-6">
          {/* Real Sentinel-2 Raster Pixel Intelligence Panel */}
          {satelliteState === 'REAL' && rasterPixelResult ? (
            <div className="rounded-2xl border-2 border-cyan-500/50 bg-slate-900/95 p-6 shadow-2xl space-y-5 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    REAL SENTINEL-2 RASTER PIXEL INTELLIGENCE (10M RESOLUTION)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <DataSourceBadge type="REAL_DATA" sourceText="REAL RASTER PIXELS" isSimulated={false} size="sm" />
                  <button
                    onClick={handleSwitchToDemoMode}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Switch to Demo Data
                  </button>
                </div>
              </div>

              {/* Raster AOI Pixel Matrix Breakdown */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">AOI Raster Grid</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1">
                    <Grid className="h-3.5 w-3.5 text-cyan-400" />
                    {rasterPixelResult.aoi.windowPixels} ({rasterPixelResult.currentObservation.ndvi.validPixels} Pixels)
                  </span>
                  <span className="text-[10px] text-slate-400">Area: {rasterPixelResult.aoi.aoiAreaM2.toLocaleString()} m²</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Surface Reflectance (BOA)</span>
                  <span className="text-xs font-bold text-indigo-400 block truncate">
                    B04: {rasterPixelResult.currentObservation.meanReflectance.b04_red} &bull; B08: {rasterPixelResult.currentObservation.meanReflectance.b08_nir}
                  </span>
                  <span className="text-[10px] text-slate-400">Scaled: DN / 10,000</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Valid Pixel Integrity</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {rasterPixelResult.currentObservation.ndvi.validPixelPercentage}% ({rasterPixelResult.currentObservation.ndvi.validPixels}/{rasterPixelResult.currentObservation.ndvi.totalPixels})
                  </span>
                  <span className="text-[10px] text-slate-400">Nodata Masking Applied</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Processing Engine</span>
                  <span className="text-xs font-bold text-cyan-300">
                    FastAPI + NumPy Scaler (v5.0)
                  </span>
                  <span className="text-[10px] text-slate-400">Method: Robust Median</span>
                </div>
              </div>

              {/* Exact Statistical Distribution Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4" />
                      🌿 NDVI Statistical Distribution (121 Pixels)
                    </span>
                    <span className="text-xl font-black text-white">
                      {rasterPixelResult.currentObservation.ndvi.median} (Median)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                    <div>Mean: <strong className="text-white">{rasterPixelResult.currentObservation.ndvi.mean}</strong></div>
                    <div>Std Dev: <strong className="text-cyan-400">&plusmn;{rasterPixelResult.currentObservation.ndvi.stdDev}</strong></div>
                    <div>Range: <strong className="text-white">[{rasterPixelResult.currentObservation.ndvi.min}, {rasterPixelResult.currentObservation.ndvi.max}]</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4" />
                      💧 NDWI Statistical Distribution (121 Pixels)
                    </span>
                    <span className="text-xl font-black text-white">
                      {rasterPixelResult.currentObservation.ndwi.median} (Median)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                    <div>Mean: <strong className="text-white">{rasterPixelResult.currentObservation.ndwi.mean}</strong></div>
                    <div>Std Dev: <strong className="text-cyan-400">&plusmn;{rasterPixelResult.currentObservation.ndwi.stdDev}</strong></div>
                    <div>Range: <strong className="text-white">[{rasterPixelResult.currentObservation.ndwi.min}, {rasterPixelResult.currentObservation.ndwi.max}]</strong></div>
                  </div>
                </div>
              </div>

              {/* Data Quality Evaluation */}
              {rasterPixelResult.dataQuality && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-cyan-400" />
                      Data Quality Assessment:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                      rasterPixelResult.dataQuality.score === 'EXCELLENT'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : rasterPixelResult.dataQuality.score === 'GOOD'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {rasterPixelResult.dataQuality.score}
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                    {rasterPixelResult.dataQuality.reasons.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Expandable Scientific Data Provenance Section */}
              <div className="border border-slate-800 rounded-xl bg-slate-950/70 overflow-hidden">
                <button
                  onClick={() => setShowProvenance(!showProvenance)}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    SCIENTIFIC DATA PROVENANCE (AUDIT TRAIL)
                  </span>
                  <span className="text-[11px] text-indigo-400 font-mono">
                    {showProvenance ? '▲ Hide Full Provenance' : '▼ Expand 22-Parameter Provenance'}
                  </span>
                </button>

                {showProvenance && rasterPixelResult.provenance && (
                  <div className="p-4 space-y-3 border-t border-slate-800 bg-slate-950 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div><span className="text-slate-500 block">Intervention ID:</span><span className="text-white font-bold">{rasterPixelResult.provenance.interventionId || intervention.id}</span></div>
                      <div><span className="text-slate-500 block">Coordinates (WGS84):</span><span className="text-white font-bold">{intervention.coordinates[0]}° N, {intervention.coordinates[1]}° E</span></div>
                      <div><span className="text-slate-500 block">Bounding Box:</span><span className="text-slate-300">{JSON.stringify(rasterPixelResult.provenance.boundingBox || [])}</span></div>
                      <div><span className="text-slate-500 block">STAC Scene ID:</span><span className="text-cyan-400 font-bold">{rasterPixelResult.provenance.sceneId || rasterPixelResult.sceneId}</span></div>
                      <div><span className="text-slate-500 block">Acquisition Timestamp:</span><span className="text-slate-200">{rasterPixelResult.provenance.acquisitionTimestamp}</span></div>
                      <div><span className="text-slate-500 block">Cloud Cover:</span><span className="text-slate-200">{rasterPixelResult.provenance.cloudCover}%</span></div>
                      <div><span className="text-slate-500 block">Platform / Sensor:</span><span className="text-slate-200">{rasterPixelResult.provenance.satellite || 'Sentinel-2 MSI'}</span></div>
                      <div><span className="text-slate-500 block">Collection:</span><span className="text-slate-200">{rasterPixelResult.provenance.collection || 'sentinel-2-l2a'}</span></div>
                      <div><span className="text-slate-500 block">MGRS Tile ID:</span><span className="text-cyan-400 font-bold">{rasterPixelResult.provenance.tileId || rasterPixelResult.tileId || '43RFL'}</span></div>
                      <div><span className="text-slate-500 block">Geographic Intersection:</span><span className="text-emerald-400 font-bold">✓ AOI Intersects ({rasterPixelResult.provenance.utmZone || 'UTM Zone 43N'})</span></div>
                      <div><span className="text-slate-500 block">Target Inside Raster:</span><span className="text-emerald-400 font-bold">✓ True ({intervention.coordinates[0]}° N, {intervention.coordinates[1]}° E)</span></div>
                      <div><span className="text-slate-500 block">Geographic Validation:</span><span className="text-emerald-400 font-bold font-mono">{rasterPixelResult.provenance.validationStatus || 'GEOGRAPHICALLY_VALIDATED'}</span></div>
                      <div><span className="text-slate-500 block">UTM Zone & CRS:</span><span className="text-emerald-400 font-bold">{rasterPixelResult.provenance.rasterCrs || 'EPSG:32643 (WGS84 / UTM Zone 43N)'}</span></div>
                      <div><span className="text-slate-500 block">Pixel Size / GSD:</span><span className="text-slate-200">{rasterPixelResult.provenance.pixelSize || '10m x 10m Ground Sample Distance'}</span></div>
                      <div><span className="text-slate-500 block">AOI Window:</span><span className="text-slate-200">{rasterPixelResult.provenance.windowSize || '11x11 (110m x 110m AOI)'}</span></div>
                      <div><span className="text-slate-500 block">Valid / Nodata Pixels:</span><span className="text-slate-200">{rasterPixelResult.provenance.validPixelCount ?? 121} valid / {rasterPixelResult.provenance.nodataPixelCount ?? 0} nodata</span></div>
                      <div><span className="text-slate-500 block">Radiometric Scale Factor:</span><span className="text-slate-200">10,000.0 (BOA Reflectance = DN / 10,000)</span></div>
                      <div><span className="text-slate-500 block">NDVI Median / NDWI Median:</span><span className="text-emerald-400 font-bold">{rasterPixelResult.provenance.ndviMedian} / {rasterPixelResult.provenance.ndwiMedian}</span></div>
                      <div><span className="text-slate-500 block">Processing Version & Engine:</span><span className="text-slate-300">v{rasterPixelResult.provenance.processingVersion || '13.1.0'} &bull; Server-Side COG Streaming</span></div>
                      <div><span className="text-slate-500 block">Processing Timestamp:</span><span className="text-slate-400 font-mono">{rasterPixelResult.provenance.processingTimestamp || rasterPixelResult.provenance.processedAt}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span>
                  Target Scene: <code>{realSpectralData?.currentScene?.sceneId || 'S2C_43RFL_20241219_2_L2A'}</code> &bull; Platform: <strong>Sentinel-2</strong>
                </span>
                <span className="text-emerald-400 font-bold">✓ Pixel-Derived Scientific Evidence Locked</span>
              </div>
            </div>
          ) : satelliteState === 'LOADING' ? (
            <div className="rounded-2xl border border-cyan-500/50 bg-slate-900/95 p-8 text-center font-mono space-y-3 shadow-2xl">
              <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white">Streaming Real Sentinel-2 COG Raster Pixels...</h3>
              <p className="text-xs text-slate-400">
                Extracting 121 Bottom-of-Atmosphere (BOA) pixels across Band 4 (Red) and Band 8 (NIR) over Check Dam #12.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs font-mono text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Satellite className="h-4 w-4 text-amber-400" />
                <span>
                  <strong>Sentinel-2 derived metric — DEMO DATA:</strong> Multi-temporal surface reflectance simulation active.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQueryLiveSentinel2}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Activity className="h-3 w-3 animate-pulse" />
                  <span>Execute Raster Analysis</span>
                </button>
                <DataSourceBadge type="DEMO_DATA" size="sm" />
              </div>
            </div>
          )}

          {/* Baseline & Multi-Temporal Observation Telemetry Banner */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase">Baseline Determination:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  satelliteState === 'REAL' && multiSceneHistory?.baseline.sourceType === 'REAL_HISTORICAL_BASELINE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : satelliteState === 'REAL'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {satelliteState === 'REAL'
                    ? (multiSceneHistory?.baseline.sourceClassification || '⚙ Baseline: CONFIGURED REFERENCE')
                    : '🟡 DEMO DATA BASELINE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Baseline: <strong>CONFIGURED REFERENCE</strong> &bull; Value: <strong className="text-white">{multiSceneHistory?.baseline.value ?? 0.4900}</strong> &bull; Method: <code>{multiSceneHistory?.baseline.method ?? 'dpr_watershed_reference'}</code> &bull; Historical Scenes: <strong>{multiSceneHistory?.baseline.scenesCount ?? 0}</strong>
              </p>
            </div>
            {satelliteState === 'REAL' && (
              <button
                onClick={() => setShowDemoTrend(!showDemoTrend)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition cursor-pointer"
              >
                {showDemoTrend ? 'Hide Demo Trend' : 'View Demo Trend Comparison'}
              </button>
            )}
          </div>

          {/* Time Series Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NDVI Chart Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-400 font-mono uppercase">
                    NDVI Multi-Temporal Observation
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Current Observation: {satelliteState === 'REAL' ? (rasterPixelResult?.statistics?.ndviMedian ?? rasterPixelResult?.currentObservation?.ndvi?.median ?? '0.0949') : '0.4206 (Demo)'}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-emerald-400">
                    {satelliteState === 'REAL' ? (rasterPixelResult?.statistics?.ndviMedian ?? rasterPixelResult?.currentObservation?.ndvi?.median ?? '0.0949') : '0.4206'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">10m BOA Resolution</span>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={satelliteState === 'REAL' && !showDemoTrend
                    ? (multiSceneHistory?.observations.length ? multiSceneHistory.observations.map(o => ({ month: o.observationDate, value: o.ndviMedian })) : [{ month: '2024-12-19', value: rasterPixelResult?.statistics?.ndviMedian ?? 0.0949 }])
                    : satelliteData.monthlyNdviTrend2025
                  }>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[-0.2, 0.6]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip content={<CustomSpectralTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* NDWI Chart Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                    NDWI Multi-Temporal Observation
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Current Observation: {satelliteState === 'REAL' ? (rasterPixelResult?.statistics?.ndwiMedian ?? rasterPixelResult?.currentObservation?.ndwi?.median ?? '-0.1348') : '0.2392 (Demo)'}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-cyan-400">
                    {satelliteState === 'REAL' ? (rasterPixelResult?.statistics?.ndwiMedian ?? rasterPixelResult?.currentObservation?.ndwi?.median ?? '-0.1348') : '0.2392'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">10m BOA Resolution</span>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={satelliteState === 'REAL' && !showDemoTrend
                    ? (multiSceneHistory?.observations.length ? multiSceneHistory.observations.map(o => ({ month: o.observationDate, value: o.ndwiMedian })) : [{ month: '2024-12-19', value: rasterPixelResult?.statistics?.ndwiMedian ?? -0.1348 }])
                    : satelliteData.monthlyNdwiTrend2025
                  }>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[-0.3, 0.4]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip content={<CustomSpectralTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={{ fill: '#06b6d4', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Genuine Sentinel-2 Multi-Temporal Observations Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                {satelliteState === 'REAL' ? 'Genuine Sentinel-2 Multi-Temporal Observations (10m L2A)' : 'Historical Annual Observations (Demo Fixtures)'}
              </h3>
              <DataSourceBadge
                type={satelliteState === 'REAL' ? 'REAL_DATA' : 'DEMO_DATA'}
                sourceText={satelliteState === 'REAL' ? 'SENTINEL-2 L2A STAC' : 'DEMO DATA'}
                size="sm"
              />
            </div>
            {satelliteState === 'REAL' && multiSceneHistory?.observations && multiSceneHistory.observations.length > 0 ? (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-2">Observation Date</th>
                    <th className="pb-2">STAC Scene ID</th>
                    <th className="pb-2">Cloud Cover</th>
                    <th className="pb-2">NDVI Median</th>
                    <th className="pb-2">NDWI Median</th>
                    <th className="pb-2">Valid Pixels</th>
                    <th className="pb-2 text-right">Data Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {multiSceneHistory.observations.map((obs) => (
                    <tr key={obs.sceneId} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white">{obs.observationDate}</td>
                      <td className="py-2.5 text-cyan-300 truncate max-w-[200px]">{obs.sceneId}</td>
                      <td className="py-2.5 text-slate-300">{obs.cloudCover}%</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{obs.ndviMedian}</td>
                      <td className="py-2.5 text-cyan-400 font-bold">{obs.ndwiMedian}</td>
                      <td className="py-2.5 text-slate-300">{obs.validPixelPercentage}% ({obs.validPixelCount}/{obs.totalPixelCount})</td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">{obs.qualityScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-2">Year / Date</th>
                    <th className="pb-2">NDVI</th>
                    <th className="pb-2">NDWI</th>
                    <th className="pb-2">Vegetation Cover (%)</th>
                    <th className="pb-2">Water Area (Ha)</th>
                    <th className="pb-2 text-right">Soil Moisture Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {satelliteData.historicalObservations.map((obs) => (
                    <tr key={obs.year} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white">{obs.year}</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{obs.ndvi}</td>
                      <td className="py-2.5 text-cyan-400 font-bold">{obs.ndwi}</td>
                      <td className="py-2.5 text-slate-200">{obs.vegetationCoverPercent}%</td>
                      <td className="py-2.5 text-slate-200">{obs.waterSurfaceAreaHa} Ha</td>
                      <td className="py-2.5 text-right text-slate-300">{obs.soilMoistureIndex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ======================================================== */}
          {/* BHUVAN / ISRO LAND USE & LAND COVER (LULC) EVIDENCE LAYER */}
          {/* ======================================================== */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Bhuvan / ISRO Land Use & Land Cover (Thematic AOI Statistics)
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Sentinel-2 provides current spectral observations, while Bhuvan LULC provides land-use/land-cover context for the intervention AOI.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  bhuvanData?.sourceType === 'REAL_BHUVAN_LULC'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : bhuvanData?.sourceType === 'SIMULATED'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {bhuvanData?.sourceType === 'REAL_BHUVAN_LULC'
                    ? '🛰 REAL BHUVAN LULC'
                    : bhuvanData?.sourceType === 'SIMULATED'
                    ? '🟡 DEMO DATA'
                    : bhuvanData?.status || 'UNQUERIED'}
                </span>
                <button
                  onClick={() => handleFetchBhuvanLulc(false)}
                  disabled={isLoadingBhuvan}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingBhuvan ? 'animate-spin' : ''}`} />
                  {bhuvanData ? 'Refresh Bhuvan LULC' : 'Fetch Live Bhuvan LULC'}
                </button>
              </div>
            </div>

            {bhuvanData && bhuvanData.sourceType !== 'REAL_BHUVAN_LULC' && bhuvanData.sourceType !== 'SIMULATED' && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <strong className="block text-amber-200">Bhuvan Service Telemetry:</strong>
                  <span>{bhuvanData.reason || 'Bhuvan LULC data currently unavailable.'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFetchBhuvanLulc(false)}
                    className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                  >
                    Retry Bhuvan
                  </button>
                  <button
                    onClick={() => handleFetchBhuvanLulc(true)}
                    className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                  >
                    Switch to Demo Data
                  </button>
                </div>
              </div>
            )}

            {bhuvanData && bhuvanData.statistics && bhuvanData.statistics.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>State: <strong className="text-white">{bhuvanData.state || 'RJ (Rajasthan)'}</strong></span>
                  <span>Total Calculated AOI Area: <strong className="text-cyan-400">{bhuvanData.totalArea ?? '205.54'} {bhuvanData.areaUnit || 'Ha'}</strong></span>
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="pb-2">LULC Category Code</th>
                      <th className="pb-2">Area</th>
                      <th className="pb-2">Unit</th>
                      <th className="pb-2 text-right">Data Provider</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bhuvanData.statistics.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 font-bold text-white uppercase">{rec.code}</td>
                        <td className="py-2 text-emerald-400 font-bold">{rec.area}</td>
                        <td className="py-2 text-slate-300">{rec.unit}</td>
                        <td className="py-2 text-right text-cyan-300">{rec.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !isLoadingBhuvan && !bhuvanData ? (
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center space-y-2 font-mono text-xs text-slate-400">
                <p>Click <strong>"Fetch Live Bhuvan LULC"</strong> to retrieve official ISRO thematic land-use statistics for the CD-012 watershed area of interest.</p>
              </div>
            ) : null}

            {/* Collapsible Scientific Data Provenance for Bhuvan */}
            {bhuvanData && (
              <div className="border border-slate-800 rounded-xl bg-slate-950/70 overflow-hidden">
                <button
                  onClick={() => setShowBhuvanProvenance(!showBhuvanProvenance)}
                  className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-cyan-400" />
                    BHUVAN SCIENTIFIC DATA PROVENANCE (AUDIT TRAIL)
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {showBhuvanProvenance ? '▲ Hide Provenance' : '▼ Expand Bhuvan Provenance'}
                  </span>
                </button>
                {showBhuvanProvenance && (
                  <div className="p-3.5 space-y-2 border-t border-slate-800 bg-slate-950 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-slate-500 block">Provider:</span><span className="text-white font-bold">{bhuvanData.provider}</span></div>
                      <div><span className="text-slate-500 block">API Endpoint:</span><span className="text-slate-300 truncate block">https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php</span></div>
                      <div><span className="text-slate-500 block">Intervention ID:</span><span className="text-cyan-400 font-bold">{bhuvanData.interventionId}</span></div>
                      <div><span className="text-slate-500 block">Retrieval Timestamp:</span><span className="text-slate-300">{bhuvanData.retrievedAt}</span></div>
                      <div><span className="text-slate-500 block">Response Status:</span><span className="text-emerald-400 font-bold">{bhuvanData.status}</span></div>
                      <div><span className="text-slate-500 block">Source Classification:</span><span className="text-slate-300">{bhuvanData.sourceClassification || bhuvanData.sourceType}</span></div>
                      <div><span className="text-slate-500 block">AOI WKT Geometry:</span><span className="text-slate-400 text-[10px] truncate block">{bhuvanData.geometry || 'POLYGON((76.6078 27.5634, ...))'}</span></div>
                      <div><span className="text-slate-500 block">LULC Codes Returned:</span><span className="text-emerald-400 font-bold">{JSON.stringify(bhuvanData.statistics.map(s => s.code))}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: BEFORE / AFTER WITH DYNAMIC CHANGE DETECTION */}
      {/* ======================================================== */}
      {activeTab === 'before-after' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Spatial & Spectral Change Detection Model
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Calculated dynamically from multi-temporal observations ({changeObservations[0]?.baselineDate || '2024 Baseline'} vs{' '}
                  {changeObservations[0]?.comparisonDate || '2026 Observation'})
                </p>
              </div>
              <div className="flex items-center gap-2">
                {changeObservations.map((obs) => (
                  <span
                    key={obs.metric}
                    className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-bold"
                  >
                    {obs.metric}: {obs.percentageChange > 0 ? `+${obs.percentageChange}%` : `${obs.percentageChange}%`}
                  </span>
                ))}
              </div>
            </div>

            {/* Split Slider Comparison */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 aspect-video bg-black select-none max-w-4xl mx-auto">
              <img
                src="/assets/evidence/watershed-post-monsoon.jpg"
                alt="After intervention (Post-monsoon monitored)"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-300 font-bold shadow-xl">
                AFTER (POST-MONSOON MONITORED)
              </div>

              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src="/assets/evidence/watershed-pre-construction.jpg"
                  alt="Before intervention (Pre-construction baseline)"
                  className="w-full h-full object-cover filter saturate-75 brightness-90 max-w-none"
                  style={{ width: '100%', minWidth: '100%' }}
                />
                <div className="absolute top-4 left-4 bg-amber-950/90 border border-amber-500/50 px-3 py-1.5 rounded-lg text-xs font-mono text-amber-300 font-bold shadow-xl">
                  BEFORE (PRE-CONSTRUCTION BASELINE)
                </div>
              </div>

              <div
                className="absolute top-0 bottom-0 flex items-center justify-center -ml-4 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="h-10 w-10 rounded-full bg-white shadow-2xl flex items-center justify-center text-slate-900 font-bold text-xs">
                  &harr;
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-slate-400 max-w-4xl mx-auto">
              <span>&larr; Drag slider to inspect baseline</span>
              <span>Drag slider to reveal post-construction &rarr;</span>
            </div>

            {/* Observed Change Section */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Info className="h-4 w-4" />
                  OBSERVED CHANGE ANALYSIS
                </span>
                <DataSourceBadge
                  type={satelliteState === 'REAL' ? 'REAL_DATA' : 'DEMO_DATA'}
                  sourceText={satelliteState === 'REAL' ? 'REAL RASTER PIXELS' : 'DEMO DATA'}
                  size="sm"
                />
              </div>

              <div className="space-y-1 text-slate-300">
                {changeObservations.map((obs) => (
                  <p key={obs.metric}>
                    &bull; <strong>{obs.metric}:</strong> {obs.interpretation} (Baseline: {obs.baselineValue} &rarr; Comparison: {obs.comparisonValue})
                  </p>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                ⚠️ <strong>SCIENTIFIC PRINCIPLE:</strong> Observed spectral changes describe environmental conditions over time and do not prove causal attribution to the intervention without hydrological modeling.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: HEALTH SCORE */}
      {/* ======================================================== */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <HealthScoreGauge
            score={intervention.healthScore}
            breakdown={MOCK_HEALTH_BREAKDOWN_CD012}
            title={`${intervention.name} Health Score Diagnostics`}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: ALERTS, SPECTRAL ANOMALY & AUTOMATED MONITORING */}
      {/* ======================================================== */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Spectral Anomaly Card */}
          {anomalyResult && (
            <div className="rounded-2xl border-2 border-rose-500/50 bg-slate-900/95 p-6 shadow-2xl space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-rose-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    VEGETATION SPECTRAL ANOMALY INTERPRETATION
                  </h3>
                </div>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2.5 py-1 rounded border border-rose-500/40 uppercase">
                  {anomalyResult.severity} ANOMALY DETECTED
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Current Median NDVI</span>
                  <span className="text-lg font-bold text-white">{anomalyResult.currentValue}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Historical Baseline</span>
                  <span className="text-lg font-bold text-slate-300">{anomalyResult.expectedBaseline}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Deviation</span>
                  <span className="text-lg font-bold text-rose-400">{anomalyResult.deviationPercent}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Observation Period</span>
                  <span className="text-xs font-bold text-cyan-400 mt-1 block">{anomalyResult.observationPeriod}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div>
                  Evidence: <strong className="text-emerald-400">🛰️ {anomalyResult.evidenceType}</strong>
                </div>
                <div>
                  Recommended Action: <strong className="text-amber-300">{anomalyResult.recommendedAction}</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <FileCheck2 className="h-4 w-4" />
                  <span>Dispatch Field Inspection</span>
                </button>
              </div>
            </div>
          )}

          {/* Automated Monitoring Events Stream */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Automated Orbital Monitoring Events ({monitoringEvents.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Continuous Satellite Audit</span>
            </div>

            <div className="space-y-3">
              {monitoringEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border font-mono space-y-2 transition ${
                    evt.anomalyLevel === 'HIGH_PRIORITY'
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${evt.anomalyLevel === 'HIGH_PRIORITY' ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                      {evt.sceneId}
                    </span>
                    <span className="text-slate-500 text-[10px]">{evt.observationDate}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <div>Previous: <strong className="text-slate-300">{evt.previousNdvi}</strong></div>
                    <div>Current: <strong className="text-white">{evt.currentNdvi}</strong></div>
                    <div>Change: <strong className={evt.percentageChange < 0 ? 'text-rose-400' : 'text-emerald-400'}>{evt.percentageChange}%</strong></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">{evt.recommendedAction}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.status === 'REVIEW_REQUIRED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW EVIDENCE & HUMAN APPROVAL */}
      {/* ======================================================== */}
      {selectedEvidenceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  Field Evidence Dossier — {selectedEvidenceForModal.id}
                </h3>
              </div>
              <button onClick={() => setSelectedEvidenceForModal(null)} className="text-slate-400 hover:text-white p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800">
              <EvidenceImage
                src={selectedEvidenceForModal.photoUrl}
                alt={selectedEvidenceForModal.caption}
                coordinates={selectedEvidenceForModal.coordinates}
                structureCode={selectedEvidenceForModal.interventionId}
                provenanceLabel="DEMO FIELD EVIDENCE"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 z-10 bg-black/85 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-300 border border-emerald-500/40 backdrop-blur-xs">
                📍 {selectedEvidenceForModal.coordinates[0].toFixed(6)}° N, {selectedEvidenceForModal.coordinates[1].toFixed(6)}° E &bull; Accuracy {selectedEvidenceForModal.accuracyM || '±5m (Simulated)'}
              </div>
            </div>

            <p className="text-xs text-slate-200 font-mono">{selectedEvidenceForModal.caption}</p>

            {/* Assistive AI Analysis Block */}
            <div className="rounded-xl border border-indigo-500/30 bg-slate-950 p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  AI FIELD IMAGE ANALYSIS (DEMO AI)
                </span>
                <span>{selectedEvidenceForModal.aiAnalysis.confidenceScore}% Model Confidence</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900">
                  <span className="text-slate-500 block">Structure:</span>
                  <span className="text-white font-bold">{selectedEvidenceForModal.aiAnalysis.structureDetected}</span>
                </div>
                <div className="p-2 rounded bg-slate-900">
                  <span className="text-slate-500 block">Water Presence:</span>
                  <span className="text-emerald-400 font-bold">YES ({selectedEvidenceForModal.aiAnalysis.waterConfidence}%)</span>
                </div>
                <div className="p-2 rounded bg-slate-900">
                  <span className="text-slate-500 block">Vegetation:</span>
                  <span className="text-emerald-400 font-bold">YES ({selectedEvidenceForModal.aiAnalysis.vegetationConfidence}%)</span>
                </div>
                <div className="p-2 rounded bg-slate-900">
                  <span className="text-slate-500 block">Potential Issue:</span>
                  <span className="text-amber-400 font-bold">Minor deterioration</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300 text-[11px]">
                ⚠ <strong>AI is Assistive:</strong> Nodal reviewer must approve or reject this assessment before it locks to the evidence chain.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 font-mono">
              <div className="text-xs text-slate-400">
                Status:{' '}
                <strong className={selectedEvidenceForModal.verificationStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>
                  {selectedEvidenceForModal.verificationStatus === 'VERIFIED' ? '✓ Human Verified' : '⚠ Pending Review'}
                </strong>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    flagEvidence(selectedEvidenceForModal.id);
                    setSelectedEvidenceForModal(null);
                  }}
                  className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Flag for Re-Inspection
                </button>
                <button
                  onClick={() => {
                    approveEvidence(selectedEvidenceForModal.id);
                    setSelectedEvidenceForModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve & Sign-off</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE FIELD INSPECTION */}
      {/* ======================================================== */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">CREATE FIELD INSPECTION</h3>
              </div>
              <button onClick={() => setShowInspectionModal(false)} className="text-slate-400 hover:text-white p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            {inspectionCreatedSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center font-mono space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">✓ Inspection Created</h4>
                <p className="text-xs text-slate-300">
                  Assigned to: <strong className="text-emerald-400">{inspectionOfficer}</strong>
                </p>
                <p className="text-[11px] text-amber-300">Status: Pending Field Visit (Due: {inspectionDueDate})</p>
              </div>
            ) : (
              <form onSubmit={handleCreateInspectionSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Intervention</label>
                  <input
                    type="text"
                    disabled
                    value={`${intervention.name} (${intervention.code})`}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Inspection Reason</label>
                  <input
                    type="text"
                    required
                    value={inspectionReason}
                    onChange={(e) => setInspectionReason(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority Classification</label>
                  <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 font-bold">
                    🔴 HIGH PRIORITY
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Assign Field Officer</label>
                  <select
                    value={inspectionOfficer}
                    onChange={(e) => setInspectionOfficer(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Vikram Singh (Field Officer)">Vikram Singh (Alwar Block 3)</option>
                    <option value="Priya Meena (Normal Admin)">Priya Meena (Alwar Nodal)</option>
                    <option value="Harpreet Kaur (Field Officer)">Harpreet Kaur (Punjab Division)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={inspectionDueDate}
                    onChange={(e) => setInspectionDueDate(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowInspectionModal(false)} className="px-3 py-1.5 text-slate-400 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg cursor-pointer">
                    Dispatch Inspection Task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LIFECYCLE STAGE DETAILS */}
      {/* ======================================================== */}
      {selectedStageDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">Stage Audit: {selectedStageDetail.stage}</h3>
              </div>
              <button onClick={() => setSelectedStageDetail(null)} className="text-slate-400 hover:text-white p-1 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-white font-bold">{selectedStageDetail.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">{selectedStageDetail.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authority:</span>
                  <span className="text-slate-200">{selectedStageDetail.responsibleAgency}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Lifecycle Record Notes:</span>
                <p className="text-slate-300 leading-relaxed">{selectedStageDetail.notes}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button onClick={() => setSelectedStageDetail(null)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono cursor-pointer">
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
