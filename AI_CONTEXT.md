# AI_CONTEXT.md — Beacon (VeritAI)

> **This document is optimized for AI coding assistants: Cursor, Windsurf, Cline, Roo Code, Claude, Gemini, ChatGPT.**
> Read this file before writing any code for this project.

---

## 1. Project Summary

**Beacon (VeritAI)** is an AI-powered truth verification engine that analyzes content (text, URL, audio, video, image, PDF) and returns a transparent, evidence-backed verdict with sentence-level annotations.

**Core Innovation:** Sentence-level color-coded fact annotations with cited evidence per claim, powered by a 5-agent LangGraph pipeline.

**Tech Stack:**
- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Python 3.11 + FastAPI + LangGraph
- **AI:** Anthropic Claude Sonnet (LLM) + Tavily (search) + OpenAI Whisper (audio)
- **Database:** SQLite (v1) → PostgreSQL (v2) + Qdrant (vectors)
- **Deployment:** Vercel (frontend) + Railway (backend)

---

## 2. Business Goals

1. Verify content accuracy in < 10 seconds (Quick) or < 60 seconds (Deep)
2. Provide sentence-level fact annotations (green=true, amber=misleading, red=false)
3. Support multi-format input: text, URL, audio, video, image, PDF
4. Show transparent AI reasoning with cited sources per claim
5. Track misinformation spread via geographic heatmap
6. Rank news sources by historical credibility

---

## 3. Architecture Summary

```
User → React SPA (Vercel) → FastAPI (Railway) → LangGraph Pipeline
                                                    ├── Agent 1: Input Parser (Claude)
                                                    ├── Agent 2: Source Retriever (Tavily)
                                                    ├── Agent 3: Evidence Analyser (Claude)
                                                    ├── Agent 4: Verdict Synthesiser (Claude)
                                                    └── Agent 5: Browse Curator (background)
                                                ↕
                                          SQLite/PostgreSQL + Qdrant + Redis
```

### Key Design Decisions
- **LangGraph** (not LangChain) for the pipeline — explicit state machine with TypedDict state
- **SQLite** for Phase 1 — zero setup, fast reads, ORM-portable via SQLAlchemy
- **Claude Sonnet** as primary LLM — superior structured JSON output, 200K context
- **Tavily** for search — purpose-built for AI agents, clean structured results
- **React SPA** (not Next.js) — primarily client-side interactive, no SSR needed

---

## 4. Database Summary

### Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `verifications` | Verification results | id, input_type, raw_input, overall_trust_score, overall_verdict, annotated_html |
| `claims` | Individual claims per verification | id, verification_id (FK), original_sentence, verdict, confidence |
| `claim_sources` | Evidence sources per claim | id, claim_id (FK), source_name, source_url, relevant_quote, stance |
| `browse_articles` | Curated news feed | id, title, source_name, verdict, trust_score, category |
| `source_credibility` | Source trust rankings | source_name (PK), credibility_score, total_checks |
| `community_flags` | User feedback on verdicts | id, target_type, target_id, reason, flag_count, status |
| `users` (Phase 2) | User accounts | id, email, role, auth_provider |
| `saved_reports` (Phase 2) | Bookmarked verifications | id, user_id (FK), verification_id (FK) |

### Important Relationships
- `verifications` → `claims` → `claim_sources` (cascade delete)
- `source_credibility` → `browse_articles` (by source_name)
- `users` → `verifications`, `community_flags`, `saved_reports`

### Database Rules
- Always use parameterized queries (SQLAlchemy ORM)
- All IDs are UUID v4 (TEXT type in SQLite)
- Timestamps are UTC ISO 8601
- Trust scores are REAL between 0.0 and 1.0
- Use CHECK constraints for enum-like columns

---

## 5. API Rules

### Base URL: `/v1`

### All Responses Use This Envelope

```json
{
  "success": true|false,
  "data": { ... },
  "error": null | { "code": "ERROR_CODE", "message": "...", "details": {} },
  "meta": { "request_id": "uuid", "timestamp": "ISO-8601" }
}
```

### Key Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/verify/text | Verify text (returns 202 + verification_id) |
| POST | /api/verify/url | Verify URL content |
| POST | /api/verify/audio | Verify audio (multipart) |
| POST | /api/verify/video | Verify video (multipart) |
| GET | /api/verify/{id} | Get verification result |
| WS | /ws/verify/{id} | Real-time progress updates |
| GET | /api/browse/verified | Verified news feed |
| GET | /api/browse/fake | Fake news feed |
| GET | /api/heatmap/data | Geographic heatmap data |
| GET | /api/leaderboard | Source credibility rankings |
| POST | /api/community/flag | Flag a verdict |
| GET | /api/stats | Platform statistics |
| GET | /health | Health check |

