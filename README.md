<p align="center">
  <h1 align="center">🐝 Skill-Bee</h1>
  <p align="center">
    <strong>Closed-Loop Adaptive Learning Intelligence Platform</strong><br>
    <em>Bridging College Curricula with Industry Mastery for Higher Engineering Education</em>
  </p>
  <p align="center">
    <a href="#-problem-statement">Problem Statement</a> •
    <a href="#-core-thesis--product-vision">Product Vision</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-starter-pack-datasets">Datasets</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-ibm-technology-alignment">IBM Tech</a> •
    <a href="#-repository-structure">Repository</a>
  </p>
</p>

---

## 📌 Problem Statement

**Problem Statement No. 4: Making Learning Intelligent using AI** (IBM National Hackathon)

Engineering colleges conventionally deliver uniform curriculum, learning materials, and assessment schedules across entire classrooms (60–120+ students), disregarding significant individual variances in:
- **Prior knowledge** & foundational gaps
- **Learning speed** & acquisition velocity
- **Conceptual understanding** vs. superficial memorization
- **Study behaviour**, dwell time, and persistence
- **Preferred learning modalities** (code, visual simulation, mathematical proof, text)
- **Assessment performance** under test pressure
- **Areas of cognitive difficulty**
- **Engagement telemetry** with learning content

### The 3 Core Questions Skill-Bee Answers:
1. **Diagnostic:** *"What does the student actually understand right now?"*
2. **Predictive:** *"What are they likely to struggle with next?"*
3. **Prescriptive & Interventive:** *"What learning intervention will help, and when is human faculty intervention required?"*

---

## 💡 Core Thesis & Product Vision

Current Massive Open Online Courses (e.g., Coursera) and institutional LMSs suffer from **abysmal completion rates (< 15%)** and severe **prerequisite collapse**: when an engineering student gets stuck on an advanced topic (like *Backpropagation* or *Principal Component Analysis*), the platform repeats the same video transcript rather than diagnosing that the student forgot 1st-year *Multivariable Chain Rule* or *Matrix Eigenvalues*.

**Skill-Bee transforms IBM SkillsBuild into an Adaptive Cognitive Operating System:**
- **Synchronized Dual-Horizon Dashboard:** Connects a student's active university classroom (e.g., *Dr. Sharma's 4th Sem Math & CS*) with their chosen industry career pathway (e.g., *AI & Machine Learning Engineer*).
- **Mastery-Driven Prerequisite Graph:** Maps college academic concepts as prerequisite bridges required to unlock high-value industry competencies.
- **Faculty Early-Warning Cockpit:** Replaces noisy grade books with an ICU-style triage radar (Green / Amber / Red) that flags at-risk students weeks before mid-term exams.

---

## 🏗️ System Architecture

Skill-Bee enforces a **decoupled dual-layer architecture** strictly separating deterministic, psychometric mastery computation from generative natural language scaffolding.

```
                                  [ STUDENT TELEMETRY ]
                     (Answers, Dwell Time, Hint Latency, Retry Counts)
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │  LAYER 1: DETERMINISTIC PSYCHOMETRIC & COGNITIVE ENGINE                                │
 │  ────────────────────────────────────────────────────────────────────────────────────  │
 │  • 2-Parameter Logistic Item Response Theory (2PL-IRT) + Bayesian Belief Updating       │
 │  • Computes Latent Ability (θ), Item Difficulty (b), and Discrimination (a)             │
 │  • Directed Acyclic Graph (DAG) Concept Knowledge Graph (Math ➔ ML Prerequisite Chains) │
 │  • Backward Prerequisite Traversal: Isolates foundational math decay behind ML errors  │
 │  • Contextual Multi-Armed Bandit (LinUCB): Dynamically selects optimal modality        │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Immutable JSON Assessment State
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │  LAYER 2: SOCRATIC TUTOR & GENERATIVE SCAFFOLDING (IBM Granite 3.0)                    │
 │  ────────────────────────────────────────────────────────────────────────────────────  │
 │  • Consumes diagnostic JSON vectors without calculating grades (hallucination-free)    │
 │  • Progressive Socratic hint engine: guides students without spoon-feeding answers     │
 │  • 1-Click Faculty Lesson Briefs & Remedial Micro-Quiz Generator                       │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
        [ STUDENT DUAL-HORIZON VIEW ]               [ FACULTY TRIAGE RADAR ]
        • Academic & Career Roadmap Sync            • Green / Amber / Red Tiers
        • Dynamic Prerequisite Graph                • Pre-Exam Dropout Early Warning
        • Modality-Adaptive Content Player          • Automated Peer-to-Peer Matchmaker
```

