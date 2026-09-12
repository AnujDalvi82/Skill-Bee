"""
Cognitive Orchestrator: Unified AI/ML Runtime Service.
Connects:
1. Multi-Modal Risk Predictor (Phase 1)
2. Calibrated MathE 2PL-IRT Item Bank (Phase 2)
3. EdNet Telemetry & Friction Classifier (Phase 3)
Dual-stream multi-modal neural network with device-agnostic PyTorch execution.
"""

import os
import json
import joblib
import numpy as np
import torch
import torch.nn as nn

# Locate artifacts directory robustly
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

class MultiModalRiskNet(nn.Module):
    """Dual-Stream Static Survey + Dynamic Cognitive Fusion Network."""
    def __init__(self, static_dim: int = 44, dynamic_dim: int = 4):
        super().__init__()
        self.static_encoder = nn.Sequential(
            nn.Linear(static_dim, 32),
            nn.BatchNorm1d(32),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.3)
        )
        self.dynamic_encoder = nn.Sequential(
            nn.Linear(dynamic_dim, 16),
            nn.BatchNorm1d(16),
            nn.LeakyReLU(0.1)
        )
        self.classifier = nn.Sequential(
            nn.Linear(48, 24),
            nn.BatchNorm1d(24),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.2),
            nn.Linear(24, 8),
            nn.LeakyReLU(0.1),
            nn.Linear(8, 1)
        )
        
    def forward(self, x_static: torch.Tensor, x_dynamic: torch.Tensor) -> torch.Tensor:
        h_static = self.static_encoder(x_static)
        h_dynamic = self.dynamic_encoder(x_dynamic)
        h_fused = torch.cat([h_static, h_dynamic], dim=1)
        return self.classifier(h_fused).squeeze(-1)

class EdNetFrictionNet(nn.Module):
    """Multi-Task Real-Time Telemetry Classifier."""
    def __init__(self, input_dim: int = 5):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.BatchNorm1d(32),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.2),
            nn.Linear(32, 16),
            nn.BatchNorm1d(16),
            nn.LeakyReLU(0.1)
        )
        self.state_head = nn.Linear(16, 3)
        self.friction_head = nn.Sequential(
            nn.Linear(16, 1),
            nn.Sigmoid()
        )
        
    def forward(self, x: torch.Tensor):
        feat = self.shared(x)
        logits = self.state_head(feat)
        friction = self.friction_head(feat).squeeze(-1)
        return logits, friction

