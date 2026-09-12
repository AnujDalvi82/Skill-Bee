// UCI Higher Education Student Performance & Early-Warning Risk Dataset
// Models student academic risk and failure probability P_fail before exams

import { StudentTriageRecord, CohortOverview } from '@/lib/types';

export const COHORT_MOCK_DATA: StudentTriageRecord[] = [
  {
    id: 'stud-001',
    name: 'Rohan Verma',
    rollNo: '22CS084',
    avatar: 'RV',
    tier: 'RED',
    pFailMidterm: 0.78,       // 78% failure risk
    attendanceRate: 0.62,
    currentDwellFriction: 'CRITICAL',
    primaryBlockerConcept: 'Matrix Inversion & Determinants',
    suggestedPeerId: 'stud-012',
    suggestedPeerName: 'Ananya Sen',
    hoursSpentWeekly: 3.5,
    lastActiveHoursAgo: 26,
    latent_theta: -1.45,
    friction_index: 0.82,
    xai_attribution: {
      calculus_decay_pct: 44.5,
      telemetry_friction_pct: 38.2,
      attendance_decay_pct: 17.3
    },
    office_hour_script: 'Focus 10-min remedial review on Matrix Inversion row-reduction step. Recommend 2D visual determinant simulation.'
  },
  {
    id: 'stud-002',
    name: 'Priya Nair',
    rollNo: '22CS091',
    avatar: 'PN',
    tier: 'RED',
    pFailMidterm: 0.82,       // 82% failure risk
    attendanceRate: 0.58,
    currentDwellFriction: 'CRITICAL',
    primaryBlockerConcept: 'Multivariable Chain Rule',
    suggestedPeerId: 'stud-007',
    suggestedPeerName: 'Devansh Roy',
    hoursSpentWeekly: 2.8,
    lastActiveHoursAgo: 48,
    latent_theta: -1.68,
    friction_index: 0.88,
    xai_attribution: {
      calculus_decay_pct: 51.0,
      telemetry_friction_pct: 32.5,
      attendance_decay_pct: 16.5
    },
    office_hour_script: 'Chain rule nested partial derivatives breakdown. Student experiences cognitive block after 3rd nested Jacobian.'
  },
  {
    id: 'stud-003',
    name: 'Kabir Mehta',
    rollNo: '22CS045',
    avatar: 'KM',
    tier: 'AMBER',
    pFailMidterm: 0.44,       // 44% friction
    attendanceRate: 0.76,
    currentDwellFriction: 'NORMAL',
    primaryBlockerConcept: 'Eigenvalues & Vectors',
    suggestedPeerId: 'stud-012',
    suggestedPeerName: 'Ananya Sen',
    hoursSpentWeekly: 6.2,
    lastActiveHoursAgo: 8,
    latent_theta: 0.12,
    friction_index: 0.45,
    xai_attribution: {
      calculus_decay_pct: 32.0,
      telemetry_friction_pct: 45.0,
      attendance_decay_pct: 23.0
    },
    office_hour_script: 'Review characteristic equation det(A - lambda*I) = 0 with geometric vector scaling demo.'
  },
  {
    id: 'stud-004',
    name: 'Sneha Kulkarni',
    rollNo: '22CS110',
    avatar: 'SK',
    tier: 'AMBER',
    pFailMidterm: 0.38,
    attendanceRate: 0.81,
    currentDwellFriction: 'NORMAL',
    primaryBlockerConcept: 'Gradient Descent Convergence',
    hoursSpentWeekly: 7.0,
    lastActiveHoursAgo: 14,
    latent_theta: 0.35,
    friction_index: 0.38,
    xai_attribution: {
      calculus_decay_pct: 28.5,
      telemetry_friction_pct: 48.0,
      attendance_decay_pct: 23.5
    },
    office_hour_script: 'Address learning rate oscillations. Transition to interactive Jupyter loss surface contour visualizer.'
  },
  {
    id: 'stud-012',
    name: 'Ananya Sen',
    rollNo: '22CS014',
    avatar: 'AS',
    tier: 'GREEN',
    pFailMidterm: 0.08,       // Safe autonomous
    attendanceRate: 0.94,
    currentDwellFriction: 'LOW',
    primaryBlockerConcept: 'None (Ahead of Pacing)',
    hoursSpentWeekly: 14.5,
    lastActiveHoursAgo: 2,
    latent_theta: 1.85,
    friction_index: 0.08,
    xai_attribution: {
      calculus_decay_pct: 5.0,
      telemetry_friction_pct: 6.0,
      attendance_decay_pct: 89.0
    },
    office_hour_script: 'Advanced topic readiness: Nominate as peer tutor for Section B Linear Algebra laboratory.'
  },
  {
    id: 'stud-007',
    name: 'Devansh Roy',
    rollNo: '22CS032',
    avatar: 'DR',
    tier: 'GREEN',
    pFailMidterm: 0.11,
    attendanceRate: 0.91,
    currentDwellFriction: 'LOW',
    primaryBlockerConcept: 'None (Ahead of Pacing)',
    hoursSpentWeekly: 12.8,
    lastActiveHoursAgo: 5,
    latent_theta: 1.65,
    friction_index: 0.12,
    xai_attribution: {
      calculus_decay_pct: 8.0,
      telemetry_friction_pct: 7.0,
      attendance_decay_pct: 85.0
    },
    office_hour_script: 'High autonomy. Prepared for advanced Transformers & Multi-Head Self-Attention modules.'
  }
];

export const COHORT_OVERVIEW_STATS: CohortOverview = {
  totalStudents: 74,
  greenCount: 44,
  amberCount: 19,
  redCount: 11,
  averageTheta: 0.42,
  predictedPassRate: 88.4,
  topClassBottleneck: {
    concept: 'Matrix Inversion & Determinants',
    failingPercentage: 62.1,
    affectedStudentCount: 46
  }
};
