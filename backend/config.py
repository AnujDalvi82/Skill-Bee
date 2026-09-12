import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application configuration settings for Skill-Bee Backend"""
    
    # Application
    APP_NAME: str = "Skill-Bee Cognitive Mastery Engine"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    # CORS Origins (No Wildcards in Production)
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
        if origin.strip()
    ]
    
    # Security (C-01 & H-04)
    # Never commit default secrets to production; fall back only for local hackathon demo
    SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        os.getenv("SECRET_KEY", "skillbee-ibm-national-hackathon-super-secret-key-2026")
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # Demo & Rate Limiting (C-02 & H-02)
    ALLOW_DEMO_LOGIN: bool = os.getenv("ALLOW_DEMO_LOGIN", "true").lower() == "true"
    DEMO_PASSPHRASE: str = os.getenv("DEMO_PASSPHRASE", "")  # Optional passphrase gate
    RATE_LIMIT_AUTH: str = os.getenv("RATE_LIMIT_AUTH", "10/minute")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
