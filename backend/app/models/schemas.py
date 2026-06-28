from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class Source(BaseModel):
    source_name: str
    source_domain: str
    trust_score: float
    stance: Literal["supports", "contradicts", "neutral"]
    relevant_quote: str
    source_url: str

class Claim(BaseModel):
    id: str
    claim_index: int
    original_sentence: str
    extracted_claim: str
    verdict: Literal["verified", "misleading", "false", "exaggerated", "ai_generated", "unverified"] = "unverified"
    confidence: float = 0.0
    explanation: str = ""
    sources: List[Source] = Field(default_factory=list)

class VerifyRequest(BaseModel):
    content: str = Field(..., min_length=10, max_length=10000)
    mode: Literal["quick", "deep"] = "quick"
    context: Optional[str] = Field(None, max_length=500)

class VerifyUrlRequest(BaseModel):
    url: str = Field(..., description="URL to verify")
    mode: Literal["quick", "deep"] = "quick"
    context: Optional[str] = Field(None, max_length=500)

class VerifyResponseData(BaseModel):
    verification_id: str
    status: str
    estimated_seconds: int
    websocket_url: str

class StandardResponse(BaseModel):
    success: bool = True
    data: Optional[dict] = None
    error: Optional[dict] = None
    meta: Optional[dict] = None
