# 🐝 Skill-Bee — Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Track:** IBM National Hackathon — Problem Statement No. 4 (Making Learning Intelligent using AI)  
**Product Positioning:** Adaptive Learning Intelligence Engine extending IBM SkillsBuild  
**Target Execution:** High-Fidelity Client-Side React SPA with Deterministic Cognitive Engine  

---

## 1. Executive Summary & Problem Framing

### 1.1 The Problem
Conventional engineering education in colleges operates as an **open-loop batch-processing system**. A single instructor delivers an identical syllabus, resource pack, and testing schedule to classrooms of 60 to 120+ students, ignoring severe variance in:
1. **Prior Knowledge** (Hidden foundational math decay from 1st/2nd year).
2. **Learning Acquisition Speed** (Velocity of concept synthesis).
3. **Conceptual Understanding** (Distinction between formula memorization and spatial/intuitive mastery).
4. **Study Behavior** (Dwell time, hint-dependency, retry latency, and cramming habits).
5. **Preferred Modalities** (Code implementations, visual animations, formal proofs, or micro-videos).
6. **Assessment Performance** (Accuracy degradation under test stress).
7. **Areas of Difficulty** (Specific localized cognitive blockers).
8. **Resource Engagement** (Active manipulation vs. passive skimming).

### 1.2 The Failure of Incumbent Platforms (Coursera, Static MOOCs)
- **Linear Silos:** Coursera delivers content sequentially (Video -> Quiz -> Certificate). If a student struggles with *Backpropagation* in Week 3, the platform merely loops the same transcript.
- **Prerequisite Collapse:** The platform fails to diagnose that the failure stems from missing 1st-year *Multivariable Chain Rule*. The student experiences cognitive overload and drops out (yielding the industry-standard <15% MOOC completion rate).
- **Disengaged Instructors:** College faculty only discover student failure post-mortem (after mid-terms or finals), suffering from either complete blindness or notification fatigue.

### 1.3 The Skill-Bee Solution
Skill-Bee transforms **IBM SkillsBuild** into a **Closed-Loop Cognitive Mastery Engine**:
- **Dual-Horizon Synchronization:** Unifies the student active university course (*Dr. Sharma 4th Sem Math & CS*) with their future career aspiration (*AI & Machine Learning Engineer*).
- **Deterministic Knowledge Tracing:** Employs 2-Parameter Logistic Item Response Theory (2PL-IRT) and Bayesian updating to maintain an immutable, hallucination-free Latent Ability Vector (theta).
- **Concept Dependency Graph (DAG):** Traverses backwards from applied ML failures to isolate root-cause mathematical decay (e.g., Eigenvalues -> PCA/SVD).
- **LinUCB Contextual Bandit:** Adaptively switches delivery modalities (Interactive Code, Dynamic Simulation, Math Proof, Micro-Video) based on real-time friction telemetry.
- **Faculty ICU Cockpit:** Stratifies the cohort into Green / Amber / Red tiers and provides 1-click clinical interventions (Micro-Quiz, Peer Matchmaker, Student Dossier).

---

## 2. Core Personas & User Stories

### 2.1 Persona A: Rohan Verma (2nd-Year Engineering Student)
- **Profile:** Enrolled in Tier-2 engineering college; strong programmatic intuition, but rusty in higher-ed calculus and linear algebra. Aspires to become an AI Engineer on IBM SkillsBuild.
- **Pain Point:** Fails mid-term questions on Machine Learning loss functions because he does not understand gradient vectors; feels discouraged and abandons online courses.
- **User Story:**
  > 'As an engineering student, I want my learning platform to connect what I study in college math to real AI career skills, and when I get stuck, show me the exact prerequisite I missed instead of making me rewatch long lectures.'

### 2.2 Persona B: Dr. Sunita Sharma (Associate Professor, Computer Science)
- **Profile:** Teaches 85 students in Semester 4. Spends 10 hours a week grading assignments; only knows who is failing after Mid-Term 1.
- **Pain Point:** Cannot provide 1-on-1 diagnostic attention to 85 students; overwhelmed by noisy dashboard charts that offer no actionable next step.
- **User Story:**
  > 'As a university professor, I want a triage radar that alerts me to students experiencing prerequisite collapse weeks before exams, with 1-click tools to dispatch targeted remedial clinics.'

