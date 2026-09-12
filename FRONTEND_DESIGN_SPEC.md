# ?? Skill-Bee ? Frontend Design Specification & Architecture Plan

**Document Version:** 1.0.0  
**Audience:** UI/UX Designer, Frontend Engineers, Parallel AI Agents  
**Product:** Skill-Bee (Closed-Loop Adaptive Learning Intelligence Engine for IBM SkillsBuild)  
**Target Stack:** Next.js 14/15 (App Router), React 19/18, TypeScript, Tailwind CSS, shadcn/ui, React Flow (@xyflow/react), Recharts, Lucide Icons  
**Design Theme:** IBM Carbon Design System (Enterprise dark/light, Carbon Blue #0f62fe, high-contrast status accents)  

---

## 1. Executive Summary & Design Mission

Skill-Bee is an **adaptive learning intelligence platform** that connects an engineering student's university classroom syllabus with high-value industry career tracks (e.g., AI & Machine Learning Engineer).

In this hackathon, **the frontend is the primary presentation vehicle**. The design must deliver:
1. **Instant Clarity:** Judges must immediately understand the dual-horizon bridge (College Math -> AI Career).
2. **Interactive Visual Feedback:** Live sliders, reactive gauges, dynamic graph traversal, and zero-latency state transitions.
3. **Dedicated Pitch Navigator:** A persistent presenter bar at the top allowing a 1-click walkthrough across all user personas during the 3-minute pitch.

---

## 2. Global Design System & Theme Tokens (IBM Carbon Inspired)

### 2.1 Color Palette
- **Backgrounds:**
  - `bg-background`: #0f172a (Slate 900) or #161616 (Carbon Dark 100)
  - `bg-card`: #1e293b (Slate 800) or #262626 (Carbon Gray 90)
  - `bg-muted`: #334155 (Slate 700) or #393939 (Carbon Gray 80)
- **Primary Brand Accents:**
  - `primary`: #0f62fe (IBM Carbon Blue)
  - `primary-hover`: #0043ce
  - `accent`: #8a3ffc (IBM Purple / AI Watson Accent)
- **Triage & Status Accents:**
  - ?? **Green (Autonomous / Mastered):** #24a148 (Carbon Green) | Badges: bg-emerald-500/10 text-emerald-400 border-emerald-500/30
  - ?? **Amber (Friction / In Progress):** #f1c21b (Carbon Yellow) | Badges: bg-amber-500/10 text-amber-400 border-amber-500/30
  - ?? **Red (Critical Collapse / Blocked):** #da1e28 (Carbon Red) | Badges: bg-rose-500/10 text-rose-400 border-rose-500/30

### 2.2 Typography & Iconography
- **Font:** Inter, Plus Jakarta Sans, or IBM Plex Sans.
- **Icons:** lucide-react (Cpu, Network, GitBranch, AlertTriangle, CheckCircle2, BookOpen, Compass, Award, Users, FileText).

---

## 3. Screen-by-Screen UI/UX Specifications

### ?? Global: The Pitch Navigator Bar (PitchNavigatorBar.tsx)
*Persistent fixed bar at the very top of the screen (above the Navbar).*
- **Elements:**
  - Product brand: `?? Skill-Bee Live Demo`
  - 4 Segmented Control buttons with badges:
    1. `[1. Student Onboarding & CAT]`
    2. `[2. Dual-Horizon Dashboard]`
    3. `[3. Faculty ICU Cockpit]`
    4. `[4. Datasets & Tech Proof]`
  - Persona Quick-Switcher: Toggle between Student (Rohan Verma) and Professor (Dr. Sunita Sharma).

---

### ??? Screen 1: Onboarding & Computerized Adaptive Test (/onboarding)
**Layout:** 3-step centered wizard card with progress stepper.
- **Step 1: Classroom Sync Card**
  - Input field for Classroom Code (Pre-filled: CS302 - Dr. Sharma - 4th Sem Math & CS).
  - Badge showing: Verified: University Syllabus & Mid-Term Sync Active.
- **Step 2: Career Track Selector**
  - 3 Selectable interactive cards:
    - ?? **AI & Machine Learning Engineer** (Recommended - Pre-selected)
    - Cloud Native Architect
    - Big Data & Analytics Engineer
  - Shows visual connector: "Your College Math (Linear Algebra + Calculus) unlocks 4 Core IBM AI Credentials".
- **Step 3: Live 3-Question Adaptive Diagnostic (MathE)**
  - Card rendering real math questions from the MathE dataset.
  - **The Hero UI Element:** An animated **Latent Ability (theta) Gauge** needle on the right side.
  - On clicking an answer, the needle smoothly swings between -2.0 and +2.0, and shows real-time Bayesian confidence bounds.
  - Clicking Complete Assessment triggers a celebratory unlock animation into the Dashboard.

---

### ??? Screen 2: Dual-Horizon Student Dashboard (/student/dashboard)
**Layout:** Split layout ? Left/Center (Interactive Concept DAG Canvas), Right (Multi-Modal Adaptive Content Player).

#### Component 1: Interactive Concept Knowledge DAG (KnowledgeDAGCanvas.tsx)
- Rendered using @xyflow/react (React Flow) or dynamic SVG canvas with pan/zoom.
- **Node Categories:**
  - **Academic Foundation Nodes (Bottom Rail):** Matrix Basics -> Determinants -> Eigenvalues -> Partial Derivatives -> Multivariable Chain Rule.
  - **Industry Career Nodes (Top Rail):** PCA/SVD -> Gradient Descent -> Neural Network Weights -> Backpropagation.
- **Node States:**
  - ?? Green Glow: Mastered (>= 85%)
  - ?? Amber Pulse: In-Progress / Current Learning Frontier
  - ?? Red Lock: Blocked Prerequisite
- **Interactive Action:**
  - Clicking Backpropagation opens a **Root-Cause Inspector Drawer**:
    > "?? Concept Blocked: Missing 1st-Year Math Prerequisites:
    > (1) Multivariable Chain Rule [Calculus II] ? Mastery: 28%
    > (2) Matrix Inversion ? Mastery: 42%
    > [Click to launch 5-minute refresher bridge]"

#### Component 2: Multi-Modal Adaptive Player (AdaptivePlayer.tsx)
- **LinUCB Modality Tabs:**
  - ??? Interactive Code (Editable Python snippet with Run Code simulation).
  - ?? Visual Sim (Interactive 2D vector coordinate grid with draggable transform sliders).
  - ?? Math Proof (Clean LaTeX formulas with step-by-step collapse accordions).
  - ?? Micro-Video (Embedded video player card with key takeaways checklist).
- **Interactive Telemetry / Friction Simulator Card:**
  - Sliders for Dwell Time (seconds) and Retry Count.
  - Dragging the dwell time slider past the threshold triggers an animated notification:  
    "? LinUCB Bandit detected cognitive friction: Automatically adapting delivery from Math Proof to Visual Simulation."
- **Socratic AI Companion Drawer (SocraticDrawer.tsx):**
  - Sliding side panel simulating IBM Granite 3.0.
  - 3 Progressive Hint Buttons: Level 1 (Intuition), Level 2 (Scaffolding), Level 3 (Micro-Step).

---

### ??? Screen 3: Faculty ICU Cockpit (/faculty/cockpit)
**Layout:** Top Metrics Summary -> Stratified Triage Columns/Table -> 3 One-Click Intervention Action Buttons.

#### Component 1: Cohort Cognitive Health Header (CohortStatsHeader.tsx)
- 4 Stat Cards:
  1. Classroom Average Ability (theta): +0.42 (+14% this month)
  2. Critical Triage Count: 11 Students (Red Tier)
  3. Primary Class Bottleneck: Matrix Inversion & Eigenvalues (62% struggle)
  4. Mid-Term Failure Risk Index: Low (Class-wide pass probability 88%)

#### Component 2: Stratified Triage Table (TriageRadarView.tsx)
- Tabbed by Tiers:
  - ?? **Green (Autonomous - 44 Students):** High pacing, potential peer tutors.
  - ?? **Amber (Friction - 19 Students):** Automated remedial modules dispatched.
  - ?? **Red (Critical Collapse - 11 Students):** High failure probability (P_fail > 75%).
- Table Columns: Student Name, Roll No, Mastery %, Friction Signal, Failure Risk, Primary Blocker, 1-Click Action.

#### Component 3: The 3 One-Click Clinical Interventions
1. ? **1-Click Remedial Micro-Quiz Modal (MicroQuizModal.tsx):**
   - Modal showing a 5-minute pre-lecture diagnostic quiz targeted at Matrix Inversion with 3 calibrated MathE questions.
   - Button: Dispatch to Section B via SkillsBuild Classroom.
2. ?? **Automated Peer-to-Peer Matchmaker Modal (PeerMatchModal.tsx):**
   - Visual pairing cards: matches Red-tier student (e.g., Rohan Verma) with Green-tier student (e.g., Ananya Sen).
   - Displays compatibility score (94%) and generates an automated lab collaboration invite.
3. ?? **1-Page Diagnostic Dossier Drawer (StudentDossierModal.tsx):**
   - Opens a printable briefing card for Dr. Sharma:
     - Student cognitive spider chart.
     - Root-cause prerequisite decay timeline.
     - 10-minute office hour intervention script generated by IBM Granite.

---

### ??? Screen 4: Dataset & Algorithmic Proof Inspector (/proof)
*Designed specifically to convince IBM technical hackathon judges.*
- **Tab 1: Raw Datasets Explorer:** Interactive filterable tables for MathE (9,546 items), EdNet (Telemetry patterns), and UCI (Student Performance features).
- **Tab 2: Live 2PL-IRT Curve Playground:** Sliders for ability theta, item difficulty b, and discrimination a, with real-time SVG probability curve updating.
- **Tab 3: LinUCB Modality Weight Matrix:** Visual chart showing how exploration/exploitation weights adjust as student dwell time changes.

---


### ??? Screen 5: Interactive Lecture Studio with BeeBook & Active Recall (`/student/lecture`)
**Layout:** 12-column layout ? 8 Columns (Video Player & Controls), 4 Columns (BeeBook & Interactive Transcript Drawer).

1. **Video Player Canvas & Fast-Whisper Subtitles:**
   - Custom video controls with playback speed (0.75x to 2.0x).
   - **Multilingual Pill Switcher:** `[EN | ?????? | ????? | Hinglish]`.
   - In-video animated captions powered by Fast-Whisper.
   - **In-Video Pop-Up Checkpoint:** Pauses playback at timestamp markers with a soft background blur; displays a 1-question active recall card with Skillbee feedback.

2. **BeeBook ? Live AI Side Panel Notebook (`BeeBookDrawer.tsx`):**
   - Top tab switcher: `[?? BeeBook Notes]` and `[??? Interactive Transcript]`.
   - **Notes Tab:** Auto-scrolling, timestamped cards summarizing key insights, LaTeX equations (e.g., $\det(A-\lambda I) = 0$), and formatted code snippets.
   - Student interactive note-taking: add notes, highlight text, or click `Ask Skillbee about this moment`.
   - **Transcript Tab:** Click-to-seek interactive text feed synchronized with video timecodes.

3. **Pre-Lecture Recall Flashcard Modal (`LectureWarmupModal.tsx`):**
   - Displays a 3D flip card carousel before lecture start.
   - Warm-up prompt: *"Honey Memory Recall: 3 Quick Checks from Lecture 2"*.
   - Flips on click to show explanation; button: *"I Remember! Launch Lecture ??"*.

4. **Curriculum Graph-View Progress Trail (`CurriculumGraphBar.tsx`):**
   - Placed above the video player showing connected node steps (`01 Foundations` -> `02 Data Core` -> `03 Active` -> `? Capstone`).

5. **Daily Study Hour Ring & Honeycomb Streak Widget (`DailyHourTracker.tsx`):**
   - Header widget showing circular progress ring: `1.5 / 2.0 hrs Target` + `?? 12 Days Streak`.

---

## 4. Frontend Project Directory Structure (Next.js App Router)

```
frontend/
??? src/
?   ??? app/
?   ?   ??? layout.tsx              # Root layout with Carbon dark theme + PitchNavigatorBar
?   ?   ??? page.tsx                # Welcome portal / Role switcher
?   ?   ??? onboarding/
?   ?   ?   ??? page.tsx            # Classroom Code + Career Selector + CAT Test
?   ?   ??? student/
?   ?   ?   ??? dashboard/
?   ?   ?       ??? page.tsx        # Concept DAG + Adaptive Player + Socratic Drawer
?   ?   ??? faculty/
?   ?   ?   ??? cockpit/
?   ?   ?       ??? page.tsx        # Triage Radar + Heatmap + 1-Click Interventions
?   ?   ??? proof/
?   ?       ??? page.tsx            # Live IRT Math & Dataset Inspector
?   ?
?   ??? components/
?   ?   ??? layout/
?   ?   ?   ??? PitchNavigatorBar.tsx # Top Presenter bar for 1-click live pitch
?   ?   ?   ??? Navbar.tsx            # SkillsBuild branded header
?   ?   ?   ??? Sidebar.tsx           # Collapsible navigation rail
?   ?   ??? onboarding/
?   ?   ?   ??? ClassroomSyncCard.tsx # Class code verification
?   ?   ?   ??? CareerSelector.tsx    # AI Engineer track card
?   ?   ?   ??? AdaptiveCATTest.tsx   # MathE item stepper + theta gauge
?   ?   ??? student/
?   ?   ?   ??? KnowledgeDAGCanvas.tsx# Interactive React Flow canvas
?   ?   ?   ??? NodeDetailDrawer.tsx  # Root-cause prerequisite breakdown
?   ?   ?   ??? AdaptivePlayer.tsx    # Code/Sim/Math/Video multi-modal player
?   ?   ?   ??? CodeRunnerMock.tsx    # Interactive Python runner
?   ?   ?   ??? VisualSimViewer.tsx   # Canvas 2D vector transformation slider
?   ?   ?   ??? SocraticDrawer.tsx    # Progressive AI hint dialogue
?   ?   ?   ??? TelemetrySimulator.tsx# Sliders for dwell time and retries
?   ?   ??? faculty/
?   ?   ?   ??? CohortStatsHeader.tsx # Average theta, at-risk, bottleneck stats
?   ?   ?   ??? TriageRadarView.tsx   # Green/Amber/Red triage tables
?   ?   ?   ??? BottleneckHeatmap.tsx # Recharts failure distribution
?   ?   ?   ??? MicroQuizModal.tsx    # 1-Click 5-min remedial quiz
?   ?   ?   ??? PeerMatchModal.tsx    # Red-to-Green peer matching visualizer
?   ?   ?   ??? StudentDossierModal.tsx# Printable 1-page clinical dossier
?   ?   ??? proof/
?   ?   ?   ??? IRTCurveVisualizer.tsx# Live 2PL-IRT interactive chart
?   ?   ?   ??? DatasetRawViewer.tsx  # Filterable MathE/EdNet/UCI table
?   ?   ??? ui/                       # Atomic shadcn/ui components
?   ?       ??? button.tsx
?   ?       ??? card.tsx
?   ?       ??? badge.tsx
?   ?       ??? dialog.tsx
?   ?       ??? tabs.tsx
?   ?       ??? slider.tsx
?   ?       ??? progress.tsx
?   ?
?   ??? lib/
?   ?   ??? store.ts                # Global Zustand / Context state
?   ?   ??? types.ts                # Strict TypeScript interfaces (Contract-First)
?   ?   ??? utils.ts                # cn() class helper
?   ?
?   ??? data/                       # Embedded Starter Pack Datasets
?       ??? matheQuestions.ts       # Calibrated MathE items (a, b parameters)
?       ??? ednetProfiles.ts        # Telemetry & dwell time benchmarks
?       ??? uciCohortData.ts        # 74 student cohort records with failure risk
```

---

## 5. Strict TypeScript Data Contracts (src/lib/types.ts)

```typescript
// 1. MathE Item for Computerized Adaptive Testing
export interface MathEQuestion {
  id: string;
  topic: 'LinearAlgebra' | 'Calculus' | 'Probability';
  conceptKey: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty_b: number;      // -2.5 to +2.5
  discrimination_a: number;  // 0.5 to 2.2
  prerequisites: string[];
}

// 2. Student Cognitive State
export interface StudentCognitiveProfile {
  studentId: string;
  name: string;
  classroomCode: string;
  careerTrack: 'AI_ML_ENGINEER' | 'CLOUD_ARCHITECT' | 'DATA_ENGINEER';
  latentAbilityTheta: number; // e.g. +0.45
  masteryMap: Record<string, number>; // conceptKey -> mastery (0.0 to 1.0)
  learningVelocity: number;
  preferredModality: 'code' | 'simulation' | 'proof' | 'video';
}

// 3. Knowledge DAG Node
export interface ConceptNode {
  id: string;
  label: string;
  category: 'ACADEMIC_FOUNDATION' | 'INDUSTRY_CAREER';
  tier: 'MATH_SEM1' | 'MATH_SEM2' | 'CS_CORE' | 'AI_SPECIALIZATION';
  masteryScore: number;       // 0.0 to 1.0
  status: 'MASTERED' | 'IN_PROGRESS' | 'BLOCKED';
  prerequisiteIds: string[];
  blockedReason?: string;
}

// 4. Faculty Triage Record (UCI Risk Model)
export interface StudentTriageRecord {
  id: string;
  name: string;
  rollNo: string;
  tier: 'GREEN' | 'AMBER' | 'RED';
  pFailMidterm: number;       // 0.0 to 1.0 (UCI Model)
  attendanceRate: number;     // e.g. 0.68
  currentDwellFriction: 'LOW' | 'NORMAL' | 'CRITICAL';
  primaryBlockerConcept: string;
  suggestedPeerId?: string;
  lastActiveHoursAgo: number;
}
```

---

## 6. Recommended Next Steps for the Designer
1. Initialize the Next.js project with Tailwind CSS and shadcn/ui.
2. Place `types.ts` in `src/lib/types.ts`.
3. Build the **`PitchNavigatorBar.tsx`** so pages can be toggled immediately.
4. Scaffold the 4 main page views with high visual polish and mockup data.
