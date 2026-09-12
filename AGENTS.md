# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
**Skill-Bee** — Adaptive Learning Intelligence Platform for the IBM National Hackathon (Problem Statement 4).
Monorepo with two independent services: `frontend/` (Next.js 16) and `backend/` (FastAPI Python).

## Commands

### Frontend (run from `frontend/`)
```
npm run dev       # Next.js dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint (eslint-config-next)
```
> No test suite is configured in the frontend.

### Backend (run from `backend/`)
```
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # Dev server on http://127.0.0.1:8000
```
> No test suite is configured in the backend. Interactive API docs at http://127.0.0.1:8000/docs.

## Critical Architecture Notes

### Backend imports use bare module names (not package paths)
All backend modules import each other directly (e.g., `from database import get_db`, `import models, security`) because uvicorn runs from the `backend/` directory. Do **not** add `backend.` prefixes.

### SQLite is the active dev database — not PostgreSQL
`config.py` defaults `DATABASE_URL` to `sqlite:///./scamper.db` (file at `backend/scamper.db`). The TECH_STACK.md describes PostgreSQL as the production target, but the running code uses SQLite.

### JWT secret is hardcoded in `security.py`
`SECRET_KEY = "skillbee-ibm-national-hackathon-super-secret-key-2026"` is set directly in `backend/security.py`, **not** read from `config.py`'s `SECRET_KEY` field. These are two separate, inconsistent secrets.

### Frontend operates in offline/mock-data mode by default
All views use locally-defined TypeScript data (`src/data/`, `src/engine/`) and fall back gracefully when the backend is unreachable. `ApiClient.checkBackendHealth()` has a 1500ms timeout. The frontend is fully functional without a running backend.

### IRT engine is duplicated across frontend and backend
- `frontend/src/engine/irtEngine.ts` — 2PL-IRT with Bayesian theta updating, used for live in-browser CAT
- `backend/routers/cat_router.py` — MAP grid-search IRT, used for server-side evaluation endpoint
- Both use `D = 1.702` (standard 2PL scaling constant). The frontend learning rate is `0.45`; the backend uses 120-step grid search. These are **not** equivalent — the frontend is a live stepper, the backend is a batch evaluator.

### Auth is optional on all backend endpoints
`current_user: Optional[models.User] = Depends(security.get_current_user)` — unauthenticated requests are accepted; theta is only persisted to DB when `current_user` is not None.

### Frontend router is view-state, not URL-based
Navigation between `hero`, `onboarding`, `roadmap`, `lecture`, `faculty`, `proof` is pure React state in `page.tsx` — no `next/router` or URL changes. Deep-linking to a view is not possible.

## Code Style

### Frontend (TypeScript / Next.js)
- All types defined in `src/lib/types.ts` — add new shared types there only
- `@/` path alias maps to `src/` (configured in `tsconfig.json`)
- All components are `'use client'` — no Server Components currently used
- Tailwind classes only; no CSS modules or styled-components
- Brand palette: background `#fbf9f6`, text `#1b1c1a`, accent IBM Blue `#0f62fe`, honey `#ffe24c`
- `clsx` + `tailwind-merge` available for conditional class merging

### Backend (Python / FastAPI)
- Pydantic v2 schemas in `schemas.py`; SQLAlchemy 2.0 models in `models.py`
- All routers register with prefix `/api/<subsystem>` and are included in `main.py`
- `UserRole` enum in `models.py` uses ALL_CAPS strings (`"STUDENT"`, `"FACULTY"`, `"ADMIN"`)
- DB primary keys are UUID strings (`str(uuid.uuid4())`), not integers

### Adding a new router
1. Create `backend/routers/<name>_router.py` with `router = APIRouter(prefix="/api/<name>", ...)`
2. Import and register in `backend/main.py` with `app.include_router(...)`
