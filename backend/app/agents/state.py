from typing import TypedDict, List, Optional
from app.models.schemas import Claim

class VerificationState(TypedDict):
    """LangGraph state for the verification pipeline."""
    verification_id: str
    raw_input: str
    input_type: str
    analysis_mode: str
    
    # Pipeline data
    claims: List[Claim]
    
    # Final results
    overall_trust_score: float
    overall_verdict: str
    confidence: float
    annotated_html: str
    
    # Errors
    error: Optional[str]
