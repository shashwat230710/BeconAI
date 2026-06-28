from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import StandardResponse
from app.api import verify

app = FastAPI(
    title="Beacon (VeritAI) API",
    version="1.0.0",
    description="AI-powered truth verification engine API"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://app.beacon.ai", "https://staging.beacon.ai"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(verify.router, prefix="/v1/api/verify", tags=["Verification"])

@app.get("/health", response_model=StandardResponse)
async def health_check():
    """Health check endpoint."""
    return StandardResponse(
        success=True,
        data={"status": "healthy", "version": "1.0.0"}
    )
