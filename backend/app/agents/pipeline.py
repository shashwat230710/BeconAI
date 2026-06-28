from langgraph.graph import StateGraph, END
from app.agents.state import VerificationState
from app.agents.input_parser import InputParserAgent
from app.agents.source_retriever import SourceRetrieverAgent
from app.agents.evidence_analyser import EvidenceAnalyserAgent
from app.agents.verdict_synthesiser import VerdictSynthesiserAgent

def create_pipeline():
    """Create the LangGraph verification pipeline."""
    
    # Initialize agents
    parser = InputParserAgent()
    retriever = SourceRetrieverAgent()
    analyser = EvidenceAnalyserAgent()
    synthesiser = VerdictSynthesiserAgent()
    
    # Define workflow
    workflow = StateGraph(VerificationState)
    
    # Add nodes
    workflow.add_node("parse_input", parser.process)
    workflow.add_node("retrieve_sources", retriever.process)
    workflow.add_node("analyze_evidence", analyser.process)
    workflow.add_node("synthesize_verdict", synthesiser.process)
    
    # Define edges
    workflow.add_edge("parse_input", "retrieve_sources")
    workflow.add_edge("retrieve_sources", "analyze_evidence")
    workflow.add_edge("analyze_evidence", "synthesize_verdict")
    workflow.add_edge("synthesize_verdict", END)
    
    # Set entry point
    workflow.set_entry_point("parse_input")
    
    return workflow.compile()

# Global compiled pipeline
verification_pipeline = create_pipeline()
