import threading
from typing import List, Optional, Literal
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import get_db
import models, security

router = APIRouter(prefix="/api/faculty", tags=["Faculty ICU Triage Radar"])

# 45-Student Cohort Seed Data (CS302: Applied Mathematics & AI Engineering)
COHORT_STUDENTS = [
    {
        "id": "std_01",
        "name": "Aarav Sharma",
        "roll_no": "22CS101",
        "email": "aarav.s@college.edu",
        "avatar": "AS",
        "tier": "RED",
        "risk_score": 0.88,
        "latent_theta": -1.24,
        "standard_error": 0.18,
        "mastery_score": 0.38,
        "streak_days": 1,
        "daily_hours_done": 0.3,
        "root_cause": "Eigenvalues & Spectral Decomposition (det(A - lambda*I) = 0)",
        "preferred_modality": "simulation",
        "last_active": "3 days ago"
    },
    {
        "id": "std_02",
        "name": "Priya Patel",
        "roll_no": "22CS104",
        "email": "priya.p@college.edu",
        "avatar": "PP",
        "tier": "RED",
        "risk_score": 0.81,
        "latent_theta": -0.92,
        "standard_error": 0.21,
        "mastery_score": 0.44,
        "streak_days": 2,
        "daily_hours_done": 0.5,
        "root_cause": "Multivariate Chain Rule & Jacobians",
        "preferred_modality": "code",
        "last_active": "Yesterday"
    },
    {
        "id": "std_03",
        "name": "Vikram Malhotra",
        "roll_no": "22CS109",
        "email": "vikram.m@college.edu",
        "avatar": "VM",
        "tier": "RED",
        "risk_score": 0.79,
        "latent_theta": -0.85,
        "standard_error": 0.19,
        "mastery_score": 0.46,
        "streak_days": 0,
        "daily_hours_done": 0.1,
        "root_cause": "Vector Projection & Orthogonality in High Dimensions",
        "preferred_modality": "simulation",
        "last_active": "4 days ago"
    },
    {
        "id": "std_04",
        "name": "Ananya Roy",
        "roll_no": "22CS115",
        "email": "ananya.r@college.edu",
        "avatar": "AR",
        "tier": "AMBER",
        "risk_score": 0.54,
        "latent_theta": 0.15,
        "standard_error": 0.22,
        "mastery_score": 0.65,
        "streak_days": 6,
        "daily_hours_done": 1.2,
        "root_cause": "Second-Order Hessian Matrices in Loss Optimization",
        "preferred_modality": "video",
        "last_active": "Today"
    },
    {
        "id": "std_05",
        "name": "Rohan Verma",
        "roll_no": "22CS120",
        "email": "rohan.verma@college.edu",
        "avatar": "RV",
        "tier": "AMBER",
        "risk_score": 0.48,
        "latent_theta": 0.45,
        "standard_error": 0.20,
        "mastery_score": 0.71,
        "streak_days": 12,
        "daily_hours_done": 1.5,
        "root_cause": "Eigen-projection intuition before Deep Learning Backpropagation",
        "preferred_modality": "simulation",
        "last_active": "Today"
    },
    {
        "id": "std_06",
        "name": "Neha Joshi",
        "roll_no": "22CS126",
        "email": "neha.j@college.edu",
        "avatar": "NJ",
        "tier": "GREEN",
        "risk_score": 0.12,
        "latent_theta": 1.62,
        "standard_error": 0.16,
        "mastery_score": 0.92,
        "streak_days": 21,
        "daily_hours_done": 2.4,
        "root_cause": "None (Ready for Attention Transformers)",
        "preferred_modality": "code",
        "last_active": "Today"
    },
    {
        "id": "std_07",
        "name": "Devansh Gupta",
        "roll_no": "22CS130",
        "email": "devansh.g@college.edu",
        "avatar": "DG",
        "tier": "GREEN",
        "risk_score": 0.08,
        "latent_theta": 1.95,
        "standard_error": 0.15,
        "mastery_score": 0.96,
        "streak_days": 30,
        "daily_hours_done": 3.0,
        "root_cause": "None (IBM SkillsBuild Champion)",
        "preferred_modality": "proof",
        "last_active": "Today"
    }
]


