# Beacon (VeritAI) - Truth Verification Engine

![Beacon AI](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)

Beacon is a production-grade, AI-powered truth verification platform. It utilizes a multi-agent LLM pipeline to parse factual claims from text, audio, video, or URLs, retrieves primary sources across the web, analyzes the evidence, and synthesizes a transparent verdict (Verified, False, Misleading, etc.).

## 🏗️ Architecture

This is a monorepo consisting of:
*   **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion. 
*   **Backend**: Python FastAPI + LangGraph + SQLAlchemy + SQLite.
*   **AI Engine**: Anthropic Claude 3.5 Sonnet for reasoning, Tavily for real-time web retrieval.

## 🚀 Quick Start (Local Development)

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   [Anthropic API Key](https://console.anthropic.com/)
*   [Tavily API Key](https://tavily.com/)

### 1. Start the Backend

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up Environment Variables
# Open `backend/.env` and add your ANTHROPIC_API_KEY and TAVILY_API_KEY.

# Start the FastAPI server
uvicorn app.main:app --reload
```
The API will be running at `http://localhost:8000` (Swagger UI at `/docs`).

### 2. Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The UI will be running at `http://localhost:5173`.

## 📚 Documentation

The `docs/` folder contains the complete, implementation-ready architectural specifications that governed the creation of this project:

1.  `01-product-design.md` - Vision, Goals, MVP Scope
2.  `02-uiux-design.md` - Design Tokens, Wireframes, Animations
3.  `03-technical-requirements.md` - Scalability & Performance SLAs
4.  `04-system-architecture.md` - System & Data Flow Diagrams
5.  `05-database-design.md` - ER Diagrams & Schemas
6.  `06-api-specification.md` - OpenAPI Endpoints
7.  `07-development-roadmap.md` - Phased Execution Plan
8.  `08-devops-deployment.md` - CI/CD & Infrastructure
9.  `09-security-design.md` - Threat Models & Auth
10. `10-testing-strategy.md` - QA & Testing Pyramids
11. `11-project-structure.md` - Git Workflows & Naming Conventions
12. `12-ai-context.md` - Prompt Rules for AI Agents.

*(Note: The `docs/` folder is explicitly `.gitignore`d in production to maintain a clean deployed footprint, but is retained locally for architectural reference).*

## 🤝 Contributing

Please ensure you read `AI_CONTEXT.md` at the root of this repository before modifying the codebase. It contains strict coding patterns and architectural rules to prevent context degradation.
