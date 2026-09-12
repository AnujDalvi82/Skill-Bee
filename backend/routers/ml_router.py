from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from ml.orchestrator import cognitive_orchestrator

router = APIRouter(prefix="/api/ml", tags=["Cognitive Machine Learning Engine"])

class TelemetryEvaluationRequest(BaseModel):
    dwell_time_sec: float = Field(..., description="Seconds spent on active question/screen")
    hint_count: int = Field(0, description="Total progressive hints requested")
    attempt_count: int = Field(1, description="Number of submission attempts")
    item_difficulty_b: float = Field(0.0, description="2PL-IRT calibrated difficulty b of the item")

class StudentRiskInferenceRequest(BaseModel):
    static_survey: Optional[List[float]] = Field(
        None,
        description="30-item UCI demographic/academic survey values (defaults to standard median student if omitted)"
    )
    latent_theta: float = Field(..., description="Student current 2PL-IRT latent math ability")
    friction_index: float = Field(..., description="EdNet telemetry friction index F in [0, 1]")
    dwell_ratio: float = Field(1.0, description="Dwell time ratio (actual / expected)")
    hint_rate: float = Field(0.0, description="Hint consumption rate")

@router.get("/status", summary="Query Live ML Models & Hardware Status")
def get_ml_status():
    """Returns runtime status of all 3 trained models and hardware acceleration."""
    return cognitive_orchestrator.get_system_status()

@router.post("/telemetry/evaluate", summary="Evaluate Real-Time Telemetry via EdNet Classifier")
def evaluate_telemetry(req: TelemetryEvaluationRequest):
    """
    Evaluates streaming student behavior.
    Classifies state into NORMAL_ENGAGEMENT, FRUSTRATED_BLOCK, or BLIND_GUESSING,
    and returns continuous Friction Index F for LinUCB bandit switching.
    """
    return cognitive_orchestrator.evaluate_telemetry(
        dwell_time_sec=req.dwell_time_sec,
        hint_count=req.hint_count,
        attempt_count=req.attempt_count,
        item_difficulty_b=req.item_difficulty_b
    )

@router.get("/cat/adaptive-question", summary="Select Next Item via Fisher Information Maximization")
def get_adaptive_question(
    topic: str = Query("Linear Algebra", description="Topic to test"),
    theta: float = Query(0.0, description="Student current latent ability theta"),
    answered: Optional[str] = Query(None, description="Comma-separated question IDs already answered")
):
    """
    Selects the optimal question from the 833 calibrated MathE items
    that maximizes Fisher Information I(theta) at the student's current ability.
    """
    answered_ids = [int(q.strip()) for q in answered.split(",") if q.strip().isdigit()] if answered else []
    selected = cognitive_orchestrator.select_next_adaptive_question(
        topic=topic,
        current_theta=theta,
        answered_ids=answered_ids
    )
    return selected

@router.post("/risk/predict", summary="Predict Student Failure Risk via Multi-Modal Network")
def predict_student_risk(req: StudentRiskInferenceRequest):
    """
    Executes Multi-Modal Neural Network inference
    combining static survey features with dynamic MathE theta and EdNet friction.
    Returns P_fail and Green/Amber/Red triage tier.
    """
    static_vec = req.static_survey if req.static_survey and len(req.static_survey) == 30 else [2.0] * 30
    return cognitive_orchestrator.predict_student_risk(
        static_survey_vector=static_vec,
        latent_theta=req.latent_theta,
        friction_index=req.friction_index,
        dwell_ratio=req.dwell_ratio,
        hint_rate=req.hint_rate
    )
