import math
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models, security

router = APIRouter(prefix="/api/cat", tags=["Computerized Adaptive Testing (CAT)"])

# Starter Calibrated MathE Item Pool (2PL-IRT)
MATHE_ITEMS = [
    {
        "id": "mathe_la_01",
        "topic": "LinearAlgebra",
        "concept_key": "eigenvalues",
        "concept_label": "Eigenvalues & Eigenvectors",
        "question": "For a square matrix A, what scalar lambda satisfies the characteristic equation det(A - lambda*I) = 0?",
        "options": ["Singular Value", "Eigenvalue", "Determinant Trace", "Condition Number"],
        "correct_index": 1,
        "difficulty_b": -0.8,
        "discrimination_a": 1.4,
    },
    {
        "id": "mathe_calc_01",
        "topic": "Calculus",
        "concept_key": "gradient_descent",
        "concept_label": "Multivariate Gradient & Jacobian",
        "question": "In gradient descent optimization, what direction does the negative gradient vector -nabla f(x) point toward?",
        "options": ["Direction of steepest ascent", "Direction of steepest descent", "Orthogonal to contour level", "Global minimum guaranteed"],
        "correct_index": 1,
        "difficulty_b": 0.2,
        "discrimination_a": 1.6,
    },
    {
        "id": "mathe_prob_01",
        "topic": "Probability",
        "concept_key": "bayes_theorem",
        "concept_label": "Bayes' Rule & Conditional Probability",
        "question": "Given Prior P(A) and Likelihood P(B|A), how is the Posterior Probability P(A|B) formulated?",
        "options": [
            "P(A|B) = [P(B|A) * P(A)] / P(B)",
            "P(A|B) = P(B|A) * P(B) / P(A)",
            "P(A|B) = P(A) + P(B) - P(A and B)",
            "P(A|B) = 1 - P(B|A)"
        ],
        "correct_index": 0,
        "difficulty_b": -0.3,
        "discrimination_a": 1.5,
    },
    {
        "id": "mathe_la_02",
        "topic": "LinearAlgebra",
        "concept_key": "matrix_derivatives",
        "concept_label": "Matrix Calculus & Jacobians",
        "question": "If f(x) = x^T A x where A is a symmetric matrix, what is the derivative df/dx with respect to vector x?",
        "options": ["A x", "2 A x", "x^T A", "0.5 A^2 x"],
        "correct_index": 1,
        "difficulty_b": 1.3,
        "discrimination_a": 1.9,
    },
    {
        "id": "mathe_calc_02",
        "topic": "Calculus",
        "concept_key": "taylor_series",
        "concept_label": "Second-Order Hessian & Curvature",
        "question": "What information does the symmetric Hessian matrix H = nabla^2 f(x) provide about a critical point in optimization?",
        "options": [
            "Learning rate step decay",
            "Local curvature and positive definiteness for extrema",
            "Sparsity pattern of activations",
            "Normalizing constant for partition function"
        ],
        "correct_index": 1,
        "difficulty_b": 1.7,
        "discrimination_a": 1.8,
    }
]

from pydantic import BaseModel, Field

class QuestionResponse(BaseModel):
    question_id: str = Field(min_length=1, max_length=100)
    is_correct: bool
    topic: str = Field(min_length=1, max_length=50)

class CATEvaluationRequest(BaseModel):
    # I-03: Cap test items to 50 to prevent algorithmic complexity DoS in MAP grid search
    responses: List[QuestionResponse] = Field(default_factory=list, max_length=50)

def irt_probability_2pl(theta: float, a: float, b: float, D: float = 1.702) -> float:
    z = D * a * (theta - b)
    # Clip z to avoid numerical overflow
    z = max(-20.0, min(20.0, z))
    return 1.0 / (1.0 + math.exp(-z))

def fisher_information(theta: float, a: float, b: float, D: float = 1.702) -> float:
    p = irt_probability_2pl(theta, a, b, D)
    q = 1.0 - p
    return (D * a) ** 2 * p * q

