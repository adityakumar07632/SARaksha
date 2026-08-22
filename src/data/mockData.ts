import {
  User,
  Watershed,
  Intervention,
  FieldEvidence,
  SatelliteData,
  Alert,
  HealthScoreBreakdown
} from '../types';

// ==========================================
// MOCK USERS
// ==========================================
export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@saraksha.gov.in',
    role: 'SUPER_ADMIN',
    region: 'National Command (All States)',
    status: 'Active',
    lastActive: '2 minutes ago',
  },
  {
    id: 'USR-002',
    name: 'Priya Meena',
    email: 'priya.meena@rajasthan.gov.in',
    role: 'NORMAL_ADMIN',
    region: 'Rajasthan — Alwar & Jaipur',
    assignedWatershedId: 'WS-001',
    assignedWatershedName: 'Alwar North Catchment (WS-001)',
    status: 'Active',
    lastActive: '15 minutes ago',
  },
  {
    id: 'USR-003',
    name: 'Vikram Singh',
    email: 'vikram.singh@field.saraksha.gov.in',
    role: 'FIELD_OFFICER',
    region: 'Rajasthan — Alwar Block 3',
    assignedWatershedId: 'WS-001',
    assignedWatershedName: 'Alwar North Catchment (WS-001)',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'USR-004',
    name: 'Harpreet Kaur',
    email: 'h.kaur@punjab.gov.in',
    role: 'NORMAL_ADMIN',
    region: 'Punjab — Ludhiana Basin',
    assignedWatershedId: 'WS-012',
    assignedWatershedName: 'Ludhiana Canal Watershed (WS-012)',
    status: 'Active',
    lastActive: '1 hour ago',
  },
  {
    id: 'USR-005',
    name: 'Amitabh Joshi',
    email: 'amitabh.j@gujarat.gov.in',
    role: 'NORMAL_ADMIN',
    region: 'Gujarat — Sabarmati Division',
    assignedWatershedId: 'WS-021',
    assignedWatershedName: 'Sabarmati Upper Basin (WS-021)',
    status: 'Inactive',
    lastActive: '3 days ago',
  }
];

// ==========================================
// MOCK WATERSHEDS
// ==========================================
export const MOCK_WATERSHEDS: Watershed[] = [
  {
    id: 'WS-001',
    code: 'WS-001',
    name: 'Alwar North Catchment',
    state: 'Rajasthan',
    district: 'Alwar',
    subDistrict: 'Thanagazi',
    areaHa: 4250,
    totalInterventions: 42,
    healthScore: 81,
    status: 'HEALTHY',
    activeAlerts: 2,
    pendingVerificationCount: 3,
    coordinates: [27.5684, 76.6128],
    lastUpdated: '2026-08-20',
    description: 'A semi-arid catchment area featuring multi-tier water harvesting structures including check dams, contour bunds, and percolation ponds.',
  },
  {
    id: 'WS-004',
    code: 'WS-004',
    name: 'Jodhpur Arid Micro-Basin',
    state: 'Rajasthan',
    district: 'Jodhpur',
    subDistrict: 'Osian',
    areaHa: 5800,
    totalInterventions: 28,
    healthScore: 54,
    status: 'MODERATE',
    activeAlerts: 6,
    pendingVerificationCount: 4,
    coordinates: [26.2389, 73.0243],
    lastUpdated: '2026-08-19',
    description: 'High runoff loss area with severe desertification pressure. Significant recent drop in vegetation and water retention.',
  },
  {
    id: 'WS-012',
    code: 'WS-012',
    name: 'Ludhiana Canal Catchment',
    state: 'Punjab',
    district: 'Ludhiana',
    subDistrict: 'Jagraon',
    areaHa: 3600,
    totalInterventions: 34,
    healthScore: 48,
    status: 'CRITICAL',
    activeAlerts: 8,
    pendingVerificationCount: 2,
    coordinates: [30.9010, 75.8573],
    lastUpdated: '2026-08-21',
    description: 'Agricultural watershed experiencing heavy siltation and structural deterioration in downstream diversion weirs.',
  },
  {
    id: 'WS-007',
    code: 'WS-007',
    name: 'Karnal Upper Drainage',
    state: 'Haryana',
    district: 'Karnal',
    subDistrict: 'Assandh',
    areaHa: 2900,
    totalInterventions: 22,
    healthScore: 68,
    status: 'MODERATE',
    activeAlerts: 4,
    pendingVerificationCount: 1,
    coordinates: [29.6857, 76.9905],
    lastUpdated: '2026-08-18',
    description: 'Canal-fed micro watershed with moderate vegetation decline observed in the buffer zones.',
  },
  {
    id: 'WS-009',
    code: 'WS-009',
    name: 'Bikaner Dune Micro-Basin',
    state: 'Rajasthan',
    district: 'Bikaner',
    subDistrict: 'Nokha',
    areaHa: 6400,
    totalInterventions: 18,
    healthScore: 72,
    status: 'MODERATE',
    activeAlerts: 3,
    pendingVerificationCount: 5,
    coordinates: [28.0229, 73.3119],
    lastUpdated: '2026-08-15',
    description: 'Arid catchment relying on Khadin systems and check structures. Ground verification is pending on recent pond developments.',
  },
  {
    id: 'WS-015',
    code: 'WS-015',
    name: 'Indore Plateau Catchment',
    state: 'Madhya Pradesh',
    district: 'Indore',
    subDistrict: 'Mhow',
    areaHa: 5100,
    totalInterventions: 38,
    healthScore: 86,
    status: 'HEALTHY',
    activeAlerts: 1,
    pendingVerificationCount: 0,
    coordinates: [22.7196, 75.8577],
    lastUpdated: '2026-08-21',
    description: 'High-performing watershed with dense canopy restoration and excellent groundwater recharge metrics.',
  },
  {
    id: 'WS-021',
    code: 'WS-021',
    name: 'Sabarmati Upper Basin',
    state: 'Gujarat',
    district: 'Sabarkantha',
    subDistrict: 'Idar',
    areaHa: 4900,
    totalInterventions: 32,
    healthScore: 79,
    status: 'HEALTHY',
    activeAlerts: 2,
    pendingVerificationCount: 2,
    coordinates: [23.5979, 72.9698],
    lastUpdated: '2026-08-20',
    description: 'Interconnected check dam network successfully conserving seasonal monsoon flows.',
  }
];