---

## 📊 Starter Pack Datasets & Ingestion Strategy

Skill-Bee strictly anchors its machine learning pipelines and psychometrics in the official hackathon starter pack:

| Dataset | Records / Scope | Exact Role in Skill-Bee |
| :--- | :--- | :--- |
| **EdNet** | 131M+ interactions, 784k+ students | Trains sequential knowledge tracing, dwell-time thresholds, hint-consumption penalties, and frustration/guessing detection. |
| **MathE** | 9,546 higher-ed mathematics responses | Calibrates empirical difficulty ($b$) and discrimination ($a$) parameters across foundational Linear Algebra, Calculus, and Probability. |
| **UCI Higher Education Performance** | 145 instances, 31 features | Powers the Faculty Early-Warning Classifier to predict end-of-term academic failure based on study habits and early engagement. |
| **Indian Open Government Data** | Data.gov.in & AICTE/NPTEL standards | Calibrates curriculum ontologies to Indian engineering standards and establishes Tier-2 / Tier-3 regional performance baselines. |

---

## ⚡ Key Features

### 1. Student Experience (The Adaptive Learning Loop)
* **Cold-Start Computerized Adaptive Test (CAT):** A 3–5 question diagnostic calibrated on MathE to instantly establish baseline ability ($\theta$) upon joining a classroom.
* **Dual-Horizon Roadmap:** Academic syllabus concepts dynamically unlock career milestones (e.g., *"Master Matrix Inverses to unlock Neural Network Weights"*).
* **Multi-Modal Content Bandit (LinUCB):** Automatically selects the most effective format for each student:
  - 🖥️ Interactive Python code lab
  - 📊 Visual dynamic simulation
  - 📝 Concise mathematical proof / cheatsheet
  - 🎥 Focused micro-video explanation
* **Socratic Companion:** Real-time conversational tutor providing multi-level progressive hints.

### 2. Faculty ICU Cockpit (Human-in-the-Loop Triage)
* **Triage Stratification:** Automatically clusters the class into:
  - 🟢 **Green (Autonomous):** Pacing ahead, eligible to be peer mentors.
  - 🟡 **Amber (Friction):** Automated remedial modules dispatched.
  - 🔴 **Red (Critical Collapse):** Foundational prerequisite breakdown requiring direct intervention.
* **1-Click Remedial Micro-Quiz:** Generates and dispatches a 5-minute pre-lecture diagnostic quiz targeting class-wide bottlenecks.
* **Automated Peer Matchmaker:** Intelligently pairs struggling Red-tier students with compatible Green-tier lab peers.
* **1-Page Diagnostic Dossier:** Auto-generates a student briefing card for office hours in under 30 seconds.

---

## 🔄 End-to-End User Flows

### 1. Student Flow: Onboarding to Adaptive Mastery Loop
```
[ 1. Student Auth ] 
       │ (Google / College SSO on IBM SkillsBuild)
       ▼
[ 2. Connect Classroom ] ──► Enter Teacher Code (e.g., CS302 - Dr. Sharma)
       │                      Imports College Syllabus, Mid-Term Deadlines, & Course Outcomes
       ▼
[ 3. Select Career Goal ] ──► Choose "AI & Machine Learning Engineer"
       │                      Bridges Academic Math (Linear Algebra) with Applied ML (Neural Nets)
       ▼
[ 4. Cold-Start CAT ] ──► 3–5 Adaptive Questions (calibrated on MathE dataset)
       │                   Initializes Latent Ability Vector (θ) and Prerequisite Baselines
       ▼
[ 5. Dual-Horizon Dashboard ] ──► Dynamic Knowledge DAG View + Next-Best-Action Card
       │
       ▼
[ 6. Adaptive Learning Unit ]
       ├── LinUCB Bandit selects optimal modality (Interactive Code / Visual / Cheatsheet)
       ├── Telemetry Logging (Dwell time, Hint latency, Attempts logged in EdNet schema)
       └── Socratic Agent provides progressive scaffolding if friction is detected
       │
       ▼
[ 7. Mastery Update ] ──► Bayesian belief updating updates concept node mastery state
```

