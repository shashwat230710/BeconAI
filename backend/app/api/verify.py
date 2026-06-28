import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from app.models.schemas import VerifyRequest, VerifyResponseData, StandardResponse
from app.agents.state import VerificationState
from app.agents.pipeline import verification_pipeline
from app.db.session import get_db
from app.db.models import Verification, ClaimModel, SourceModel

router = APIRouter()

def process_verification(verification_id: str, content: str, mode: str, db: Session):
    """Background task to run the LangGraph pipeline and save to DB."""
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
    
    # Save to database
    db_ver = db.query(Verification).filter(Verification.id == verification_id).first()
    if db_ver:
        db_ver.status = "completed"
        db_ver.overall_trust_score = final_state.get("overall_trust_score", 0.0)
        db_ver.overall_verdict = final_state.get("overall_verdict", "unverified")
        db_ver.confidence = final_state.get("confidence", 0.0)
        db_ver.annotated_html = final_state.get("annotated_html", "")
        db_ver.error = final_state.get("error")
        
        for claim in final_state.get("claims", []):
            db_claim = ClaimModel(
                id=claim.id,
                verification_id=verification_id,
                claim_index=claim.claim_index,
                original_sentence=claim.original_sentence,
                extracted_claim=claim.extracted_claim,
                verdict=claim.verdict,
                confidence=claim.confidence,
                explanation=claim.explanation
            )
            db.add(db_claim)
            
            for source in claim.sources:
                db_source = SourceModel(
                    id=f"src_{uuid.uuid4().hex[:8]}",
                    claim_id=claim.id,
                    source_name=source.source_name,
                    source_domain=source.source_domain,
                    trust_score=source.trust_score,
                    stance=source.stance,
                    relevant_quote=source.relevant_quote,
                    source_url=source.source_url
                )
                db.add(db_source)
                
        db.commit()
    db.close()

@router.post("/text", response_model=StandardResponse, status_code=202)
async def verify_text(request: VerifyRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Submit text for verification."""
    verification_id = f"ver_{uuid.uuid4().hex}"
    
    # Initialize state in DB
    db_ver = Verification(
        id=verification_id,
        status="processing",
        raw_input=request.content,
        input_type="text",
        analysis_mode=request.mode
    )
    db.add(db_ver)
    db.commit()
    
    # Create a new session for the background task to avoid thread issues
    from app.db.session import SessionLocal
    bg_db = SessionLocal()
    
    # Trigger background processing
    background_tasks.add_task(process_verification, verification_id, request.content, request.mode, bg_db)
    
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
async def get_verification(verification_id: str, db: Session = Depends(get_db)):
    """Get the result of a verification."""
    db_ver = db.query(Verification).filter(Verification.id == verification_id).first()
    
    if not db_ver:
        raise HTTPException(status_code=404, detail="Verification not found")
        
    if db_ver.status == "processing":
        return StandardResponse(
            success=True,
            data={"status": "processing", "message": "Verification is still in progress"}
        )
        
    # Format result for client
    claims_data = []
    for claim in db_ver.claims:
        sources_data = [{
            "source_name": s.source_name,
            "source_domain": s.source_domain,
            "trust_score": s.trust_score,
            "stance": s.stance,
            "relevant_quote": s.relevant_quote,
            "source_url": s.source_url
        } for s in claim.sources]
        
        claims_data.append({
            "id": claim.id,
            "claim_index": claim.claim_index,
            "original_sentence": claim.original_sentence,
            "extracted_claim": claim.extracted_claim,
            "verdict": claim.verdict,
            "confidence": claim.confidence,
            "explanation": claim.explanation,
            "sources": sources_data
        })
    
    client_data = {
        "id": db_ver.id,
        "status": db_ver.status,
        "input_type": db_ver.input_type,
        "analysis_mode": db_ver.analysis_mode,
        "overall_trust_score": db_ver.overall_trust_score,
        "overall_verdict": db_ver.overall_verdict,
        "confidence": db_ver.confidence,
        "claims_count": len(claims_data),
        "claims": claims_data,
        "annotated_html": db_ver.annotated_html,
        "error": db_ver.error
    }
    
    return StandardResponse(success=True, data=client_data)