// ==========================================
// MOCK INTERVENTIONS
// ==========================================
export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: 'CD-012',
    code: 'CD-012',
    name: 'Check Dam #12',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    state: 'Rajasthan',
    district: 'Alwar',
    type: 'Check Dam',
    lifecycleStage: 'Field Verified',
    healthScore: 82,
    status: 'HEALTHY',
    coordinates: [27.5684, 76.6128],
    constructionDate: '12 June 2025',
    implementingAgency: 'Demo Watershed Development Agency',
    budgetAllocatedLakhs: 18.5,
    capacityM3: 45000,
    currentCondition: 'Good masonry integrity, active sediment retention, minor wear on right flank apron.',
    lastInspectedDate: '14 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 6,
    activeAlertCount: 1,
  },
  {
    id: 'CT-004',
    code: 'CT-004',
    name: 'Contour Trench #04',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    state: 'Rajasthan',
    district: 'Alwar',
    type: 'Contour Trench',
    lifecycleStage: 'Monitoring',
    healthScore: 76,
    status: 'HEALTHY',
    coordinates: [27.5742, 76.6085],
    constructionDate: '18 March 2025',
    implementingAgency: 'Rajasthan Soil Conservation Dept',
    budgetAllocatedLakhs: 7.2,
    capacityM3: 12000,
    currentCondition: 'Stable bund slopes, native grasses establishing well along ridges.',
    lastInspectedDate: '10 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 4,
    activeAlertCount: 0,
  },
  {
    id: 'FP-008',
    code: 'FP-008',
    name: 'Farm Pond #08',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    state: 'Rajasthan',
    district: 'Alwar',
    type: 'Farm Pond',
    lifecycleStage: 'Impact Assessed',
    healthScore: 88,
    status: 'HEALTHY',
    coordinates: [27.5610, 76.6210],
    constructionDate: '05 October 2024',
    implementingAgency: 'Gram Panchayat Thanagazi',
    budgetAllocatedLakhs: 12.0,
    capacityM3: 32000,
    currentCondition: 'Full capacity retention, high water clarity, robust peripheral planting.',
    lastInspectedDate: '12 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 8,
    activeAlertCount: 0,
  },
  {
    id: 'CD-015',
    code: 'CD-015',
    name: 'Check Dam #15',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    state: 'Rajasthan',
    district: 'Alwar',
    type: 'Check Dam',
    lifecycleStage: 'Completed',
    healthScore: 46,
    status: 'CRITICAL',
    coordinates: [27.5810, 76.6290],
    constructionDate: '20 November 2025',
    implementingAgency: 'District Water Resources Division',
    budgetAllocatedLakhs: 22.0,
    capacityM3: 50000,
    currentCondition: 'Excessive upstream silt accumulation and hairline stress fissures on downstream spillway.',
    lastInspectedDate: '02 August 2026',
    isFieldVerified: false,
    fieldEvidenceCount: 2,
    activeAlertCount: 2,
  },
  {
    id: 'PT-002',
    code: 'PT-002',
    name: 'Percolation Tank #02',
    watershedId: 'WS-004',
    watershedName: 'Jodhpur Arid Micro-Basin (WS-004)',
    state: 'Rajasthan',
    district: 'Jodhpur',
    type: 'Percolation Tank',
    lifecycleStage: 'Monitoring',
    healthScore: 58,
    status: 'MODERATE',
    coordinates: [26.2420, 73.0310],
    constructionDate: '14 January 2025',
    implementingAgency: 'Western Arid Watershed Unit',
    budgetAllocatedLakhs: 16.4,
    capacityM3: 28000,
    currentCondition: 'Bed sealing by clay deposition reducing percolation rates.',
    lastInspectedDate: '28 July 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 3,
    activeAlertCount: 1,
  },
  {
    id: 'GP-011',
    code: 'GP-011',
    name: 'Gully Plug #11',
    watershedId: 'WS-012',
    watershedName: 'Ludhiana Canal Catchment (WS-012)',
    state: 'Punjab',
    district: 'Ludhiana',
    type: 'Gully Plug',
    lifecycleStage: 'Construction Started',
    healthScore: 42,
    status: 'CRITICAL',
    coordinates: [30.9050, 75.8610],
    constructionDate: '10 February 2026',
    implementingAgency: 'Punjab Soil Conservation Cell',
    budgetAllocatedLakhs: 4.8,
    capacityM3: 5000,
    currentCondition: 'Scouring behind anchor boulders during flash rainfall.',
    lastInspectedDate: '18 August 2026',
    isFieldVerified: false,
    fieldEvidenceCount: 1,
    activeAlertCount: 3,
  },
  {
    id: 'CD-028',
    code: 'CD-028',
    name: 'Check Dam #28',
    watershedId: 'WS-018',
    watershedName: 'Narmada Valley Catchment (WS-018)',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    type: 'Check Dam',
    lifecycleStage: 'Field Verified',
    healthScore: 84,
    status: 'HEALTHY',
    coordinates: [23.2599, 77.4126],
    constructionDate: '15 March 2025',
    implementingAgency: 'MP Watershed Development Cell',
    budgetAllocatedLakhs: 21.0,
    capacityM3: 48000,
    currentCondition: 'Excellent impoundment volume, stabilized vegetative spillway.',
    lastInspectedDate: '11 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 5,
    activeAlertCount: 0,
  },
  {
    id: 'PT-019',
    code: 'PT-019',
    name: 'Percolation Tank #19',
    watershedId: 'WS-022',
    watershedName: 'Godavari Basin Catchment (WS-022)',
    state: 'Maharashtra',
    district: 'Pune',
    type: 'Percolation Tank',
    lifecycleStage: 'Monitoring',
    healthScore: 68,
    status: 'MODERATE',
    coordinates: [18.5204, 73.8567],
    constructionDate: '08 November 2024',
    implementingAgency: 'Maharashtra Soil & Water Conservation',
    budgetAllocatedLakhs: 19.5,
    capacityM3: 35000,
    currentCondition: 'Moderate silt ingress; recharge rates steady.',
    lastInspectedDate: '05 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 4,
    activeAlertCount: 1,
  },
  {
    id: 'FP-022',
    code: 'FP-022',
    name: 'Farm Pond #22',
    watershedId: 'WS-031',
    watershedName: 'Sabarmati Watershed (WS-031)',
    state: 'Gujarat',
    district: 'Ahmedabad',
    type: 'Farm Pond',
    lifecycleStage: 'Field Verified',
    healthScore: 78,
    status: 'HEALTHY',
    coordinates: [23.0225, 72.5714],
    constructionDate: '22 December 2024',
    implementingAgency: 'Gujarat Water Resources Dept',
    budgetAllocatedLakhs: 14.2,
    capacityM3: 25000,
    currentCondition: 'HDPE lining intact, high storage retention.',
    lastInspectedDate: '10 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 6,
    activeAlertCount: 0,
  },
  {
    id: 'CD-041',
    code: 'CD-041',
    name: 'Check Dam #41',
    watershedId: 'WS-045',
    watershedName: 'Cauvery Upper Basin (WS-045)',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    type: 'Check Dam',
    lifecycleStage: 'Monitoring',
    healthScore: 74,
    status: 'HEALTHY',
    coordinates: [13.0827, 77.5877],
    constructionDate: '14 May 2025',
    implementingAgency: 'Karnataka Watershed Cell',
    budgetAllocatedLakhs: 17.8,
    capacityM3: 40000,
    currentCondition: 'Good structural masonry, minor apron desilting needed.',
    lastInspectedDate: '09 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 4,
    activeAlertCount: 0,
  },
  {
    id: 'CT-018',
    code: 'CT-018',
    name: 'Contour Trench #18',
    watershedId: 'WS-052',
    watershedName: 'Mahanadi Delta Sub-Basin (WS-052)',
    state: 'Odisha',
    district: 'Cuttack',
    type: 'Contour Trench',
    lifecycleStage: 'Completed',
    healthScore: 49,
    status: 'MODERATE',
    coordinates: [20.4625, 85.8828],
    constructionDate: '19 January 2025',
    implementingAgency: 'Odisha Watershed Development Mission',
    budgetAllocatedLakhs: 8.5,
    capacityM3: 15000,
    currentCondition: 'Ridge erosion along northern flank; vegetation stabilizing.',
    lastInspectedDate: '04 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 3,
    activeAlertCount: 1,
  }
];