@router.get("/questions")
def get_cat_question_pool():
    """Return all calibrated 2PL-IRT questions in pool"""
    return {"questions": MATHE_ITEMS, "total": len(MATHE_ITEMS)}

@router.post("/evaluate")
def evaluate_cat_responses(
    req: CATEvaluationRequest,
    current_user: Optional[models.User] = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compute Maximum A Posteriori (MAP) 2PL-IRT latent ability theta,
    standard error SE(theta) = 1 / sqrt(sum(Fisher)), and select next best item.
    """
    responses = req.responses
    items_map = {item["id"]: item for item in MATHE_ITEMS}

    # Grid search / Newton-Raphson approximation for theta in [-3.0, +3.0]
    best_theta = 0.0
    best_log_posterior = -1e9
    D = 1.702

    # Prior: theta ~ N(0, 1) -> log_prior = -0.5 * theta^2
    steps = 120
    for i in range(steps):
        th = -3.0 + (6.0 * i) / (steps - 1)
        log_prior = -0.5 * (th ** 2)
        log_likelihood = 0.0
        for r in responses:
            item = items_map.get(r.question_id)
            if not item:
                continue
            p = irt_probability_2pl(th, item["discrimination_a"], item["difficulty_b"], D)
            p = max(1e-6, min(1.0 - 1e-6, p))
            log_likelihood += math.log(p) if r.is_correct else math.log(1.0 - p)
        
        log_post = log_prior + log_likelihood
        if log_post > best_log_posterior:
            best_log_posterior = log_post
            best_theta = th

    # Compute Total Test Information & Standard Error at best_theta
    total_info = 1.0  # prior information precision (1/sigma_0^2 = 1)
    answered_ids = set(r.question_id for r in responses)

    for r in responses:
        item = items_map.get(r.question_id)
        if item:
            total_info += fisher_information(best_theta, item["discrimination_a"], item["difficulty_b"], D)

    se = 1.0 / math.sqrt(max(0.1, total_info))

    # Pick next recommended question maximizing Fisher information among unasked
    next_question_id = None
    max_info = -1.0
    for item in MATHE_ITEMS:
        if item["id"] not in answered_ids:
            info = fisher_information(best_theta, item["discrimination_a"], item["difficulty_b"], D)
            if info > max_info:
                max_info = info
                next_question_id = item["id"]

    # Topic breakdown
    topic_scores: Dict[str, Dict[str, int]] = {}
    for r in responses:
        item = items_map.get(r.question_id)
        if item:
            top = item["topic"]
            if top not in topic_scores:
                topic_scores[top] = {"correct": 0, "total": 0}
            topic_scores[top]["total"] += 1
            if r.is_correct:
                topic_scores[top]["correct"] += 1

    topic_percentages = {
        k: round((v["correct"] / v["total"]) * 100, 1) if v["total"] > 0 else 50.0
        for k, v in topic_scores.items()
    }

    # Determine mastery level
    if best_theta >= 1.0:
        mastery_level = "ADVANCED_MASTERY"
    elif best_theta >= 0.0:
        mastery_level = "PROFICIENT_FOUNDATION"
    elif best_theta >= -1.0:
        mastery_level = "DEVELOPING_NEED_PREREQ"
    else:
        mastery_level = "CRITICAL_GAPS_DETECTED"

    # Save to user cognitive state in database if user is authenticated
    if current_user:
        current_user.latent_ability_theta = round(best_theta, 2)
        db.commit()

    return {
        "theta": round(best_theta, 2),
        "standard_error": round(se, 2),
        "confidence_interval": [round(best_theta - 1.96 * se, 2), round(best_theta + 1.96 * se, 2)],
        "mastery_level": mastery_level,
        "topic_breakdown": topic_percentages,
        "next_recommended_question_id": next_question_id or "COMPLETED"
    }