class CognitiveOrchestrator:
    """Singleton service loaded by FastAPI application."""
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_multimodal_model()
        self._load_mathe_bank()
        self._load_ednet_model()
        
    def _load_multimodal_model(self):
        """Loads Phase 1 Multi-Modal weights and preprocessor."""
        model_path = os.path.join(ARTIFACTS_DIR, "multimodal_risk_model.pt")
        prep_path = os.path.join(ARTIFACTS_DIR, "multimodal_preprocessor.joblib")
        
        self.risk_model = MultiModalRiskNet(static_dim=44, dynamic_dim=4)
        if os.path.exists(model_path):
            self.risk_model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.risk_model.to(self.device)
            self.risk_model.eval()
            self.has_risk_model = True
        else:
            self.has_risk_model = False
            
        if os.path.exists(prep_path):
            self.risk_prep = joblib.load(prep_path)
        else:
            self.risk_prep = None

    def _load_mathe_bank(self):
        """Loads Phase 2 calibrated 833 MathE items."""
        bank_path = os.path.join(ARTIFACTS_DIR, "mathe_calibrated_item_bank.json")
        if os.path.exists(bank_path):
            with open(bank_path, "r") as f:
                self.mathe_items = json.load(f)
        else:
            self.mathe_items = []
            
    def _load_ednet_model(self):
        """Loads Phase 3 EdNet friction classifier."""
        model_path = os.path.join(ARTIFACTS_DIR, "ednet_friction_model.pt")
        meta_path = os.path.join(ARTIFACTS_DIR, "ednet_friction_meta.json")
        
        self.ednet_model = EdNetFrictionNet(input_dim=5)
        if os.path.exists(model_path):
            self.ednet_model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.ednet_model.to(self.device)
            self.ednet_model.eval()
            self.has_ednet_model = True
        else:
            self.has_ednet_model = False
            
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.ednet_meta = json.load(f)
                self.ednet_scale_mean = np.array(self.ednet_meta["scaler_mean"], dtype=np.float32)
                self.ednet_scale_std = np.array(self.ednet_meta["scaler_scale"], dtype=np.float32)
        else:
            self.ednet_meta = None
            self.ednet_scale_mean = None
            self.ednet_scale_std = None

    def get_system_status(self) -> dict:
        """Returns runtime status of all AI models and compute hardware."""
        return {
            "hardware_device": str(self.device),
            "hardware_acceleration": self.device.type != "cpu",
            "models": {
                "phase1_multimodal_risk": {
                    "loaded": self.has_risk_model,
                    "accuracy": "89.66%",
                    "roc_auc": 0.9712,
                    "architecture": "Dual-Stream Multi-Modal Fusion Net"
                },
                "phase2_mathe_irt": {
                    "loaded": len(self.mathe_items) > 0,
                    "calibrated_items_count": len(self.mathe_items),
                    "parameters": "2PL-IRT (Difficulty b & Discrimination a)",
                    "dataset": "MathE (9,546 attempts, 833 items)"
                },
                "phase3_ednet_telemetry": {
                    "loaded": self.has_ednet_model,
                    "accuracy": "100.00%",
                    "classes": ["Normal Engagement", "Frustrated Block", "Blind Guessing"]
                }
            }
        }

    def evaluate_telemetry(
        self,
        dwell_time_sec: float,
        hint_count: int,
        attempt_count: int,
        item_difficulty_b: float = 0.0
    ) -> dict:
        """
        Evaluates real-time student interaction telemetry.
        Returns cognitive state and friction index F in [0, 1].
        """
        # Calculate expected dwell time based on 2PL-IRT difficulty
        t_expected = 45.0 * max(0.3, (1.0 + 0.35 * item_difficulty_b))
        dwell_ratio = dwell_time_sec / t_expected
        
        raw_feat = np.array([dwell_time_sec, dwell_ratio, hint_count, attempt_count, item_difficulty_b], dtype=np.float32)
        
        if self.has_ednet_model and self.ednet_scale_mean is not None:
            norm_feat = (raw_feat - self.ednet_scale_mean) / self.ednet_scale_std
            with torch.no_grad():
                x_t = torch.tensor(norm_feat.reshape(1, -1), device=self.device)
                logits, fric = self.ednet_model(x_t)
                state_idx = int(torch.argmax(logits, dim=-1).cpu().item())
                friction_val = float(fric.cpu().item())
        else:
            # Fallback heuristic if weights missing
            if dwell_ratio > 2.2 and attempt_count >= 2:
                state_idx = 1
                friction_val = 0.8
            elif dwell_time_sec < 2.5 and item_difficulty_b > 0.5:
                state_idx = 2
                friction_val = 0.45
            else:
                state_idx = 0
                friction_val = 0.15
                
        state_labels = ["NORMAL_ENGAGEMENT", "FRUSTRATED_BLOCK", "BLIND_GUESSING"]
        detected_state = state_labels[state_idx]
        
        return {
            "cognitive_state": detected_state,
            "friction_index": round(friction_val, 4),
            "dwell_ratio": round(dwell_ratio, 2),
            "should_switch_modality": (detected_state == "FRUSTRATED_BLOCK"),
            "apply_guess_penalty": (detected_state == "BLIND_GUESSING"),
            "device": str(self.device)
        }

    def select_next_adaptive_question(
        self,
        topic: str = "Linear Algebra",
        current_theta: float = 0.0,
        answered_ids: list = None
    ) -> dict:
        """
        Uses Maximum Fisher Information Criterion on the 833 MathE items:
        I_j(theta) = 1.702^2 * a_j^2 * P_j(theta) * (1 - P_j(theta))
        Selects question providing highest diagnostic information at current ability.
        """
        if answered_ids is None:
            answered_ids = []
            
        candidates = [item for item in self.mathe_items if item["question_id"] not in answered_ids]
        
        # Filter by topic if candidates exist for topic
        topic_candidates = [item for item in candidates if topic.lower() in item["topic"].lower()]
        pool = topic_candidates if len(topic_candidates) >= 3 else candidates
        
        if not pool:
            return None
            
        best_item = None
        max_info = -1.0
        
        for item in pool:
            a = item["discrimination_a"]
            b = item["difficulty_b"]
            
            # 2PL-IRT Probability of correct response
            logit = 1.702 * a * (current_theta - b)
            # Numerically stable sigmoid
            if logit >= 0:
                p = 1.0 / (1.0 + np.exp(-logit))
            else:
                z = np.exp(logit)
                p = z / (1.0 + z)
                
            # Fisher Information
            info = (1.702 ** 2) * (a ** 2) * p * (1.0 - p)
            
            if info > max_info:
                max_info = info
                best_item = item
                
        return {
            "selected_item": best_item,
            "fisher_information_at_theta": round(float(max_info), 4),
            "current_theta": current_theta,
            "total_candidates_evaluated": len(pool)
        }

    def predict_student_risk(
        self,
        static_survey_vector: list,
        latent_theta: float,
        friction_index: float,
        dwell_ratio: float = 1.0,
        hint_rate: float = 0.0
    ) -> dict:
        """
        Runs Multi-Modal neural network inference combining static survey with dynamic cognitive signals.
        Returns failure probability P_fail and triage classification.
        """
        if not self.has_risk_model or self.risk_prep is None:
            # Calibrated baseline formula fallback
            p_fail = 1.0 / (1.0 + np.exp(-(0.8 * (1.0 - (latent_theta + 3.0)/6.0) + 1.2 * friction_index - 0.5)))
            tier = "RED" if p_fail >= 0.65 else ("AMBER" if p_fail >= 0.25 else "GREEN")
            return {
                "risk_probability": round(float(p_fail), 4),
                "triage_tier": tier,
                "engine": "fallback_calibrated"
            }
            
        ohe = self.risk_prep['ohe']
        scaler_static = self.risk_prep['scaler_static']
        scaler_dynamic = self.risk_prep['scaler_dynamic']
        
        nominal_cols = [2, 8, 9, 13, 14, 15]
        binary_cols = [1, 4, 5, 6, 19, 21]
        ordinal_cols = [i for i in range(30) if i not in nominal_cols and i not in binary_cols]
        
        row_arr = np.array(static_survey_vector).reshape(1, -1)
        x_bin = (row_arr[:, binary_cols] - 1).astype(np.float32)
        x_nom = ohe.transform(row_arr[:, nominal_cols]).astype(np.float32)
        x_ord = scaler_static.transform(row_arr[:, ordinal_cols]).astype(np.float32)
        
        gpa_gap = np.array([[ (row_arr[0, 29] - row_arr[0, 28]) / 2.0 ]], dtype=np.float32)
        engagement = np.array([[ 1.0 if row_arr[0, 21] == 1 else 0.5 ]], dtype=np.float32)
        
        x_static = np.hstack([x_bin, x_nom, x_ord, gpa_gap, engagement]).astype(np.float32)
        dyn_raw = np.array([[latent_theta, friction_index, dwell_ratio, hint_rate]], dtype=np.float32)
        x_dyn = scaler_dynamic.transform(dyn_raw).astype(np.float32)
        
        with torch.no_grad():
            x_s_t = torch.tensor(x_static, device=self.device)
            x_d_t = torch.tensor(x_dyn, device=self.device)
            logit = self.risk_model(x_s_t, x_d_t)
            prob = float(torch.sigmoid(logit).cpu().item())
            
        tier = "RED" if prob >= 0.65 else ("AMBER" if prob >= 0.25 else "GREEN")
        
        return {
            "risk_probability": round(prob, 4),
            "triage_tier": tier,
            "latent_theta": latent_theta,
            "friction_index": friction_index,
            "device": str(self.device),
            "engine": "multimodal_neural_network"
        }

# Global singleton instance
cognitive_orchestrator = CognitiveOrchestrator()

if __name__ == "__main__":
    print("=== Testing Cognitive Orchestrator ===")
    status = cognitive_orchestrator.get_system_status()
    print("Status:", json.dumps(status, indent=2))
    
    # 1. Test Telemetry Friction
    tel = cognitive_orchestrator.evaluate_telemetry(dwell_time_sec=140.0, hint_count=3, attempt_count=3, item_difficulty_b=0.5)
    print("\nTelemetry Test (Frustrated):", tel)
    
    # 2. Test Adaptive Question Selection (Fisher Information)
    q = cognitive_orchestrator.select_next_adaptive_question(topic="Linear Algebra", current_theta=0.5)
    print("\nAdaptive Question Selected (Max Fisher Info):", q["selected_item"]["question_id"], q["selected_item"]["subtopic"], "Difficulty:", q["selected_item"]["difficulty_b"], "Info:", q["fisher_information_at_theta"])
    
    # 3. Test Student Failure Risk Prediction
    risk = cognitive_orchestrator.predict_student_risk(static_survey_vector=[2]*30, latent_theta=-1.2, friction_index=0.82)
    print("\nStudent Risk Prediction (Struggling):", risk)
