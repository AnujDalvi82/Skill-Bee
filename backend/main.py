from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Skill-Bee API",
    description="Cognitive Mastery Engine & Adaptive Learning Intelligence Platform extending IBM SkillsBuild",
    version="1.0.0"
)

# CORS Configuration for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "app": "Skill-Bee Cognitive Mastery Engine",
        "hackathon": "IBM National Hackathon (BOB)",
        "track": "Problem Statement 4 (Adaptive Learning)"
    }
