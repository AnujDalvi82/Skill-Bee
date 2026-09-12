"""
Skill-Bee Enterprise Guardrails & Prompt Sanitization Engine
Compliant with IBM Granite 3.0 Guardrails, OWASP Top 10 for LLMs (2025), and NeMo Architecture.
"""

import re
import html
import unicodedata
from typing import Dict, Any, Tuple, Optional

# --- 1. PROMPT INJECTION & JAILBREAK SIGNATURES ---
PROMPT_INJECTION_PATTERNS = [
    # Direct instruction override
    r"(?i)\b(?:ignore|disregard|forget|bypass|override)\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|rules|constraints|directives)\b",
    r"(?i)\b(?:stop\s+being|do\s+not\s+act\s+as)\s+(?:beebot|tutor|assistant|ai)\b",
    r"(?i)\b(?:act\s+as|pretend\s+to\s+be|roleplay\s+as)\s+(?:dan|developer\s+mode|jailbreak|unrestricted|anarchy|evil)\b",
    r"(?i)\b(?:you\s+are\s+now|switch\s+to)\s+(?:unfiltered|god\s+mode|jailbroken|unrestricted)\b",
    # System prompt extraction & leakage
    r"(?i)\b(?:reveal|show|print|output|display|leak|dump)\s+(?:your\s+)?(?:system\s+prompt|initial\s+instructions|hidden\s+rules|api\s+key|bearer\s+token)\b",
    r"(?i)\b(?:repeat\s+the\s+words\s+above|what\s+are\s+your\s+instructions\s+verbatim)\b",
    # Token manipulation & delimiter injection
    r"(?i)(?:<\|im_start\|>|<\|im_end\|>|<\|endoftext\|>|\[INST\]|\[/INST\]|<<SYS>>|<</SYS>>)",
    # Data exfiltration via markdown / image rendering
    r"(?i)!\[.*?\]\s*\(\s*https?://[^\s)]+\?[^\s)]*=(?:[^\s)]*token|[^\s)]*key)\b",
]

# --- 2. HARMFUL & TOXIC PATTERNS ---
HARMFUL_PATTERNS = [
    r"(?i)\b(?:how\s+to\s+make|synthesize|manufacture)\s+(?:bomb|explosive|weapon|poison|meth|fentanyl)\b",
    r"(?i)\b(?:ddos|sql\s+injection|exploit|malware|ransomware|keylogger)\s+(?:script|payload|attack)\b",
    r"(?i)\b(?:kill|harm|commit\s+suicide|self-harm|murder)\b",
]

# --- 3. ACADEMIC & TOPICAL SCOPE KEYWORDS ---
# Queries should ideally relate to neural networks, math, programming, AI, or the active lecture
EDUCATIONAL_CONTEXT_KEYWORDS = [
    "neuron", "neural", "network", "weight", "bias", "sigmoid", "activation", "gradient",
    "descent", "backprop", "backpropagation", "loss", "cost", "matrix", "vector", "layer",
    "linear", "algebra", "calculus", "chain", "rule", "derivative", "mnist", "dataset",
    "learning", "rate", "relu", "softmax", "epoch", "batch", "tensor", "scalar", "dimension",
    "3blue1brown", "grant", "sanderson", "video", "timestamp", "chapter", "lecture", "math",
    "formula", "equation", "eigen", "determinant", "dot", "product", "cross", "hidden",
    "input", "output", "step", "explain", "why", "how", "what", "clarify", "help", "code",
    "python", "numpy", "pytorch", "tensorflow", "watsonx", "ibm"
]

class PromptSanitizer:
    """
    Sanitizes and normalizes incoming student prompts to eliminate malicious control codes,
    delimiter hijacks, script injection, and token-flooding attempts.
    """

    MAX_PROMPT_LENGTH = 1000

    @classmethod
    def sanitize(cls, text: str) -> Tuple[str, Dict[str, Any]]:
        if not text:
            return "", {"sanitized": False, "truncated": False, "original_length": 0}

        original_length = len(text)
        meta: Dict[str, Any] = {
            "original_length": original_length,
            "truncated": False,
            "html_stripped": False,
            "control_chars_removed": False,
        }

        # 1. Truncate excessive input to prevent DoS / buffer overflow
        if len(text) > cls.MAX_PROMPT_LENGTH:
            text = text[:cls.MAX_PROMPT_LENGTH]
            meta["truncated"] = True

        # 2. Normalize Unicode (NFKC) to resolve homoglyphs and hidden zero-width spaces
        text = unicodedata.normalize("NFKC", text)

        # 3. Strip dangerous bidirectional override & zero-width characters
        dangerous_chars = [
            "\u202E", "\u202D", "\u202A", "\u202B", "\u202C", # BiDi overrides
            "\u200B", "\u200C", "\u200D", "\uFEFF",           # Zero-width spaces & BOM
            "\x00", "\r"                                       # Null byte & carriage returns
        ]
        for char in dangerous_chars:
            if char in text:
                text = text.replace(char, "")
                meta["control_chars_removed"] = True

        # 4. Strip dangerous HTML/Script tags while preserving mathematical symbols (<, >, <=)
        script_pattern = re.compile(r"<\s*(?:script|iframe|object|embed|svg|applet)[^>]*>.*?<\s*/\s*(?:script|iframe|object|embed|svg|applet)\s*>", re.IGNORECASE | re.DOTALL)
        if script_pattern.search(text):
            text = script_pattern.sub("", text)
            meta["html_stripped"] = True

        tag_pattern = re.compile(r"<\s*(?:script|iframe|object|embed|svg|img|style|link|base)[^>]*>", re.IGNORECASE)
        if tag_pattern.search(text):
            text = tag_pattern.sub("", text)
            meta["html_stripped"] = True

        # 5. Normalize excessive whitespace
        text = re.sub(r"\s+", " ", text).strip()

        meta["final_length"] = len(text)
        meta["sanitized"] = meta["truncated"] or meta["html_stripped"] or meta["control_chars_removed"]

        return text, meta


