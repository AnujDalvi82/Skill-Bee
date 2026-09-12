from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import settings
from database import engine, Base
import models
from routers import auth_router, cat_router, dag_router, faculty_router, studio_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Rate Limiter setup (H-02)
limiter = Limiter(key_func=get_remote_address)

# Conditionally configure API Documentation exposure (M-03)
docs_kwargs = {}
if not settings.DEBUG and settings.ENVIRONMENT == "production":
    docs_kwargs = {"docs_url": None, "redoc_url": None, "openapi_url": None}

app = FastAPI(
    title=settings.APP_NAME,
    description="Cognitive Mastery Engine & Adaptive Learning Intelligence Platform extending IBM SkillsBuild",
    version=settings.APP_VERSION,
    **docs_kwargs
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# C-03: Strict CORS Configuration without wildcard "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# M-03: Security Response Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response

# Register All Subsystem Routers
app.include_router(auth_router.router)
app.include_router(cat_router.router)
app.include_router(dag_router.router)
app.include_router(faculty_router.router)
app.include_router(studio_router.router)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "security_mode": "hardened"
    }
