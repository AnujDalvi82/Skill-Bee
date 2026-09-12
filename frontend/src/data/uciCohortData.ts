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
    lastActiveHoursAgo: 26
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
    lastActiveHoursAgo: 48
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
    lastActiveHoursAgo: 8
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
    lastActiveHoursAgo: 14
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
    lastActiveHoursAgo: 2
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
    lastActiveHoursAgo: 5
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