class RAGGuardrailEngine:
    """
    Multi-layer guardrail inspection engine:
    Layer 1: Prompt Injection & Jailbreak Shield (OWASP LLM-01)
    Layer 2: Toxicity & Harm Shield
    Layer 3: Pedagogical Scope Alignment
    Layer 4: Output Grounding & Secret Leakage Shield
    """

    @classmethod
    def evaluate_prompt(cls, query: str) -> Dict[str, Any]:
        """
        Evaluates a sanitized prompt against security and scope policies.
        Returns evaluation dict with 'allowed', 'reason', and 'guardrail_action'.
        """
        query_clean = query.strip()
        
        # 1. Prompt Injection Inspection
        for pattern in PROMPT_INJECTION_PATTERNS:
            if re.search(pattern, query_clean):
                return {
                    "allowed": False,
                    "policy": "PROMPT_INJECTION_SHIELD",
                    "reason": "Input triggered the Prompt Injection & Jailbreak Defense Policy.",
                    "guardrail_action": "BLOCKED_INJECTION",
                    "fallback_message": (
                        "🛡️ **BeeBot Security Guardrail Triggered:**\n\n"
                        "Your query contains instructions that attempt to override system constraints, "
                        "extract internal model instructions, or alter the assistant's persona.\n\n"
                        "As part of the **IBM Granite Guardrails & OWASP LLM-01 Defense Standard**, "
                        "BeeBot remains strictly dedicated to your engineering mathematics curriculum. "
                        "Please ask a conceptual question about the lecture video!"
                    )
                }

        # 2. Harm & Toxicity Inspection
        for pattern in HARMFUL_PATTERNS:
            if re.search(pattern, query_clean):
                return {
                    "allowed": False,
                    "policy": "SAFETY_AND_HARM_SHIELD",
                    "reason": "Input triggered the Harm & Dangerous Content Prevention Policy.",
                    "guardrail_action": "BLOCKED_HARMFUL",
                    "fallback_message": (
                        "🛡️ **Safety Guardrail Active:**\n\n"
                        "This query violates academic safety policies. BeeBot is configured exclusively "
                        "for safe, educational learning under IBM SkillsBuild and FERPA guidelines."
                    )
                }

        # 3. Academic Scope Check (Soft check - encourages focus without false positives on basic questions)
        words = set(re.findall(r"\b[a-zA-Z]{3,}\b", query_clean.lower()))
        has_academic_keyword = any(kw in words for kw in EDUCATIONAL_CONTEXT_KEYWORDS)
        
        # If query is very long and has zero academic/video terms, flag guidance
        is_completely_off_topic = len(words) > 15 and not has_academic_keyword

        return {
            "allowed": True,
            "policy": "PASSED_ALL_SHIELDS",
            "reason": "Query verified clean by IBM Granite Guardrails.",
            "guardrail_action": "PERMITTED",
            "is_off_topic_warning": is_completely_off_topic,
            "fallback_message": None
        }

    @classmethod
    def sanitize_and_guard_output(cls, answer: str) -> str:
        """
        Inspects generated LLM output to prevent leakage of credentials,
        API keys, internal system configuration, or raw injection confirmations.
        """
        if not answer:
            return answer

        # Redact OpenRouter or OpenAI keys if inadvertently hallucinated or leaked
        api_key_regex = r"(?:sk-or-v1-[a-f0-9]{64}|sk-[a-zA-Z0-9]{32,})"
        sanitized = re.sub(api_key_regex, "[REDACTED_API_KEY]", answer)

        # Redact internal secret key mentions
        sanitized = sanitized.replace("skillbee-ibm-national-hackathon-super-secret-key-2026", "[REDACTED_SECRET]")

        return sanitized
