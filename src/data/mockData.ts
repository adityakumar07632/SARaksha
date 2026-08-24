import {
  User,
  Watershed,
  Intervention,
  FieldEvidence,
  SatelliteData,
  Alert,
  HealthScoreBreakdown,
  ImpactAnalysisRecord,
  ImpactClassification,
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
    name: 'Suresh Patil',
    email: 'suresh.patil@maharashtra.gov.in',
    role: 'NORMAL_ADMIN',
    region: 'Maharashtra — Marathwada Basin',
    assignedWatershedId: 'WS-004',
    assignedWatershedName: 'Marathwada Watershed Recovery (WS-004)',
    status: 'Active',
    lastActive: '45 minutes ago',
  },
  {
    id: 'USR-005',
    name: 'Kavita Deshmukh',
    email: 'kavita.deshmukh@field.saraksha.gov.in',
    role: 'FIELD_OFFICER',
    region: 'Maharashtra — Vidarbha Division',
    assignedWatershedId: 'WS-005',
    assignedWatershedName: 'Vidarbha Soil & Water Conservation (WS-005)',
    status: 'Active',
    lastActive: '10 minutes ago',
  },
  {
    id: 'USR-006',
    name: 'Anand Rao',
    email: 'anand.rao@karnataka.gov.in',
    role: 'NORMAL_ADMIN',
    region: 'Karnataka — Deccan Plateau',
    assignedWatershedId: 'WS-006',
    assignedWatershedName: 'Deccan Plateau Watershed (WS-006)',
    status: 'Active',
    lastActive: '1 hour ago',
  },
  {
    id: 'USR-007',
    name: 'Rameshwar Bundela',
    email: 'rameshwar.b@mp.gov.in',
    role: 'NORMAL_ADMIN',
    region: 'Madhya Pradesh — Bundelkhand',
    assignedWatershedId: 'WS-003',
    assignedWatershedName: 'Bundelkhand Water Resilience (WS-003)',
    status: 'Active',
    lastActive: '3 hours ago',
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
    totalInterventions: 6,
    healthScore: 81,
    status: 'HEALTHY',
    activeAlerts: 1,
    pendingVerificationCount: 1,
    coordinates: [27.5684, 76.6128],
    lastUpdated: '2026-08-22',
    description: 'DEMO DATA — A semi-arid catchment area featuring multi-tier water harvesting structures including check dams, contour bunds, and percolation ponds.',
  },
  {
    id: 'WS-002',
    code: 'WS-002',
    name: 'Aravalli Restoration Catchment',
    state: 'Rajasthan',
    district: 'Jaipur',
    subDistrict: 'Jamwa Ramgarh',
    areaHa: 5120,
    totalInterventions: 5,
    healthScore: 76,
    status: 'HEALTHY',
    activeAlerts: 1,
    pendingVerificationCount: 1,
    coordinates: [27.0125, 75.9840],
    lastUpdated: '2026-08-21',
    description: 'DEMO DATA — Ridge-to-valley rejuvenation across degraded Aravalli slopes featuring stone contour bunds, staggered trenches, and native silvopasture restoration.',
  },
  {
    id: 'WS-003',
    code: 'WS-003',
    name: 'Bundelkhand Water Resilience Project',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    subDistrict: 'Bijawar',
    areaHa: 6800,
    totalInterventions: 5,
    healthScore: 64,
    status: 'MODERATE',
    activeAlerts: 2,
    pendingVerificationCount: 2,
    coordinates: [24.6340, 79.4890],
    lastUpdated: '2026-08-20',
    description: 'DEMO DATA — Drought mitigation catchment in granite-dominated hard rock terrain utilizing percolation ponds, check dams, and recharge shafts.',
  },
  {
    id: 'WS-004',
    code: 'WS-004',
    name: 'Marathwada Watershed Recovery Basin',
    state: 'Maharashtra',
    district: 'Latur',
    subDistrict: 'Ausa',
    areaHa: 5400,
    totalInterventions: 5,
    healthScore: 58,
    status: 'MODERATE',
    activeAlerts: 2,
    pendingVerificationCount: 1,
    coordinates: [18.2530, 76.5020],
    lastUpdated: '2026-08-22',
    description: 'DEMO DATA — Black cotton soil rainfed agricultural basin focusing on farm ponds, deep continuous contour trenches, and stream widening/desiltation.',
  },
  {
    id: 'WS-005',
    code: 'WS-005',
    name: 'Vidarbha Soil & Water Conservation Unit',
    state: 'Maharashtra',
    district: 'Yavatmal',
    subDistrict: 'Pusad',
    areaHa: 4750,
    totalInterventions: 5,
    healthScore: 84,
    status: 'HEALTHY',
    activeAlerts: 0,
    pendingVerificationCount: 1,
    coordinates: [19.9110, 77.5830],
    lastUpdated: '2026-08-23',
    description: 'DEMO DATA — Sub-catchment of Penganga basin with integrated loose boulder structures, masonry check dams, and community farm ponds.',
  },
  {
    id: 'WS-006',
    code: 'WS-006',
    name: 'Deccan Plateau Watershed Project',
    state: 'Karnataka',
    district: 'Kolar',
    subDistrict: 'Srinivaspur',
    areaHa: 3900,
    totalInterventions: 5,
    healthScore: 86,
    status: 'HEALTHY',
    activeAlerts: 0,
    pendingVerificationCount: 1,
    coordinates: [13.3420, 78.2140],
    lastUpdated: '2026-08-19',
    description: 'DEMO DATA — Semi-arid plateau catchment with historical tank cascading systems, artificial recharge borewells, and afforestation buffer zones.',
  },
  {
    id: 'WS-007',
    code: 'WS-007',
    name: 'Eastern Rajasthan Water Security Corridor',
    state: 'Rajasthan',
    district: 'Dausa',
    subDistrict: 'Bandikui',
    areaHa: 3650,
    totalInterventions: 5,
    healthScore: 71,
    status: 'MODERATE',
    activeAlerts: 1,
    pendingVerificationCount: 1,
    coordinates: [27.0480, 76.5710],
    lastUpdated: '2026-08-20',
    description: 'DEMO DATA — Gully control and rainwater retention basin protecting agricultural topsoil from severe monsoon erosion.',
  },
  {
    id: 'WS-008',
    code: 'WS-008',
    name: 'Central India Catchment Restoration',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    subDistrict: 'Budni',
    areaHa: 5950,
    totalInterventions: 5,
    healthScore: 90,
    status: 'HEALTHY',
    activeAlerts: 0,
    pendingVerificationCount: 0,
    coordinates: [22.7830, 77.6740],
    lastUpdated: '2026-08-22',
    description: 'DEMO DATA — Narmada tributary sub-watershed characterized by rich forest catchment, silt detention dams, and healthy stream baseflow.',
  }
];