### Verification is Async
1. POST /verify/text → returns 202 + `verification_id`
2. Client connects to WebSocket /ws/verify/{id}
3. Server pushes progress events as each agent completes
4. Final event contains full result

### Pagination: Cursor-based
```json
{ "limit": 20, "cursor": "opaque_cursor_string" }
```

### Rate Limiting
- Anonymous: 100 req/min, 10 verifications/hour
- Authenticated: 500 req/min, 100 verifications/hour

---

## 6. Coding Standards

### JavaScript/React

```
- Functional components only, no class components
- Use hooks: useState, useEffect, useMemo, useCallback
- Add data-testid attributes to all interactive elements
- Handle 3 states in every component: loading, error, empty
- Named exports for components, default export for pages
- Keep components < 200 lines
- Use Tailwind utility classes, custom CSS for animations
- Framer Motion for all animations
```

### Python

```
- Type hints on ALL function signatures
- Docstrings on ALL public functions (Google style)
- async/await for ALL I/O operations
- Pydantic models for ALL data structures
- No bare except: — always catch specific exceptions
- Use logging module, NEVER print()
- pathlib.Path for file operations
- Keep functions < 50 lines
```

### Naming

| Entity | Convention | Example |
|--------|-----------|---------|
| React component | PascalCase | `TrustScoreCircle` |
| JS function | camelCase | `formatTrustScore()` |
| JS constant | UPPER_SNAKE_CASE | `MAX_CONTENT_LENGTH` |
| Python function | snake_case | `extract_claims()` |
| Python class | PascalCase | `VerificationState` |
| DB table | snake_case plural | `browse_articles` |
| API endpoint | kebab-case | `/api/verify/text` |
| Env variable | UPPER_SNAKE_CASE | `ANTHROPIC_API_KEY` |

---

## 7. Folder Structure

```
beacon/
├── frontend/src/
│   ├── components/{feature}/     # Feature-grouped components
│   ├── pages/                    # Route-level pages
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API client functions
│   ├── context/                  # React context providers
│   ├── utils/                    # Helpers and formatters
│   └── assets/                   # Static files
├── backend/app/
│   ├── api/                      # FastAPI route handlers
│   ├── agents/                   # LangGraph agents + prompts/
│   ├── models/                   # Pydantic + SQLAlchemy models
│   ├── services/                 # Business logic
│   ├── middleware/               # Auth, rate limiting, logging
│   ├── utils/                    # Helpers
│   └── db/                       # Session factory + migrations
└── docs/                         # Documentation (gitignored)
```

---

## 8. Security Rules

