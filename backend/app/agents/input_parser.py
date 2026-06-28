import json
import uuid
from typing import List
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_anthropic import ChatAnthropic
from app.config import settings
from app.models.schemas import Claim
from app.agents.state import VerificationState

SYSTEM_PROMPT = """You are an expert fact-checker and parser.
Your job is to extract factual claims from the provided text that can be independently verified.
Ignore opinions, subjective statements, and rhetorical questions.

Return a JSON array of objects, where each object represents a claim.
Each object MUST have:
1. "original_sentence": The exact substring from the text that contains the claim.
2. "extracted_claim": A normalized, self-contained factual statement derived from the sentence.

If the text contains no factual claims, return an empty array [].
Respond ONLY with valid JSON. Do not include markdown blocks like ```json.
"""

class InputParserAgent:
    def __init__(self):
        # We initialize the model here. In a real app, you'd handle the case where the key is missing gracefully.
        self.llm = ChatAnthropic(
            model="claude-3-sonnet-20240229",
            temperature=0.1,
            api_key=settings.ANTHROPIC_API_KEY or "dummy", 
            max_tokens=2000
        )

    def process(self, state: VerificationState) -> VerificationState:
        """Extract claims from the raw input text."""
        raw_text = state["raw_input"]
        
        # If API key is not set (development), use dummy data
        if not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY == "dummy":
            state["claims"] = [
                Claim(
                    id=f"clm_{uuid.uuid4().hex[:8]}",
                    claim_index=0,
                    original_sentence=raw_text[:50],
                    extracted_claim=raw_text[:50],
                )
            ]
            return state
            
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"<CONTENT>\n{raw_text}\n</CONTENT>")
        ]
        
        try:
            response = self.llm.invoke(messages)
            content = response.content.strip()
            
            # Clean markdown if present
            if content.startswith("```json"):
                content = content[7:-3]
            
            parsed_data = json.loads(content)
            
            claims = []
            for idx, item in enumerate(parsed_data):
                claims.append(Claim(
                    id=f"clm_{uuid.uuid4().hex[:8]}",
                    claim_index=idx,
                    original_sentence=item.get("original_sentence", ""),
                    extracted_claim=item.get("extracted_claim", "")
                ))
                
            state["claims"] = claims
            
        except Exception as e:
            state["error"] = f"Failed to parse claims: {str(e)}"
            
        return state