---

## 3. Product Architecture & Decoupled Engine Specification

Skill-Bee implements a strict **Decoupled Dual-Layer Architecture**:

`
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                    LAYER 1: DETERMINISTIC COGNITIVE ENGINE                             │
 │                    (Pure TypeScript Client-Side Numerical Core)                        │
 ├────────────────────────────────────────────────────────────────────────────────────────┤
 │ 1. 2PL-IRT Psychometric Kernel:                                                        │
 │    P(correct | theta, a, b) = 1 / (1 + exp(-1.7 * a * (theta - b)))                    │
 │    • theta (Latent Ability): Continuous scale [-3.0, +3.0]                             │
 │    • b (Item Difficulty): Calibrated from MathE dataset                                │
 │    • a (Item Discrimination): Calibrated from MathE response curves                    │
 │                                                                                        │
 │ 2. Bayesian Posterior Belief Updating:                                                 │
 │    P(Mastery_t | Response, DwellTime, Hints) proportional to Likelihood x Prior        │
 │    • Dwell-Time Penalty: Calibrated from EdNet telemetry percentiles                   │
 │    • Hint Penalty: Multi-tier degradation factor                                       │
 │                                                                                        │
 │ 3. Concept Dependency Directed Acyclic Graph (DAG):                                    │
 │    • Forward Traversal: Unblocks career competencies as academic nodes are mastered.   │
 │    • Backward Traversal: Roots out prerequisite math failures when ML questions fail.  │
 │                                                                                        │
 │ 4. LinUCB Contextual Multi-Armed Bandit:                                               │
 │    • Arms: [Interactive Code Lab, Dynamic Visual Sim, Mathematical Cheatsheet, Video]  │
 │    • Context Vector: [theta_ability, cognitive_speed, recent_friction, dwell_ratio]    │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Immutable Diagnostic State JSON
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                    LAYER 2: SOCRATIC GUIDANCE & INTERACTION UI                         │
 │                    (Simulated IBM Granite 3.0 via watsonx Scaffolding)                 │
 ├────────────────────────────────────────────────────────────────────────────────────────┤
 │ • Consumes raw psychometric vectors without computing grades (Zero-Hallucination rule).│
 │ • Progressive 3-Tier Socratic Scaffolding:                                             │
 │   - Tier 1: Conceptual Intuition Prompt                                                │
 │   - Tier 2: Structural Scaffolding Prompt                                              │
 │   - Tier 3: Concrete Micro-Step Drill                                                  │
 │ • Generates 1-click Faculty Briefing Dossiers and Pre-Lecture Diagnostic Micro-Quizzes.│
 └────────────────────────────────────────────────────────────────────────────────────────┘
`

---

## 4. Starter Pack Datasets — Schema & Ingestion Mapping

Skill-Bee grounds every mathematical variable in the official starter pack datasets:

### 4.1 MathE Dataset (Higher Education Mathematics)
- **Scope:** 9,546 student responses across higher-ed mathematics (Calculus, Linear Algebra, Probability).
- **Ingestion Role:** Calibrates item parameters (a, b) for the Cold-Start Computerized Adaptive Test (CAT) and foundational math concept nodes.
- **Embedded Schema:**
`	ypescript
interface MathEItem {
  itemId: string;
  topic: 'LinearAlgebra' | 'Calculus' | 'Probability';
  conceptNode: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  difficulty_b: number;      // Range: -2.5 to +2.5
  discrimination_a: number;  // Range: 0.5 to 2.2
  prerequisiteNodes: string[];
}
`

### 4.2 EdNet Dataset (Flagship Student Interaction Telemetry)
- **Scope:** 131M+ interactions from 784k+ students capturing sequential problem solving, dwell time, and hint seeking.
- **Ingestion Role:** Calibrates telemetry friction thresholds:
  - Normal Dwell Time: Expected seconds per item based on difficulty b.
  - Frustration Trigger: Dwell time > 2.4x expected + >= 2 failed attempts -> triggers LinUCB modality switch.
  - Guessing Trigger: Dwell time < 0.25x expected on high difficulty b -> dampens ability gain.