### 2. Faculty Flow: ICU Triage Cockpit & Early Intervention
```
[ 1. Faculty Login ] ──► Select Active Course Cohort (e.g., Section B - 74 Students)
       │
       ▼
[ 2. Cohort Cognitive Radar ]
       ├── Class-wide Concept Bottleneck Heatmap (e.g., 62% stuck on Matrix Determinants)
       └── Predictive Failure Radar (UCI Model: Flags 9 students at >75% risk of Mid-Term fail)
       │
       ▼
[ 3. Stratified Student Triage ]
       ├── 🟢 Green Tier: Fast-track candidates & potential peer mentors
       ├── 🟡 Amber Tier: Autonomous remediation dispatched
       └── 🔴 Red Tier: Direct intervention needed
       │
       ▼
[ 4. One-Click Interventions ]
       ├── [Dispatch Micro-Quiz]: 5-minute pre-lecture diagnostic targeting the bottleneck
       ├── [Trigger Peer-Pairing]: Auto-matches Red-tier students with Green-tier lab partners
       └── [Generate Dossier]: 1-page summary of root-cause prerequisite decay for office hours
```

---

## 💻 Technology Stack & Client-Side Pitch Architecture

To ensure **zero-downtime, sub-10ms response latency, and bulletproof live judging presentations**, Skill-Bee is engineered as a **Pure React Single-Page Application (SPA)** with embedded client-side cognitive and psychometric engines:

| Subsystem | Technologies | Purpose & Live Hackathon Impact |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + TypeScript + Vite** | Blazing-fast hot module reloading, strict type safety, zero build friction. |
| **Styling & Design System** | **Tailwind CSS + Lucide Icons + Radix UI** | Enterprise IBM Carbon-inspired aesthetic with rich dark/light UI tokens. |
| **Interactive Graph Visualizer** | **React Flow (`@xyflow/react`)** | Dynamic, node-based visual rendering of the Prerequisite Knowledge DAG. |
| **Telemetry & Metrics Charts** | **Recharts** | Real-time cognitive velocity charts, student dwell-time histograms, and cohort heatmaps. |
| **Psychometric IRT Engine** | **TypeScript Numerical Engine** | In-browser 2-Parameter Logistic (2PL) Item Response Theory & Bayesian posterior updates. |
| **Contextual Bandit Engine** | **LinUCB Algorithm (Client-Side)** | Real-time adaptive modality selector balancing exploration & exploitation based on student dwell time. |
| **Starter Pack Datasets** | **Embedded JSON Micro-Datastores** | Pre-calibrated item pools from MathE (difficulty $b$, discrimination $a$), EdNet interaction profiles, and UCI student performance risk benchmarks. |
| **Socratic AI Simulation** | **Granite 3.0 / watsonx Scaffold Engine** | Structured multi-tier hint generators producing pedagogical guidance without hallucinating grades. |

---

## 🖥️ Screen-by-Screen Pitch Walkthrough

Skill-Bee includes a dedicated **Judge / Pitch Presenter Bar** at the top, enabling instant 1-click transitions across the entire user journey:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🐝 Skill-Bee Live Demo Navigator:  [1. Student Onboarding & CAT]  [2. Dual-Horizon Dashboard]  [3. Faculty ICU Cockpit]  [4. Datasets & Tech Proof] │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Screen 1: Cold-Start Onboarding & Adaptive CAT
* **Step 1:** Student logs in and connects to classroom: `CS302 - Dr. Sharma - 4th Sem Engineering Math & Computing`.
* **Step 2:** Selects target career path: `AI & Machine Learning Engineer`.
* **Step 3 (Live 3-Question Adaptive Test):** Serves real questions from the **MathE dataset**.
  - As the judge clicks an answer, the live **Latent Ability ($\theta$) Gauge** dynamically shifts in real-time using Bayesian updating!
  - Diagnoses prerequisite gaps (e.g., *Matrix Eigenvalues: 32% - At Risk*).

### Screen 2: Dual-Horizon Student Dashboard & Adaptive Player
* **Interactive Knowledge DAG (React Flow):** 
  - Visual nodes: Green (Mastered), Amber (In Progress), Red (Blocked Prerequisite).
  - Clicking `Neural Network Backpropagation` opens the backward traversal inspector: *"Blocked: Missing prerequisite Multivariable Chain Rule (Calculus II)!"*
* **Adaptive Multi-Modal Content Player:**
  - Demonstrates **LinUCB Contextual Bandit** in action.
  - Live friction simulator: Sliders for *Dwell Time* and *Retry Count* (EdNet telemetry) dynamically trigger modality shifts (Code Playground ➔ Visual Simulation ➔ Socratic Cheatsheet).
