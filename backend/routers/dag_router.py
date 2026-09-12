import math
from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api/dag", tags=["Knowledge Graph DAG & LinUCB Diagnostics"])

# Dual-Horizon DAG Nodes: College CS302 Math + AI Specialization (IBM SkillsBuild)
KNOWLEDGE_DAG_NODES = [
    {
        "id": "math_la_basics",
        "label": "Linear Algebra: Matrix Inversion & Rank",
        "category": "ACADEMIC_FOUNDATION",
        "tier": "MATH_SEM1",
        "mastery_score": 0.88,
        "status": "MASTERED",
        "prerequisites": [],
        "estimated_hours": 8,
        "ibm_badge_id": "ibm-la-foundations"
    },
    {
        "id": "math_eigenvalues",
        "label": "Eigenvalues, Eigenvectors & PCA Projection",
        "category": "ACADEMIC_FOUNDATION",
        "tier": "MATH_SEM1",
        "mastery_score": 0.42,
        "status": "BLOCKED",
        "prerequisites": ["math_la_basics"],
        "blocked_reason": "Low retention in Characteristic Polynomial roots (det(A - lambda*I) = 0)",
        "estimated_hours": 12,
        "ibm_badge_id": "ibm-spectral-theory"
    },
    {
        "id": "math_multivar_calc",
        "label": "Multivariate Calculus & Jacobians",
        "category": "ACADEMIC_FOUNDATION",
        "tier": "MATH_SEM2",
        "mastery_score": 0.58,
        "status": "IN_PROGRESS",
        "prerequisites": ["math_la_basics"],
        "estimated_hours": 14,
        "ibm_badge_id": "ibm-multivar-calculus"
    },
    {
        "id": "math_prob_bayes",
        "label": "Probability Distributions & Bayes Theorem",
        "category": "ACADEMIC_FOUNDATION",
        "tier": "MATH_SEM2",
        "mastery_score": 0.91,
        "status": "MASTERED",
        "prerequisites": [],
        "estimated_hours": 10,
        "ibm_badge_id": "ibm-prob-inference"
    },
    {
        "id": "cs_data_structures",
        "label": "Graph Traversals & Dynamic Programming",
        "category": "ACADEMIC_FOUNDATION",
        "tier": "CS_CORE",
        "mastery_score": 0.85,
        "status": "MASTERED",
        "prerequisites": [],
        "estimated_hours": 18,
        "ibm_badge_id": "ibm-dsa-advanced"
    },
    {
        "id": "ai_backprop_gradients",
        "label": "Deep Learning: Backpropagation & Chain Rule",
        "category": "INDUSTRY_CAREER",
        "tier": "AI_SPECIALIZATION",
        "mastery_score": 0.35,
        "status": "BLOCKED",
        "prerequisites": ["math_eigenvalues", "math_multivar_calc"],
        "blocked_reason": "Upstream bottleneck: Multivariate Jacobians & Eigen-decomposition",
        "estimated_hours": 16,
        "ibm_badge_id": "ibm-deep-learning-mastery"
    },
    {
        "id": "ai_attention_transformers",
        "label": "Self-Attention, KV-Cache & Transformers",
        "category": "INDUSTRY_CAREER",
        "tier": "AI_SPECIALIZATION",
        "mastery_score": 0.15,
        "status": "BLOCKED",
        "prerequisites": ["ai_backprop_gradients"],
        "blocked_reason": "Locked until Backpropagation and Linear Attention projection reach 75% mastery",
        "estimated_hours": 24,
        "ibm_badge_id": "ibm-granite-transformer-architect"
    }
]

# LinUCB Contextual Bandit parameters for 4 Learning Modalities
MODALITIES_METRICS = [
    {
        "modality": "simulation",
        "label": "Interactive Eigen-Vector 3D Canvas",
        "expected_payoff_mu": 0.89,
        "exploration_bonus_alpha": 0.22,
        "confidence_ucb": 0.94,
        "format": "Interactive Three.js Geometric Visualizer",
        "completion_time_min": 14
    },
    {
        "modality": "code",
        "label": "NumPy Eigendecomposition Notebook",
        "expected_payoff_mu": 0.82,
        "exploration_bonus_alpha": 0.18,
        "confidence_ucb": 0.88,
        "format": "Jupyter Interactive Scaffold",
        "completion_time_min": 20
    },
    {
        "modality": "proof",
        "label": "Step-by-Step Spectral Theorem Proof",
        "expected_payoff_mu": 0.65,
        "exploration_bonus_alpha": 0.25,
        "confidence_ucb": 0.73,
        "format": "Structured Math Proof Card with Active Checkpoints",
        "completion_time_min": 25
    },
    {
        "modality": "video",
        "label": "12-Min Fast-Whisper Lecture with BeeBook",
        "expected_payoff_mu": 0.78,
        "exploration_bonus_alpha": 0.15,
        "confidence_ucb": 0.83,
        "format": "Multilingual Video with Synchronized AI Notes",
        "completion_time_min": 12
    }
]

@router.get("/graph")
def get_dag_nodes():
    """Returns all nodes and edges in dual-horizon knowledge graph"""
    edges = []
    for node in KNOWLEDGE_DAG_NODES:
        for prereq in node["prerequisites"]:
            edges.append({"source": prereq, "target": node["id"]})

    return {
        "nodes": KNOWLEDGE_DAG_NODES,
        "edges": edges,
        "overall_curriculum_mastery": 0.59,
        "target_career": "AI & ML Engineer (IBM SkillsBuild Track)"
    }

@router.get("/inspect-blocker")
def inspect_blocker(node_id: str = Query(..., description="Target node to diagnose")):
    node_map = {n["id"]: n for n in KNOWLEDGE_DAG_NODES}
    target = node_map.get(node_id)
    if not target:
        raise HTTPException(status_code=404, detail=f"DAG node '{node_id}' not found")

    # Trace upstream prerequisites
    chain = []
    blockers = []

    def trace(curr_id: str, depth: int = 0):
        if depth > 5:
            return
        curr = node_map.get(curr_id)
        if not curr:
            return
        chain.append(curr)
        if curr["mastery_score"] < 0.70 and curr["id"] != node_id:
            blockers.append(curr)
        for p in curr["prerequisites"]:
            trace(p, depth + 1)

    trace(node_id)

    # Sort LinUCB recommendations by Upper Confidence Bound (UCB = mu + alpha * sqrt(ln(t)/n))
    sorted_modalities = sorted(MODALITIES_METRICS, key=lambda m: m["confidence_ucb"], reverse=True)

    return {
        "target_node": target,
        "ancestor_chain": chain,
        "root_cause_bottlenecks": blockers if blockers else [target],
        "linucb_optimal_modality": sorted_modalities[0],
        "all_modalities_scored": sorted_modalities,
        "diagnostic_summary": f"Target '{target['label']}' is blocked by lower mastery in upstream prerequisite '{blockers[0]['label'] if blockers else target['label']}'. Remediating this 12-minute micro-module will unblock AI Backpropagation."
    }
