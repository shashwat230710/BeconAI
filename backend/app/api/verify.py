import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import VerifyRequest, VerifyResponseData, StandardResponse
from app.agents.state import VerificationState
from app.agents.pipeline import verification_pipeline

router = APIRouter()

# In-memory store for prototype (in production this would be Redis/DB)
VERIFICATIONS = {}

def process_verification(verification_id: str, content: str, mode: str):
    """Background task to run the LangGraph pipeline."""
    state = VerificationState(
        verification_id=verification_id,
        raw_input=content,
        input_type="text",
        analysis_mode=mode,
        claims=[],
        overall_trust_score=0.0,
        overall_verdict="unverified",
        confidence=0.0,
        annotated_html="",
        error=None
    )
    
    # Run the pipeline
    final_state = verification_pipeline.invoke(state)
    
    # Update store
    VERIFICATIONS[verification_id] = {
        "status": "completed",
        "result": final_state
    }

@router.post("/text", response_model=StandardResponse, status_code=202)
async def verify_text(request: VerifyRequest, background_tasks: BackgroundTasks):
    """Submit text for verification."""
    verification_id = f"ver_{uuid.uuid4().hex}"
    
    # Initialize state in memory
    VERIFICATIONS[verification_id] = {
        "status": "processing",
        "result": None
    }
    
    # Trigger background processing
    background_tasks.add_task(process_verification, verification_id, request.content, request.mode)
    
    return StandardResponse(
        success=True,
        data=VerifyResponseData(
            verification_id=verification_id,
            status="processing",
            estimated_seconds=8 if request.mode == "quick" else 30,
            websocket_url=f"wss://api.beacon.ai/v1/ws/verify/{verification_id}"
        ).model_dump()
    )

@router.get("/{verification_id}", response_model=StandardResponse)
async def get_verification(verification_id: str):
    """Get the result of a verification."""
    if verification_id not in VERIFICATIONS:
        raise HTTPException(status_code=404, detail="Verification not found")
        
    data = VERIFICATIONS[verification_id]
    
    if data["status"] == "processing":
        return StandardResponse(
            success=True,
            data={"status": "processing", "message": "Verification is still in progress"}
        )
        
    # Format result for client
    result = data["result"]
    client_data = {
        "id": result["verification_id"],
        "status": "completed",
        "input_type": result["input_type"],
        "analysis_mode": result["analysis_mode"],
        "overall_trust_score": result["overall_trust_score"],
        "overall_verdict": result["overall_verdict"],
        "confidence": result["confidence"],
        "claims_count": len(result.get("claims", [])),
        "claims": [c.model_dump() for c in result.get("claims", [])],
        "annotated_html": result["annotated_html"]
    }
    
    return StandardResponse(success=True, data=client_data)
