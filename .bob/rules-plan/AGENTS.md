# Project Architecture Constraints (Non-Obvious Only)

- **Frontend and backend are fully decoupled by design** — the frontend renders a complete demo experience from mock data without the backend. Plan features assuming the frontend may run standalone.
- **The IRT/CAT engine exists in two places with different algorithms**: frontend does live Bayesian theta stepping per question; backend does full MAP grid-search over all responses. These serve different use cases and should not be merged.
- **Knowledge DAG and IRT item pool are hardcoded in Python routers** (`dag_router.py`, `cat_router.py`), not in the database. Adding persistence requires schema design + migration.
- **No migration system exists** — SQLAlchemy `Base.metadata.create_all()` in `main.py` creates tables on startup. Schema changes require dropping and recreating `scamper.db`.
- **Auth is optional on all API endpoints** — `Optional[models.User]` pattern means unauthenticated requests succeed. Any endpoint that should require auth must explicitly raise `HTTPException(401)` when `current_user is None`.
- **`@xyflow/react` v12 is used** (not v11/older React Flow) — its API differs significantly. Check `node_modules/next/dist/docs/` for Next.js 16.x specifics before adding App Router features.
- **Three career tracks are defined** but only `ai-engineer` has full data coverage in `src/data/`. `cloud-architect` and `cyber-responder` exist as type stubs only.