// ==========================================
// MOCK INTERVENTIONS
// ==========================================
export const MOCK_INTERVENTIONS: Intervention[] = [
  // --- Watershed 1: Alwar North Catchment (Rajasthan) ---
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
    fieldEvidenceCount: 2,
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
    fieldEvidenceCount: 1,
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
    fieldEvidenceCount: 1,
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
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'GP-003',
    code: 'GP-003',
    name: 'Gully Plug #03',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    state: 'Rajasthan',
    district: 'Alwar',
    type: 'Gully Plug',
    lifecycleStage: 'Field Verified',
    healthScore: 85,
    status: 'HEALTHY',
    coordinates: [27.5630, 76.6040],
    constructionDate: '15 January 2025',
    implementingAgency: 'Thanagazi Watershed Cell',
    budgetAllocatedLakhs: 3.5,
    capacityM3: 4200,
    currentCondition: 'Intact dry stone masonry effectively arresting gully bed erosion.',
    lastInspectedDate: '15 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'RS-001',
    code: 'RS-001',
    name: 'Recharge Shaft #01',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    state: 'Rajasthan',
    district: 'Alwar',
    type: 'Recharge Shaft',
    lifecycleStage: 'Field Verified',
    healthScore: 79,
    status: 'HEALTHY',
    coordinates: [27.5715, 76.6195],
    constructionDate: '28 April 2025',
    implementingAgency: 'Groundwater Directorate Alwar',
    budgetAllocatedLakhs: 6.8,
    capacityM3: 9500,
    currentCondition: 'Gravel pack and geo-textile filter operating at optimal percolation rate.',
    lastInspectedDate: '11 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 2: Aravalli Restoration Catchment (Rajasthan) ---
  {
    id: 'CB-201',
    code: 'CB-201',
    name: 'Contour Bund #201',
    watershedId: 'WS-002',
    watershedName: 'Aravalli Restoration Catchment (WS-002)',
    state: 'Rajasthan',
    district: 'Jaipur',
    type: 'Contour Bund',
    lifecycleStage: 'Field Verified',
    healthScore: 80,
    status: 'HEALTHY',
    coordinates: [27.0160, 75.9810],
    constructionDate: '10 February 2025',
    implementingAgency: 'Aravalli Eco-Restoration Society',
    budgetAllocatedLakhs: 8.4,
    capacityM3: 14000,
    currentCondition: 'Terraced slope stabilized with vegetative cover; runoff velocity reduced.',
    lastInspectedDate: '16 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'GP-202',
    code: 'GP-202',
    name: 'Gully Plug #202',
    watershedId: 'WS-002',
    watershedName: 'Aravalli Restoration Catchment (WS-002)',
    state: 'Rajasthan',
    district: 'Jaipur',
    type: 'Gully Plug',
    lifecycleStage: 'Monitoring',
    healthScore: 68,
    status: 'MODERATE',
    coordinates: [27.0110, 75.9890],
    constructionDate: '22 March 2025',
    implementingAgency: 'Jaipur District Rural Development',
    budgetAllocatedLakhs: 4.2,
    capacityM3: 4800,
    currentCondition: 'Minor scouring on eastern wing wall; needs boulder repacking.',
    lastInspectedDate: '08 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'AF-203',
    code: 'AF-203',
    name: 'Afforestation Zone #203',
    watershedId: 'WS-002',
    watershedName: 'Aravalli Restoration Catchment (WS-002)',
    state: 'Rajasthan',
    district: 'Jaipur',
    type: 'Afforestation Zone',
    lifecycleStage: 'Impact Assessed',
    healthScore: 86,
    status: 'HEALTHY',
    coordinates: [27.0220, 75.9750],
    constructionDate: '05 July 2024',
    implementingAgency: 'Rajasthan Forest Department',
    budgetAllocatedLakhs: 24.5,
    capacityM3: 18000,
    currentCondition: 'High seedling survival rate (82%); native Dhok and Kair canopy expanding.',
    lastInspectedDate: '18 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'CD-204',
    code: 'CD-204',
    name: 'Masonry Check Dam #204',
    watershedId: 'WS-002',
    watershedName: 'Aravalli Restoration Catchment (WS-002)',
    state: 'Rajasthan',
    district: 'Jaipur',
    type: 'Check Dam',
    lifecycleStage: 'Field Verified',
    healthScore: 71,
    status: 'MODERATE',
    coordinates: [27.0080, 75.9930],
    constructionDate: '14 January 2025',
    implementingAgency: 'Jaipur Irrigation Circle',
    budgetAllocatedLakhs: 19.8,
    capacityM3: 42000,
    currentCondition: 'Moderate silt build-up in reservoir area; masonry crest sound.',
    lastInspectedDate: '12 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'FP-205',
    code: 'FP-205',
    name: 'Community Farm Pond #205',
    watershedId: 'WS-002',
    watershedName: 'Aravalli Restoration Catchment (WS-002)',
    state: 'Rajasthan',
    district: 'Jaipur',
    type: 'Farm Pond',
    lifecycleStage: 'Field Verified',
    healthScore: 83,
    status: 'HEALTHY',
    coordinates: [27.0190, 75.9860],
    constructionDate: '19 November 2024',
    implementingAgency: 'Gram Panchayat Jamwa Ramgarh',
    budgetAllocatedLakhs: 11.2,
    capacityM3: 28000,
    currentCondition: 'Good water depth, protected embankment with vetiver grass planting.',
    lastInspectedDate: '14 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 3: Bundelkhand Water Resilience (Madhya Pradesh) ---
  {
    id: 'PT-301',
    code: 'PT-301',
    name: 'Percolation Tank #301',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    type: 'Percolation Tank',
    lifecycleStage: 'Monitoring',
    healthScore: 64,
    status: 'MODERATE',
    coordinates: [24.6380, 79.4820],
    constructionDate: '12 December 2024',
    implementingAgency: 'Bundelkhand Drought Mitigation Mission',
    budgetAllocatedLakhs: 21.0,
    capacityM3: 54000,
    currentCondition: 'Bed clay deposition slightly impairing percolation velocity.',
    lastInspectedDate: '15 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'CD-302',
    code: 'CD-302',
    name: 'Check Dam #302 (Silt Warning)',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    type: 'Check Dam',
    lifecycleStage: 'Completed',
    healthScore: 44,
    status: 'CRITICAL',
    coordinates: [24.6310, 79.4950],
    constructionDate: '08 October 2024',
    implementingAgency: 'MP Water Resources Division',
    budgetAllocatedLakhs: 26.5,
    capacityM3: 62000,
    currentCondition: 'Heavy silt accumulation exceeding 50% storage capacity; active desilting recommended.',
    lastInspectedDate: '05 August 2026',
    isFieldVerified: false,
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'RS-303',
    code: 'RS-303',
    name: 'Recharge Shaft #303',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    type: 'Recharge Shaft',
    lifecycleStage: 'Field Verified',
    healthScore: 78,
    status: 'HEALTHY',
    coordinates: [24.6410, 79.4870],
    constructionDate: '16 May 2025',
    implementingAgency: 'Central Groundwater Board MP',
    budgetAllocatedLakhs: 7.5,
    capacityM3: 11000,
    currentCondition: 'Intake chamber clean; dual GNSS verification confirmed active aquifer recharge.',
    lastInspectedDate: '17 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'FP-304',
    code: 'FP-304',
    name: 'Farm Pond #304',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    type: 'Farm Pond',
    lifecycleStage: 'Field Verified',
    healthScore: 75,
    status: 'HEALTHY',
    coordinates: [24.6270, 79.4790],
    constructionDate: '02 March 2025',
    implementingAgency: 'Bijawar Farmers Cooperative',
    budgetAllocatedLakhs: 9.8,
    capacityM3: 22000,
    currentCondition: 'Stable bund slopes, provides critical supplemental irrigation for rabi pulses.',
    lastInspectedDate: '10 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'DS-305',
    code: 'DS-305',
    name: 'Desilting Intervention Site #305',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    type: 'Desilting Site',
    lifecycleStage: 'Under Intervention',
    healthScore: 59,
    status: 'MODERATE',
    coordinates: [24.6350, 79.4910],
    constructionDate: '15 June 2026',
    implementingAgency: 'District Watershed Mission',
    budgetAllocatedLakhs: 14.0,
    capacityM3: 35000,
    currentCondition: 'Excavators actively clearing silt beds; 6,500 m3 sediment relocated to farmer fields.',
    lastInspectedDate: '20 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 4: Marathwada Watershed Recovery (Maharashtra) ---
  {
    id: 'FP-401',
    code: 'FP-401',
    name: 'Community Farm Pond #401',
    watershedId: 'WS-004',
    watershedName: 'Marathwada Watershed Recovery Basin (WS-004)',
    state: 'Maharashtra',
    district: 'Latur',
    type: 'Farm Pond',
    lifecycleStage: 'Field Verified',
    healthScore: 82,
    status: 'HEALTHY',
    coordinates: [18.2560, 76.4980],
    constructionDate: '11 January 2025',
    implementingAgency: 'Jalyukt Shivar Abhiyan Unit',
    budgetAllocatedLakhs: 13.5,
    capacityM3: 38000,
    currentCondition: 'Excellent water retention; solar pump setup provides drip irrigation for soybean crops.',
    lastInspectedDate: '19 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'SR-402',
    code: 'SR-402',
    name: 'Stream Deepening Reach #402',
    watershedId: 'WS-004',
    watershedName: 'Marathwada Watershed Recovery Basin (WS-004)',
    state: 'Maharashtra',
    district: 'Latur',
    type: 'Stream Restoration',
    lifecycleStage: 'Monitoring',
    healthScore: 62,
    status: 'MODERATE',
    coordinates: [18.2490, 76.5090],
    constructionDate: '25 April 2025',
    implementingAgency: 'Latur Rural Water Cell',
    budgetAllocatedLakhs: 17.2,
    capacityM3: 46000,
    currentCondition: 'Widened channel containing seasonal flash flows; side slope vegetative stabilization ongoing.',
    lastInspectedDate: '09 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'CD-403',
    code: 'CD-403',
    name: 'Nala Bund Check Dam #403',
    watershedId: 'WS-004',
    watershedName: 'Marathwada Watershed Recovery Basin (WS-004)',
    state: 'Maharashtra',
    district: 'Latur',
    type: 'Check Dam',
    lifecycleStage: 'Construction Started',
    healthScore: 41,
    status: 'CRITICAL',
    coordinates: [18.2610, 76.5050],
    constructionDate: '14 May 2026',
    implementingAgency: 'Maharashtra Soil & Water Dept',
    budgetAllocatedLakhs: 23.0,
    capacityM3: 52000,
    currentCondition: 'Downstream apron partially damaged during heavy cloudburst; requires urgent reinforcement.',
    lastInspectedDate: '04 August 2026',
    isFieldVerified: false,
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'CT-404',
    code: 'CT-404',
    name: 'Continuous Contour Trench #404',
    watershedId: 'WS-004',
    watershedName: 'Marathwada Watershed Recovery Basin (WS-004)',
    state: 'Maharashtra',
    district: 'Latur',
    type: 'Contour Trench',
    lifecycleStage: 'Field Verified',
    healthScore: 79,
    status: 'HEALTHY',
    coordinates: [18.2450, 76.4920],
    constructionDate: '03 December 2024',
    implementingAgency: 'Ausa Watershed Committee',
    budgetAllocatedLakhs: 8.9,
    capacityM3: 16000,
    currentCondition: 'Terrace ridges intact; reduced sheet erosion across 65 hectares of farmland.',
    lastInspectedDate: '13 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'DS-405',
    code: 'DS-405',
    name: 'Desilting Site #405',
    watershedId: 'WS-004',
    watershedName: 'Marathwada Watershed Recovery Basin (WS-004)',
    state: 'Maharashtra',
    district: 'Latur',
    type: 'Desilting Site',
    lifecycleStage: 'Under Intervention',
    healthScore: 66,
    status: 'MODERATE',
    coordinates: [18.2520, 76.5140],
    constructionDate: '01 July 2026',
    implementingAgency: 'Latur Water Conservation Taskforce',
    budgetAllocatedLakhs: 15.5,
    capacityM3: 31000,
    currentCondition: 'Silt extraction completed on upper 200m reach, increasing storage by 42%.',
    lastInspectedDate: '18 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 5: Vidarbha Soil & Water Conservation (Maharashtra) ---
  {
    id: 'CD-501',
    code: 'CD-501',
    name: 'Masonry Check Dam #501',
    watershedId: 'WS-005',
    watershedName: 'Vidarbha Soil & Water Conservation Unit (WS-005)',
    state: 'Maharashtra',
    district: 'Yavatmal',
    type: 'Check Dam',
    lifecycleStage: 'Field Verified',
    healthScore: 89,
    status: 'HEALTHY',
    coordinates: [19.9140, 77.5790],
    constructionDate: '20 September 2024',
    implementingAgency: 'Vidarbha Watershed Authority',
    budgetAllocatedLakhs: 24.0,
    capacityM3: 58000,
    currentCondition: 'Crest in excellent condition; provides continuous recharge to 14 downstream open wells.',
    lastInspectedDate: '19 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'PT-502',
    code: 'PT-502',
    name: 'Percolation Tank #502',
    watershedId: 'WS-005',
    watershedName: 'Vidarbha Soil & Water Conservation Unit (WS-005)',
    state: 'Maharashtra',
    district: 'Yavatmal',
    type: 'Percolation Tank',
    lifecycleStage: 'Field Verified',
    healthScore: 81,
    status: 'HEALTHY',
    coordinates: [19.9070, 77.5870],
    constructionDate: '15 November 2024',
    implementingAgency: 'Pusad Taluka Rural Development',
    budgetAllocatedLakhs: 18.0,
    capacityM3: 44000,
    currentCondition: 'Strong earthen bund with stone pitching; groundwater table elevated by 2.4m.',
    lastInspectedDate: '14 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'GP-503',
    code: 'GP-503',
    name: 'Loose Boulder Gully Plug #503',
    watershedId: 'WS-005',
    watershedName: 'Vidarbha Soil & Water Conservation Unit (WS-005)',
    state: 'Maharashtra',
    district: 'Yavatmal',
    type: 'Gully Plug',
    lifecycleStage: 'Field Verified',
    healthScore: 84,
    status: 'HEALTHY',
    coordinates: [19.9190, 77.5730],
    constructionDate: '08 January 2025',
    implementingAgency: 'Yavatmal Eco-Watershed Society',
    budgetAllocatedLakhs: 4.6,
    capacityM3: 5200,
    currentCondition: 'Boulders firmly keyed into bed rock; heavy silt trapped on upstream side.',
    lastInspectedDate: '16 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'FP-504',
    code: 'FP-504',
    name: 'Farm Pond #504',
    watershedId: 'WS-005',
    watershedName: 'Vidarbha Soil & Water Conservation Unit (WS-005)',
    state: 'Maharashtra',
    district: 'Yavatmal',
    type: 'Farm Pond',
    lifecycleStage: 'Impact Assessed',
    healthScore: 78,
    status: 'HEALTHY',
    coordinates: [19.9030, 77.5910],
    constructionDate: '28 February 2025',
    implementingAgency: 'Pusad Farmers Society',
    budgetAllocatedLakhs: 10.5,
    capacityM3: 26000,
    currentCondition: 'High water volume; supports multi-cropping of cotton and pigeon pea.',
    lastInspectedDate: '12 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'AF-505',
    code: 'AF-505',
    name: 'Catchment Afforestation #505',
    watershedId: 'WS-005',
    watershedName: 'Vidarbha Soil & Water Conservation Unit (WS-005)',
    state: 'Maharashtra',
    district: 'Yavatmal',
    type: 'Afforestation Zone',
    lifecycleStage: 'Field Verified',
    healthScore: 87,
    status: 'HEALTHY',
    coordinates: [19.9160, 77.5850],
    constructionDate: '10 July 2024',
    implementingAgency: 'Maharashtra Forest Dept',
    budgetAllocatedLakhs: 22.0,
    capacityM3: 15000,
    currentCondition: 'Dense teak and bamboo sapling growth across ridge slopes.',
    lastInspectedDate: '18 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 6: Deccan Plateau Watershed (Karnataka) ---
  {
    id: 'PT-601',
    code: 'PT-601',
    name: 'Tank Cascade Percolation Basin #601',
    watershedId: 'WS-006',
    watershedName: 'Deccan Plateau Watershed Project (WS-006)',
    state: 'Karnataka',
    district: 'Kolar',
    type: 'Percolation Tank',
    lifecycleStage: 'Field Verified',
    healthScore: 92,
    status: 'HEALTHY',
    coordinates: [13.3450, 78.2100],
    constructionDate: '18 August 2024',
    implementingAgency: 'Karnataka Watershed Development Dept',
    budgetAllocatedLakhs: 28.0,
    capacityM3: 75000,
    currentCondition: 'Cascade weir fully functional; substantial replenishment of local granitic aquifers.',
    lastInspectedDate: '17 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'RS-602',
    code: 'RS-602',
    name: 'Artificial Recharge Borewell #602',
    watershedId: 'WS-006',
    watershedName: 'Deccan Plateau Watershed Project (WS-006)',
    state: 'Karnataka',
    district: 'Kolar',
    type: 'Recharge Shaft',
    lifecycleStage: 'Field Verified',
    healthScore: 86,
    status: 'HEALTHY',
    coordinates: [13.3390, 78.2180],
    constructionDate: '05 March 2025',
    implementingAgency: 'Kolar District Groundwater Board',
    budgetAllocatedLakhs: 7.8,
    capacityM3: 13000,
    currentCondition: 'Sand-gravel filter pit operating cleanly without silt blockage.',
    lastInspectedDate: '15 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'CD-603',
    code: 'CD-603',
    name: 'Masonry Check Dam #603',
    watershedId: 'WS-006',
    watershedName: 'Deccan Plateau Watershed Project (WS-006)',
    state: 'Karnataka',
    district: 'Kolar',
    type: 'Check Dam',
    lifecycleStage: 'Field Verified',
    healthScore: 83,
    status: 'HEALTHY',
    coordinates: [13.3480, 78.2050],
    constructionDate: '12 November 2024',
    implementingAgency: 'Srinivaspur Taluk Panchayat',
    budgetAllocatedLakhs: 17.5,
    capacityM3: 40000,
    currentCondition: 'Masonry weir sound, post-monsoon storage level at 85% capacity.',
    lastInspectedDate: '11 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'AF-604',
    code: 'AF-604',
    name: 'Tank Buffer Afforestation #604',
    watershedId: 'WS-006',
    watershedName: 'Deccan Plateau Watershed Project (WS-006)',
    state: 'Karnataka',
    district: 'Kolar',
    type: 'Afforestation Zone',
    lifecycleStage: 'Impact Assessed',
    healthScore: 88,
    status: 'HEALTHY',
    coordinates: [13.3360, 78.2220],
    constructionDate: '22 July 2024',
    implementingAgency: 'Karnataka Social Forestry Division',
    budgetAllocatedLakhs: 19.2,
    capacityM3: 16000,
    currentCondition: 'Neem, tamarind, and sandalwood buffer belt flourishing along catchment perimeter.',
    lastInspectedDate: '16 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'FP-605',
    code: 'FP-605',
    name: 'Farm Pond #605',
    watershedId: 'WS-006',
    watershedName: 'Deccan Plateau Watershed Project (WS-006)',
    state: 'Karnataka',
    district: 'Kolar',
    type: 'Farm Pond',
    lifecycleStage: 'Field Verified',
    healthScore: 80,
    status: 'HEALTHY',
    coordinates: [13.3410, 78.2150],
    constructionDate: '10 January 2025',
    implementingAgency: 'Kolar Horticulture Association',
    budgetAllocatedLakhs: 11.0,
    capacityM3: 29000,
    currentCondition: 'Lined pond providing reliable irrigation for mango and tomato horticulture.',
    lastInspectedDate: '14 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 7: Eastern Rajasthan Water Security (Rajasthan) ---
  {
    id: 'GP-701',
    code: 'GP-701',
    name: 'Gully Plug Series #701',
    watershedId: 'WS-007',
    watershedName: 'Eastern Rajasthan Water Security Corridor (WS-007)',
    state: 'Rajasthan',
    district: 'Dausa',
    type: 'Gully Plug',
    lifecycleStage: 'Field Verified',
    healthScore: 77,
    status: 'HEALTHY',
    coordinates: [27.0510, 76.5680],
    constructionDate: '14 March 2025',
    implementingAgency: 'Dausa Watershed Development Cell',
    budgetAllocatedLakhs: 5.1,
    capacityM3: 6000,
    currentCondition: 'Dry stone masonry stable; prevents ravines from expanding into agricultural fields.',
    lastInspectedDate: '18 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'CD-702',
    code: 'CD-702',
    name: 'Check Dam #702 (Silt Warning)',
    watershedId: 'WS-007',
    watershedName: 'Eastern Rajasthan Water Security Corridor (WS-007)',
    state: 'Rajasthan',
    district: 'Dausa',
    type: 'Check Dam',
    lifecycleStage: 'Monitoring',
    healthScore: 58,
    status: 'MODERATE',
    coordinates: [27.0440, 76.5750],
    constructionDate: '09 December 2024',
    implementingAgency: 'Rajasthan Water Resources Dept',
    budgetAllocatedLakhs: 20.4,
    capacityM3: 48000,
    currentCondition: 'Reservoir bed showing moderate siltation (~35%); structural spillway intact.',
    lastInspectedDate: '07 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 1,
  },
  {
    id: 'CB-703',
    code: 'CB-703',
    name: 'Earthen Contour Bund #703',
    watershedId: 'WS-007',
    watershedName: 'Eastern Rajasthan Water Security Corridor (WS-007)',
    state: 'Rajasthan',
    district: 'Dausa',
    type: 'Contour Bund',
    lifecycleStage: 'Field Verified',
    healthScore: 75,
    status: 'HEALTHY',
    coordinates: [27.0540, 76.5630],
    constructionDate: '18 January 2025',
    implementingAgency: 'Bandikui Farmer Producer Co.',
    budgetAllocatedLakhs: 7.9,
    capacityM3: 13500,
    currentCondition: 'Ridge profile well maintained by village watershed committee.',
    lastInspectedDate: '16 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'DT-704',
    code: 'DT-704',
    name: 'Drainage Treatment #704',
    watershedId: 'WS-007',
    watershedName: 'Eastern Rajasthan Water Security Corridor (WS-007)',
    state: 'Rajasthan',
    district: 'Dausa',
    type: 'Drainage Treatment',
    lifecycleStage: 'Monitoring',
    healthScore: 64,
    status: 'MODERATE',
    coordinates: [27.0410, 76.5790],
    constructionDate: '25 February 2025',
    implementingAgency: 'Dausa Soil Conservation Office',
    budgetAllocatedLakhs: 12.6,
    capacityM3: 21000,
    currentCondition: 'Vegetative buffer thriving; boulder toe wall arrests stream bank slumping.',
    lastInspectedDate: '10 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'FP-705',
    code: 'FP-705',
    name: 'Farm Pond #705',
    watershedId: 'WS-007',
    watershedName: 'Eastern Rajasthan Water Security Corridor (WS-007)',
    state: 'Rajasthan',
    district: 'Dausa',
    type: 'Farm Pond',
    lifecycleStage: 'Impact Assessed',
    healthScore: 81,
    status: 'HEALTHY',
    coordinates: [27.0490, 76.5720],
    constructionDate: '11 October 2024',
    implementingAgency: 'Bandikui Gram Panchayat',
    budgetAllocatedLakhs: 10.8,
    capacityM3: 27000,
    currentCondition: 'Retains 2.1m water depth; provides critical moisture for mustard crops.',
    lastInspectedDate: '15 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },

  // --- Watershed 8: Central India Catchment Restoration (Madhya Pradesh) ---
  {
    id: 'CD-801',
    code: 'CD-801',
    name: 'Silt Detention Dam #801',
    watershedId: 'WS-008',
    watershedName: 'Central India Catchment Restoration (WS-008)',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    type: 'Check Dam',
    lifecycleStage: 'Field Verified',
    healthScore: 91,
    status: 'HEALTHY',
    coordinates: [22.7860, 77.6710],
    constructionDate: '14 August 2024',
    implementingAgency: 'Narmada Basin Development Authority',
    budgetAllocatedLakhs: 27.5,
    capacityM3: 68000,
    currentCondition: 'Robust masonry crest and pristine reservoir; high water clarity and dense forest cover.',
    lastInspectedDate: '20 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'PT-802',
    code: 'PT-802',
    name: 'Percolation Tank #802',
    watershedId: 'WS-008',
    watershedName: 'Central India Catchment Restoration (WS-008)',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    type: 'Percolation Tank',
    lifecycleStage: 'Field Verified',
    healthScore: 89,
    status: 'HEALTHY',
    coordinates: [22.7790, 77.6780],
    constructionDate: '03 November 2024',
    implementingAgency: 'Budni Watershed Development Cell',
    budgetAllocatedLakhs: 19.5,
    capacityM3: 49000,
    currentCondition: 'Substantial water spread; provides baseflow replenishment to downstream springs.',
    lastInspectedDate: '18 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'AF-803',
    code: 'AF-803',
    name: 'Slope Afforestation Zone #803',
    watershedId: 'WS-008',
    watershedName: 'Central India Catchment Restoration (WS-008)',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    type: 'Afforestation Zone',
    lifecycleStage: 'Impact Assessed',
    healthScore: 94,
    status: 'HEALTHY',
    coordinates: [22.7910, 77.6660],
    constructionDate: '15 June 2024',
    implementingAgency: 'MP Forest Directorate',
    budgetAllocatedLakhs: 31.0,
    capacityM3: 22000,
    currentCondition: 'Exceptional 91% canopy recovery with mixed Sal, Mahua, and Bamboo plantings.',
    lastInspectedDate: '21 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'SR-804',
    code: 'SR-804',
    name: 'Stream Restoration Reach #804',
    watershedId: 'WS-008',
    watershedName: 'Central India Catchment Restoration (WS-008)',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    type: 'Stream Restoration',
    lifecycleStage: 'Field Verified',
    healthScore: 85,
    status: 'HEALTHY',
    coordinates: [22.7750, 77.6820],
    constructionDate: '19 January 2025',
    implementingAgency: 'Sehore Soil Conservation Society',
    budgetAllocatedLakhs: 16.0,
    capacityM3: 39000,
    currentCondition: 'Stone-pitched riparian banks stabilized with native grasses; minimal bank scouring.',
    lastInspectedDate: '17 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  },
  {
    id: 'RS-805',
    code: 'RS-805',
    name: 'Recharge Shaft #805',
    watershedId: 'WS-008',
    watershedName: 'Central India Catchment Restoration (WS-008)',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    type: 'Recharge Shaft',
    lifecycleStage: 'Field Verified',
    healthScore: 88,
    status: 'HEALTHY',
    coordinates: [22.7840, 77.6760],
    constructionDate: '28 February 2025',
    implementingAgency: 'Central Groundwater Board MP',
    budgetAllocatedLakhs: 7.2,
    capacityM3: 12500,
    currentCondition: 'Filtration chamber fully clear of silt; active recharge into basalt fracture zone.',
    lastInspectedDate: '19 August 2026',
    isFieldVerified: true,
    fieldEvidenceCount: 1,
    activeAlertCount: 0,
  }
];

// ==========================================
// MOCK FIELD EVIDENCE & AI ANALYSIS
// ==========================================
export const MOCK_FIELD_EVIDENCE: FieldEvidence[] = [
  // --- WS-001 / CD-012 (Existing Intact) ---
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
    notes: 'DEMO EVIDENCE — Structure verified matching design blueprints. Water head level at 1.8m.',
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
    notes: 'DEMO EVIDENCE — Downstream moisture sustained grass cover across 150m channel stretch.',
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
    notes: 'DEMO EVIDENCE — Urgent desilting needed before next cloudburst event.',
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
  },
  {
    id: 'EVD-104',
    interventionId: 'GP-003',
    interventionName: 'Gully Plug #03',
    watershedId: 'WS-001',
    photoUrl: '/assets/evidence/evidence_gullyplug_stone.jpg',
    thumbnailUrl: '/assets/evidence/evidence_gullyplug_stone.jpg',
    caption: 'Dry stone masonry gully plug checking active runoff in northern micro-gully.',
    coordinates: [27.5630, 76.6040],
    capturedAt: '2026-08-15 03:30 PM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Priya Meena (Normal Admin)',
    verifiedAt: '2026-08-16 11:00 AM IST',
    notes: 'DEMO EVIDENCE — Stable anchor stones; upstream silt buildup indicates high erosion control efficiency.',
    aiAnalysis: {
      structureDetected: 'Gully Plug (Dry Stone)',
      structureConfidence: 92,
      waterDetected: false,
      waterConfidence: 74,
      vegetationDetected: true,
      vegetationConfidence: 68,
      potentialIssue: 'None. Stone keying intact.',
      confidenceScore: 91,
      recommendation: 'Routine seasonal monitoring.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-105',
    interventionId: 'RS-001',
    interventionName: 'Recharge Shaft #01',
    watershedId: 'WS-001',
    photoUrl: '/assets/evidence/evidence_recharge_shaft.jpg',
    thumbnailUrl: '/assets/evidence/evidence_recharge_shaft.jpg',
    caption: 'Groundwater recharge shaft concrete chamber with silt filtration bed.',
    coordinates: [27.5715, 76.6195],
    capturedAt: '2026-08-11 11:15 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-12 04:20 PM IST',
    notes: 'DEMO EVIDENCE — Intake screen clean and gravel filter permeable.',
    aiAnalysis: {
      structureDetected: 'Recharge Shaft / Silt Trap',
      structureConfidence: 94,
      waterDetected: true,
      waterConfidence: 86,
      vegetationDetected: true,
      vegetationConfidence: 88,
      potentialIssue: 'Minor silt on outer apron.',
      confidenceScore: 92,
      recommendation: 'Periodic rake clearing of filtration gravel.',
      requiresHumanReview: false,
    }
  },

  // --- WS-002 / Aravalli Restoration (Rajasthan) ---
  {
    id: 'EVD-201',
    interventionId: 'CB-201',
    interventionName: 'Contour Bund #201',
    watershedId: 'WS-002',
    photoUrl: '/assets/evidence/evidence_contourbund_slope.jpg',
    thumbnailUrl: '/assets/evidence/evidence_contourbund_slope.jpg',
    caption: 'Terraced slope earthen contour bunds arresting agricultural runoff.',
    coordinates: [27.0160, 75.9810],
    capturedAt: '2026-08-16 02:40 PM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Priya Meena (Normal Admin)',
    verifiedAt: '2026-08-17 10:30 AM IST',
    notes: 'DEMO EVIDENCE — Bund height measured at 0.75m adhering to technical design norms.',
    aiAnalysis: {
      structureDetected: 'Contour Bund (Earthen / Terraced)',
      structureConfidence: 89,
      waterDetected: false,
      waterConfidence: 65,
      vegetationDetected: true,
      vegetationConfidence: 84,
      potentialIssue: 'Stable bund slopes with emerging grass cover.',
      confidenceScore: 88,
      recommendation: 'Encourage vegetative planting along bund ridges.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-202',
    interventionId: 'AF-203',
    interventionName: 'Afforestation Zone #203',
    watershedId: 'WS-002',
    photoUrl: '/assets/evidence/evidence_afforestation_zone.jpg',
    thumbnailUrl: '/assets/evidence/evidence_afforestation_zone.jpg',
    caption: 'Hillside sapling plantation on stone-terraced contour ridges.',
    coordinates: [27.0220, 75.9750],
    capturedAt: '2026-08-18 10:15 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-19 03:45 PM IST',
    notes: 'DEMO EVIDENCE — Over 3,400 indigenous saplings thriving across ridge contour terraces.',
    aiAnalysis: {
      structureDetected: 'Afforestation / Hillside Contour Trenching',
      structureConfidence: 96,
      waterDetected: false,
      waterConfidence: 55,
      vegetationDetected: true,
      vegetationConfidence: 94,
      potentialIssue: 'None. Strong biomass recovery detected by Sentinel-2 NDVI.',
      confidenceScore: 95,
      recommendation: 'Maintain cattle exclusion fencing during monsoon sapling growth.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-203',
    interventionId: 'CB-201',
    interventionName: 'Contour Bund System #201',
    watershedId: 'WS-002',
    photoUrl: '/assets/evidence/evidence_contourbund_slope.jpg',
    thumbnailUrl: '/assets/evidence/evidence_contourbund_slope.jpg',
    caption: 'Earthen contour bund ridges along agricultural slope checking sheet erosion.',
    coordinates: [27.0520, 75.9810],
    capturedAt: '2026-08-20 10:15 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-21 02:00 PM IST',
    notes: 'DEMO EVIDENCE — Terraced ridges holding topsoil with vegetative grass stabilizer.',
    aiAnalysis: {
      structureDetected: 'Contour Bund / Slope Terracing',
      structureConfidence: 93,
      waterDetected: false,
      waterConfidence: 62,
      vegetationDetected: true,
      vegetationConfidence: 86,
      potentialIssue: 'None detected.',
      confidenceScore: 91,
      recommendation: 'Periodic inspection of side spillways.',
      requiresHumanReview: false,
    }
  },

  // --- WS-003 / Bundelkhand Water Resilience (Madhya Pradesh) ---
  {
    id: 'EVD-301',
    interventionId: 'PT-301',
    interventionName: 'Percolation Tank #301',
    watershedId: 'WS-003',
    photoUrl: '/assets/evidence/evidence_percolation_tank.jpg',
    thumbnailUrl: '/assets/evidence/evidence_percolation_tank.jpg',
    caption: 'Earthen percolation basin holding post-monsoon runoff in semi-arid landscape.',
    coordinates: [24.6380, 79.4820],
    capturedAt: '2026-08-15 01:20 PM IST',
    uploadedBy: {
      id: 'USR-005',
      name: 'Kavita Deshmukh',
      role: 'Field Officer'
    },
    verificationStatus: 'PENDING',
    notes: 'DEMO EVIDENCE — Water spread area estimated at 2.4 hectares; shallow depth promoting infiltration.',
    aiAnalysis: {
      structureDetected: 'Percolation Tank (Earthen Basin)',
      structureConfidence: 91,
      waterDetected: true,
      waterConfidence: 89,
      vegetationDetected: false,
      vegetationConfidence: 52,
      potentialIssue: 'Clay deposition observed along eastern bank.',
      confidenceScore: 87,
      recommendation: 'Nodal verification recommended for desiltation scheduling.',
      requiresHumanReview: true,
    }
  },
  {
    id: 'EVD-302',
    interventionId: 'DS-305',
    interventionName: 'Desilting Intervention Site #305',
    watershedId: 'WS-003',
    photoUrl: '/assets/evidence/evidence_desiltation_site.jpg',
    thumbnailUrl: '/assets/evidence/evidence_desiltation_site.jpg',
    caption: 'Heavy machinery actively removing compacted sediment from check dam reservoir.',
    coordinates: [24.6350, 79.4910],
    capturedAt: '2026-08-20 11:50 AM IST',
    uploadedBy: {
      id: 'USR-005',
      name: 'Kavita Deshmukh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Rameshwar Bundela (Normal Admin)',
    verifiedAt: '2026-08-21 02:00 PM IST',
    notes: 'DEMO EVIDENCE — Active desilting verified on site with 6,500 m3 sediment excavated.',
    aiAnalysis: {
      structureDetected: 'Desiltation Activity / Check Dam Basin',
      structureConfidence: 95,
      waterDetected: true,
      waterConfidence: 72,
      vegetationDetected: false,
      vegetationConfidence: 48,
      potentialIssue: 'Heavy excavation in progress; restore bed slope prior to heavy rain.',
      confidenceScore: 92,
      recommendation: 'Complete desilting cycle before next monsoon peak.',
      requiresHumanReview: false,
    }
  },

  // --- WS-004 / Marathwada Watershed Recovery (Maharashtra) ---
  {
    id: 'EVD-401',
    interventionId: 'FP-401',
    interventionName: 'Community Farm Pond #401',
    watershedId: 'WS-004',
    photoUrl: '/assets/evidence/evidence_farmpond_filled.jpg',
    thumbnailUrl: '/assets/evidence/evidence_farmpond_filled.jpg',
    caption: 'Filled community farm pond surrounded by lush agricultural fields.',
    coordinates: [18.2560, 76.4980],
    capturedAt: '2026-08-19 09:30 AM IST',
    uploadedBy: {
      id: 'USR-005',
      name: 'Kavita Deshmukh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Suresh Patil (Normal Admin)',
    verifiedAt: '2026-08-19 05:10 PM IST',
    notes: 'DEMO EVIDENCE — Farm pond operating at full 38,000 m3 capacity supporting 28 farm families.',
    aiAnalysis: {
      structureDetected: 'Farm Pond (Excavated Earthen)',
      structureConfidence: 97,
      waterDetected: true,
      waterConfidence: 98,
      vegetationDetected: true,
      vegetationConfidence: 93,
      potentialIssue: 'None. Pristine embankment and high water clarity.',
      confidenceScore: 96,
      recommendation: 'Model structure for regional farmer replication.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-402',
    interventionId: 'SR-402',
    interventionName: 'Stream Deepening Reach #402',
    watershedId: 'WS-004',
    photoUrl: '/assets/evidence/evidence_stream_restoration.jpg',
    thumbnailUrl: '/assets/evidence/evidence_stream_restoration.jpg',
    caption: 'Restored drainage stream with stone-pitched banks and healthy vegetative corridor.',
    coordinates: [18.2490, 76.5090],
    capturedAt: '2026-08-09 04:15 PM IST',
    uploadedBy: {
      id: 'USR-005',
      name: 'Kavita Deshmukh',
      role: 'Field Officer'
    },
    verificationStatus: 'PENDING',
    notes: 'DEMO EVIDENCE — Stream capacity increased by 3.2x preventing local village waterlogging.',
    aiAnalysis: {
      structureDetected: 'Stream Restoration / Boulder Bank Pitching',
      structureConfidence: 93,
      waterDetected: true,
      waterConfidence: 85,
      vegetationDetected: true,
      vegetationConfidence: 91,
      potentialIssue: 'Minor loose boulder dislocation on right curve.',
      confidenceScore: 90,
      recommendation: 'Officer review to confirm boulder compaction.',
      requiresHumanReview: true,
    }
  },

  // --- WS-005 / Vidarbha Soil & Water Conservation (Maharashtra) ---
  {
    id: 'EVD-501',
    interventionId: 'CD-501',
    interventionName: 'Masonry Check Dam #501',
    watershedId: 'WS-005',
    photoUrl: '/assets/evidence/cd012-upstream-checkdam.jpg',
    thumbnailUrl: '/assets/evidence/cd012-upstream-checkdam.jpg',
    caption: 'High-capacity masonry check dam spillway with upstream water impoundment.',
    coordinates: [19.9140, 77.5790],
    capturedAt: '2026-08-19 11:00 AM IST',
    uploadedBy: {
      id: 'USR-005',
      name: 'Kavita Deshmukh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Suresh Patil (Normal Admin)',
    verifiedAt: '2026-08-20 01:30 PM IST',
    notes: 'DEMO EVIDENCE — Structural integrity confirmed; zero structural fissures on downstream face.',
    aiAnalysis: {
      structureDetected: 'Check Dam (Masonry Gravity)',
      structureConfidence: 94,
      waterDetected: true,
      waterConfidence: 96,
      vegetationDetected: true,
      vegetationConfidence: 85,
      potentialIssue: 'None. Masonry joints intact.',
      confidenceScore: 93,
      recommendation: 'Annual post-monsoon telemetry inspection.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-502',
    interventionId: 'GP-503',
    interventionName: 'Loose Boulder Gully Plug #503',
    watershedId: 'WS-005',
    photoUrl: '/assets/evidence/evidence_gullyplug_stone.jpg',
    thumbnailUrl: '/assets/evidence/evidence_gullyplug_stone.jpg',
    caption: 'Loose boulder gully plug structure checking torrent flow in upper catchment.',
    coordinates: [19.9190, 77.5730],
    capturedAt: '2026-08-16 01:10 PM IST',
    uploadedBy: {
      id: 'USR-005',
      name: 'Kavita Deshmukh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-17 04:00 PM IST',
    notes: 'DEMO EVIDENCE — Interlocked boulder keying effective in halting soil loss.',
    aiAnalysis: {
      structureDetected: 'Gully Plug (Loose Boulder)',
      structureConfidence: 91,
      waterDetected: false,
      waterConfidence: 68,
      vegetationDetected: true,
      vegetationConfidence: 71,
      potentialIssue: 'None.',
      confidenceScore: 89,
      recommendation: 'Maintain dry-stone profile.',
      requiresHumanReview: false,
    }
  },

  // --- WS-006 / Deccan Plateau Watershed (Karnataka) ---
  {
    id: 'EVD-601',
    interventionId: 'PT-601',
    interventionName: 'Tank Cascade Percolation Basin #601',
    watershedId: 'WS-006',
    photoUrl: '/assets/evidence/evidence_percolation_tank.jpg',
    thumbnailUrl: '/assets/evidence/evidence_percolation_tank.jpg',
    caption: 'Rejuvenated tank cascade percolation basin in semi-arid granitic terrain.',
    coordinates: [13.3450, 78.2100],
    capturedAt: '2026-08-17 10:45 AM IST',
    uploadedBy: {
      id: 'USR-006',
      name: 'Anand Rao',
      role: 'Normal Admin / Nodal'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-18 11:30 AM IST',
    notes: 'DEMO EVIDENCE — Cascade flow connects to downstream tank #2 with minimal transmission loss.',
    aiAnalysis: {
      structureDetected: 'Percolation Basin / Cascading Tank',
      structureConfidence: 93,
      waterDetected: true,
      waterConfidence: 91,
      vegetationDetected: true,
      vegetationConfidence: 76,
      potentialIssue: 'None detected.',
      confidenceScore: 92,
      recommendation: 'Sustain community de-weeding drives.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-602',
    interventionId: 'RS-602',
    interventionName: 'Artificial Recharge Borewell #602',
    watershedId: 'WS-006',
    photoUrl: '/assets/evidence/evidence_recharge_shaft.jpg',
    thumbnailUrl: '/assets/evidence/evidence_recharge_shaft.jpg',
    caption: 'Artificial groundwater recharge shaft injecting filtered runoff into deep fractures.',
    coordinates: [13.3390, 78.2180],
    capturedAt: '2026-08-15 02:20 PM IST',
    uploadedBy: {
      id: 'USR-006',
      name: 'Anand Rao',
      role: 'Normal Admin / Nodal'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-16 03:15 PM IST',
    notes: 'DEMO EVIDENCE — Dual GNSS hardware lock confirmed accurate geospatial positioning.',
    aiAnalysis: {
      structureDetected: 'Recharge Borewell / Filtration Unit',
      structureConfidence: 95,
      waterDetected: true,
      waterConfidence: 88,
      vegetationDetected: true,
      vegetationConfidence: 86,
      potentialIssue: 'None.',
      confidenceScore: 94,
      recommendation: 'Periodic backwashing of filter bed.',
      requiresHumanReview: false,
    }
  },

  // --- WS-007 / Eastern Rajasthan Water Security (Rajasthan) ---
  {
    id: 'EVD-701',
    interventionId: 'GP-701',
    interventionName: 'Gully Plug Series #701',
    watershedId: 'WS-007',
    photoUrl: '/assets/evidence/evidence_gullyplug_stone.jpg',
    thumbnailUrl: '/assets/evidence/evidence_gullyplug_stone.jpg',
    caption: 'Stone masonry gully plug series protecting ravine edge farmland.',
    coordinates: [27.0510, 76.5680],
    capturedAt: '2026-08-18 08:45 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Priya Meena (Normal Admin)',
    verifiedAt: '2026-08-18 04:30 PM IST',
    notes: 'DEMO EVIDENCE — Structure intact; trapped topsoil depth measured at 0.38m.',
    aiAnalysis: {
      structureDetected: 'Gully Plug (Stone Masonry)',
      structureConfidence: 90,
      waterDetected: false,
      waterConfidence: 60,
      vegetationDetected: true,
      vegetationConfidence: 65,
      potentialIssue: 'None.',
      confidenceScore: 88,
      recommendation: 'Annual pre-monsoon inspection.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-702',
    interventionId: 'CD-702',
    interventionName: 'Check Dam #702 (Silt Warning)',
    watershedId: 'WS-007',
    photoUrl: '/assets/evidence/cd015-silt-checkdam.jpg',
    thumbnailUrl: '/assets/evidence/cd015-silt-checkdam.jpg',
    caption: 'Moderate silt buildup in check dam basin reducing storage.',
    coordinates: [27.0440, 76.5750],
    capturedAt: '2026-08-07 10:10 AM IST',
    uploadedBy: {
      id: 'USR-003',
      name: 'Vikram Singh',
      role: 'Field Officer'
    },
    verificationStatus: 'FLAGGED',
    notes: 'DEMO EVIDENCE — Silt accumulation at 35%; scheduled for non-monsoon excavation.',
    aiAnalysis: {
      structureDetected: 'Check Dam (Silted Basin)',
      structureConfidence: 87,
      waterDetected: false,
      waterConfidence: 58,
      vegetationDetected: false,
      vegetationConfidence: 42,
      potentialIssue: 'Silt deposition near spillway apron.',
      confidenceScore: 86,
      recommendation: 'Schedule desiltation before next season.',
      requiresHumanReview: true,
    }
  },

  // --- WS-008 / Central India Catchment Restoration (Madhya Pradesh) ---
  {
    id: 'EVD-801',
    interventionId: 'CD-801',
    interventionName: 'Silt Detention Dam #801',
    watershedId: 'WS-008',
    photoUrl: '/assets/evidence/cd012-upstream-checkdam.jpg',
    thumbnailUrl: '/assets/evidence/cd012-upstream-checkdam.jpg',
    caption: 'Silt detention dam nestled in dense forest catchment with clear water reservoir.',
    coordinates: [22.7860, 77.6710],
    capturedAt: '2026-08-20 09:15 AM IST',
    uploadedBy: {
      id: 'USR-007',
      name: 'Rameshwar Bundela',
      role: 'Normal Admin / Nodal'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-21 01:00 PM IST',
    notes: 'DEMO EVIDENCE — Pristine ecological health, water clarity exceeds 90%, robust baseflow.',
    aiAnalysis: {
      structureDetected: 'Check Dam / Silt Detention Structure',
      structureConfidence: 96,
      waterDetected: true,
      waterConfidence: 97,
      vegetationDetected: true,
      vegetationConfidence: 95,
      potentialIssue: 'None. Benchmark ecological condition.',
      confidenceScore: 97,
      recommendation: 'Maintain continuous automated Sentinel-2 surveillance.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-802',
    interventionId: 'AF-803',
    interventionName: 'Slope Afforestation Zone #803',
    watershedId: 'WS-008',
    photoUrl: '/assets/evidence/evidence_afforestation_zone.jpg',
    thumbnailUrl: '/assets/evidence/evidence_afforestation_zone.jpg',
    caption: 'Lush hillside afforestation zone with indigenous multi-tier canopy.',
    coordinates: [22.7910, 77.6660],
    capturedAt: '2026-08-21 11:30 AM IST',
    uploadedBy: {
      id: 'USR-007',
      name: 'Rameshwar Bundela',
      role: 'Normal Admin / Nodal'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-22 10:15 AM IST',
    notes: 'DEMO EVIDENCE — Excellent 94/100 vegetative health score verified.',
    aiAnalysis: {
      structureDetected: 'Afforestation & Silvopasture Zone',
      structureConfidence: 98,
      waterDetected: false,
      waterConfidence: 62,
      vegetationDetected: true,
      vegetationConfidence: 98,
      potentialIssue: 'None.',
      confidenceScore: 98,
      recommendation: 'Model afforestation practice.',
      requiresHumanReview: false,
    }
  },
  {
    id: 'EVD-803',
    interventionId: 'SR-804',
    interventionName: 'Stream Restoration Reach #804',
    watershedId: 'WS-008',
    photoUrl: '/assets/evidence/evidence_stream_restoration.jpg',
    thumbnailUrl: '/assets/evidence/evidence_stream_restoration.jpg',
    caption: 'Meandering perennial stream with boulder-pitched banks and rich riparian buffer.',
    coordinates: [22.7750, 77.6820],
    capturedAt: '2026-08-17 03:10 PM IST',
    uploadedBy: {
      id: 'USR-007',
      name: 'Rameshwar Bundela',
      role: 'Normal Admin / Nodal'
    },
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Rajesh Sharma (Super Admin)',
    verifiedAt: '2026-08-18 09:45 AM IST',
    notes: 'DEMO EVIDENCE — Healthy naturalized waterway maintaining constant post-monsoon baseflow.',
    aiAnalysis: {
      structureDetected: 'Riparian Stream Restoration',
      structureConfidence: 95,
      waterDetected: true,
      waterConfidence: 92,
      vegetationDetected: true,
      vegetationConfidence: 94,
      potentialIssue: 'None.',
      confidenceScore: 95,
      recommendation: 'Sustain riparian buffer protection.',
      requiresHumanReview: false,
    }
  }
];

// ==========================================
// MOCK SATELLITE & SPECTRAL DATA (MULTI-INTERVENTION)
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
  },
  'CD-501': {
    interventionId: 'CD-501',
    watershedId: 'WS-005',
    sensor: 'Sentinel-2 MSI (Multi-Spectral Demo Simulation)',
    resolution: '10m Surface Reflectance',
    lastPassDate: '2026-08-20 06:10 UTC',
    currentNdvi: 0.49,
    currentNdwi: 0.31,
    historicalObservations: [
      { year: 2023, ndvi: 0.31, ndwi: 0.18, vegetationCoverPercent: 28.0, waterSurfaceAreaHa: 1.5, soilMoistureIndex: 0.35 },
      { year: 2024, ndvi: 0.37, ndwi: 0.22, vegetationCoverPercent: 34.0, waterSurfaceAreaHa: 2.3, soilMoistureIndex: 0.42 },
      { year: 2025, ndvi: 0.43, ndwi: 0.27, vegetationCoverPercent: 41.5, waterSurfaceAreaHa: 3.2, soilMoistureIndex: 0.49 },
      { year: 2026, ndvi: 0.49, ndwi: 0.31, vegetationCoverPercent: 48.0, waterSurfaceAreaHa: 4.1, soilMoistureIndex: 0.58 }
    ],
    monthlyNdviTrend2025: [
      { month: 'Jan', value: 0.38 }, { month: 'Feb', value: 0.36 }, { month: 'Mar', value: 0.33 },
      { month: 'Apr', value: 0.30 }, { month: 'May', value: 0.28 }, { month: 'Jun', value: 0.32 },
      { month: 'Jul', value: 0.42 }, { month: 'Aug', value: 0.49 }, { month: 'Sep', value: 0.51 },
      { month: 'Oct', value: 0.47 }, { month: 'Nov', value: 0.43 }, { month: 'Dec', value: 0.40 }
    ],
    monthlyNdwiTrend2025: [
      { month: 'Jan', value: 0.22 }, { month: 'Feb', value: 0.19 }, { month: 'Mar', value: 0.16 },
      { month: 'Apr', value: 0.12 }, { month: 'May', value: 0.10 }, { month: 'Jun', value: 0.18 },
      { month: 'Jul', value: 0.28 }, { month: 'Aug', value: 0.31 }, { month: 'Sep', value: 0.33 },
      { month: 'Oct', value: 0.29 }, { month: 'Nov', value: 0.25 }, { month: 'Dec', value: 0.23 }
    ]
  },
  'CD-801': {
    interventionId: 'CD-801',
    watershedId: 'WS-008',
    sensor: 'Sentinel-2 MSI (Multi-Spectral Demo Simulation)',
    resolution: '10m Surface Reflectance',
    lastPassDate: '2026-08-21 05:55 UTC',
    currentNdvi: 0.54,
    currentNdwi: 0.35,
    historicalObservations: [
      { year: 2023, ndvi: 0.38, ndwi: 0.22, vegetationCoverPercent: 35.0, waterSurfaceAreaHa: 2.1, soilMoistureIndex: 0.41 },
      { year: 2024, ndvi: 0.44, ndwi: 0.27, vegetationCoverPercent: 42.0, waterSurfaceAreaHa: 3.1, soilMoistureIndex: 0.48 },
      { year: 2025, ndvi: 0.49, ndwi: 0.31, vegetationCoverPercent: 49.0, waterSurfaceAreaHa: 4.2, soilMoistureIndex: 0.55 },
      { year: 2026, ndvi: 0.54, ndwi: 0.35, vegetationCoverPercent: 55.0, waterSurfaceAreaHa: 5.2, soilMoistureIndex: 0.62 }
    ],
    monthlyNdviTrend2025: [
      { month: 'Jan', value: 0.44 }, { month: 'Feb', value: 0.42 }, { month: 'Mar', value: 0.39 },
      { month: 'Apr', value: 0.35 }, { month: 'May', value: 0.33 }, { month: 'Jun', value: 0.38 },
      { month: 'Jul', value: 0.48 }, { month: 'Aug', value: 0.54 }, { month: 'Sep', value: 0.57 },
      { month: 'Oct', value: 0.52 }, { month: 'Nov', value: 0.48 }, { month: 'Dec', value: 0.45 }
    ],
    monthlyNdwiTrend2025: [
      { month: 'Jan', value: 0.26 }, { month: 'Feb', value: 0.23 }, { month: 'Mar', value: 0.20 },
      { month: 'Apr', value: 0.15 }, { month: 'May', value: 0.13 }, { month: 'Jun', value: 0.22 },
      { month: 'Jul', value: 0.32 }, { month: 'Aug', value: 0.35 }, { month: 'Sep', value: 0.38 },
      { month: 'Oct', value: 0.33 }, { month: 'Nov', value: 0.29 }, { month: 'Dec', value: 0.27 }
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
// MOCK ALERTS (REALISTIC NATIONAL ANOMALIES)
// ==========================================
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-901',
    title: 'High sediment accumulation detected',
    description: 'Reservoir storage capacity reduced by >40% due to heavy silt deposition after cloudburst.',
    severity: 'HIGH',
    category: 'STRUCTURAL_DEFECT',
    state: 'Rajasthan',
    district: 'Alwar',
    watershedId: 'WS-001',
    watershedName: 'Alwar North Catchment (WS-001)',
    interventionId: 'CD-015',
    interventionName: 'Check Dam #15',
    timestamp: '2026-08-22 08:30 AM IST',
    isResolved: false,
    assignedOfficer: 'Vikram Singh'
  },
  {
    id: 'ALT-902',
    title: 'Vegetation declining in downstream buffer',
    description: 'NDVI dropped by 14% over 30 days near Check Dam #12 right flank due to localized grazing stress.',
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
  },
  {
    id: 'ALT-903',
    title: 'Structural scour on downstream apron',
    description: 'Scour depth exceeded threshold of 0.45m following monsoon flash storm.',
    severity: 'HIGH',
    category: 'STRUCTURAL_DEFECT',
    state: 'Maharashtra',
    district: 'Latur',
    watershedId: 'WS-004',
    watershedName: 'Marathwada Watershed Recovery Basin (WS-004)',
    interventionId: 'CD-403',
    interventionName: 'Nala Bund Check Dam #403',
    timestamp: '2026-08-20 03:45 PM IST',
    isResolved: false,
    assignedOfficer: 'Kavita Deshmukh'
  },
  {
    id: 'ALT-904',
    title: 'Percolation rate reduction observed',
    description: 'Clay bed sealing detected reducing infiltration rate below design metric of 15 mm/hr.',
    severity: 'MEDIUM',
    category: 'HEALTH_DROP',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    interventionId: 'PT-301',
    interventionName: 'Percolation Tank #301',
    timestamp: '2026-08-19 11:10 AM IST',
    isResolved: false,
    assignedOfficer: 'Rameshwar Bundela'
  },
  {
    id: 'ALT-905',
    title: 'Moderate silt buildup in check dam basin',
    description: 'Sediment level reached 35% capacity near spillway crest; desiltation recommended.',
    severity: 'MEDIUM',
    category: 'STRUCTURAL_DEFECT',
    state: 'Rajasthan',
    district: 'Dausa',
    watershedId: 'WS-007',
    watershedName: 'Eastern Rajasthan Water Security Corridor (WS-007)',
    interventionId: 'CD-702',
    interventionName: 'Check Dam #702 (Silt Warning)',
    timestamp: '2026-08-18 09:00 AM IST',
    isResolved: false,
    assignedOfficer: 'Priya Meena'
  },
  {
    id: 'ALT-906',
    title: 'Gully wing wall minor scouring',
    description: 'Eastern wing wall stone displacement observed during field survey.',
    severity: 'LOW',
    category: 'STRUCTURAL_DEFECT',
    state: 'Rajasthan',
    district: 'Jaipur',
    watershedId: 'WS-002',
    watershedName: 'Aravalli Restoration Catchment (WS-002)',
    interventionId: 'GP-202',
    interventionName: 'Gully Plug #202',
    timestamp: '2026-08-17 02:20 PM IST',
    isResolved: false,
    assignedOfficer: 'Priya Meena'
  },
  {
    id: 'ALT-907',
    title: 'Severe sediment accumulation in reservoir',
    description: 'Silt deposition exceeds 50% capacity; active desilting work in progress.',
    severity: 'HIGH',
    category: 'STRUCTURAL_DEFECT',
    state: 'Madhya Pradesh',
    district: 'Chhatarpur',
    watershedId: 'WS-003',
    watershedName: 'Bundelkhand Water Resilience Project (WS-003)',
    interventionId: 'CD-302',
    interventionName: 'Check Dam #302 (Silt Warning)',
    timestamp: '2026-08-21 09:30 AM IST',
    isResolved: false,
    assignedOfficer: 'Rameshwar Bundela'
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
      },
      {
        type: 'Feature',
        properties: {
          name: 'Aravalli Restoration Catchment (WS-002)',
          areaHa: 5120,
          healthScore: 76
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [75.960, 27.030],
              [76.010, 27.032],
              [76.020, 27.000],
              [75.990, 26.985],
              [75.955, 27.005],
              [75.960, 27.030]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Bundelkhand Water Resilience (WS-003)',
          areaHa: 6800,
          healthScore: 64
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [79.460, 24.650],
              [79.515, 24.652],
              [79.525, 24.615],
              [79.475, 24.610],
              [79.460, 24.650]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Marathwada Watershed Recovery (WS-004)',
          areaHa: 5400,
          healthScore: 58
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.480, 18.270],
              [76.530, 18.275],
              [76.540, 18.235],
              [76.490, 18.230],
              [76.480, 18.270]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Vidarbha Soil & Water Conservation (WS-005)',
          areaHa: 4750,
          healthScore: 84
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [77.560, 19.930],
              [77.610, 19.935],
              [77.615, 19.895],
              [77.565, 19.890],
              [77.560, 19.930]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Deccan Plateau Watershed (WS-006)',
          areaHa: 3900,
          healthScore: 86
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [78.190, 13.360],
              [78.240, 13.362],
              [78.245, 13.325],
              [78.195, 13.320],
              [78.190, 13.360]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Eastern Rajasthan Water Security (WS-007)',
          areaHa: 3650,
          healthScore: 71
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.550, 27.065],
              [76.595, 27.068],
              [76.600, 27.030],
              [76.555, 27.025],
              [76.550, 27.065]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Central India Catchment Restoration (WS-008)',
          areaHa: 5950,
          healthScore: 90
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [77.650, 22.805],
              [77.700, 22.810],
              [77.705, 22.760],
              [77.655, 22.755],
              [77.650, 22.805]
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
          name: 'Primary Drainage Stream (Ruparel Tributary - WS-001)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.588, 27.590],
            [76.602, 27.578],
            [76.6128, 27.5684],
            [76.625, 27.558],
            [76.638, 27.548]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Aravalli Drainage River Reach (WS-002)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [75.965, 27.025],
            [75.984, 27.0125],
            [75.993, 27.008],
            [76.015, 26.995]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Ken-Betwa Sub-basin Feeder (WS-003)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [79.465, 24.645],
            [79.489, 24.634],
            [79.495, 24.631],
            [79.518, 24.620]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Godavari Tributary Drainage Channel (WS-004)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.485, 18.265],
            [76.502, 18.253],
            [76.514, 18.252],
            [76.535, 18.240]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Penganga Sub-catchment Feeder (WS-005)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.565, 19.925],
            [77.583, 19.911],
            [77.591, 19.903],
            [77.610, 19.898]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Palar River Headwater Stream (WS-006)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.195, 13.355],
            [78.214, 13.342],
            [78.222, 13.336],
            [78.240, 13.328]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Banganga Drainage Corridor (WS-007)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.555, 27.060],
            [76.571, 27.048],
            [76.579, 27.041],
            [76.595, 27.032]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Narmada Tributary Forest Stream (WS-008)',
          order: 3
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [77.655, 22.800],
            [77.674, 22.783],
            [77.682, 22.775],
            [77.700, 22.765]
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
          name: 'Check Dam #12 Reservoir Retention Pool (WS-001)',
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
          name: 'Percolation Basin #601 Storage Pool (WS-006)',
          capacityM3: 75000,
          areaHa: 4.8
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [78.2085, 13.3465],
              [78.2120, 13.3460],
              [78.2115, 13.3435],
              [78.2080, 13.3440],
              [78.2085, 13.3465]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Silt Detention Dam #801 Forest Reservoir (WS-008)',
          capacityM3: 68000,
          areaHa: 5.2
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [77.6695, 22.7875],
              [77.6730, 22.7870],
              [77.6725, 22.7845],
              [77.6690, 22.7850],
              [77.6695, 22.7875]
            ]
          ]
        }
      }
    ]
  }
};

// ==========================================
// MOCK IMPACT ANALYSIS & CHANGE DETECTION DATASET
// ==========================================
export const MOCK_IMPACT_ANALYSIS: Record<string, ImpactAnalysisRecord> = {
  'CD-012': {
    interventionId: 'CD-012',
    watershedId: 'WS-001',
    locationName: 'CD-012 Intervention Zone (Alwar North Catchment)',
    coordinates: [27.5684, 76.6128],
    areaKm2: 2.4,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '18 March 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.38,
      vegetationPercent: 42,
      waterPresencePercent: 28,
      barrenAreaPercent: 31,
      healthScore: 58,
      waterSurfaceAreaKm2: 0.18,
      waterConfidence: 78,
      soilMoisture: 'Low (14.2%)',
      erosionRisk: 'HIGH',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '22 March 2026',
      image: '/assets/evidence/watershed-post-monsoon.jpg',
      ndvi: 0.51,
      vegetationPercent: 61,
      waterPresencePercent: 47,
      barrenAreaPercent: 19,
      healthScore: 76,
      waterSurfaceAreaKm2: 0.31,
      waterConfidence: 94,
      soilMoisture: 'Optimal (28.6%)',
      erosionRisk: 'MODERATE',
    },
    lulc: {
      before: {
        water: 8,
        vegetation: 42,
        agriculture: 19,
        barren: 31,
      },
      after: {
        water: 15,
        vegetation: 61,
        agriculture: 18,
        barren: 19,
      },
    },
    fieldEvidenceIds: ['EVD-101', 'EVD-102'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Pre-construction dry ephemeral nullah bed with exposed fractured bedrock (March 2022)',
        date: '18 Mar 2022'
      },
      after: {
        url: '/assets/evidence/cd012-upstream-checkdam.jpg',
        caption: 'Post-construction active reservoir ponding behind 12,000 m³ masonry check dam weir (March 2026)',
        date: '22 Mar 2026'
      }
    },
    timeline: [
      {
        year: '2022',
        stage: 'Baseline Assessment',
        title: 'Pre-Construction Hydrological Baseline',
        description: 'Multi-spectral Sentinel-2 baseline survey recorded 0.38 NDVI with high seasonal gully erosion risk.',
        badge: 'BASELINE'
      },
      {
        year: '2023',
        stage: 'Intervention Constructed',
        title: 'Check Dam #12 Commissioning',
        description: 'Completed stone masonry check dam with 12,000 m³ design retention volume and downstream apron.',
        badge: 'CONSTRUCTED'
      },
      {
        year: '2024',
        stage: 'First Monitoring',
        title: 'Post-Monsoon Recharge Verification',
        description: 'Registered 34% increase in localized soil moisture and first perennial buffer greening.',
        badge: 'MONITORED'
      },
      {
        year: '2025',
        stage: 'Follow-up Inspection',
        title: 'Field Audit & Silt Evaluation',
        description: 'Field officer confirmed intact weir wall and healthy downstream riparian corridor.',
        badge: 'AUDITED'
      },
      {
        year: '2026',
        stage: 'Current Assessment',
        title: '4-Year Impact Verification',
        description: 'Comprehensive satellite change detection confirms +18 points health improvement and +19 pp vegetation gain.',
        badge: 'VERIFIED'
      }
    ],
    fieldCorrelation: [
      {
        metric: 'Vegetation Greenness',
        satelliteObservation: 'Sentinel-2 NDVI increased from 0.38 to 0.51 (+0.13, +19 pp vegetation coverage).',
        fieldFinding: 'Field survey (EVD-101 / EVD-102) confirmed dense riparian tree and shrub regeneration across channel banks.',
        consistency: 'CONSISTENT',
        interpretation: 'Satellite and field evidence are directionally consistent: on-ground canopy establishment corroborates the detected spectral greenness increase.'
      },
      {
        metric: 'Surface Water Retention',
        satelliteObservation: 'Surface water index (NDWI) and detected surface area increased from 0.18 km² to 0.31 km² (+72%).',
        fieldFinding: 'Field inspection confirmed sustained 1.8m upstream ponding depth 4 months post-monsoon.',
        consistency: 'CONSISTENT',
        interpretation: 'Satellite and field evidence are directionally consistent: water impoundment observed in field matches optical surface water extent.'
      },
      {
        metric: 'Erosion & Silt Retention',
        satelliteObservation: 'Barren and degraded soil footprint decreased from 31% to 19% (-12 pp).',
        fieldFinding: 'Sediment trap silt retention functioning as designed with minimal scour around keying trenches.',
        consistency: 'CONSISTENT',
        interpretation: 'Satellite and field evidence are directionally consistent: reduction in bare rock reflectance corresponds to stabilized silt terraces.'
      }
    ],
    impactScore: 18,
    classification: 'SIGNIFICANT_IMPROVEMENT',
    aiInterpretation: {
      summary: 'Vegetation indicators show an improvement from 42% to 61% (+19 pp) and surface water presence increased from 28% to 47% (+19 pp). Barren/degraded area decreased from 31% to 19% (-12 pp). Mean NDVI increased from 0.38 to 0.51 (+0.13). The observed multi-spectral indicators suggest positive ecological and hydrological improvement within the intervention influence zone.',
      confidence: 89,
      disclaimer: 'AI-assisted interpretation based on multi-temporal Sentinel-2 imagery and field audit records. Observed spectral changes describe environmental conditions over time and require continuous on-ground validation.',
    },
    recommendations: [
      'Continue scheduled bi-annual silt clearance and periodic spillway maintenance.',
      'Maintain community water user group monitoring for downstream recharge wells.',
      'Conduct next high-resolution UAV survey prior to onset of 2026 monsoon.'
    ]
  },

  'CD-501': {
    interventionId: 'CD-501',
    watershedId: 'WS-005',
    locationName: 'Pusad Sub-Catchment (WS-005 Vidarbha)',
    coordinates: [19.9140, 77.5680],
    areaKm2: 3.1,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '10 Feb 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.41,
      vegetationPercent: 45,
      waterPresencePercent: 22,
      barrenAreaPercent: 28,
      healthScore: 62,
      waterSurfaceAreaKm2: 0.20,
      waterConfidence: 80,
      soilMoisture: 'Moderate (18.1%)',
      erosionRisk: 'HIGH',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '15 Feb 2026',
      image: '/assets/evidence/watershed-post-monsoon.jpg',
      ndvi: 0.58,
      vegetationPercent: 68,
      waterPresencePercent: 41,
      barrenAreaPercent: 14,
      healthScore: 84,
      waterSurfaceAreaKm2: 0.38,
      waterConfidence: 95,
      soilMoisture: 'High (32.4%)',
      erosionRisk: 'LOW',
    },
    lulc: {
      before: { water: 7, vegetation: 45, agriculture: 20, barren: 28 },
      after: { water: 16, vegetation: 68, agriculture: 18, barren: 14 }
    },
    fieldEvidenceIds: ['EVD-501', 'EVD-502'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Baseline eroded channel in black cotton soil (2022)',
        date: '10 Feb 2022'
      },
      after: {
        url: '/assets/evidence/evidence_desiltation_site.jpg',
        caption: 'Post-intervention desilted basin with masonry check weir (2026)',
        date: '15 Feb 2026'
      }
    },
    timeline: [
      { year: '2022', stage: 'Baseline', title: 'Catchment Survey', description: 'Deep gully erosion and rapid monsoon runoff noted.' },
      { year: '2023', stage: 'Construction', title: 'Masonry Check Dam Built', description: 'Check dam with silt detention basin installed.' },
      { year: '2025', stage: 'Monitoring', title: 'Riparian Zone Greening', description: 'Significant increase in agricultural soil moisture.' },
      { year: '2026', stage: 'Impact Assessed', title: '4-Year Impact Verification', description: '+22 points health improvement verified by field audit.' }
    ],
    fieldCorrelation: [
      {
        metric: 'Vegetation Index',
        satelliteObservation: 'NDVI improved +0.17 with +23 pp vegetation cover.',
        fieldFinding: 'Healthy field crops and stabilized earthen bunds verified on ground.',
        consistency: 'CONSISTENT',
        interpretation: 'Directionally consistent: satellite spectral index aligns with field crop biomass.'
      }
    ],
    impactScore: 22,
    classification: 'SIGNIFICANT_IMPROVEMENT',
    aiInterpretation: {
      summary: 'Observed indicators demonstrate robust environmental enhancement (+22 points health index, +23 pp vegetation). High surface water retention observed.',
      confidence: 91,
      disclaimer: 'AI-assisted interpretation based on multi-temporal Sentinel-2 imagery. Requires field verification.',
    },
    recommendations: [
      'Maintain annual pre-monsoon desilting schedule.',
      'Sustain vegetative contour stabilization along upper ridge lines.'
    ]
  },

  'PT-601': {
    interventionId: 'PT-601',
    watershedId: 'WS-006',
    locationName: 'Srinivaspur Valley (WS-006 Deccan Plateau)',
    coordinates: [13.3450, 78.2100],
    areaKm2: 2.8,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '05 Jan 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.44,
      vegetationPercent: 48,
      waterPresencePercent: 30,
      barrenAreaPercent: 24,
      healthScore: 65,
      waterSurfaceAreaKm2: 0.22,
      waterConfidence: 82,
      soilMoisture: 'Moderate (17.5%)',
      erosionRisk: 'MODERATE',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '12 Jan 2026',
      image: '/assets/evidence/watershed-post-monsoon.jpg',
      ndvi: 0.60,
      vegetationPercent: 70,
      waterPresencePercent: 52,
      barrenAreaPercent: 12,
      healthScore: 86,
      waterSurfaceAreaKm2: 0.42,
      waterConfidence: 96,
      soilMoisture: 'Optimal (31.0%)',
      erosionRisk: 'LOW',
    },
    lulc: {
      before: { water: 10, vegetation: 48, agriculture: 18, barren: 24 },
      after: { water: 18, vegetation: 70, agriculture: 16, barren: 12 }
    },
    fieldEvidenceIds: ['EVD-601', 'EVD-602'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Dry semi-arid granitic plateau baseline (2022)',
        date: '05 Jan 2022'
      },
      after: {
        url: '/assets/evidence/evidence_percolation_tank.jpg',
        caption: 'Rejuvenated cascading percolation tank holding water (2026)',
        date: '12 Jan 2026'
      }
    },
    timeline: [
      { year: '2022', stage: 'Baseline', title: 'Hydro-Geological Assessment', description: 'Over-exploited groundwater zone identified in hard rock granite.' },
      { year: '2023', stage: 'Construction', title: 'Cascade Tank De-silting', description: 'Restoration of cascading tank bunds and recharge shafts.' },
      { year: '2026', stage: 'Impact Assessed', title: 'Impact Verification', description: 'Groundwater table rise of 2.1m noted in surrounding open wells.' }
    ],
    fieldCorrelation: [
      {
        metric: 'Groundwater & Water Index',
        satelliteObservation: 'NDWI and water presence increased by +22 pp with sustained post-monsoon storage.',
        fieldFinding: 'Percolation tank cascade observed with full storage pool connecting downstream units.',
        consistency: 'CONSISTENT',
        interpretation: 'Directionally consistent: satellite surface water detection confirms field hydrological recharge.'
      }
    ],
    impactScore: 21,
    classification: 'SIGNIFICANT_IMPROVEMENT',
    aiInterpretation: {
      summary: 'Percolation tank cascade rejuvenation correlates with +21 point health improvement and +22 pp surface water expansion in Deccan hard rock terrain.',
      confidence: 93,
      disclaimer: 'AI-assisted interpretation. Requires field verification.',
    },
    recommendations: [
      'Expand recharge shaft monitoring network.',
      'Promote micro-irrigation in zone of influence.'
    ]
  },

  'PT-301': {
    interventionId: 'PT-301',
    watershedId: 'WS-003',
    locationName: 'Bijawar Basin (WS-003 Bundelkhand)',
    coordinates: [24.6380, 79.4820],
    areaKm2: 3.5,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '14 Feb 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.33,
      vegetationPercent: 35,
      waterPresencePercent: 18,
      barrenAreaPercent: 38,
      healthScore: 55,
      waterSurfaceAreaKm2: 0.12,
      waterConfidence: 75,
      soilMoisture: 'Low (11.0%)',
      erosionRisk: 'HIGH',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '20 Feb 2026',
      image: '/assets/evidence/watershed-post-monsoon.jpg',
      ndvi: 0.42,
      vegetationPercent: 44,
      waterPresencePercent: 28,
      barrenAreaPercent: 26,
      healthScore: 64,
      waterSurfaceAreaKm2: 0.22,
      waterConfidence: 88,
      soilMoisture: 'Moderate (21.5%)',
      erosionRisk: 'MODERATE',
    },
    lulc: {
      before: { water: 5, vegetation: 35, agriculture: 22, barren: 38 },
      after: { water: 10, vegetation: 44, agriculture: 20, barren: 26 }
    },
    fieldEvidenceIds: ['EVD-301', 'EVD-302'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Degraded scrubland with high surface runoff (2022)',
        date: '14 Feb 2022'
      },
      after: {
        url: '/assets/evidence/evidence_percolation_tank.jpg',
        caption: 'Percolation tank holding runoff with stone riprap (2026)',
        date: '20 Feb 2026'
      }
    },
    timeline: [
      { year: '2022', stage: 'Baseline', title: 'Bundelkhand Drought Survey', description: 'Severe water deficit and shallow soil profile recorded.' },
      { year: '2023', stage: 'Construction', title: 'Percolation Tank Excavated', description: 'Excavation of 25,000 m³ capacity earthen percolation tank.' },
      { year: '2026', stage: 'Impact Assessed', title: 'Impact Verification', description: 'Positive +9 point improvement in overall watershed health index.' }
    ],
    fieldCorrelation: [
      {
        metric: 'Vegetation & Soil Moisture',
        satelliteObservation: 'NDVI improved from 0.33 to 0.42 (+0.09).',
        fieldFinding: 'Field audit noted soil moisture extension 300m downstream of tank.',
        consistency: 'CONSISTENT',
        interpretation: 'Directionally consistent: modest positive gain in vegetation and soil water.'
      }
    ],
    impactScore: 9,
    classification: 'POSITIVE_IMPROVEMENT',
    aiInterpretation: {
      summary: 'Moderate positive improvement (+9 points health score, +9 pp vegetation) observed in drought-prone Bundelkhand terrain.',
      confidence: 86,
      disclaimer: 'AI-assisted interpretation. Requires field verification.',
    },
    recommendations: [
      'Implement upstream gully plugs to reduce silt loading into percolation tank.',
      'Schedule follow-up field inspection within 90 days.'
    ]
  },

  'FP-401': {
    interventionId: 'FP-401',
    watershedId: 'WS-004',
    locationName: 'Ausa Block Catchment (WS-004 Marathwada)',
    coordinates: [18.2580, 76.5120],
    areaKm2: 2.2,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '20 Mar 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.36,
      vegetationPercent: 38,
      waterPresencePercent: 20,
      barrenAreaPercent: 34,
      healthScore: 56,
      waterSurfaceAreaKm2: 0.14,
      waterConfidence: 76,
      soilMoisture: 'Low (12.8%)',
      erosionRisk: 'HIGH',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '25 Mar 2026',
      image: '/assets/evidence/watershed-post-monsoon.jpg',
      ndvi: 0.48,
      vegetationPercent: 52,
      waterPresencePercent: 36,
      barrenAreaPercent: 22,
      healthScore: 70,
      waterSurfaceAreaKm2: 0.25,
      waterConfidence: 91,
      soilMoisture: 'Moderate (24.2%)',
      erosionRisk: 'MODERATE',
    },
    lulc: {
      before: { water: 6, vegetation: 38, agriculture: 22, barren: 34 },
      after: { water: 12, vegetation: 52, agriculture: 20, barren: 22 }
    },
    fieldEvidenceIds: ['EVD-401', 'EVD-402'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Rainfed agricultural zone baseline (2022)',
        date: '20 Mar 2022'
      },
      after: {
        url: '/assets/evidence/evidence_farmpond_filled.jpg',
        caption: 'Lined farm pond with stored rainwater supporting rabi crops (2026)',
        date: '25 Mar 2026'
      }
    },
    timeline: [
      { year: '2022', stage: 'Baseline', title: 'Marathwada Drought Assessment', description: 'Acute agricultural water stress during post-monsoon rabi season.' },
      { year: '2023', stage: 'Construction', title: 'Farm Pond Cluster', description: 'Excavation of 4 lined farm ponds across participatory farmer plots.' },
      { year: '2026', stage: 'Impact Assessed', title: 'Impact Verification', description: '+14 points health score gain and reliable supplementary irrigation.' }
    ],
    fieldCorrelation: [
      {
        metric: 'Crop Moisture',
        satelliteObservation: 'Vegetation cover expanded from 38% to 52% (+14 pp).',
        fieldFinding: 'Farmers reported two full protective irrigations during dry spells.',
        consistency: 'CONSISTENT',
        interpretation: 'Directionally consistent: farm pond water storage enables extended crop greenness.'
      }
    ],
    impactScore: 14,
    classification: 'POSITIVE_IMPROVEMENT',
    aiInterpretation: {
      summary: 'Farm pond cluster intervention demonstrates positive improvement (+14 points health score, +16 pp water presence) supporting rabi crop resilience.',
      confidence: 88,
      disclaimer: 'AI-assisted interpretation. Requires field verification.',
    },
    recommendations: [
      'Maintain plastic lining inspection against UV degradation.',
      'Promote solar pump linkage for efficient micro-drip distribution.'
    ]
  },

  'CD-801': {
    interventionId: 'CD-801',
    watershedId: 'WS-008',
    locationName: 'Budni Forest Sub-Catchment (WS-008 Central India)',
    coordinates: [22.7840, 77.6710],
    areaKm2: 4.2,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '15 Apr 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.52,
      vegetationPercent: 62,
      waterPresencePercent: 32,
      barrenAreaPercent: 18,
      healthScore: 74,
      waterSurfaceAreaKm2: 0.28,
      waterConfidence: 85,
      soilMoisture: 'Moderate (22.0%)',
      erosionRisk: 'MODERATE',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '20 Apr 2026',
      image: '/assets/evidence/watershed-post-monsoon.jpg',
      ndvi: 0.68,
      vegetationPercent: 78,
      waterPresencePercent: 48,
      barrenAreaPercent: 8,
      healthScore: 90,
      waterSurfaceAreaKm2: 0.46,
      waterConfidence: 97,
      soilMoisture: 'High (34.5%)',
      erosionRisk: 'LOW',
    },
    lulc: {
      before: { water: 12, vegetation: 62, agriculture: 8, barren: 18 },
      after: { water: 20, vegetation: 78, agriculture: 7, barren: 8 }
    },
    fieldEvidenceIds: ['EVD-801', 'EVD-802', 'EVD-803'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Forest fringe stream with seasonal flash floods (2022)',
        date: '15 Apr 2022'
      },
      after: {
        url: '/assets/evidence/evidence_stream_restoration.jpg',
        caption: 'Restored perennial riparian stream with boulder-pitched weir (2026)',
        date: '20 Apr 2026'
      }
    },
    timeline: [
      { year: '2022', stage: 'Baseline', title: 'Forest Stream Baseline', description: 'Pre-monsoon dry season stream survey.' },
      { year: '2023', stage: 'Construction', title: 'Silt Detention Dam Built', description: 'Composite boulder & masonry silt dam commissioned.' },
      { year: '2026', stage: 'Impact Assessed', title: '4-Year Impact Verification', description: '+16 points health improvement with perennial stream flow restored.' }
    ],
    fieldCorrelation: [
      {
        metric: 'Canopy Density',
        satelliteObservation: 'NDVI reached 0.68 with dense forest canopy reflectance.',
        fieldFinding: 'Wildlife presence and perennial spring discharge verified by forest guard.',
        consistency: 'CONSISTENT',
        interpretation: 'Directionally consistent: high spectral biomass verified on ground.'
      }
    ],
    impactScore: 16,
    classification: 'SIGNIFICANT_IMPROVEMENT',
    aiInterpretation: {
      summary: 'Forest catchment intervention showcases significant improvement (+16 points health score, +16 pp vegetation, +16 pp water surface area) stabilizing natural wildlife watering holes.',
      confidence: 94,
      disclaimer: 'AI-assisted interpretation. Requires field verification.',
    },
    recommendations: [
      'Maintain wildlife corridor access paths.',
      'Conduct periodic camera trap biodiversity monitoring.'
    ]
  },

  'CD-015': {
    interventionId: 'CD-015',
    watershedId: 'WS-001',
    locationName: 'Alwar North Catchment - Check Dam #15 (WS-001)',
    coordinates: [27.5740, 76.6190],
    areaKm2: 1.8,
    dataClassification: 'DEMO_DATA',
    before: {
      periodLabel: '2022 Baseline Assessment',
      date: '18 March 2022',
      image: '/assets/evidence/watershed-pre-construction.jpg',
      ndvi: 0.45,
      vegetationPercent: 50,
      waterPresencePercent: 32,
      barrenAreaPercent: 24,
      healthScore: 68,
      waterSurfaceAreaKm2: 0.22,
      waterConfidence: 81,
      soilMoisture: 'Moderate (19.4%)',
      erosionRisk: 'MODERATE',
    },
    after: {
      periodLabel: '2026 Current Assessment',
      date: '22 March 2026',
      image: '/assets/evidence/cd015-silt-checkdam.jpg',
      ndvi: 0.40,
      vegetationPercent: 45,
      waterPresencePercent: 26,
      barrenAreaPercent: 29,
      healthScore: 61,
      waterSurfaceAreaKm2: 0.16,
      waterConfidence: 83,
      soilMoisture: 'Low (14.8%)',
      erosionRisk: 'HIGH',
    },
    lulc: {
      before: { water: 10, vegetation: 50, agriculture: 16, barren: 24 },
      after: { water: 7, vegetation: 45, agriculture: 19, barren: 29 }
    },
    fieldEvidenceIds: ['EVD-103'],
    fieldPhotos: {
      before: {
        url: '/assets/evidence/watershed-pre-construction.jpg',
        caption: 'Baseline upstream stream channel prior to heavy silt loading (2022)',
        date: '18 Mar 2022'
      },
      after: {
        url: '/assets/evidence/cd015-silt-checkdam.jpg',
        caption: 'Silt deposition near inlet notch causing flow deflection and water loss (2026)',
        date: '22 Mar 2026'
      }
    },
    timeline: [
      { year: '2022', stage: 'Baseline', title: 'Initial Basin Baseline', description: 'Functional runoff basin with moderate capacity.' },
      { year: '2023', stage: 'Construction', title: 'Check Dam #15 Built', description: 'Masonry structure built.' },
      { year: '2026', stage: 'Monitoring Anomaly', title: 'Siltation Flagged', description: 'Decline in water retention detected due to 68% silt basin choking.' }
    ],
    fieldCorrelation: [
      {
        metric: 'Water Retention Deficit',
        satelliteObservation: 'NDWI dropped with water surface shrinking from 0.22 km² to 0.16 km² (-27%).',
        fieldFinding: 'Field inspection confirmed severe silt sedimentation choking storage capacity.',
        consistency: 'CONSISTENT',
        interpretation: 'Directionally consistent: spectral water reduction matches physical silt buildup.'
      }
    ],
    impactScore: -7,
    classification: 'NEGATIVE_TREND',
    aiInterpretation: {
      summary: 'Observed indicators indicate a negative trend (-7 points health score, -6 pp water presence) primarily driven by heavy silt accumulation obstructing inlet notches.',
      confidence: 87,
      disclaimer: 'AI-assisted interpretation. Requires field verification.',
    },
    recommendations: [
      'Urgent mechanical desiltation required before next monsoon season.',
      'Deploy upstream silt trapping gully plugs in feeder torrents.'
    ]
  }
};

