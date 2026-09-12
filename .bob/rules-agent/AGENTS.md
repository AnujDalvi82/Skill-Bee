# Project Coding Rules (Non-Obvious Only)

- **Backend imports are flat** — always `from database import get_db`, never `from backend.database`. Uvicorn runs from `backend/` as cwd.
- **Two separate JWT secrets** — `security.py` has a hardcoded `SECRET_KEY` that overrides `config.py`'s `SECRET_KEY`. Do not consolidate them without testing auth flows.
- **SQLite, not PostgreSQL** — `backend/scamper.db` is the live file. Do not add `psycopg2` or migration tooling without updating `config.py` and adding `DATABASE_URL` to env.
- **Frontend has no URL routing** — navigation is `useState<DemoView>` in `src/app/page.tsx`. To add a new view: add its key to the `DemoView` union in `PitchNavigatorBar.tsx`, add a conditional render block in `page.tsx`.
- **IRT math constants** — use `D = 1.702` (not `1.7`) when matching backend precision. The frontend uses `1.7` (minor discrepancy; do not "fix" it without syncing both sides).
- **New backend router checklist**: create file → add `router = APIRouter(prefix="/api/<name>")` → import & register in `main.py`. Missing the `main.py` step silently drops all routes.
- **`UserRole` must be ALL_CAPS strings** everywhere (`"STUDENT"`, `"FACULTY"`, `"ADMIN"`). Frontend types in `src/lib/types.ts` and backend SQLAlchemy enum both enforce this.
- **All shared TS types live in `src/lib/types.ts`** — do not inline interfaces in component files.
- **`ApiClient` in `src/services/api.ts` is a static class** — all methods are `static`. Do not instantiate it.
