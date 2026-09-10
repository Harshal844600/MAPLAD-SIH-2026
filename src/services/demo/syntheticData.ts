// ==============================================================================
// MPLAD SENTINEL — REALISTIC SYNTHETIC DATASET (1000+ PROJECTS & FLAGSHIP SCENARIOS)
// ==============================================================================

import {
  AuditLogRecord,
  DocumentRecord,
  InvestigationCase,
  InvestigationNote,
  ProjectEntity,
  TransactionRecord,
  UserProfile,
  VendorInfo,
} from '../../types';

export const CURRENT_DEMO_USER: UserProfile = {
  id: 'usr-officer-001',
  email: 'investigator.nodal@nic.in',
  full_name: 'Dr. Rameshwar Sharma, IAS',
  role: 'SUPER_ADMIN',
  state_id: 'st-up',
  state_name: 'Uttar Pradesh',
  district_id: 'dist-pry',
  district_name: 'Prayagraj',
  designation: 'Principal Director of Audits & Inspections',
  department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
};

export const DEMO_STATES = [
  { id: 'st-up', code: 'UP', name: 'Uttar Pradesh' },
  { id: 'st-mh', code: 'MH', name: 'Maharashtra' },
  { id: 'st-br', code: 'BR', name: 'Bihar' },
  { id: 'st-tn', code: 'TN', name: 'Tamil Nadu' },
  { id: 'st-ka', code: 'KA', name: 'Karnataka' },
  { id: 'st-rj', code: 'RJ', name: 'Rajasthan' },
  { id: 'st-wb', code: 'WB', name: 'West Bengal' },
  { id: 'st-mp', code: 'MP', name: 'Madhya Pradesh' },
];

