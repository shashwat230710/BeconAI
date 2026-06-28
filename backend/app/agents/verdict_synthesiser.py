import json
from app.agents.state import VerificationState

class VerdictSynthesiserAgent:
    def process(self, state: VerificationState) -> VerificationState:
        """Synthesize final verdict and HTML annotations from all claims."""
        if "claims" not in state or not state["claims"]:
            state["overall_verdict"] = "unverified"
            state["overall_trust_score"] = 0.0
            state["confidence"] = 0.0
            state["annotated_html"] = state.get("raw_input", "")
            return state
            
        claims = state["claims"]
        
        # Calculate overall scores
        total_claims = len(claims)
        
        weights = {
            "verified": 1.0,
            "misleading": 0.5,
            "exaggerated": 0.4,
            "false": 0.0,
            "ai_generated": 0.0,
            "unverified": 0.5
        }
        
        score_sum = sum(weights.get(c.verdict, 0.5) for c in claims)
        overall_score = score_sum / total_claims if total_claims > 0 else 0.0
        
        state["overall_trust_score"] = overall_score
        
        # Determine overall verdict
        if overall_score >= 0.7:
            state["overall_verdict"] = "verified"
        elif overall_score >= 0.4:
            state["overall_verdict"] = "misleading"
        else:
            state["overall_verdict"] = "false"
            
        # We also look for specific false claims that might taint the whole article
        false_claims = [c for c in claims if c.verdict == "false"]
        if len(false_claims) > 0 and overall_score >= 0.4:
            # If there's a blatant lie but mostly true info, mark as misleading
            state["overall_verdict"] = "misleading"
            
        state["confidence"] = sum(c.confidence for c in claims) / total_claims if total_claims > 0 else 0.0
        
        # In a full implementation, we'd use the LLM to weave the exact HTML with tags.
        # For this prototype, we'll just mock the annotated HTML by wrapping the original sentences.
        html = state["raw_input"]
        for claim in claims:
            # Simple replacement - in reality needs more robust DOM handling
            span = f"<span class='claim-{claim.verdict}' id='{claim.id}'>{claim.original_sentence}</span>"
            html = html.replace(claim.original_sentence, span)
            
        state["annotated_html"] = html
        
        return state