- **Embedded Schema:**
`	ypescript
interface EdNetTelemetryProfile {
  studentId: string;
  actionSequence: Array<{
    itemType: 'question' | 'hint' | 'explanation';
    elapsedMs: number;
    isCorrect?: boolean;
  }>;
  meanResponseTime: number;
  hintConsumptionRate: number;
}
`

### 4.3 UCI Higher Education Students Performance Evaluation
- **Scope:** 145 instances, 31 features (study hours, attendance, notes taking, previous GPA, socio-demographic features).
- **Ingestion Role:** Powers the Faculty Early-Warning Classifier to compute **Mid-Term Failure Probability (P_fail)**.
- **Risk Stratification Formula:**
  P_fail = sigmoid( w1*(1 - Attendance) + w2*(1 - theta_mastery) + w3*FrictionSpike + w4*(1 - PriorGPA) )
- **Triage Tiers:**
  - 🟢 **Green (Autonomous):** P_fail < 0.25
  - 🟡 **Amber (Remedial Needed):** 0.25 <= P_fail < 0.65
  - 🔴 **Red (Critical Collapse):** P_fail >= 0.65

---

## 5. Functional Specifications & Screen-by-Screen Requirements

The React application is structured around a top-level **Pitch Presenter Bar** allowing judges and users to navigate all 4 core screens:

`
[ 1. Onboarding & CAT ]  [ 2. Student Dual-Horizon Dashboard ]  [ 3. Faculty ICU Cockpit ]  [ 4. Dataset & Tech Proof ]
`

### 5.1 Screen 1: Onboarding & Cold-Start CAT
1. **Classroom Sync Card:**
   - Input: Teacher Code (Default prefill: CS302 - Dr. Sharma - 4th Sem Engineering Math & Computing).
   - Displays imported university syllabus and mid-term date.
2. **Career Track Selection:**
   - Radio selection: AI & Machine Learning Engineer (Primary), Cloud Native Architect, Data Engineer.
   - Displays visual alignment: *'College Linear Algebra + Calculus -> IBM AI Engineer Credential'*.
3. **Live 3-Question Computerized Adaptive Test (CAT):**
   - Question 1 (Medium b=0.0): Vector Dot Products.
   - Live Latent Ability (theta) Gauge with needle animation: updates dynamically on each selection using 2PL-IRT.
   - Question 2 & 3: Branch adaptively based on response correctness.
   - Completion State: Generates baseline student cognitive radar and unlocks the dashboard.

### 5.2 Screen 2: Dual-Horizon Student Dashboard & Adaptive Player
1. **Interactive Concept Knowledge DAG Canvas:**
   - Built using dynamic visual nodes (SVG / Canvas / React Flow style).
   - Shows dual paths:
     - **Academic Foundation Nodes:** *Matrix Basics -> Determinants -> Eigenvalues -> Partial Derivatives -> Chain Rule*.
     - **Industry Career Nodes:** *PCA / SVD -> Gradient Descent -> Neural Network Weights -> Backpropagation*.
   - Node Status: Mastered (Green), In-Progress (Amber), Blocked (Red).
   - **Root-Cause Inspector Modal:** Clicking on Backpropagation displays:
     > '⚠️ Concept Blocked: 2 Prerequisite Failures Detected: (1) Multivariable Chain Rule [Calculus II] — Mastery: 28%; (2) Matrix Inversion — Mastery: 42%. Review foundational bridge modules to unlock.'
2. **Adaptive Multi-Modal Content Player:**
   - Dynamic Modality Tabs:
     - 🖥️ **Interactive Code Lab:** Live editable Python code runner simulation.
     - 📊 **Visual Dynamic Sim:** Interactive parameter sliders visualizing vector transformations.
     - 📝 **Math Cheatsheet:** Concise formula derivations.
     - 🎥 **Socratic Micro-Video:** Focused conceptual breakdown.
   - **Live Telemetry & Bandit Simulator:**
     - Sliders for *Dwell Time (seconds)* and *Quiz Attempt Counter*.
     - When dwell time spikes, the LinUCB Bandit dynamically re-ranks and switches the active modality, logging an EdNet-compatible event.
