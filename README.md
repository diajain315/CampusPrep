# Campus Placement Intelligence Platform (CampusPrep)

**Target Institution:** Dhirubhai Ambani University (DAU), Gandhinagar  
**Academic Context:** IT643 — Software Design and Testing  
**Architecture:** Monorepo (Django REST Framework Backend + React/TypeScript Frontend + Neon Serverless PostgreSQL)

---

## 1. Executive Summary & Problem Context

In university campus placement ecosystems, historical recruitment knowledge suffers from severe institutional memory decay. Each annual recruitment cycle, students repeat identical discovery research, while graduating seniors take valuable placement context with them.

**CampusPrep** is a student-driven placement intelligence platform designed to preserve and surface historical campus recruitment knowledge at Dhirubhai Ambani University.

### Product Boundary & Anti-Goals
* **Placement Intelligence & Preparation Platform:** Preserves historical recruitment cycles, company profiles, job roles, selection processes (ordered selection rounds), structured candidate interview logs, and alumni workplace reviews.
* **NOT an Applicant Tracking System (ATS):** Does not process corporate job applications, schedule candidate interviews, or manage resume submissions.
* **NOT a Placement Cell Replacement:** Complements university preparation and peer learning; does not replace the official university placement committee or corporate communications.

---

## 2. Technology Stack & Verified Versions

| Layer | Technology | Exact Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Django | `6.1.2` | Core application framework & ORM |
| **API Framework** | Django REST Framework | `3.18.3` | RESTful API endpoints & serialization |
| **Python Runtime** | Python (CPython) | `3.15.0` | Execution runtime |
| **Database Driver** | psycopg | `3.3.6` | High-performance PostgreSQL 3-tier driver |
| **Database** | Neon Serverless PostgreSQL | `18.6` | Cloud serverless database with connection pooling |
| **Frontend Framework** | React | `18.3.1` | Reactive UI component layer |
| **Language** | TypeScript | `5.6.3` | Static typing & domain contracts |
| **Build Tooling** | Vite | `6.4.5` | Fast HMR dev server & bundle pipeline |
| **Styling** | Tailwind CSS | `3.4.17` | Utility-first design tokens & responsive UI |
| **Icons** | Lucide React | `0.468.0` | Clean iconography |
| **Backend Testing** | pytest + pytest-django | `8.3.4` | Automated domain & invariant test suite (27 tests) |
| **Frontend Testing** | Vitest + React Testing Library | `2.1.9` | Automated component & integration test suite (12 tests) |

---

## 3. Repository Architecture & Directory Structure

```text
CampusPrep/
├── backend/                        # Django + DRF Application Server
│   ├── apps/
│   │   ├── common/                 # Base mixins, enums, exceptions, audit types
│   │   ├── universities/           # University profile & onboarding models
│   │   ├── companies/              # Curated companies & contributor proposals
│   │   ├── drives/                 # Campus drives, job roles, selection rounds
│   │   ├── experiences/            # Structured candidate interview logs & round details
│   │   ├── reviews/                # Alumni company reviews (JobRoleFamily, TenureBand)
│   │   ├── resources/              # Preparation resources (coding sheets, roadmaps)
│   │   ├── workspace/              # Personal workspace tasks & bookmarks
│   │   ├── moderation/             # Moderation queue, reports, and content revisions
│   │   └── users/                  # Custom User, OTP verification, stable pseudonyms
│   ├── config/                     # Django settings, WSGI/ASGI, root URL routing
│   ├── tests/                      # Automated test suites for business rules & invariants
│   ├── manage.py
│   └── requirements.txt
├── frontend/                       # React 18 + Vite + TypeScript Application
│   ├── src/
│   │   ├── components/             # Reusable design system (Button, Card, Badge, Modal, etc.)
│   │   ├── context/                # AuthContext (6-role RBAC persona switcher)
│   │   ├── features/               # Domain feature modules:
│   │   │   ├── authentication/     # Institutional email verification modal
│   │   │   ├── contributions/      # Experience, review, resource submission forms
│   │   │   ├── moderation/         # Staff moderation queue & revision diff triage
│   │   │   └── workspace/          # Personal workspace checklist & bookmarks
│   │   ├── fixtures/               # Curated DAU placement fixtures
│   │   ├── lib/api/                # API client boundary & data adapters
│   │   ├── routes/                 # Route views (Landing, Detail, Experiences, Workspace, etc.)
│   │   ├── test/                   # Vitest component & workflow test suites
│   │   └── types/                  # Strict TypeScript domain interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── documents/                      # Authoritative Specifications & Contracts
│   ├── AGENTS.md                   # Agentic developer instructions & constraints
│   ├── PROJECT_CONTEXT.md          # Comprehensive architectural specification & decisions
│   └── UBIQUITOUS_LANGUAGE.md      # IT643 domain glossary & ubiquitous language mapping
├── neon.ts                         # Neon cloud database configuration
└── package.json                    # Root scripts & tooling dependencies
```

