// Skill-Bee Core Data Contracts (Types)

export type CareerTrackId = 'ai-engineer' | 'cloud-architect' | 'cyber-responder';

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export type ModalityType = 'code' | 'simulation' | 'proof' | 'video';

export type TriageTier = 'GREEN' | 'AMBER' | 'RED';

// 1. MathE Question with Calibrated Item Response Theory (2PL-IRT) parameters
export interface MathEQuestion {
  id: string;
  topic: 'LinearAlgebra' | 'Calculus' | 'Probability';
  conceptKey: string;
  conceptLabel: string;
  question: string;
  codeSnippet?: string;
  latexEquation?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty_b: number;      // Item difficulty (-2.5 to +2.5)
  discrimination_a: number;  // Item discrimination (0.5 to 2.2)
  prerequisites: string[];
}

// 2. Student Cognitive State & Progress
export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  avatar: string;
  college: string;
  classroomCode: string;
  careerTrack: CareerTrackId;
  latentAbilityTheta: number; // Current theta estimate (-3.0 to +3.0)
  standardError: number;      // Precision/Confidence of theta
  streakDays: number;
  dailyHoursDone: number;
  dailyHoursTarget: number;
  xpPoints: number;
  masteryMap: Record<string, number>; // conceptKey -> mastery (0.0 to 1.0)
  preferredModality: ModalityType;
  lastActive: string;
}

// 3. Concept Knowledge Graph (DAG) Node
export interface ConceptDAGNode {
  id: string;
  label: string;
  category: 'ACADEMIC_FOUNDATION' | 'INDUSTRY_CAREER';
  tier: 'MATH_SEM1' | 'MATH_SEM2' | 'CS_CORE' | 'AI_SPECIALIZATION';
  masteryScore: number;       // 0.0 to 1.0
  status: 'MASTERED' | 'IN_PROGRESS' | 'BLOCKED';
  prerequisiteIds: string[];
  blockedReason?: string;     // Reason if blocked
  estimatedHours: number;
  skillsbuildBadgeId?: string;
}

export interface ConceptDAGEdge {
  id: string;
  source: string;
  target: string;
  isRootCauseDecay?: boolean;
}

// 4. BeeBook Note Item
export interface BeeBookNote {
  id: string;
  timestampSec: number;
  timestampLabel: string;
  conceptTitle: string;
  keyTakeaway: string;
  latexFormula?: string;
  pythonSnippet?: string;
  studentAnnotation?: string;
  isBookmarked?: boolean;
}

// 5. In-Video Active Recall Checkpoint
export interface InVideoQuizCheckpoint {
  id: string;
  triggerTimestampSec: number;
  question: string;
  options: string[];
  correctIndex: number;
  xpReward: number;
  socraticHint: string;
  explanation?: string;
}

// 6. Pre-Lecture Flashcard
export interface PreLectureFlashcard {
  id: string;
  lectureNumber: number;
  frontConcept: string;
  frontQuestion: string;
  backAnswer: string;
  latexFormula?: string;
  tag: string;
}

// 6b. Video Learning Studio Dynamic Types & Socratic Context Buffer
export interface VideoContextBuffer {
  videoId: string;
  lectureId: string;
  courseId: string;
  lastTimestampSec: number;
  watchedSegments: [number, number][];
  lastActiveConcept: string;
  cognitiveFrictionAtExit: number;
  lastCognitiveState: string;
  reentryQuizCompleted?: boolean;
  savedAtISO: string;
}

export interface CourseLecture {
  id: string;
  number: string;
  title: string;
  duration: string;
  durationSec: number;
  youtubeId: string;
  completed: boolean;
  active: boolean;
  description: string;
  conceptKey: string;
  cues: { sec: number; label: string; text: string }[];
  multilingualCues?: Record<'EN' | 'HI' | 'TA' | 'ES', { sec: number; text: string }[]>;
  beebookNotes: BeeBookNote[];
  inVideoQuiz: InVideoQuizCheckpoint;
  reentryPrimingQuiz: {
    concept: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    triggerTimestampSec: number;
  };
  flashcards: PreLectureFlashcard[];
}

export interface CourseChapter {
  id: string;
  title: string;
  lectures: CourseLecture[];
}

export interface CourseTrack {
  id: string;
  title: string;
  code: string;
  instructor: string;
  badge: string;
  description: string;
  chapters: CourseChapter[];
}

// 7. Faculty Triage Record (UCI Risk Model)
export interface StudentTriageRecord {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  tier: TriageTier;
  pFailMidterm: number;       // 0.0 to 1.0 (Probability of failure)
  attendanceRate: number;     // e.g. 0.68
  currentDwellFriction: 'LOW' | 'NORMAL' | 'CRITICAL';
  primaryBlockerConcept: string;
  suggestedPeerId?: string;
  suggestedPeerName?: string;
  hoursSpentWeekly: number;
  lastActiveHoursAgo: number;
  xai_attribution?: {
    calculus_decay_pct: number;
    telemetry_friction_pct: number;
    attendance_decay_pct: number;
  };
  office_hour_script?: string;
  latent_theta?: number;
  friction_index?: number;
}

// 8. Cohort Health Overview
export interface CohortOverview {
  totalStudents: number;
  greenCount: number;
  amberCount: number;
  redCount: number;
  averageTheta: number;
  predictedPassRate: number;
  topClassBottleneck: {
    concept: string;
    failingPercentage: number;
    affectedStudentCount: number;
  };
}