3. **Socratic AI Companion Drawer:**
   - Sliding side panel demonstrating IBM Granite 3.0 pedagogical hint progression:
     - *Hint 1 (Intuitive Analogy):* 'Think of a matrix transformation like stretching a rubber sheet...'
     - *Hint 2 (Mathematical Scaffolding):* 'Remember that for det(A) = 0, the volume of the transformed space collapses to zero...'
     - *Hint 3 (Direct Step):* 'Check row 2 minus 2 times row 1.'

### 5.3 Screen 3: Faculty ICU Cockpit (The Triage Command Center)
1. **Cohort Cognitive Health Overview:**
   - Active Cohort: Section B — 74 Enrolled Students.
   - Metric Badges:
     - Average Latent Ability (theta_bar): +0.42 (Classroom average).
     - Prerequisite Bottleneck: Matrix Inversion & Eigenvalues (46 students struggling).
     - At-Risk Count: 11 Students in Red Tier.
2. **Stratified Triage Table:**
   - Filterable by tier: 🟢 Green (44), 🟡 Amber (19), 🔴 Red (11).
   - Columns: Student Name, Roll No, Current Mastery, Dwell Friction, Mid-Term Failure Risk (P_fail), Root Blocker, Action.
3. **3 One-Click Clinical Interventions:**
   - ⚡ **1-Click Remedial Micro-Quiz:**
     - Modal pops up showing auto-generated 5-minute pre-lecture quiz targeted precisely at *Matrix Inversion* with 3 calibrated MathE questions.
     - Button: *'Dispatch to Class via SkillsBuild Classroom'*.
   - 🤝 **Automated Peer-to-Peer Matchmaker:**
     - Algorithm pairs Red-tier students with complementary Green-tier students (e.g., *Rohan Verma [Red: Matrix Inversion]* paired with *Ananya Sen [Green: Linear Algebra Master]*).
     - Displays compatibility score and auto-generated lab briefing.
   - 📄 **1-Page Student Diagnostic Dossier:**
     - Select any student (e.g., *Rohan Verma*) to view an instant printable/exportable briefing card with cognitive spider chart, exact prerequisite breakdown, and recommended 10-minute office-hour script.

### 5.4 Screen 4: Dataset & Algorithmic Proof (For Hackathon Judges)
1. **Raw Starter Pack Inspector:**
   - Toggle between **MathE Item Bank**, **EdNet Telemetry Logs**, and **UCI Performance Records**.
   - Displays real data points and field definitions.
2. **Live Math Playground:**
   - Interactive 2PL-IRT Curve visualizer: adjust theta, a, and b to see the probability curve shift.
   - Bayesian posterior update calculator showing how prior belief transforms with new evidence.
   - LinUCB confidence bound calculator showcasing explore-exploit trade-offs.

---

## 6. Non-Functional & Technical Requirements

1. **Zero External Runtime Dependencies:** The entire application runs smoothly in modern web browsers using client-side execution.
2. **Sub-15ms Latency:** Psychometric updates, IRT probability computations, and DAG graph traversals compute in <15ms.
3. **Responsive Presentation Layout:** Desktop-first presentation layout (1920x1080 / 1440x900) optimized for live screen sharing with hackathon evaluators.
4. **Design Aesthetics:** IBM Carbon Design System-inspired color palette (Cool Gray, Carbon Blue #0f62fe, Amber Warning #f1c21b, Red Alert #da1e28, Green Success #24a148).

---

## 7. Hackathon Success & Judging Evaluation Metrics

| Evaluation Criteria | Target Metric | Skill-Bee Implementation Proof |
| :--- | :--- | :--- |
| **Problem Statement Alignment** | 100% compliance with PS-4 | Diagnostic (theta computation), Predictive (P_fail score), Prescriptive (LinUCB & Faculty Cockpit). |
| **Dataset Utilization** | Explicit use of 3 datasets | MathE for IRT item parameters, EdNet for friction telemetry, UCI for failure risk models. |
| **IBM Ecosystem Alignment** | watsonx & SkillsBuild synergy | Extends SkillsBuild with dual-horizon roadmap; integrates Granite 3.0 Socratic scaffolding & watsonx governance. |
| **Demo Impact & Completeness** | Flawless 3-minute pitch | Top presenter bar allows instant live walkthrough of all user personas without staging or setup. |