export const DEMO_DISTRICTS: Record<string, Array<{ id: string; name: string; lat: number; lon: number }>> = {
  'st-up': [
    { id: 'dist-pry', name: 'Prayagraj', lat: 25.4358, lon: 81.8463 },
    { id: 'dist-vns', name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
    { id: 'dist-lko', name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
    { id: 'dist-gkp', name: 'Gorakhpur', lat: 26.7606, lon: 83.3732 },
    { id: 'dist-knp', name: 'Kanpur Nagar', lat: 26.4499, lon: 80.3319 },
  ],
  'st-mh': [
    { id: 'dist-pun', name: 'Pune', lat: 18.5204, lon: 73.8567 },
    { id: 'dist-ngp', name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
    { id: 'dist-mum', name: 'Mumbai Suburban', lat: 19.076, lon: 72.8777 },
    { id: 'dist-nsk', name: 'Nashik', lat: 19.9975, lon: 73.7898 },
  ],
  'st-br': [
    { id: 'dist-pat', name: 'Patna', lat: 25.5941, lon: 85.1376 },
    { id: 'dist-gya', name: 'Gaya', lat: 24.7914, lon: 85.0002 },
    { id: 'dist-muz', name: 'Muzaffarpur', lat: 26.1209, lon: 85.3647 },
  ],
  'st-tn': [
    { id: 'dist-chn', name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { id: 'dist-cbe', name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
    { id: 'dist-mdu', name: 'Madurai', lat: 9.9252, lon: 78.1198 },
  ],
  'st-ka': [
    { id: 'dist-blr', name: 'Bengaluru Urban', lat: 12.9716, lon: 77.5946 },
    { id: 'dist-mys', name: 'Mysuru', lat: 12.2958, lon: 76.6394 },
  ],
  'st-rj': [
    { id: 'dist-jpr', name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { id: 'dist-jdh', name: 'Jodhpur', lat: 26.2389, lon: 73.0243 },
  ],
  'st-wb': [
    { id: 'dist-kol', name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { id: 'dist-hwh', name: 'Howrah', lat: 22.5958, lon: 88.2636 },
  ],
  'st-mp': [
    { id: 'dist-bpl', name: 'Bhopal', lat: 23.2599, lon: 77.4126 },
    { id: 'dist-ind', name: 'Indore', lat: 22.7196, lon: 75.8577 },
  ],
};

export const DEMO_VENDORS: VendorInfo[] = [
  {
    id: 'ven-apex',
    vendor_code: 'VEND-001',
    name: 'Apex Infrastructure & Heavy Works Ltd.',
    pan_number: 'AAACA1234F',
    gstin: '09AAACA1234F1Z5',
    registered_address: 'Plot 44, Industrial Area, Naini, Prayagraj, UP',
    state_name: 'Uttar Pradesh',
    district_name: 'Prayagraj',
    blacklisted: false,
    total_projects_count: 24,
    total_contract_value: 145000000,
    risk_index: 88,
  },
  {
    id: 'ven-bharat',
    vendor_code: 'VEND-002',
    name: 'Bharat Rural Engineering Works',
    pan_number: 'AABCB9876K',
    gstin: '09AABCB9876K1Z9',
    registered_address: 'Civil Lines, Varanasi, UP',
    state_name: 'Uttar Pradesh',
    district_name: 'Varanasi',
    blacklisted: false,
    total_projects_count: 8,
    total_contract_value: 32000000,
    risk_index: 22,
  },
  {
    id: 'ven-surya',
    vendor_code: 'VEND-003',
    name: 'Surya Ganga Water Solutions Pvt Ltd',
    pan_number: 'AACCW5544J',
    gstin: '09AACCW5544J1ZQ',
    registered_address: 'Gomti Nagar, Lucknow, UP',
    state_name: 'Uttar Pradesh',
    district_name: 'Lucknow',
    blacklisted: false,
    total_projects_count: 14,
    total_contract_value: 48000000,
    risk_index: 34,
  },
  {
    id: 'ven-vikas',
    vendor_code: 'VEND-004',
    name: 'Vikas Building Associates',
    pan_number: 'AADCV1122L',
    gstin: '27AADCV1122L1ZX',
    registered_address: 'Shivaji Nagar, Pune, MH',
    state_name: 'Maharashtra',
    district_name: 'Pune',
    blacklisted: false,
    total_projects_count: 11,
    total_contract_value: 52000000,
    risk_index: 18,
  },
  {
    id: 'ven-shell',
    vendor_code: 'VEND-005',
    name: 'Pragati Infraprojects (Suspended Entity)',
    pan_number: 'AAECP9900M',
    gstin: '10AAECP9900M1ZV',
    registered_address: 'Fraser Road, Patna, BR',
    state_name: 'Bihar',
    district_name: 'Patna',
    blacklisted: true,
    total_projects_count: 5,
    total_contract_value: 29000000,
    risk_index: 95,
  },
];

export const DEMO_CATEGORIES = [
  'Roads & Bridges',
  'Drinking Water & Sanitation',
  'Education & Skill Centers',
  'Public Health Infrastructure',
  'Community Centers & Halls',
  'Renewable Energy & Lighting',
];

// Seeded pseudo-random helper for deterministic generation
let seed = 42;
function pseudoRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// 1. Landmark Flagship Case: #MPLAD-10291
export const FLAGSHIP_PROJECT_10291: ProjectEntity = {
  id: 'proj-10291',
  project_code: 'MPLAD-10291',
  title: 'Construction of High-Tech Community Center & Digital Literacy Hall',
  description:
    'Two-story RCC community center with dedicated solar rooftop, digital classroom, and public auditorium in Phulpur block.',
  category_id: 'cat-comm',
  category_name: 'Community Centers & Halls',
  mp_id: 'mp-phulpur',
  mp_name: 'Smt. Keshari Devi Patel, Hon. MP (Lok Sabha)',
  constituency_id: 'const-phulpur',
  constituency_name: 'Phulpur (51)',
  district_id: 'dist-pry',
  district_name: 'Prayagraj',
  state_id: 'st-up',
  state_name: 'Uttar Pradesh',
  implementing_agency: 'Rural Engineering Services (RES), Division Prayagraj',
  vendor_id: 'ven-apex',
  vendor_name: 'Apex Infrastructure & Heavy Works Ltd.',
  status: 'IN_PROGRESS',
  sanctioned_amount: 4850000.0,
  released_amount: 4850000.0,
  utilized_amount: 4850000.0,
  sanction_date: '2024-03-15',
  start_date: '2024-04-01',
  expected_completion_date: '2024-11-30',
  actual_completion_date: '2024-02-28', // Anomaly: Completion predates sanction!
  latitude: 25.5482,
  longitude: 81.9834,
  location_name: 'Gram Panchayat Saidabad, Block Phulpur',
  risk_score: 91,
  risk_level: 'CRITICAL',
  anomalies_count: 5,
  open_investigations_count: 1,
  subscores: {
    financial: 94,
    timeline: 88,
    vendor: 92,
    geographic: 96,
    documents: 86,
    duplicate: 78,
  },
  is_demo: true,
  created_at: '2024-03-15T10:00:00Z',
  updated_at: '2026-09-01T08:30:00Z',
};

// Flagship Transactions for #MPLAD-10291
export const FLAGSHIP_TRANSACTIONS_10291: TransactionRecord[] = [
  {
    id: 'txn-10291-1',
    project_id: 'proj-10291',
    vendor_id: 'ven-apex',
    vendor_name: 'Apex Infrastructure & Heavy Works Ltd.',
    transaction_reference: 'PFMS/2024/TXN-88912',
    amount: 1820000.0,
    invoice_number: 'INV-APX-884',
    invoice_date: '2024-04-10',
    payment_date: '2024-04-15',
    payment_mode: 'PFMS e-Transfer',
    purpose: '1st Running Milestone: Excavation & Plinth Beam Construction',
  },
  {
    id: 'txn-10291-2',
    project_id: 'proj-10291',
    vendor_id: 'ven-apex',
    vendor_name: 'Apex Infrastructure & Heavy Works Ltd.',
    transaction_reference: 'PFMS/2024/TXN-91450',
    amount: 1820000.0,
    invoice_number: 'INV-APX-884', // Duplicate invoice reference!
    payment_date: '2024-04-28',
    payment_mode: 'PFMS e-Transfer',
    purpose: '2nd Milestone: Superstructure & Roof Slab (Duplicate Invoice Attached)',
  },
  {
    id: 'txn-10291-3',
    project_id: 'proj-10291',
    vendor_id: 'ven-apex',
    vendor_name: 'Apex Infrastructure & Heavy Works Ltd.',
    transaction_reference: 'PFMS/2024/TXN-98231',
    amount: 1210000.0,
    invoice_number: 'INV-APX-912',
    invoice_date: '2024-05-12',
    payment_date: '2024-05-20',
    payment_mode: 'PFMS e-Transfer',
    purpose: 'Final Milestone & Handover Clearing Bill',
  },
];

// Flagship Documents for #MPLAD-10291
export const FLAGSHIP_DOCUMENTS_10291: DocumentRecord[] = [
  {
    id: 'doc-10291-1',
    project_id: 'proj-10291',
    document_type: 'SANCTION_ORDER',
    file_name: 'Sanction_Order_Phulpur_2024_RES_485.pdf',
    file_size_bytes: 1420800,
    mime_type: 'application/pdf',
    uploaded_at: '2024-03-15T11:00:00Z',
    uploaded_by_name: 'Office of District Magistrate, Prayagraj',
    is_verified: true,
  },
  {
    id: 'doc-10291-2',
    project_id: 'proj-10291',
    document_type: 'INVOICE',
    file_name: 'Apex_Infra_Invoice_INV-APX-884_Scan.pdf',
    file_size_bytes: 890400,
    mime_type: 'application/pdf',
    uploaded_at: '2024-04-12T14:20:00Z',
    uploaded_by_name: 'Apex Infrastructure Billing Desk',
    is_verified: false,
    extraction: {
      extracted_vendor_name: 'Apex Infrastructure & Heavy Works Ltd.',
      extracted_amount: 1820000.0,
      extracted_date: '2024-03-01', // Date anomaly: Predates sanction!
      extracted_location: 'Saidabad, Phulpur',
      confidence: 0.96,
      mismatch_flags: ['DATE_PREDATING_SANCTION', 'DUPLICATE_USAGE_ON_TXN_91450'],
    },
  },
  {
    id: 'doc-10291-3',
    project_id: 'proj-10291',
    document_type: 'COMPLETION_CERTIFICATE',
    file_name: 'Completion_Cert_Phulpur_RES_Feb2024.pdf',
    file_size_bytes: 1120000,
    mime_type: 'application/pdf',
    uploaded_at: '2024-05-22T09:15:00Z',
    uploaded_by_name: 'Executive Engineer RES Prayagraj',
    is_verified: false,
    extraction: {
      extracted_vendor_name: 'Apex Infrastructure & Heavy Works Ltd.',
      extracted_date: '2024-02-28', // Impossible chronological sequence!
      confidence: 0.98,
      mismatch_flags: ['COMPLETION_PREDATES_GROUND_WORK'],
    },
  },
];

// Flagship Investigation for #MPLAD-10291
export const FLAGSHIP_INVESTIGATION_10291: InvestigationCase = {
  id: 'inv-10291',
  case_number: 'INV-2026-10291',
  project_id: 'proj-10291',
  project_code: 'MPLAD-10291',
  project_title: 'Construction of High-Tech Community Center & Digital Literacy Hall',
  title: 'Multi-Layer Investigation: Duplicate Disbursements & GPS Overlap in Phulpur Block',
  status: 'UNDER_REVIEW',
  priority: 'CRITICAL',
  assigned_officer_id: 'usr-officer-001',
  assigned_officer_name: 'Dr. Rameshwar Sharma, IAS',
  assigned_at: '2026-09-02T10:00:00Z',
  risk_score: 91,
  created_at: '2026-09-01T09:00:00Z',
  updated_at: '2026-09-06T10:30:00Z',
  evidence_count: 5,
  notes_count: 3,
};

export const FLAGSHIP_NOTES_10291: InvestigationNote[] = [
  {
    id: 'note-10291-1',
    investigation_id: 'inv-10291',
    author_id: 'usr-officer-001',
    author_name: 'Dr. Rameshwar Sharma, IAS',
    author_role: 'SUPER_ADMIN',
    note_text:
      'Preliminary algorithmic audit flagged 5 critical indicators. Satellite coordinate check at (25.54820° N, 81.98340° E) matches existing 2023 panchayat hall. Directing on-ground physical inspection team to verify site presence.',
    is_confidential: false,
    created_at: '2026-09-01T11:20:00Z',
  },
  {
    id: 'note-10291-2',
    investigation_id: 'inv-10291',
    author_id: 'usr-officer-001',
    author_name: 'Dr. Rameshwar Sharma, IAS',
    author_role: 'SUPER_ADMIN',
    note_text:
      'Bank transaction log cross-verification confirms Invoice #INV-APX-884 was paid out twice via PFMS. Treasury officer summoned for reconciliation records.',
    is_confidential: true,
    created_at: '2026-09-03T16:45:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'aud-001',
    sequence_number: 10482,
    actor_name: 'Dr. Rameshwar Sharma, IAS',
    actor_role: 'SUPER_ADMIN',
    action: 'INVESTIGATION_OPENED',
    entity_type: 'INVESTIGATION',
    entity_id: 'inv-10291',
    entity_label: 'INV-2026-10291 (Project #MPLAD-10291)',
    metadata: { reason: 'Algorithmic Critical Risk Score 91/100 threshold crossed' },
    ip_address: '10.24.18.91',
    tamper_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'aud-002',
    sequence_number: 10483,
    actor_name: 'Sentinel Risk Engine v1.4.2',
    actor_role: 'SYSTEM',
    action: 'RISK_RECALCULATED',
    entity_type: 'PROJECT',
    entity_id: 'proj-10291',
    entity_label: 'MPLAD-10291',
    metadata: {
      previousScore: 84,
      newScore: 91,
      trigger: 'Document OCR mismatch detected on INV-APX-884',
    },
    ip_address: '127.0.0.1',
    tamper_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    created_at: '2026-09-01T08:30:00Z',
  },
  {
    id: 'aud-003',
    sequence_number: 10484,
    actor_name: 'Dr. Rameshwar Sharma, IAS',
    actor_role: 'SUPER_ADMIN',
    action: 'NOTE_ATTACHED',
    entity_type: 'INVESTIGATION',
    entity_id: 'inv-10291',
    entity_label: 'INV-2026-10291',
    metadata: { confidential: true },
    ip_address: '10.24.18.91',
    tamper_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    created_at: '2026-09-03T16:45:00Z',
  },
];

// 2. Generate 1,000+ realistic synthetic projects across India
export function generateSyntheticProjects(count: number = 1000): ProjectEntity[] {
  const projects: ProjectEntity[] = [FLAGSHIP_PROJECT_10291];

  const projectPrefixes: Record<string, string[]> = {
    'Roads & Bridges': [
      'Construction of All-Weather CC Road with Drainage',
      'Upgradation of Rural Link Road to Bituminous Standard',
      'Construction of High-Level RCC Box Culvert and Approach',
      'Paving of Inter-Village Concrete Roadway',
    ],
    'Drinking Water & Sanitation': [
      'Installation of Solar-Powered RO Water Purification Plant',
      'Deep Borewell with Overhead Community Storage Tank',
      'Piped Drinking Water Supply Network & Community Taps',
      'Construction of Public Hygiene & Community Sanitation Complex',
    ],
    'Education & Skill Centers': [
      'Construction of Additional Classrooms & STEM Lab at Govt High School',
      'Setup of Smart Digital Classroom and Library Complex',
      'Youth Vocational Skill Development Center Facility',
      'Installation of Composite Science & Computer Laboratory',
    ],
    'Public Health Infrastructure': [
      'Primary Health Center (PHC) Infrastructure Modernization',
      'Procurement of Mobile Advanced Life Support Ambulance',
      'Diagnostic Pathology Laboratory & Maternity Ward Wing',
      'Sub-District Community Health Dispensary Facility',
    ],
    'Community Centers & Halls': [
      'Multipurpose Community Hall & Cultural Auditorium',
      'Panchayat Bhavan Extension and Citizen Service Kendra',
      'Gramin Barat Ghar and Public Welfare Pavilion',
      'Construction of Public Assembly Shed and Sports Ground Facility',
    ],
    'Renewable Energy & Lighting': [
      'Installation of 120 Integrated LED Solar Street Lights',
      'Rooftop Grid-Connected Solar Power System for Public School',
      'Solar-Powered Irrigation Micro-Grid Facility',
      'High-Mast Solar Lighting System for Rural Market Junction',
    ],
  };

  const statuses: ProjectEntity['status'][] = [
    'COMPLETED',
    'COMPLETED',
    'IN_PROGRESS',
    'IN_PROGRESS',
    'SANCTIONED',
    'TENDERED',
    'STALLED',
  ];

  for (let i = 1; i <= count; i++) {
    const codeNum = 10300 + i;
    const state = DEMO_STATES[Math.floor(pseudoRandom() * DEMO_STATES.length)];
    const districtList = DEMO_DISTRICTS[state.id] || DEMO_DISTRICTS['st-up'];
    const district = districtList[Math.floor(pseudoRandom() * districtList.length)];
    const category = DEMO_CATEGORIES[Math.floor(pseudoRandom() * DEMO_CATEGORIES.length)];
    const titleTemplateList = projectPrefixes[category];
    const baseTitle = titleTemplateList[Math.floor(pseudoRandom() * titleTemplateList.length)];
    const vendor = DEMO_VENDORS[Math.floor(pseudoRandom() * DEMO_VENDORS.length)];
    const status = statuses[Math.floor(pseudoRandom() * statuses.length)];

    // Random financial figures (₹5 Lakh to ₹95 Lakh)
    const baseAmount = Math.round(500000 + pseudoRandom() * 9000000);
    const sanctionedAmount = Math.round(baseAmount / 50000) * 50000;

    let releasedRatio = 0.5;
    let utilizedRatio = 0.3;

    if (status === 'COMPLETED') {
      releasedRatio = 1.0;
      utilizedRatio = 0.95 + pseudoRandom() * 0.05;
    } else if (status === 'IN_PROGRESS') {
      releasedRatio = 0.6 + pseudoRandom() * 0.4;
      utilizedRatio = releasedRatio * (0.6 + pseudoRandom() * 0.35);
    } else if (status === 'SANCTIONED' || status === 'TENDERED') {
      releasedRatio = pseudoRandom() * 0.3;
      utilizedRatio = releasedRatio * pseudoRandom() * 0.4;
    } else if (status === 'STALLED') {
      releasedRatio = 0.8;
      utilizedRatio = 0.78; // High draw with no completion
    }

    const releasedAmount = Math.round(sanctionedAmount * releasedRatio);
    const utilizedAmount = Math.round(releasedAmount * utilizedRatio);

    // Timeline
    const year = 2023 + Math.floor(pseudoRandom() * 3);
    const month = 1 + Math.floor(pseudoRandom() * 12);
    const day = 1 + Math.floor(pseudoRandom() * 28);
    const sanctionDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Geo jitter around district center
    const lat = Number((district.lat + (pseudoRandom() - 0.5) * 0.25).toFixed(5));
    const lon = Number((district.lon + (pseudoRandom() - 0.5) * 0.25).toFixed(5));

    // Anomaly & Risk distribution: 70% LOW, 18% MEDIUM, 8% HIGH, 4% CRITICAL
    const randRoll = pseudoRandom();
    let score = 12;
    let anomaliesCount = 0;

    if (randRoll > 0.96) {
      // Critical (80-98)
      score = Math.floor(80 + pseudoRandom() * 18);
      anomaliesCount = Math.floor(3 + pseudoRandom() * 3);
    } else if (randRoll > 0.88) {
      // High (60-79)
      score = Math.floor(60 + pseudoRandom() * 19);
      anomaliesCount = Math.floor(2 + pseudoRandom() * 2);
    } else if (randRoll > 0.70) {
      // Medium (30-59)
      score = Math.floor(30 + pseudoRandom() * 29);
      anomaliesCount = 1;
    } else {
      // Low (0-29)
      score = Math.floor(pseudoRandom() * 29);
      anomaliesCount = 0;
    }

    const riskLevel =
      score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';

    projects.push({
      id: `proj-${codeNum}`,
      project_code: `MPLAD-${codeNum}`,
      title: `${baseTitle} at Sector ${Math.floor(pseudoRandom() * 20) + 1}`,
      description: `Implementation of ${category.toLowerCase()} under MPLADS for constituency infrastructure development.`,
      category_id: `cat-${category.toLowerCase().replace(/[^a-z]/g, '')}`,
      category_name: category,
      mp_id: `mp-${district.id}`,
      mp_name: `Hon. MP (${district.name} Constituency)`,
      constituency_id: `const-${district.id}`,
      constituency_name: `${district.name} Parliamentary Constituency`,
      district_id: district.id,
      district_name: district.name,
      state_id: state.id,
      state_name: state.name,
      implementing_agency: `${district.name} Zilla Parishad Engineering Division`,
      vendor_id: vendor.id,
      vendor_name: vendor.name,
      status,
      sanctioned_amount: sanctionedAmount,
      released_amount: releasedAmount,
      utilized_amount: utilizedAmount,
      sanction_date: sanctionDate,
      start_date: `${year}-${String(Math.min(12, month + 1)).padStart(2, '0')}-01`,
      expected_completion_date: `${year + 1}-${String(month).padStart(2, '0')}-28`,
      actual_completion_date: status === 'COMPLETED' ? `${year + 1}-${String(month).padStart(2, '0')}-15` : undefined,
      latitude: lat,
      longitude: lon,
      location_name: `Village Block #${Math.floor(pseudoRandom() * 12) + 1}, ${district.name}`,
      risk_score: score,
      risk_level: riskLevel,
      anomalies_count: anomaliesCount,
      open_investigations_count: score >= 80 ? 1 : 0,
      subscores: {
        financial: Math.min(100, Math.round(score * (0.8 + pseudoRandom() * 0.4))),
        timeline: Math.min(100, Math.round(score * (0.7 + pseudoRandom() * 0.4))),
        vendor: Math.min(100, Math.round(score * (0.85 + pseudoRandom() * 0.3))),
        geographic: Math.min(100, Math.round(score * (0.6 + pseudoRandom() * 0.5))),
        documents: Math.min(100, Math.round(score * (0.75 + pseudoRandom() * 0.4))),
        duplicate: Math.min(100, Math.round(score * (0.5 + pseudoRandom() * 0.5))),
      },
      is_demo: true,
      created_at: `${sanctionDate}T09:00:00Z`,
      updated_at: '2026-09-01T00:00:00Z',
    });
  }

  return projects;
}

// 3. Realistic Dynamic Generators for any Project's Ledger Transactions & Archive Records
function getDeterministicHash(str: string, salt: number = 0): number {
  let hash = 0;
  const combined = `${str}_${salt}`;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
}

export function generateProjectTransactions(project: ProjectEntity): TransactionRecord[] {
  if (project.id === 'proj-10291' || project.project_code === 'MPLAD-10291') {
    return [...FLAGSHIP_TRANSACTIONS_10291];
  }

  const releasedAmount = project.released_amount || 0;
  if (releasedAmount <= 0) {
    return [];
  }

  const vendorName = project.vendor_name || 'Designated Infrastructure Contractor';
  const vendorId = project.vendor_id || 'ven-apex';
  const vendorCode = vendorName.split(' ')[0].substring(0, 4).toUpperCase();
  
  const sanctionYear = parseInt(project.sanction_date.substring(0, 4)) || 2024;
  const sanctionMonth = parseInt(project.sanction_date.substring(5, 7)) || 3;
  const sanctionDay = parseInt(project.sanction_date.substring(8, 10)) || 15;

  // Number of milestone payouts (2 to 4 based on amount)
  const isHighRisk = project.risk_score >= 80;
  const hasDuplicateRisk = project.subscores?.duplicate >= 65 || isHighRisk;
  const count = releasedAmount > 4000000 ? 3 : 2;

  const transactions: TransactionRecord[] = [];
  const ratios = count === 3 ? [0.4, 0.35, 0.25] : [0.6, 0.4];

  const milestonePurposes: Record<string, string[]> = {
    'Roads & Bridges': [
      '1st Milestone: Sub-grade Earthwork, Grading & Stone Base Pitching',
      '2nd Milestone: WBM Layering, Bituminous Macadam & Concrete Pavement',
      'Final Milestone: RCC Culvert Jointing, Drainage & Road Safety Markings',
    ],
    'Drinking Water & Sanitation': [
      '1st Milestone: Deep Hydro-geological Drilling & Borewell Casing',
      '2nd Milestone: RO Filtration Plant Installation & RCC Tank Erection',
      'Final Milestone: Solar PV Connection, Distribution Pipeline & Community Taps',
    ],
    'Education & Skill Centers': [
      '1st Milestone: Foundation Plinth, RCC Pillars & Ground Slab Laying',
      '2nd Milestone: Brick Masonry, Smart Audio-Visual Wiring & Roof Slab',
      'Final Milestone: Laboratory Fixtures, Interior Flooring, Paint & Handover',
    ],
    'Public Health Infrastructure': [
      '1st Milestone: Civil Foundation & Structural Framework Construction',
      '2nd Milestone: Pathology Diagnostic Lab Enclosure & Sterilization Bays',
      'Final Milestone: Medical Gas Pipeline, Solar Backup & Final Handover',
    ],
    'Community Centers & Halls': [
      '1st Milestone: Excavation, PCC Foundation & Plinth Beam Construction',
      '2nd Milestone: RCC Superstructure Columns, Masonry Walls & Roof Truss',
      'Final Milestone: Auditorium Acoustic Panel, Solar Rooftop & Electrical Clearing',
    ],
    'Renewable Energy & Lighting': [
      '1st Milestone: Procurement of Integrated Solar PV Panels & Battery Modules',
      '2nd Milestone: Structural Pole Erection & Micro-Grid Cabling Layout',
      'Final Milestone: Luminaires Testing, Grid Commissioning & Inspection Clearing',
    ],
  };

  const defaultPurposes = [
    '1st Milestone: Ground Survey, Initial Mobilization & Base Infrastructure',
    '2nd Milestone: Core Civil Works & Structural Construction Phase',
    'Final Milestone: Finishing, Quality Commissioning & Final Handover',
  ];

  const purposes = milestonePurposes[project.category_name] || defaultPurposes;
  const baseInvoiceNum = Math.floor(100 + getDeterministicHash(project.id, 1) * 899);

  for (let idx = 0; idx < count; idx++) {
    const isDuplicate = hasDuplicateRisk && idx === 1;
    const invNumber = isDuplicate
      ? `INV-${vendorCode}-${baseInvoiceNum}` // Identical to 1st milestone!
      : `INV-${vendorCode}-${baseInvoiceNum + idx * 17}`;

    const monthOffset = idx + 1;
    const calcMonth = ((sanctionMonth - 1 + monthOffset) % 12) + 1;
    const calcYear = sanctionYear + Math.floor((sanctionMonth - 1 + monthOffset) / 12);
    const day = Math.min(28, sanctionDay + idx * 3);
    const dateStr = `${calcYear}-${String(calcMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const invDateStr = `${calcYear}-${String(calcMonth).padStart(2, '0')}-${String(Math.max(1, day - 5)).padStart(2, '0')}`;

    const portion = idx === count - 1
      ? releasedAmount - transactions.reduce((acc, t) => acc + t.amount, 0)
      : Math.round((releasedAmount * ratios[idx]) / 1000) * 1000;

    const refHash = Math.floor(10000 + getDeterministicHash(project.id, idx + 10) * 89999);

    transactions.push({
      id: `txn-${project.id}-${idx + 1}`,
      project_id: project.id,
      vendor_id: vendorId,
      vendor_name: vendorName,
      transaction_reference: `PFMS/${calcYear}/TXN-${refHash}`,
      amount: Math.max(10000, portion),
      invoice_number: invNumber,
      invoice_date: invDateStr,
      payment_date: dateStr,
      payment_mode: 'PFMS e-Transfer',
      purpose: isDuplicate
        ? `${purposes[idx] || defaultPurposes[idx]} (Duplicate Invoice Reference Attached)`
        : purposes[idx] || defaultPurposes[idx],
    });
  }

  return transactions;
}

export function generateProjectDocuments(
  project: ProjectEntity,
  transactions: TransactionRecord[] = []
): DocumentRecord[] {
  if (project.id === 'proj-10291' || project.project_code === 'MPLAD-10291') {
    return [...FLAGSHIP_DOCUMENTS_10291];
  }

  const docs: DocumentRecord[] = [];
  const cleanCode = project.project_code.replace(/[^A-Za-z0-9]/g, '_');
  const districtClean = project.district_name.replace(/\s+/g, '_');
  const isHighRisk = project.risk_score >= 70;
  const isChronologyConflict = project.subscores?.timeline >= 70;

  // 1. Administrative Sanction Order
  docs.push({
    id: `doc-${project.id}-sanction`,
    project_id: project.id,
    document_type: 'SANCTION_ORDER',
    file_name: `Sanction_Order_${districtClean}_${cleanCode}_Gazette.pdf`,
    file_size_bytes: 1250000 + Math.floor(getDeterministicHash(project.id, 101) * 400000),
    mime_type: 'application/pdf',
    uploaded_at: `${project.sanction_date}T10:30:00Z`,
    uploaded_by_name: `Office of District Magistrate & Collector, ${project.district_name}`,
    is_verified: true,
    extraction: {
      extracted_vendor_name: project.vendor_name,
      extracted_amount: project.sanctioned_amount,
      extracted_date: project.sanction_date,
      extracted_location: project.location_name,
      confidence: 0.98,
    },
  });

  // 2. Inspection & Baseline Technical Survey Report
  docs.push({
    id: `doc-${project.id}-survey`,
    project_id: project.id,
    document_type: 'INSPECTION_REPORT',
    file_name: `DPR_Technical_Sanction_and_Site_Survey_${cleanCode}.pdf`,
    file_size_bytes: 2100000 + Math.floor(getDeterministicHash(project.id, 102) * 600000),
    mime_type: 'application/pdf',
    uploaded_at: `${project.start_date || project.sanction_date}T14:15:00Z`,
    uploaded_by_name: project.implementing_agency,
    is_verified: true,
    extraction: {
      extracted_vendor_name: project.vendor_name,
      extracted_amount: project.sanctioned_amount,
      extracted_location: `${project.latitude.toFixed(4)}° N, ${project.longitude.toFixed(4)}° E`,
      confidence: 0.96,
      mismatch_flags: project.subscores?.geographic >= 75 ? ['COORDINATE_PROXIMITY_BUFFER_OVERLAP_25M'] : undefined,
    },
  });

  // 3. Running Invoices matching generated transactions
  transactions.forEach((txn, idx) => {
    const isFlagged = isHighRisk && (idx === 1 || txn.invoice_number?.includes('INV-'));
    const flags: string[] = [];
    if (idx === 1 && isHighRisk) {
      flags.push('DUPLICATE_INVOICE_HASH_ON_PFMS');
    }
    if (isChronologyConflict && idx === 0) {
      flags.push('INVOICE_PREDATES_OFFICIAL_SANCTION');
    }

    docs.push({
      id: `doc-${project.id}-inv-${idx + 1}`,
      project_id: project.id,
      document_type: 'INVOICE',
      file_name: `Invoice_${txn.invoice_number}_${cleanCode}_Milestone${idx + 1}.pdf`,
      file_size_bytes: 840000 + Math.floor(getDeterministicHash(project.id, 200 + idx) * 350000),
      mime_type: 'application/pdf',
      uploaded_at: `${txn.payment_date}T11:00:00Z`,
      uploaded_by_name: `${project.vendor_name || 'Vendor'} Billing Desk`,
      is_verified: flags.length === 0,
      extraction: {
        extracted_vendor_name: txn.vendor_name,
        extracted_amount: txn.amount,
        extracted_date: txn.invoice_date || txn.payment_date,
        extracted_location: project.location_name,
        confidence: 0.95,
        mismatch_flags: flags.length > 0 ? flags : undefined,
      },
    });
  });

  // 4. Completion or Utilization Certificate
  if (project.status === 'COMPLETED' || project.utilized_amount > 0) {
    const isCompletionInverted = isChronologyConflict && project.actual_completion_date && project.actual_completion_date < project.sanction_date;
    docs.push({
      id: `doc-${project.id}-uc`,
      project_id: project.id,
      document_type: project.status === 'COMPLETED' ? 'COMPLETION_CERTIFICATE' : 'UTILIZATION_CERTIFICATE',
      file_name: project.status === 'COMPLETED'
        ? `Final_Handover_Completion_Certificate_${cleanCode}.pdf`
        : `Audited_Utilization_Certificate_GFR12C_${cleanCode}.pdf`,
      file_size_bytes: 1450000 + Math.floor(getDeterministicHash(project.id, 301) * 300000),
      mime_type: 'application/pdf',
      uploaded_at: `${project.actual_completion_date || project.updated_at.substring(0, 10)}T16:45:00Z`,
      uploaded_by_name: `Executive Engineer, ${project.implementing_agency}`,
      is_verified: !isCompletionInverted,
      extraction: {
        extracted_vendor_name: project.vendor_name,
        extracted_amount: project.utilized_amount,
        extracted_date: project.actual_completion_date || project.updated_at.substring(0, 10),
        confidence: 0.97,
        mismatch_flags: isCompletionInverted ? ['COMPLETION_PREDATES_GROUND_WORK', 'CHRONOLOGICAL_INVERSION'] : undefined,
      },
    });
  }

  return docs;
}