// ==========================================
// MOCK FIELD EVIDENCE & AI ANALYSIS
// ==========================================
export const MOCK_FIELD_EVIDENCE: FieldEvidence[] = [
  {
    id: 'EVD-101',
    interventionId: 'CD-012',
    interventionName: 'Check Dam #12',
    watershedId: 'WS-001',
    photoUrl: '/assets/evidence/cd012-upstream-checkdam.jpg',
    thumbnailUrl: '/assets/evidence/cd012-upstream-checkdam.jpg',
    caption: 'Upstream reservoir ponding and reinforced masonry spillway during post-monsoon inspection.',
    coordinates: [27.5684, 76.6128],
    capturedAt: '2026-08-14 10:42 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer (Alwar Block 3)'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-15 02:15 PM IST',
    notes: 'Structure verified matching design blueprints. Water head level at 1.8m.',
    aiAnalysis: {
      structureDetected: 'Check Dam (Masonry)',
      structureConfidence: 87,
      waterDetected: true,
      waterConfidence: 94,
      vegetationDetected: true,
      vegetationConfidence: 82,
      potentialIssue: 'Minor structural surface wear on right flank apron; no critical cracks detected.',
      confidenceScore: 89,
      recommendation: 'Scheduled desiltation in dry season Q1 2027.',
      requiresHumanReview: true,
    }
  },
  {
    id: 'EVD-102',
    interventionId: 'CD-012',
    interventionName: 'Check Dam #12',
    watershedId: 'WS-001',
    photoUrl: '/assets/evidence/cd012-downstream-channel.jpg',
    thumbnailUrl: '/assets/evidence/cd012-downstream-channel.jpg',
    caption: 'Downstream channel buffer zone showing healthy vegetation regeneration.',
    coordinates: [27.5689, 76.6134],
    capturedAt: '2026-08-14 11:15 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer (Alwar Block 3)'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Priya Meena (Normal Admin)',
    verifiedAt: '2026-08-14 04:30 PM IST',
    notes: 'Downstream moisture sustained grass cover across 150m channel stretch.',
    aiAnalysis: {
      structureDetected: 'Drainage Channel / Buffer Vegetative Zone',
      structureConfidence: 91,
      waterDetected: true,
      waterConfidence: 78,
      vegetationDetected: true,
      vegetationConfidence: 96,
      potentialIssue: 'No structural failure detected.',
      confidenceScore: 93,
      recommendation: 'Maintain grass buffer strip against livestock overgrazing.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-103',
    interventionId: 'CD-015',
    interventionName: 'Check Dam #15',
    watershedId: 'WS-001',
    photoUrl: '/assets/evidence/cd015-silt-checkdam.jpg',
    thumbnailUrl: '/assets/evidence/cd015-silt-checkdam.jpg',
    caption: 'Silt deposition near inlet notch causing overflow deflection.',
    coordinates: [27.5810, 76.6290],
    capturedAt: '2026-08-18 09:20 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'FLAGGED',
    notes: 'Urgent desilting needed before next cloudburst event.',
    aiAnalysis: {
      structureDetected: 'Check Dam (Silted)',
      structureConfidence: 84,
      waterDetected: false,
      waterConfidence: 61,
      vegetationDetected: false,
      vegetationConfidence: 45,
      potentialIssue: 'Severe sediment accumulation reducing design storage capacity by >40%.',
      confidenceScore: 86,
      recommendation: 'Issue corrective action notice to implementing agency.',
      requiresHumanReview: true,
    }
  }
];

// ==========================================
// MOCK SATELLITE & SPECTRAL DATA (CD-012)
// ==========================================
export const MOCK_SATELLITE_DATA: Record<string, SatelliteData> = {
  'CD-012': {
    interventionId: 'CD-012',
    watershedId: 'WS-001',
    sensor: 'Sentinel-2 MSI (Multi-Spectral Demo Simulation)',
    resolution: '10m Surface Reflectance',
    lastPassDate: '2026-08-19 05:40 UTC',
    currentNdvi: 0.42,
    currentNdwi: 0.24,
    historicalObservations: [
      {
        year: 2023,
        ndvi: 0.29,
        ndwi: 0.16,
        vegetationCoverPercent: 24.5,
        waterSurfaceAreaHa: 1.2,
        soilMoistureIndex: 0.31
      },
      {
        year: 2024,
        ndvi: 0.34,
        ndwi: 0.19,
        vegetationCoverPercent: 29.8,
        waterSurfaceAreaHa: 1.9,
        soilMoistureIndex: 0.38
      },
      {
        year: 2025,
        ndvi: 0.38,
        ndwi: 0.22,
        vegetationCoverPercent: 36.2,
        waterSurfaceAreaHa: 2.8,
        soilMoistureIndex: 0.46
      },
      {
        year: 2026,
        ndvi: 0.42,
        ndwi: 0.24,
        vegetationCoverPercent: 42.5,
        waterSurfaceAreaHa: 3.4,
        soilMoistureIndex: 0.52
      }
    ],
    monthlyNdviTrend2025: [
      { month: 'Jan', value: 0.32 },
      { month: 'Feb', value: 0.31 },
      { month: 'Mar', value: 0.29 },
      { month: 'Apr', value: 0.26 },
      { month: 'May', value: 0.25 },
      { month: 'Jun', value: 0.28 },
      { month: 'Jul', value: 0.36 },
      { month: 'Aug', value: 0.42 },
      { month: 'Sep', value: 0.44 },
      { month: 'Oct', value: 0.41 },
      { month: 'Nov', value: 0.37 },
      { month: 'Dec', value: 0.34 }
    ],
    monthlyNdwiTrend2025: [
      { month: 'Jan', value: 0.18 },
      { month: 'Feb', value: 0.16 },
      { month: 'Mar', value: 0.14 },
      { month: 'Apr', value: 0.11 },
      { month: 'May', value: 0.09 },
      { month: 'Jun', value: 0.14 },
      { month: 'Jul', value: 0.22 },
      { month: 'Aug', value: 0.24 },
      { month: 'Sep', value: 0.26 },
      { month: 'Oct', value: 0.23 },
      { month: 'Nov', value: 0.20 },
      { month: 'Dec', value: 0.19 }
    ]
  }
};

// ==========================================
// HEALTH SCORE BREAKDOWN (CD-012)
// ==========================================
export const MOCK_HEALTH_BREAKDOWN_CD012: HealthScoreBreakdown = {
  vegetation: 86, // (weight 40%) -> 34.4 pts
  water: 80,       // (weight 30%) -> 24.0 pts
  interventionCondition: 82, // (weight 20%) -> 16.4 pts
  landDegradation: 72,       // (weight 10%) -> 7.2 pts
  explanation: 'Composite health is computed using multi-temporal Sentinel-2 spectral indices (NDVI/NDWI weighted at 70%) combined with on-ground AI structural audit & field verification metrics (30%). Current score 82/100 reflects robust post-monsoon water holding and healthy vegetative biomass in the buffer catchment.'
};

// ==========================================
// MOCK ALERTS
// ==========================================
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-901',
    title: 'Health score decreased significantly',
    description: 'Rapid NDVI drop of 14% and soil moisture regression observed over the last 30 days.',
    severity: 'HIGH',
    category: 'HEALTH_DROP',
    state: 'Rajasthan',
    district: 'Jodhpur',
    watershedId: 'WS-004',
    watershedName: 'Jodhpur Arid Micro-Basin (WS-004)',
    interventionId: 'PT-002',
    interventionName: 'Percolation Tank #02',
    timestamp: '2026-08-21 08:30 AM IST',
    isResolved: false,
    assignedOfficer: 'Priya Meena'
  },
  {
    id: 'ALT-902',
    title: 'Potential intervention deterioration',
    description: 'Downstream scour depth exceeded structural threshold of 0.45m; possible anchor shifting.',
    severity: 'HIGH',
    category: 'STRUCTURAL_DEFECT',
    state: 'Punjab',
    district: 'Ludhiana',
    watershedId: 'WS-012',
    watershedName: 'Ludhiana Canal Catchment (WS-012)',
    interventionId: 'GP-011',
    interventionName: 'Gully Plug #11',
    timestamp: '2026-08-20 03:45 PM IST',
    isResolved: false,
    assignedOfficer: 'Harpreet Kaur'
  },
  {
    id: 'ALT-903',
    title: 'Vegetation declining in perimeter buffer',
    description: 'NDVI dropped below baseline threshold (0.30) across 45 hectares of peripheral farmland.',
    severity: 'MEDIUM',
    category: 'VEGETATION_DECLINE',
    state: 'Haryana',
    district: 'Karnal',
    watershedId: 'WS-007',
    watershedName: 'Karnal Upper Drainage (WS-007)',
    timestamp: '2026-08-19 11:10 AM IST',
    isResolved: false
  },
  {
    id: 'ALT-904',
    title: 'Field verification overdue (>90 days)',
    description: 'No verified field inspection photograph uploaded since May 2026.',
    severity: 'LOW',
    category: 'VERIFICATION_OVERDUE',
    state: 'Rajasthan',
    district: 'Bikaner',
    watershedId: 'WS-009',
    watershedName: 'Bikaner Dune Micro-Basin (WS-009)',
    timestamp: '2026-08-18 09:00 AM IST',
    isResolved: false
  },
  {
    id: 'ALT-905',
    title: 'NDVI decreased by 14% on downstream buffer',
    description: 'Localized seasonal grazing stress detected near Check Dam #12 right flank.',
    severity: 'HIGH',
    category: 'VEGETATION_DECLINE',
    state: 'Rajasthan',
    district: 'Alwar',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    interventionId: 'CD-012',
    interventionName: 'Check Dam #12',
    timestamp: '2026-08-21 06:15 AM IST',
    isResolved: false,
    assignedOfficer: 'Vikram Singh'
  }
];