---

## 4. Core Business Rules & Invariants

The platform enforces five canonical business rules and key architectural invariants, verified through automated test suites:

| Rule # | Canonical Business Rule / Invariant | Implementation Mechanism | Automated Test Suite |
| :--- | :--- | :--- | :--- |
| **Rule 1** | **Institutional Verification Barrier** | Unverified accounts are strictly blocked from authoring campus intelligence. Access requires cryptographic 6-digit OTP email challenge (`@dau.ac.in`). | `backend/tests/test_business_rule_1_verification_barrier.py` |
| **Rule 2** | **Selection Round Sequence Continuity** | Selection rounds within a campus drive must form a strictly contiguous $1 \dots N$ sequence without numbering gaps or duplicates. | `backend/tests/test_business_rule_2_selection_rounds.py` |
| **Rule 3** | **Moderation Visibility Guard** | Public query feeds serialize content whose Publication Status is in `PUBLIC_VISIBLE_STATUSES` (`APPROVED` or `REPORTED`). `DRAFT`, `PENDING`, `UNDER_REVIEW`, `REJECTED`, or `REMOVED` are excluded. | `backend/tests/test_business_rule_3_moderation_visibility.py` |
| **Rule 4** | **Identity Whitelist Isolation** | Absolute zero public serialization of real names, institutional emails, or roll numbers. Public author signatures expose strictly `Stable Pseudonym` + `Affiliation Label` + `Recruitment Cycle`. | `backend/tests/test_business_rule_4_identity_whitelist.py` |
| **Rule 5** | **Personal Workspace User Isolation** | Preparation tasks and saved bookmarks are strictly isolated to the authenticated user account with row-level query filtering. | `backend/tests/test_business_rule_5_workspace_isolation.py` |
| **AD-3** | **Content Revision Traceability** | When editing published content, live records remain visible in `APPROVED` while an un-published `ContentRevision` draft undergoes moderator review before atomic merge. | `backend/tests/test_architectural_decision_3_content_revisions.py` |
| **Invariant** | **Anti-Self-Approval Invariant** | A Moderator or Administrator can never review, approve, reject, merge, or triage reports on any record they own across all models (`author_id`, `user_id`, or `proposer_id`). | `backend/tests/test_invariant_anti_self_approval.py` |
| **Invariant** | **Cross-Drive Round Invariant** | A selection round detail submitted within an interview experience must belong to the exact same campus drive as the parent experience. | `backend/tests/test_invariant_round_detail_same_drive.py` |
| **Guard** | **Automated Glossary Lint Guard** | AST/regex test that parses `UBIQUITOUS_LANGUAGE.md` Section 2 to ensure prohibited terminology aliases never enter code identifiers, UI labels, or doc prose. | `backend/tests/test_glossary_lint.py` |

---

## 5. Developer Quickstart Guide

