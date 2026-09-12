from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRole(str):
    STUDENT = "STUDENT"
    FACULTY = "FACULTY"
    ADMIN = "ADMIN"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "STUDENT"
    college: Optional[str] = "Indian Institute of Technology"
    classroom_code: Optional[str] = "CS302"
    career_track: Optional[str] = "ai-engineer"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class DemoLoginRequest(BaseModel):
    role: str  # "STUDENT" or "FACULTY"

class UserResponse(UserBase):
    id: str
    avatar: str
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
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