1. **Never commit secrets** — use .env files (gitignored)
2. **Sanitize all user input** — DOMPurify (FE), bleach (BE)
3. **Parameterized queries only** — never string-interpolate SQL
4. **Validate file uploads** — check magic bytes, not just extension
5. **Set security headers** — CSP, HSTS, X-Frame-Options, etc.
6. **Rate limit all endpoints** — especially /api/verify/*
7. **Prevent prompt injection** — wrap user content in `<CONTENT>` tags, never let user text become system instructions
8. **Prevent SSRF** — validate URLs, block internal IPs for /api/verify/url
9. **Hash API keys** — store SHA-256 hash, never plaintext
10. **No PII in logs** — hash IP addresses, strip user identifiers

---

## 9. UI Rules

### Design System

- **Dark mode default** — deep blue background (#0A1628)
- **Trust colors** — Green (#059669 verified), Amber (#D97706 misleading), Red (#DC2626 false)
- **Typography** — Inter (UI), JetBrains Mono (data), Playfair Display (headlines)
- **Cards** — 12px border-radius, glassmorphism effect, subtle shadows
- **Animations** — Framer Motion for page transitions, element reveals, score counting

### Verdict Color Mapping

| Verdict | Color | Icon |
|---------|-------|------|
| Verified | #059669 (green) | ✅ |
| Misleading | #D97706 (amber) | ⚠️ |
| False | #DC2626 (red) | ❌ |
| Exaggerated | #7C3AED (purple) | 🟣 |
| AI-Generated | #0D9488 (teal) | 🤖 |

### Responsive Breakpoints

- Mobile: < 640px (single column, bottom nav)
- Tablet: 640-1024px (2 columns)
- Desktop: > 1024px (full layout, side nav)

### Accessibility

- WCAG 2.1 AA minimum
- All interactive elements need `data-testid` and `aria-label`
- Color-blind safe: add patterns/icons alongside colors
- Keyboard navigable: full tab-index support
- Minimum touch target: 44x44px on mobile

---

## 10. Development Constraints

1. **External API dependency** — Claude, Tavily, Whisper are external. Always handle API failures gracefully with retries and fallbacks.
2. **LLM output parsing** — Claude outputs JSON. Always validate the JSON structure. Use Pydantic models to parse.
3. **WebSocket state** — Maintain connection state. Handle reconnection. Send heartbeats.
4. **File size limits** — Audio ≤ 25MB, Video ≤ 100MB, Image ≤ 10MB, PDF ≤ 20MB, Text ≤ 10,000 chars.
5. **SQLite limitations** — Single writer at a time. Use WAL mode. Plan migration to PostgreSQL.
6. **Cost management** — Cache verified claims (Qdrant dedup). Don't re-verify identical content within 24h.

---

## 11. Definition of Done

A feature is "done" when:

- [ ] Code implements the specification from the design docs
- [ ] All 3 UI states handled: loading, error, empty
- [ ] Unit tests written and passing
- [ ] No TypeScript/ESLint/Ruff errors
- [ ] Responsive design verified (mobile + desktop)
- [ ] Data-testid attributes on all interactive elements
- [ ] API error handling with proper error codes
- [ ] No console.log or print() statements
- [ ] No hardcoded secrets or API keys
- [ ] Documentation updated if API changed
- [ ] PR reviewed and approved

---

## 12. AI Agent Instructions

### When implementing a new feature:
1. Read the relevant docs in `docs/` first (architecture, API spec, database design)
2. Check existing components in `frontend/src/components/` before creating new ones
3. Follow the naming conventions in this file
4. Use the standard API response envelope
5. Add data-testid to all new interactive elements
6. Handle loading, error, and empty states
7. Write unit tests alongside the implementation

### When implementing API endpoints:
1. Define Pydantic request/response models in `models/schemas.py`
2. Add route handler in the appropriate `api/*.py` file
3. Register route in `api/router.py`
4. Add rate limiting decorator
5. Add input validation and sanitization
6. Return standard response envelope
7. Write integration test

### When implementing LangGraph agents:
1. Define agent function in `agents/<agent_name>.py`
2. Update state TypedDict in `agents/state.py` if new state fields needed
3. Store prompts in `agents/prompts/<agent>_v<N>.md`
4. Use temperature 0.1 for analysis, 0.3 for synthesis
5. Enforce JSON output format in prompts
6. Add error handling for API failures
7. Send WebSocket progress event on completion

### When implementing React components:
1. Create in the appropriate `components/<feature>/` directory
2. Use Tailwind classes for styling
3. Use Framer Motion for animations
4. Add PropTypes or JSDoc for props
5. Add data-testid attributes
6. Handle loading/error/empty states
7. Write component tests in `tests/components/`

---

## 13. Forbidden Patterns

```
❌ NEVER DO:
- Class components in React
- var keyword in JavaScript
- Inline styles in React (use Tailwind)
- String concatenation for SQL queries
- Storing secrets in code or config files
- console.log in production code
- print() in Python production code
- Bare except: in Python
- Any form of eval() or exec()
- Rendering unsanitized HTML from user input
- Direct DOM manipulation (use React state)
- Synchronous I/O in async code paths
- Ignoring error responses from external APIs
- Hardcoded URLs (use environment variables)
- Starting new database transactions without cleanup
- Catching and silencing errors without logging
```

---

## 14. Common Mistakes to Avoid

| Mistake | Why It's Wrong | Do This Instead |
|---------|---------------|----------------|
| Not handling WebSocket disconnect | Users see frozen UI | Implement reconnection with exponential backoff |
| Not validating Claude JSON output | LLM may return malformed JSON | Parse with Pydantic, catch ValidationError |
| Using `useEffect` without cleanup | Memory leaks, stale state | Return cleanup function, cancel pending requests |
| Not debouncing search inputs | Excessive API calls | Use 300ms debounce |
| Fetching data in component body | Infinite re-render loop | Fetch in useEffect or custom hook |
| Not handling race conditions | Stale data displayed | Use abort controllers, check current state |
| Missing CORS configuration | Frontend can't reach backend | Add frontend origin to CORS middleware |
| Not sanitizing annotated HTML | XSS vulnerability | Use DOMPurify before dangerouslySetInnerHTML |
| Storing all claims in memory | OOM on large articles | Process claims in batches, stream results |
| Not indexing frequently queried columns | Slow queries at scale | Add indexes per the database design doc |
| Making N+1 database queries | Poor performance | Use JOINs or batch queries |
| Not setting Content-Type header | API rejects request | Always set application/json |
| Forgetting to await async calls | Unhandled promises | Always await or handle .catch() |
| Using relative imports incorrectly | Module not found errors | Use @ alias or consistent relative paths |

---

*End of AI_CONTEXT.md*
