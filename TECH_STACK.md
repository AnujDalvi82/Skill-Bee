# ??? Skill-Bee ? Comprehensive Technology Stack & Architectural Decisions

**Document Version:** 1.0.0  
**Target Platform:** Skill-Bee (Closed-Loop Adaptive Learning Intelligence Platform)  
**Hackathon Track:** IBM National Hackathon ? Problem Statement No. 4 (*Making Learning Intelligent using AI*)  
**Architecture Paradigm:** Hybrid Next.js Fullstack Client + Dedicated FastAPI Cognitive Microservice  

---

## 1. Executive Summary & Evaluation Matrix

To deliver a platform that is **ultra-responsive for students, insightful for professors, mathematically rigorous for psychometrics, and enterprise-ready for university deployment**, the system is architected across specialized, best-in-class layers:

```
                      ???????????????????????????????????????????????????????????????
                      ?                      CLIENT TIER                            ?
                      ?      Next.js 15 (App Router, React 19, TypeScript)          ?
                      ?   Tailwind CSS + shadcn/ui + React Flow (@xyflow/react)     ?
                      ???????????????????????????????????????????????????????????????
                                                     ? HTTPS / WebSocket (Telemetry)
                                                     ?
                      ???????????????????????????????????????????????????????????????
                      ?                      BACKEND & API                          ?
                      ?       FastAPI (Python 3.11+) + Next.js Route Handlers       ?
                      ?        (Dual API: Next.js for Web / FastAPI for ML)         ?
                      ???????????????????????????????????????????????????????????????
                                     ?                              ?
           ?????????????????????????????????????          ???????????????????????????
           ?                                   ?          ?                         ?
  ????????????????????               ?????????????????????????????????????? ?????????????????
  ? DATABASE & CACHE ?               ? NUMERIC COGNITIVE?? FAST-WHISPER & ? ? AUTHENTICATION?
  ? PostgreSQL +     ?               ? ENGINE           ?? IBM GRANITE    ? ? NextAuth /    ?
  ? pgvector (Prisma/?               ? NumPy, SciPy,    ?? CTranslate2 +  ? ? Supabase Auth ?
  ? SQLAlchemy)      ?               ? NetworkX, 2PL-IRT?? watsonx.ai SDK ? ? (College SSO) ?
  ????????????????????               ?????????????????????????????????????? ?????????????????
```

---

## 2. Layer-by-Layer Critical Evaluation & Selection

### 2.1 Frontend Framework: Next.js 15 (App Router)
* **Evaluated Options:** Next.js 15 vs. Vite + React SPA vs. Remix / React Router 7.
* **Why Next.js 15 Won:**
  - **Hybrid SSR & Client Islands:** Initial page loads (catalogues, landing, blog) render server-side for speed, while dynamic elements (`KnowledgeDAGCanvas`, `AdaptivePlayer`, `BeeBookDrawer`) run as fast, interactive client components (`use client`).
  - **Colocated Route Handlers:** Built-in `/api/` endpoints eliminate CORS friction during development and demo presentations.
  - **Enterprise Ecosystem:** Native compatibility with `@xyflow/react`, `shadcn/ui`, and `next-auth`.

### 2.2 Styling & Aesthetics: Tailwind CSS + IBM Carbon Tokens
* **Evaluated Options:** Tailwind CSS vs. CSS Modules vs. Carbon React Component Library.
* **Why Tailwind CSS + Carbon Tokens Won:**
  - Standard Carbon React components are rigid and corporate. Tailwind allows us to blend **IBM Carbon colors** (Carbon Blue `#0f62fe`, Slate `#161616`) with our **warm, cute Skillbee honey aesthetic** (Honey Gold `#ffe24c`, Linen Surface `#fbf9f6`, squircle `rounded-[32px]`).
  - Native dark/light mode toggle with zero runtime CSS overhead.

### 2.3 Knowledge Graph Visualizer: React Flow (`@xyflow/react` v12)
* **Evaluated Options:** React Flow vs. Cytoscape.js vs. D3.js.
* **Why React Flow Won:**
  - Seamless React component integration (each node in the DAG can be a custom React card with progress rings and icons).
  - Out-of-the-box support for interactive pan, zoom, minimap, and animated custom SVG bezier curves for prerequisite chains.

### 2.4 Backend & Psychometric Engine: FastAPI (Python 3.11+)
* **Evaluated Options:** FastAPI vs. Node.js (Express/NestJS) vs. Django REST Framework.
* **Why FastAPI Won:**
  - **Scientific Library Dominance:** Item Response Theory (2PL-IRT) requires `scipy.optimize` and `numpy`. Backward graph traversal requires `networkx`. Attempting this in Node.js would require fragile Python child processes.
  - **Sub-15ms Latency:** Native asynchronous event loop (`async/await`) on Uvicorn delivers lightning-fast telemetry ingestion.
  - **First-Class IBM SDK:** Official `ibm-watsonx-ai` Python SDK is maintained directly by IBM.

### 2.5 Database & Vector Store: PostgreSQL with `pgvector`
* **Evaluated Options:** PostgreSQL + `pgvector` vs. MongoDB vs. SQLite.
* **Why PostgreSQL + pgvector Won:**
  - **Relational Rigor:** Strict constraints between Students, Classrooms, Mastery Vectors, and Concept Prerequisites.
  - **Unified Vector Search:** The `pgvector` extension allows syllabus embeddings and lecture chunk search to live in the exact same database without paying for Pinecone or managing external sync pipelines.
  - **ORM:** Managed via **Prisma ORM** in Next.js and **SQLAlchemy 2.0** in FastAPI.
  - *Demo Fallback:* SQLite is supported for zero-setup offline hackathon judging.

