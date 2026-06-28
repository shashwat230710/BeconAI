from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Verification(Base):
    __tablename__ = "verifications"
    
    id = Column(String, primary_key=True, index=True)
    status = Column(String, default="processing")
    raw_input = Column(Text, nullable=False)
    input_type = Column(String, default="text")
    analysis_mode = Column(String, default="quick")
    overall_trust_score = Column(Float, default=0.0)
    overall_verdict = Column(String, default="unverified")
    confidence = Column(Float, default=0.0)
    annotated_html = Column(Text)
    error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    claims = relationship("ClaimModel", back_populates="verification", cascade="all, delete-orphan")

class ClaimModel(Base):
    __tablename__ = "claims"
    
    id = Column(String, primary_key=True, index=True)
    verification_id = Column(String, ForeignKey("verifications.id"))
    claim_index = Column(Integer)
    original_sentence = Column(Text)
    extracted_claim = Column(Text)
    verdict = Column(String)
    confidence = Column(Float)
    explanation = Column(Text)
    
    verification = relationship("Verification", back_populates="claims")
    sources = relationship("SourceModel", back_populates="claim", cascade="all, delete-orphan")

class SourceModel(Base):
    __tablename__ = "sources"
    
    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"))
    source_name = Column(String)
    source_domain = Column(String)
    trust_score = Column(Float)
    stance = Column(String)
    relevant_quote = Column(Text)
    source_url = Column(String)
    
    claim = relationship("ClaimModel", back_populates="sources")