# Intervention History log with Thread Lock and Size Bounding (M-02)
INTERVENTIONS_LOCK = threading.Lock()
INTERVENTIONS_LOG: List[dict] = []
MAX_INTERVENTIONS_HISTORY = 100

class InterventionRequest(BaseModel):
    # H-05: Strict Literal validation to prevent arbitrary string injection
    intervention_type: Literal["MICRO_BRIDGE", "AI_TA_OFFICE_HOUR", "PARENT_STUDENT_NUDGE"]
    student_ids: List[str] = Field(min_length=1, max_length=50)
    concept_key: str = Field(min_length=2, max_length=100)
    note: Optional[str] = Field(default=None, max_length=500)

@router.get("/cohort/triage")
def get_cohort_triage(
    current_faculty: models.User = Depends(security.require_faculty)
):
    """
    Returns real-time ICU Triage Radar metrics for 45-student cohort.
    - C-04 & H-03: Gated by require_faculty dependency to prevent unauthenticated PII leakage.
    """
    red_count = sum(1 for s in COHORT_STUDENTS if s["tier"] == "RED")
    amber_count = sum(1 for s in COHORT_STUDENTS if s["tier"] == "AMBER")
    green_count = sum(1 for s in COHORT_STUDENTS if s["tier"] == "GREEN")
    avg_mastery = sum(s["mastery_score"] for s in COHORT_STUDENTS) / len(COHORT_STUDENTS)

    with INTERVENTIONS_LOCK:
        recent_logs = list(INTERVENTIONS_LOG)

    return {
        "cohort_name": "CS302: Applied Mathematics & AI Engineering",
        "faculty_supervisor": current_faculty.name,
        "total_enrolled": 45,
        "displayed_sample_count": len(COHORT_STUDENTS),
        "triage_summary": {
            "red_critical": red_count,
            "amber_warning": amber_count,
            "green_on_track": green_count,
            "class_average_mastery": round(avg_mastery * 100, 1)
        },
        "critical_bottleneck_cluster": "Characteristic Polynomial & Eigenvalues (82% of RED tier failure source)",
        "students": COHORT_STUDENTS,
        "recent_interventions": recent_logs
    }

@router.post("/intervene")
def execute_intervention(
    payload: InterventionRequest,
    current_faculty: models.User = Depends(security.require_faculty)
):
    """
    Executes 1-Click Faculty Action (Micro-Bridge, AI TA, or Nudge).
    - C-04: Requires authenticated FACULTY or ADMIN caller.
    - H-05: Validated intervention_type Literal.
    - M-02: Bounded in-memory queue with max 100 records and thread safety.
    """
    record = {
        "id": f"intv_{len(INTERVENTIONS_LOG) + 1}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dispatched_by": current_faculty.email,
        "type": payload.intervention_type,
        "student_ids": payload.student_ids,
        "students_count": len(payload.student_ids),
        "concept_key": payload.concept_key,
        "note": payload.note or "Auto-dispatched via Skill-Bee Faculty ICU Command Center",
        "status": "DISPATCHED"
    }

    with INTERVENTIONS_LOCK:
        INTERVENTIONS_LOG.insert(0, record)
        # Cap memory to avoid DoS memory leak
        if len(INTERVENTIONS_LOG) > MAX_INTERVENTIONS_HISTORY:
            del INTERVENTIONS_LOG[MAX_INTERVENTIONS_HISTORY:]

    # Return informative confirmation
    if payload.intervention_type == "MICRO_BRIDGE":
        msg = f"Successfully dispatched 12-Min Micro-Bridge interactive module for '{payload.concept_key}' to {len(payload.student_ids)} students."
    elif payload.intervention_type == "AI_TA_OFFICE_HOUR":
        msg = f"Scheduled autonomous IBM Granite AI TA 1-on-1 Socratic office hours for {len(payload.student_ids)} students."
    else:
        msg = f"Dispatched encouragement & diagnostic milestone reminder nudge to {len(payload.student_ids)} student inboxes & parent contacts."

    return {
        "success": True,
        "message": msg,
        "intervention": record
    }
