from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from backend.database import get_db
from backend.models import Project, ScamperSession, Idea
from backend.schemas import (
    ProjectCreate, ProjectUpdate, ProjectResponse,
    ScamperSessionCreate, ScamperSessionUpdate, ScamperSessionResponse,
    IdeaCreate, IdeaUpdate, IdeaResponse
)

logger = logging.getLogger(__name__)
router = APIRouter()


# Project endpoints
@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new innovation project"""
    try:
        db_project = Project(**project.model_dump())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        logger.info(f"Created project: {db_project.id}")
        return db_project
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create project")


@router.get("/projects", response_model=List[ProjectResponse])
async def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all projects"""
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project_update: ProjectUpdate, db: Session = Depends(get_db)):
    """Update a project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    try:
        db.commit()
        db.refresh(db_project)
        logger.info(f"Updated project: {project_id}")
        return db_project
    except Exception as e:
        logger.error(f"Error updating project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update project")


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        db.delete(db_project)
        db.commit()
        logger.info(f"Deleted project: {project_id}")
    except Exception as e:
        logger.error(f"Error deleting project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete project")


# SCAMPER Session endpoints
@router.post("/sessions", response_model=ScamperSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(session: ScamperSessionCreate, db: Session = Depends(get_db)):
    """Create a new SCAMPER session"""
    project = db.query(Project).filter(Project.id == session.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        db_session = ScamperSession(**session.model_dump())
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        logger.info(f"Created SCAMPER session: {db_session.id}")
        return db_session
    except Exception as e:
        logger.error(f"Error creating session: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create session")


@router.get("/sessions", response_model=List[ScamperSessionResponse])
async def list_sessions(project_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List SCAMPER sessions, optionally filtered by project"""
    query = db.query(ScamperSession)
    if project_id:
        query = query.filter(ScamperSession.project_id == project_id)
    sessions = query.offset(skip).limit(limit).all()
    return sessions


@router.get("/sessions/{session_id}", response_model=ScamperSessionResponse)
async def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get a specific SCAMPER session"""
    session = db.query(ScamperSession).filter(ScamperSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.put("/sessions/{session_id}", response_model=ScamperSessionResponse)
async def update_session(session_id: int, session_update: ScamperSessionUpdate, db: Session = Depends(get_db)):
    """Update a SCAMPER session"""
    db_session = db.query(ScamperSession).filter(ScamperSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    update_data = session_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_session, field, value)
    
    try:
        db.commit()
        db.refresh(db_session)
        logger.info(f"Updated session: {session_id}")
        return db_session
    except Exception as e:
        logger.error(f"Error updating session: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update session")


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(session_id: int, db: Session = Depends(get_db)):
    """Delete a SCAMPER session"""
    db_session = db.query(ScamperSession).filter(ScamperSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        db.delete(db_session)
        db.commit()
        logger.info(f"Deleted session: {session_id}")
    except Exception as e:
        logger.error(f"Error deleting session: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete session")


# Idea endpoints
@router.post("/ideas", response_model=IdeaResponse, status_code=status.HTTP_201_CREATED)
async def create_idea(idea: IdeaCreate, db: Session = Depends(get_db)):
    """Create a new idea"""
    session = db.query(ScamperSession).filter(ScamperSession.id == idea.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        db_idea = Idea(**idea.model_dump())
        db.add(db_idea)
        db.commit()
        db.refresh(db_idea)
        logger.info(f"Created idea: {db_idea.id}")
        return db_idea
    except Exception as e:
        logger.error(f"Error creating idea: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create idea")


@router.get("/ideas", response_model=List[IdeaResponse])
async def list_ideas(session_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List ideas, optionally filtered by session"""
    query = db.query(Idea)
    if session_id:
        query = query.filter(Idea.session_id == session_id)
    ideas = query.offset(skip).limit(limit).all()
    return ideas


@router.get("/ideas/{idea_id}", response_model=IdeaResponse)
async def get_idea(idea_id: int, db: Session = Depends(get_db)):
    """Get a specific idea"""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea


@router.put("/ideas/{idea_id}", response_model=IdeaResponse)
async def update_idea(idea_id: int, idea_update: IdeaUpdate, db: Session = Depends(get_db)):
    """Update an idea"""
    db_idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    update_data = idea_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_idea, field, value)
    
    try:
        db.commit()
        db.refresh(db_idea)
        logger.info(f"Updated idea: {idea_id}")
        return db_idea
    except Exception as e:
        logger.error(f"Error updating idea: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update idea")


@router.delete("/ideas/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_idea(idea_id: int, db: Session = Depends(get_db)):
    """Delete an idea"""
    db_idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    try:
        db.delete(db_idea)
        db.commit()
        logger.info(f"Deleted idea: {idea_id}")
    except Exception as e:
        logger.error(f"Error deleting idea: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete idea")