### 5.1 Prerequisites
* **Python:** `3.15.x` (or `3.12+` compatible)
* **Node.js:** `v18.0.0+` (Node 24 tested)
* **npm:** `v9.0.0+`
* **Neon PostgreSQL:** Active cloud instance or local PostgreSQL 16+

### 5.2 Backend Setup (Django + Neon)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply database migrations against Neon Serverless PostgreSQL
python manage.py migrate

# 5. Run automated backend test suite
python -m pytest

# 6. Start development server
python manage.py runserver
```
The Django API will start at `http://127.0.0.1:8000/`.

### 5.3 Frontend Setup (React + Vite)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Verify TypeScript types
npm run typecheck

# 4. Run automated frontend test suite
npm run test

# 5. Start Vite local development server
npm run dev
```
The client application will start at `http://localhost:5173/`.

---

## 6. Database & Cloud Configuration

The application uses **Neon Serverless PostgreSQL 18.6** with SSL encryption (`sslmode=require`).

### Dual-Endpoint Architecture
* **Pooled Endpoint (`DATABASE_URL`):** Utilizes PgBouncer connection pooling on port `5432` for low-latency, high-concurrency runtime queries:
  ```text
  postgresql://[user]:[password]@ep-fancy-union-b3dkw7pl-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```
* **Unpooled Compute Endpoint (`DATABASE_URL_UNPOOLED`):** Bypasses the connection pooler directly to compute nodes for executing DDL schema migrations:
  ```text
  postgresql://[user]:[password]@ep-fancy-union-b3dkw7pl.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```

---

## 7. Interactive RBAC Persona Switcher

To allow testing and demonstration of all platform permissions without requiring live directory seeding, the frontend includes an **Interactive Persona Switcher** in the top navigation bar:

1. **Public Visitor:** Unauthenticated guest; can browse published company profiles, campus drive timelines, interview experiences, and curated preparation resources.
2. **Registered User:** Authenticated user; can access their private Personal Workspace to manage preparation tasks and toggle bookmarks.
3. **Verified Contributor:** `@dau.ac.in` verified student; authorized to contribute campus drive details and author structured interview experiences under their Stable Pseudonym.
4. **Alumni Contributor:** Verified graduate with an approved `AlumniQualificationDeclaration`; qualified to submit company reviews with standardized `JobRoleFamily` and `TenureBand`.
5. **Moderator:** Privileged reviewer; authorized to access the Moderation Queue, approve/reject submissions, evaluate content reports, and merge revisions.
6. **Administrator:** System manager; manages university settings, seeds corporate company profiles, and assigns staff roles.

---

## 8. Verification & Test Commands

Every canonical business rule and user flow is backed by automated tests:

```bash
# Run all 27 backend pytest suites
cd backend
python -m pytest -v

# Run specific invariant suites
python -m pytest tests/test_invariant_anti_self_approval.py
python -m pytest tests/test_invariant_round_detail_same_drive.py
python -m pytest tests/test_glossary_lint.py

# Check for pending Django migrations
python manage.py makemigrations --check

# Run frontend Vitest test suite (12 tests)
cd ../frontend
npm run test

# Run frontend static typecheck
npm run typecheck

# Build frontend production bundle
npm run build
```

---

## 9. Academic & Design Documentation

For in-depth architectural contracts and domain analysis, refer to:
* **[PROJECT_CONTEXT.md](file:///c:/Users/amanr/OneDrive/Documents/Projects/CampusPrep/documents/PROJECT_CONTEXT.md):** Complete architectural specification, security models, data flows, and Approved Architectural Decisions Log.
* **[UBIQUITOUS_LANGUAGE.md](file:///c:/Users/amanr/OneDrive/Documents/Projects/CampusPrep/documents/UBIQUITOUS_LANGUAGE.md):** Formal domain glossary, code symbol mapping, flagged ambiguities, state machine diagrams, and automated verification matrix.
* **[AGENTS.md](file:///c:/Users/amanr/OneDrive/Documents/Projects/CampusPrep/documents/AGENTS.md):** Operational guidelines and behavioral invariants for agentic development.
