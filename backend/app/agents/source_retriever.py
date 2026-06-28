from tavily import TavilyClient
from app.config import settings
from app.models.schemas import Source
from app.agents.state import VerificationState

class SourceRetrieverAgent:
    def __init__(self):
        self.tavily = TavilyClient(api_key=settings.TAVILY_API_KEY or "dummy")

    def process(self, state: VerificationState) -> VerificationState:
        """Search for sources for each claim using Tavily."""
        if "claims" not in state or not state["claims"]:
            return state
            
        if not settings.TAVILY_API_KEY or settings.TAVILY_API_KEY == "dummy":
            # Mock behavior
            for claim in state["claims"]:
                claim.sources = [
                    Source(
                        source_name="Example News",
                        source_domain="example.com",
                        trust_score=0.8,
                        stance="neutral",
                        relevant_quote="This is a mock quote related to the claim.",
                        source_url="https://example.com/article"
                    )
                ]
            return state

        for claim in state["claims"]:
            try:
                # In production, we'd do this concurrently
                search_result = self.tavily.search(query=claim.extracted_claim, search_depth="basic", max_results=3)
                
                sources = []
                for result in search_result.get("results", []):
                    sources.append(Source(
                        source_name=result.get("url", "").split("/")[2] if "url" in result else "Unknown",
                        source_domain=result.get("url", "").split("/")[2] if "url" in result else "Unknown",
                        trust_score=0.7, # Default trust, would be calculated from db
                        stance="neutral", # Will be updated by analyser
                        relevant_quote=result.get("content", "")[:200] + "...",
                        source_url=result.get("url", "")
                    ))
                claim.sources = sources
            except Exception as e:
                # Log error, but continue with other claims
                print(f"Error fetching sources for claim {claim.id}: {e}")
                
        return state