### 2.6 Authentication & Role-Based Access: NextAuth.js (Auth.js v5)
* **Evaluated Options:** NextAuth.js vs. Clerk vs. Supabase Auth.
* **Why NextAuth.js Won:**
  - **Zero Cost & Open Source:** Handles thousands of student accounts without subscription pricing.
  - **Multi-Role Support:** Custom JWT callbacks cleanly separate permissions (`STUDENT`, `FACULTY`, `ADMIN`).
  - **Judge Demo Switcher:** Allows 1-click credential sign-in as `Rohan Verma (Student)` or `Dr. Sunita Sharma (Faculty)` for live demonstrations.

### 2.7 Multilingual Speech Engine: `faster-whisper` (CTranslate2)
* **Evaluated Options:** `faster-whisper` vs. OpenAI Cloud Whisper API vs. Browser Web Speech API.
* **Why `faster-whisper` Won:**
  - **4x Faster than Realtime:** Powered by CTranslate2 quantization (INT8/FP16), running efficiently on standard CPU or budget GPU.
  - **Zero Cloud Costs & Offline Feasibility:** Transcribes and translates Indian languages (Hindi, Tamil, Telugu, Marathi, Hinglish) locally without per-minute API fees.
  - **Timestamp Accuracy:** Word-level timestamps enable the click-to-seek BeeBook transcript functionality.

### 2.8 AI Scaffolding & Governance: IBM Granite 3.0 via watsonx.ai
* **Evaluated Options:** IBM Granite 3.0 vs. OpenAI GPT-4o vs. Open Source Llama 3.
* **Why IBM Granite 3.0 + watsonx Won:**
  - **Hackathon Track Alignment:** Directly evaluates IBM's flagship foundation models.
  - **Hallucination-Free Socratic Scaffolding:** Granite 3.0 Instruct excels at deterministic, step-by-step tutoring without revealing final solutions prematurely.
  - **watsonx.governance:** Provides audit trails and bias mitigation metrics across student demographics, fulfilling NEP 2020 and NBA accreditation equity mandates.

---

## 3. Comprehensive Technology Matrix

| Layer | Primary Technology | Secondary / Fallback | Role in Skill-Bee |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | React 19 / 18 | Client/Server hybrid SPA, routing, page layouts |
| **UI Styling** | **Tailwind CSS** | CSS Variables | Honeycomb aesthetic (`#ffe24c`, `#fbf9f6`, `#0f62fe`) |
| **Component Kit** | **shadcn/ui + Radix UI** | Headless UI | Accessible modals, tabs, sliders, badges |
| **Interactive Graph** | **React Flow (`@xyflow/react`)** | SVG Canvas | Concept Knowledge DAG and prerequisite visualization |
| **Data Visualization**| **Recharts** | Chart.js | Triage radar, student velocity, daily hour rings |
| **Web API / Sessions** | **Next.js Route Handlers** | Express.js | Client session handling and UI data aggregation |
| **Cognitive Backend** | **FastAPI (Python 3.11)** | Starlette | 2PL-IRT math, Bayesian updating, LinUCB bandit |
| **Math & Algorithms** | **NumPy, SciPy, NetworkX** | Pure TS Core | IRT optimization, cognitive graph traversal |
| **Database** | **PostgreSQL + pgvector** | SQLite (Dev) | Relational data, telemetry logs, concept embeddings |
| **ORM / Schema** | **Prisma (TS) & SQLAlchemy (Py)** | Raw SQL | Type-safe database queries and migrations |
| **Authentication** | **NextAuth.js (Auth.js v5)** | JWT Session | Role-based authentication (Student/Faculty/Demo) |
| **Speech & Audio AI** | **`faster-whisper` (CTranslate2)** | Web Speech API | Multilingual transcription, Hindi/Tamil translation |
| **Generative AI** | **IBM Granite 3.0 via watsonx.ai** | Mock Local Agent | Socratic hints, BeeBook notes, micro-quiz generator |
| **Governance & Trust**| **IBM watsonx.governance** | Custom Metrics | Explainable AI risk scores, bias & fairness checks |
| **Deployment / Cloud** | **Docker + Red Hat OpenShift** | Vercel / Railway | Enterprise containerization and scalable hosting |

---

## 4. Scalability & High-Availability Blueprint

To support a large-scale university rollout (e.g., 50,000 active engineering students across 20 colleges):
1. **Edge Caching & CDN:** Static course assets, videos, and compiled Next.js bundles are cached via Cloudflare / IBM Cloud CDN.
2. **Asynchronous Telemetry Ingestion:** EdNet-style interaction events (dwell time, clicks, hints) are ingested via an asynchronous queue (Redis / Celery) so psychometric calculations never block UI interactions.
3. **Stateless Cognitive Microservices:** FastAPI instances are stateless and containerized via Docker, allowing horizontal auto-scaling on Red Hat OpenShift based on CPU load during exam weeks.
4. **Sub-15ms Cognitive Response:** The 2PL-IRT Bayesian calculation runs via optimized vectorized NumPy kernels, delivering instant ability updates upon question submission.

---

## 5. Development & Demo Execution Strategy

To ensure zero risk during the hackathon live pitch:
- **Dual Execution Mode:**
  - **Online Cloud Mode:** Connected to live PostgreSQL and watsonx.ai APIs.
  - **Zero-Downtime Offline Demo Mode:** Built-in mock data loaders for MathE (calibrated items), EdNet (telemetry profiles), and UCI (student risk records), ensuring the demo never fails even if the venue Wi-Fi drops.