// ==========================================
// MOCK GEOJSON GEOMETRIES FOR GIS MAP
// ==========================================
export const MOCK_GEOJSON_LAYERS = {
  watershedBoundary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Alwar North Catchment Boundary (WS-001)',
          areaHa: 4250,
          healthScore: 81
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.585, 27.595],
              [76.635, 27.598],
              [76.650, 27.565],
              [76.630, 27.545],
              [76.590, 27.548],
              [76.575, 27.575],
              [76.585, 27.595]
            ]
          ]
        }
      }
    ]
  },
  drainageNetwork: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Primary Drainage Stream (Ruparel Tributary)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.588, 27.590],
            [76.602, 27.578],
            [76.6128, 27.5684], // Passes through Check Dam #12
            [76.625, 27.558],
            [76.638, 27.548]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Secondary Feeder Channel B',
          order: 2
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.6085, 27.5742], // From Contour Trench #04
            [76.6110, 27.5710],
            [76.6128, 27.5684]  // Joins at Check Dam #12
          ]
        }
      }
    ]
  },
  waterBodies: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Check Dam #12 Reservoir Retention Pool',
          capacityM3: 45000,
          areaHa: 3.4
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.6115, 27.5692],
              [76.6140, 27.5690],
              [76.6135, 27.5678],
              [76.6118, 27.5680],
              [76.6115, 27.5692]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Farm Pond #08 Storage Basin',
          capacityM3: 32000,
          areaHa: 1.8
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.6200, 27.5618],
              [76.6220, 27.5615],
              [76.6218, 27.5602],
              [76.6198, 27.5605],
              [76.6200, 27.5618]
            ]
          ]
        }
      }
    ]
  }
};
