import json
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_anthropic import ChatAnthropic
from app.config import settings
from app.agents.state import VerificationState

SYSTEM_PROMPT = """You are an expert fact-checker evaluating claims based on provided sources.
For each claim and its sources, determine:
1. Verdict ("verified", "misleading", "false", "exaggerated", "unverified")
2. Confidence score (0.0 to 1.0)
3. Explanation (1-2 sentences explaining why)
4. Update the stance of each source ("supports", "contradicts", "neutral")

Input format:
JSON containing the claim and list of sources.

Output format:
Respond ONLY with a JSON object matching this structure:
{
  "verdict": "verified",
  "confidence": 0.85,
  "explanation": "Multiple reputable sources confirm this...",
  "source_stances": ["supports", "neutral", "contradicts"] // matching order of input sources
}
"""

class EvidenceAnalyserAgent:
    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-sonnet-20240229",
            temperature=0.1,
            api_key=settings.ANTHROPIC_API_KEY or "dummy"
        )

    def process(self, state: VerificationState) -> VerificationState:
        """Analyze evidence for each claim and assign verdicts."""
        if "claims" not in state or not state["claims"]:
            return state
            
        if not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY == "dummy":
            # Mock behavior
            for claim in state["claims"]:
                claim.verdict = "verified"
                claim.confidence = 0.9
                claim.explanation = "Mock analysis confirms this claim."
            return state

        for claim in state["claims"]:
            if not claim.sources:
                claim.verdict = "unverified"
                claim.explanation = "No sources found to verify this claim."
                continue
                
            sources_json = [{"url": s.source_url, "content": s.relevant_quote} for s in claim.sources]
            payload = json.dumps({"claim": claim.extracted_claim, "sources": sources_json})
            
            messages = [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=payload)
            ]
            
            try:
                response = self.llm.invoke(messages)
                content = response.content.strip()
                if content.startswith("```json"):
                    content = content[7:-3]
                    
                result = json.loads(content)
                claim.verdict = result.get("verdict", "unverified")
                claim.confidence = result.get("confidence", 0.0)
                claim.explanation = result.get("explanation", "")
                
                stances = result.get("source_stances", [])
                for i, source in enumerate(claim.sources):
                    if i < len(stances):
                        source.stance = stances[i]
            except Exception as e:
                print(f"Error analyzing claim {claim.id}: {e}")
                claim.verdict = "unverified"
                
        return state
