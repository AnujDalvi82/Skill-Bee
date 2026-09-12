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

## 🛡️ IBM Technology Alignment

- **IBM Granite 3.0 via watsonx.ai:** Generates pedagogically sound, hallucination-free Socratic hints and faculty briefs.
- **watsonx.governance:** Provides transparent, auditable, and bias-free psychometric scoring, ensuring recommendations are equitable across varied socio-economic student demographics.
- **Red Hat OpenShift / IBM Cloud:** Containerized, scalable microservices designed for enterprise university deployments.

---

## 📁 Repository Structure

```
Skill-Bee/
├── datasets/                 # Real starter pack data & ingestion pipelines
│   ├── mathe/               # MathE item calibration (IRT parameters)
│   ├── ednet/               # EdNet interaction telemetry & dwell-time models
│   └── uci_performance/     # UCI academic risk predictive models
│
├── core_engine/              # Deterministic Cognitive Mastery Engine
│   ├── irt_engine.py        # 2PL-IRT + Bayesian ability & mastery computation
│   ├── concept_dag.py       # Knowledge Graph (Math prerequisites -> ML skills)
│   ├── root_cause.py        # Backward prerequisite graph traversal
│   └── bandit_recommender.py# LinUCB Contextual Bandit for adaptive modalities
│
├── faculty_cockpit/          # Faculty Triage & Early Intervention Engine
│   ├── risk_classifier.py   # Predicts student failure risk (Green / Amber / Red)
│   ├── triage_service.py    # Auto-clusters cohort bottlenecks & peer matching
│   └── remedial_generator.py# Generates 10-minute micro-quizzes & teacher dossiers
│
├── backend/                  # FastAPI Application
│   ├── api/
│   │   ├── student.py       # Onboarding, Diagnostic, Next-Action, Progress
│   │   ├── faculty.py       # Classroom overview, Heatmap, Triage alerts
│   │   └── analytics.py     # NBA/NAAC Course Outcome (CO/PO) metrics
│   ├── main.py              # Application entrypoint
│   └── requirements.txt
│
└── frontend/                 # Interactive Web Dashboard (React / Tailwind)
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/
    │   │   ├── StudentDashboard.tsx  # Dual-Horizon Roadmap & Adaptive Player
    │   │   └── FacultyCockpit.tsx    # ICU-style Triage & Intervention Radar
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