// ==========================================
// IMPACT ANALYSIS HELPER UTILITIES
// ==========================================
export const classifyImpactScore = (delta: number): ImpactClassification => {
  if (delta >= 15) return 'SIGNIFICANT_IMPROVEMENT';
  if (delta >= 5) return 'POSITIVE_IMPROVEMENT';
  if (delta >= -4) return 'MINIMAL_CHANGE';
  if (delta >= -14) return 'NEGATIVE_TREND';
  return 'SIGNIFICANT_DEGRADATION';
};

export const getImpactClassificationMeta = (classification: ImpactClassification) => {
  switch (classification) {
    case 'SIGNIFICANT_IMPROVEMENT':
      return {
        label: 'Significant Improvement',
        shortLabel: 'Significant',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        badgeStatus: 'HEALTHY' as const,
        description: 'Multi-spectral vegetation, water retention, and ground health show major positive gains.'
      };
    case 'POSITIVE_IMPROVEMENT':
      return {
        label: 'Positive Improvement',
        shortLabel: 'Positive',
        color: 'text-teal-400',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/30',
        badgeStatus: 'HEALTHY' as const,
        description: 'Measurable improvement in catchment vegetation vigour and localized water storage.'
      };
    case 'MINIMAL_CHANGE':
      return {
        label: 'Minimal Change',
        shortLabel: 'Stable',
        color: 'text-slate-300',
        bg: 'bg-slate-800/60',
        border: 'border-slate-700',
        badgeStatus: 'MODERATE' as const,
        description: 'Environmental indicators remain stable within normal seasonal baseline fluctuations.'
      };
    case 'NEGATIVE_TREND':
      return {
        label: 'Negative Trend',
        shortLabel: 'Needs Review',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        badgeStatus: 'MODERATE' as const,
        description: 'Observed drop in water retention or vegetation vigour requiring field inspection.'
      };
    case 'SIGNIFICANT_DEGRADATION':
      return {
        label: 'Significant Degradation',
        shortLabel: 'Degraded',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        badgeStatus: 'CRITICAL' as const,
        description: 'Critical decline in watershed integrity requiring immediate engineering intervention.'
      };
  }
};