* **Socratic AI Companion:**
  - Simulates IBM Granite 3.0 progressive hints (Level 1: Intuition ➔ Level 2: Scaffolding ➔ Level 3: Micro-Step).

### Screen 3: Faculty ICU Cockpit (The Triage Command Center)
* **Cohort Health Radar:** 
  - Live class stratification into **🟢 Green (60%)**, **🟡 Amber (25%)**, and **🔴 Red (15%)** tiers.
* **Pre-Exam Early Warning Matrix:**
  - Trained on the **UCI Higher Education dataset** (attendance, past GPA, study habits), highlighting students with $>75\%$ probability of failing the upcoming mid-term.
* **3 Interactive One-Click Actions:**
  1. ⚡ **Dispatch Remedial Micro-Quiz:** Opens a modal with a 5-minute pre-lecture quiz auto-targeted at the class's top bottleneck (*Matrix Inversion*).
  2. 🤝 **Automated Peer-to-Peer Matchmaker:** Shows instant smart pairings (e.g., *Rohan [Red]* paired with *Ananya [Green]* for Lab 4).
  3. 📄 **1-Page Student Diagnostic Dossier:** Generates an instant printable briefing card for 1-on-1 office hours.

### Screen 4: Dataset & Algorithmic Proof (For Judges)
* Interactive inspector showing raw data from **MathE**, **EdNet**, and **UCI** and how each formula (2PL-IRT, Bayes, LinUCB) operates under the hood.

---

## 📁 Pure React Project Structure

```
Skill-Bee/
├── README.md                 # Complete system documentation
├── Problem Statement.txt     # Official IBM hackathon challenge brief
│
└── frontend/                 # Complete React SPA (Vite + TS + Tailwind)
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── vite.config.ts
    ├── src/
    │   ├── data/             # Embedded real starter pack datasets
    │   │   ├── matheItems.ts        # MathE questions with calibrated (a, b) parameters
    │   │   ├── ednetProfiles.ts     # EdNet telemetry & interaction behavior logs
    │   │   └── uciCohortData.ts     # UCI student performance & risk features
    │   │
    │   ├── engine/           # Pure TypeScript Cognitive Engine
    │   │   ├── irtEngine.ts         # 2PL-IRT ability calculation & Bayesian updates
    │   │   ├── conceptDAG.ts        # Knowledge graph nodes & prerequisite traversal
    │   │   ├── banditRecommender.ts # LinUCB adaptive modality selector
    │   │   └── riskClassifier.ts    # UCI failure probability scoring
    │   │
    │   ├── components/       # UI Component Library
    │   │   ├── common/              # Header, TopDemoBar, StatCard, Badge, Modal
    │   │   ├── graph/               # KnowledgeDAG.tsx (Interactive React Flow)
    │   │   ├── student/             # AdaptivePlayer, SocraticDrawer, DiagnosticQuiz
    │   │   └── faculty/             # TriageRadar, CohortHeatmap, ActionModals
    │   │
    │   ├── pages/            # Pitch Pages
    │   │   ├── OnboardingPage.tsx   # Classroom sync + Career Goal + CAT Test
    │   │   ├── StudentDashboard.tsx # Dual-Horizon Roadmap & Adaptive Engine
    │   │   ├── FacultyCockpit.tsx   # ICU Triage & One-Click Interventions
    │   │   └── TechProofPage.tsx    # Live Dataset & Algorithm Inspector
    │   │
    │   ├── App.tsx           # Main app layout with TopDemoBar navigator
    │   └── main.tsx          # React entry point
```

---

## 🎯 Target Performance Benchmarks

- **Diagnostic Accuracy:** $\text{AUC} \ge 0.82$ on next-question response prediction.
- **Root-Cause Precision:** $\ge 90\%$ accuracy in isolating foundational math gaps behind ML failures.
- **Faculty Triage Latency:** Reduces instructor intervention decision time to $< 30$ seconds.
- **Computational Footprint:** Sub-15ms inference latency on a single CPU core with $< 50\text{ MB}$ RAM footprint for deployment on local college intranet servers.

---

## 👥 Authors & Acknowledgments

- **Team:** `team_063`
- **Hackathon:** IBM National Hackathon — BOB Hacks
- **Mentorship:** IBM Technology Expert Labs

