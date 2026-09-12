from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=100)
    role: Literal["STUDENT", "FACULTY"] = "STUDENT"  # M-04: Enforce role enum, prohibit ADMIN self-registration
    college: Optional[str] = "Indian Institute of Technology"
    classroom_code: Optional[str] = "CS302"
    career_track: Optional[str] = "ai-engineer"

class UserCreate(UserBase):
    # M-01: Enforce strong password length requirements
    password: str = Field(min_length=8, max_length=128, description="Minimum 8 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

class DemoLoginRequest(BaseModel):
    # C-02: Strictly validated role and optional passphrase protection
    role: Literal["STUDENT", "FACULTY"] = "STUDENT"
    passphrase: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    avatar: str
    college: Optional[str] = None
    classroom_code: Optional[str] = None
    career_track: Optional[str] = None
    latent_ability_theta: float
    streak_days: int
    daily_hours_done: float
    daily_hours_target: float
    xp_points: int
    preferred_modality: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_seconds: int = 3600
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None