export const getImpactAnalysis = (interventionId: string): ImpactAnalysisRecord | undefined => {
  return MOCK_IMPACT_ANALYSIS[interventionId] || MOCK_IMPACT_ANALYSIS['CD-012'];
};

export const getAllImpactAnalyses = (): ImpactAnalysisRecord[] => {
  return Object.values(MOCK_IMPACT_ANALYSIS);
};

export const getNationalImpactSummary = () => {
  const records = getAllImpactAnalyses();
  const totalAssessed = records.length;
  const significantGain = records.filter((r) => r.classification === 'SIGNIFICANT_IMPROVEMENT').length;
  const positiveGain = records.filter((r) => r.classification === 'POSITIVE_IMPROVEMENT').length;
  const positiveImpact = significantGain + positiveGain;
  const minimalChange = records.filter((r) => r.classification === 'MINIMAL_CHANGE').length;
  const needsReview = records.filter((r) => r.classification === 'NEGATIVE_TREND' || r.classification === 'SIGNIFICANT_DEGRADATION').length;
  const averageImprovement = Number(
    (records.reduce((acc, curr) => acc + curr.impactScore, 0) / (totalAssessed || 1)).toFixed(1)
  );

  return {
    totalAssessed,
    positiveImpact,
    minimalChange,
    needsReview,
    averageImprovement,
    avgHealthImprovement: averageImprovement,
    records
  };
};

