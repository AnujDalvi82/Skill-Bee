from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ProjectBase(BaseModel):
    """Base project schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Schema for creating a project"""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ScamperSessionBase(BaseModel):
    """Base SCAMPER session schema"""
    technique: str = Field(..., pattern="^(S|C|A|M|P|E|R)$")
    question: str = Field(..., min_length=1)
    answer: Optional[str] = None


class ScamperSessionCreate(ScamperSessionBase):
    """Schema for creating a SCAMPER session"""
    project_id: int


class ScamperSessionUpdate(BaseModel):
    """Schema for updating a SCAMPER session"""
    technique: Optional[str] = Field(None, pattern="^(S|C|A|M|P|E|R)$")
    question: Optional[str] = Field(None, min_length=1)
    answer: Optional[str] = None


class ScamperSessionResponse(ScamperSessionBase):
    """Schema for SCAMPER session response"""
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class IdeaBase(BaseModel):
    """Base idea schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = Field(default="draft", pattern="^(draft|reviewed|approved|rejected)$")


class IdeaCreate(IdeaBase):
    """Schema for creating an idea"""
    session_id: int


class IdeaUpdate(BaseModel):
    """Schema for updating an idea"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|reviewed|approved|rejected)$")


class IdeaResponse(IdeaBase):
    """Schema for idea response"""
    id: int
    session_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
