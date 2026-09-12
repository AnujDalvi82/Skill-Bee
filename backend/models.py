import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Enum, Text
from database import Base

class UserRole(str, PyEnum):
    STUDENT = "STUDENT"
    FACULTY = "FACULTY"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    avatar = Column(String(10), default="RV")
    college = Column(String(150), default="Indian Institute of Technology")
    classroom_code = Column(String(50), default="CS302")
    career_track = Column(String(50), default="ai-engineer")
    
    # Cognitive Latent State (theta)
    latent_ability_theta = Column(Float, default=0.0)
    streak_days = Column(Integer, default=12)
    daily_hours_done = Column(Float, default=1.5)
    daily_hours_target = Column(Float, default=2.0)
    xp_points = Column(Integer, default=4820)
    preferred_modality = Column(String(20), default="simulation")
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
