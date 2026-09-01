# Project Context — Campus Placement Intelligence Platform

**Working Title:** Campus Placement Intelligence Platform  
**Target Institution (Initial):** Dhirubhai Ambani University (DAU)  
**Academic Reference:** IT643 — Software Design and Testing (Prof. Ankush Chander)  
**Course Website:** [https://it643.ankushchander.com/](https://it643.ankushchander.com/)  
**Document Status:** Authoritative Architectural Baseline & Requirements Specification (Locked)

---

## 1. Product Vision & Problem Statement

### 1.1 The Real-World Problem
At universities like Dhirubhai Ambani University (DAU), campus placement drives are announced on short notice—often providing students only 48 to 72 hours to prepare. To formulate an effective preparation strategy, a candidate must independently:
1. Research the company’s domain, business units, culture, and products.
2. Determine available job roles and compensation structures.
3. Uncover university-specific historical recruitment trends: Did the company conduct an Online Assessment (OA)? Was there a group discussion? What technical topics (DSA, System Design, Operating Systems, DBMS) were prioritized? What specific questions were asked in previous cycles?
4. Track down seniors or alumni on LinkedIn and WhatsApp, awaiting sporadic replies.
5. Search fragmented public platforms (Glassdoor, Reddit, LeetCode Discuss, YouTube), which provide generic global advice rather than university-specific realities.

This fragmentation leads to:
* **Duplicate Effort:** Hundreds of students independently repeat the exact same discovery research every recruitment cycle.
* **Knowledge Decay:** Institutional memory evaporates as graduating seniors leave campus, forcing subsequent cohorts to start from scratch.
* **Severe Time Stress:** Preparation windows are consumed by chaotic information gathering rather than focused practice.

### 1.2 Our Solution
A centralized, student-driven **Placement Intelligence Platform** designed to preserve and surface university-specific recruitment knowledge. The platform provides:
* **Company Profiles:** High-level corporate overviews, products, and industry facts.
* **Campus Recruitment Intelligence:** Comprehensive historical records of previous **Campus Drives** at DAU, preserving annual recruitment cycles, job roles, eligibility criteria, and step-by-step **Selection Processes** (ordered **Selection Rounds**).
* **Structured Interview Experiences:** First-hand candidate logs linked directly to specific selection rounds, capturing exact interview questions, topics assessed, and difficulty.
* **Alumni Company Reviews:** Workplace assessments submitted exclusively by verified alumni with professional employment experience.
* **Curated Preparation Resources:** Community-validated learning materials, cheat sheets, and external coding references.
* **Personal Workspace:** A private workspace enabling students to bookmark upcoming drives and manage preparation task checklists.

### 1.3 Crucial Boundary & Anti-Goals
> [!IMPORTANT]
> **What we are NOT building:**
> * We are NOT building an Applicant Tracking System (ATS), job board, or resume submission portal.
> * We are NOT replacing the university placement cell or student placement committee (SPC).
> * We do NOT handle student job applications, interview slot scheduling, or offer letters.
> * Our singular product boundary is **Placement Intelligence and Student Preparation**.

---

## 2. Academic Alignment: IT643 Engineering Philosophy

This project is built under the academic rigor of **IT643 (Software Design and Testing)** instructed by Professor Ankush Chander. The evaluation places primary value on architectural integrity, testability, domain precision, and demonstrable production readiness rather than feature volume.

### 2.1 The Ceiling-10 Evaluation Strategy
The IT643 project rubric establishes explicit performance ceilings:
* **Ceiling 10:** Deployed, hosted, and actively used by people outside the project team, backed by tangible evidence (live URL + analytics, user feedback logs, or registered user activity).
* **Ceiling 9:** Deployed MVP with key features demonstrably functioning on a live URL.
* **Ceiling ≤ 8:** Anything else (local development only or broken deployments).

**Strategy to Secure Ceiling 10:**
We build a lean, robust, fully functional MVP deployed early to cloud infrastructure (Vercel/Static for Frontend + WSGI/Render for Django Backend + Neon Serverless PostgreSQL 18.6). We will open the platform to real DAU student cohorts and alumni to collect genuine interview experiences, feedback logs, and usage metrics prior to the final viva.

### 2.2 Alignment with the Four Mandatory Root Deliverables
1. **`README.md`**: Project overview, live deployment URL, and local setup executable in **≤ 5 commands**.
2. **`UBIQUITOUS_LANGUAGE.md`**: Strict glossary defining domain terms, aliases to avoid, code mappings, and flagged ambiguity resolutions.
3. **`DESIGN.md`**:
   * Five plain-English business rules enforced by the system.
   * Three concrete architectural decisions detailing: the software engineering principle applied (SOLID / Component / Boundary), exact file:line references, and before/after diffs explaining why the refactoring occurred.
   * One architectural boundary isolating the pure domain core from external dependencies.
   * AI usage disclosure (tools used and at least one AI recommendation consciously rejected with technical justification).
4. **`TESTING.md`**:
   * A mapping table linking the five business rules directly to automated test files and line numbers.
   * Documentation of any untestable rules and honest justification.
   * Identification of at least one test considered "weak" with an explanation of its deficiency.
   * Strict adherence to Arrange-Act-Assert (AAA) pattern.

---

## 3. User Roles & Access Control Matrix

The platform implements Role-Based Access Control (RBAC) governed by the principle of least privilege:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROLE HIERARCHY & PERMISSIONS                    │
│                                                                        │
│  [Public Visitor]                                                      │
│        │                                                               │
│        ▼ (Sign up / Login)                                             │
│  [Registered User] ──────► Access Personal Workspace & Bookmarks       │
│        │                                                               │
│        ▼ (Verify @dau.ac.in institutional email)                       │
│  [Verified Contributor] ──► Submit Interview Experiences & Drives      │
│        │                                                               │
│        ▼ (Approve Alumni Qualification Declaration)                    │
│  [Alumni Contributor] ────► Submit Company Reviews                     │
│                                                                        │
│  [Staff Roles]                                                         │
│  ├── [Moderator] ────────► Moderation Queue, Content Reports, Audit Log   │
│  └── [Administrator] ────► Manage Universities, Seed Companies         │
└────────────────────────────────────────────────────────────────────────┘
```

### Detailed Permission Matrix:

| Action / Capability | Public Visitor | Registered User | Verified Contributor | Alumni Contributor | Moderator | Administrator |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Browse published Companies & Drives | Yes | Yes | Yes | Yes | Yes | Yes |
| Read published Interview Experiences | Yes | Yes | Yes | Yes | Yes | Yes |
| Read published Company Reviews | Yes | Yes | Yes | Yes | Yes | Yes |
| Save Bookmarks & Manage Tasks | No | Yes | Yes | Yes | Yes | Yes |
| Submit Interview Experience | No | No | Yes | Yes | Yes | Yes |
| Submit Campus Drive Intel | No | No | Yes | Yes | Yes | Yes |
| Submit Preparation Resource | No | No | Yes | Yes | Yes | Yes |
| Submit Company Review | No | No | No | Yes | Yes | Yes |
| Submit Content Report | No | Yes | Yes | Yes | Yes | Yes |
| Moderate Submissions (Approve/Reject)| No | No | No | No | Yes | Yes |
| Access Moderation Audit History | No | No | No | No | Yes | Yes |
| Seed & Edit Global Company Records | No | No | No | No | No | Yes |
| Configure Universities & Roles | No | No | No | No | No | Yes |

---

## 4. Authentication, Affiliation & Verification

### 4.1 Institutional Affiliation Verification
* **Initial Institution:** Dhirubhai Ambani University (`DAU`).
* **Approved Domain Pattern:** `@dau.ac.in`.
* **Verification Workflow:**
  1. A `Registered User` inputs their institutional email (`institutional_email`, separate from their login `email`).
  2. The platform generates a secure 6-digit cryptographic Time-based One-Time Password (`VerificationChallenge`) with a 15-minute expiration.
  3. The challenge is dispatched to the user's institutional inbox.
  4. Upon successful validation, `user.is_institutional_verified` is set to `True`, and the user's role transitions to `Verified Contributor`.
* **Abuse Prevention:** Rate-limited to at most 3 OTP generation requests per 15-minute window per IP/email to prevent mail bombing.

### 4.2 Lifetime Alumni Email Handling & Review Qualification
* **The Domain Nuance:** DAU grants lifetime email accounts (`@dau.ac.in`) to both active students and alumni. Therefore, possessing a `@dau.ac.in` address confirms university affiliation, but does NOT independently prove alumni status or corporate employment.
* **Alumni Verification Seam:**
  * To submit a `Company Review`, a contributor must explicitly submit an `AlumniQualificationDeclaration`: declaring graduation year, degree program, employer name, job title, and employment dates.
  * When a moderator approves this declaration (a formal `ModerationAction`), the derived flag `user.is_alumni_qualified` becomes `True`, granting `Alumni Contributor` permissions.
  * Stated `Employment Experience` is thus formally reviewed and grounded in the approved declaration.

---

## 5. Public Identity, Privacy & Pseudonymity

### 5.1 Deterministic Stable Pseudonyms (Approved Decision 2)
To foster honest, candid sharing without fear of social repercussions or recruiter retaliation, contributor identities are decoupled from their real names:
* A **Stable Pseudonym** is deterministically allocated at registration, but is strictly quarantined and never publicly shown until the user validates control of an institutional email and becomes a Verified Contributor to publish.
* **Generation Algorithm:** Generated from a pre-curated dictionary of tech-themed adjectives, campus-themed nouns, and a collision-resistant integer hash (e.g., `CampusExplorer_42`, `FalconCoder_87`, `QuantumScholar_19`).
* **Persistence:** The pseudonym is permanently associated with the user account and reused across all public posts. This allows readers to recognize consistent contributors while keeping their real identities concealed.

### 5.2 Privacy Safeguards & Whitelist Serialization
* **Zero Leakage Invariant:** Real names, institutional emails (`users.institutional_email`), student roll numbers, and raw database primary keys are **strictly excluded** from public API serialization.
* **Whitelist DTO Pattern:** DRF Serializers for public responses use explicit field whitelisting rather than exclusions. If a developer accidentally adds an internal column to a database model, it will never be serialized unless explicitly added to the whitelist DTO.
* **Re-identification Risk Mitigation:** In small student cohorts, the combination of `(pseudonym, campus_drive, recruitment_year, candidate_outcome, affiliation_label)` could potentially narrow down and re-identify an author. Public responses display only the Recruitment Cycle year, never the exact submission timestamp, for Interview Experiences.
* **Limits of Anonymity:** Contributors are presented with a clear privacy disclaimer during registration: absolute anonymity is not guaranteed against unlawful activity. In cases of legal subpoenas or severe code-of-conduct violations (harassment, extortion), authorized system administrators can access internal identity logs.

---

## 6. Core Product Modules (MVP Scope & Functional Specs)

### Module A: Company Intelligence
* **Public Directory:** Searchable, filterable catalog of recruiting companies (filterable by industry, drive frequency, and role types).
* **Company Profile:** Displays corporate overview, industry categorization, official website, global careers link, and logo.
* **Aggregated Metrics:** Dynamically displays total historical Campus Drives conducted at DAU, average interview difficulty, and overall rating from Company Reviews.
* **Curation Model (Approved Decision 1):** Company records are seeded and maintained by Administrators to prevent messy duplicates (e.g., `Amazon`, `Amazon India`, `AWS`). Contributors can select from existing companies or submit a "Propose New Company" request.

### Module B: Company Reviews (Alumni Module)
* **Eligibility:** Restricted to `Alumni Contributor` accounts with verified employment context.
* **Review Data Model:**
  * Overall Rating (1 to 5 stars).
  * Sub-dimension Ratings: Work-Life Balance, Engineering Culture, Career Growth, Compensation Fairness.
  * Employment Status: `CURRENT_EMPLOYEE` or `FORMER_EMPLOYEE`.
  * Job Role Family and Tenure Band (coarse-grained enums to mitigate peer re-identification; Alumni Qualification Declaration job titles stay confidential).
  * Written Pros, Cons, and Advice to Students.
* **Moderation:** Strictly subject to **Pre-publication Moderation**.

### Module C: Campus Recruitment Intelligence (Core Differentiator)
* **Campus Drive Registry:** Historical record of every recruitment cycle (e.g., `DAU 2024`, `DAU 2025`).
* **Structured Selection Process:**
  * Each drive defines an ordered sequence of `SelectionRound` entities.
  * Each round contains: `round_number` (contiguous 1..N), `name`, `round_type` (OA, Coding, Tech Interview, HR), `difficulty` (`EASY`, `MEDIUM`, `HARD`), `duration_minutes` (optional), and `description`.
* **Structured Interview Experiences:**
  * Contributor logs their overall outcome (`OFFERED`, `REJECTED`, `WITHDREW`).
  * Overall preparation strategy, key takeaways, and mistakes to avoid.
  * **Round Interview Details:** Nested records mapping directly to the drive's rounds, detailing exact coding questions, system design problems, behavioral scenarios, and how the candidate approached them.

### Module D: Preparation Resources
* **Public Repository:** Categorized list of preparation materials (DSA practice sheets, System Design guides, Core Subject interview notes, Aptitude practice).
* **Metadata:** Resource title, URL, associated company/topic tags, contributor pseudonym, and timestamp.
* **Publication Policy:** Basic link validation followed by immediate publication with community reporting mechanisms.

### Module E: Personal Placement Workspace
* **Personal Workspace:** Completely segregated, accessible only to the authenticated owner.
* **Bookmarks:** Quick-access links to saved Companies, upcoming Campus Drives, and critical Preparation Resources.
* **Preparation Tasks:** Interactive personal to-do checklist. Each task has a title, target completion date, associated Campus Drive tag, and a completion toggle.

### Deferred Scope (Post-MVP Modules)
* **Module F (AI Assistant):** Automated company interview question summarization and personalized study schedule generation.
* **Module G (Alumni Mentorship):** Direct 1-on-1 mentorship messaging between students and alumni.
* **Multi-University Self-Onboarding:** Administrative self-serve portal for other universities to join.

---

## 7. Content Moderation & Publication Lifecycle

To balance community participation velocity with institutional data credibility, we apply content-type-differentiated moderation:

### 7.1 Moderation Policy Matrix:
* **Company Profiles:** Admin-seeded / source-reviewed.
* **Campus Drives & Rounds:** Pre-publication review.
* **Interview Experiences:** Pre-publication moderation.
* **Company Reviews:** Pre-publication moderation.
* **Preparation Resources:** Automated syntax/link validation followed by immediate publication with community reporting.
* **Personal Tasks & Bookmarks:** Private; zero moderation required.

### 7.2 Publication Status Lifecycle (8 States)
The platform defines `PUBLIC_VISIBLE_STATUSES = {APPROVED, REPORTED}`.
* **`DRAFT`**: Record under author composition; private.
* **`PENDING`**: Awaiting moderator evaluation in queue; hidden from public.
* **`CHANGES_REQUESTED`**: Returned to author with feedback; hidden from public.
* **`APPROVED`**: Live and discoverable; visible in public query feeds.
* **`REPORTED`**: Live record flagged by community; remains publicly visible during initial triage unless safety thresholds move it to `UNDER_REVIEW`.
* **`UNDER_REVIEW`**: Temporarily suppressed from public view while investigated.
* **`REJECTED`**: Permanently rejected with reason; hidden from public.
* **`REMOVED`**: Retracted due to confirmed violations; permanently hidden.

### 7.3 Re-Moderation Loop on Edits (Approved Decision 3)
* If an author edits an already-published `Interview Experience` or `Company Review`, the system generates an un-published **`ContentRevision`** draft with `RevisionStatus = PENDING_REVISION`.
* The original record remains `APPROVED` and visible to the public throughout the revision review.
* Upon moderator approval, `RevisionStatus` transitions to `MERGED` and changes merge atomically into the live record. If rejected, status becomes `DISCARDED` and the live record remains untouched.

---

## 8. Five Plain-English Business Rules (The IT643 Anchor)

The following five rules represent non-negotiable system invariants. These will be formally cited in `DESIGN.md` and mapped directly to automated tests in `TESTING.md`:

1. **Rule 1 — Institutional Verification Barrier:**  
   *An unverified user cannot author or submit an Interview Experience, Campus Drive, or Company Review.*
2. **Rule 2 — Selection Round Sequence Continuity:**  
   *Within a Campus Drive, Selection Rounds must form a strictly contiguous, 1-based positive integer sequence ($1, 2, \dots, N$) with zero gaps or duplicate round numbers.*
3. **Rule 3 — Moderation Visibility Guard:**  
   *Only content whose Publication Status is APPROVED or REPORTED is serialized in public query feeds; all other states are strictly excluded.*
4. **Rule 4 — Identity Whitelist Isolation:**  
   *Public serializers must never expose private account data (real name, institutional email, student ID, or auth tokens) in any public endpoint response.*
5. **Rule 5 — Personal Workspace User Isolation:**  
   *A user can view, edit, or delete only their own Preparation Tasks and Bookmarks; attempts to query or mutate another user's workspace records must return an HTTP 403 or 404 response.*

---

## 9. System Architecture & Clean Design Boundaries

To fulfill the IT643 requirement for **"One boundary — where your core logic stops and the outside world begins, and which dependency it protects you from,"** we reject the conventional Django "Fat Model / Fat View" anti-pattern in favor of a layered, clean domain architecture.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│         DRF API Views, ViewSets, Request Parsing, Response DTOs        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ calls DTOs / Commands
┌───────────────────────────────────▼────────────────────────────────────┐
│              APPLICATION & DOMAIN SERVICE LAYER (PURE PYTHON)          │
│                                                                        │
│   - DriveService (Enforces sequence continuity & drive invariants)     │
│   - VerificationService (Enforces OTP crypto & role transitions)       │
│   - ModerationService (Enforces moderation queue & revision drafts)    │
│   - WorkspaceService (Enforces ownership & boundary isolation)         │
│                                                                        │
│   ★ PROTECTED CORE: Zero imports of HTTP Request or DRF Views.        │
│   ★ Easily unit-tested with pure Python and pytest without DB spin-up. │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ persistence calls
┌───────────────────────────────────▼────────────────────────────────────┐
│                    INFRASTRUCTURE & PERSISTENCE LAYER                  │
│       Django ORM Models, PostgreSQL Relational Tables, Email Delivery   │
└────────────────────────────────────────────────────────────────────────┘
```

### Architectural Protection:
The Application/Domain Service layer is protected from changes in the Presentation Layer (switching from REST to GraphQL, or changing serializers) and external dependencies (switching email providers or auth mechanisms). All business invariants reside within pure Python domain service functions.

---

## 10. Technology Stack & Justification

| Layer | Chosen Technology | Architectural Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + TypeScript + Vite** | Strict compile-time typing for nested domain structures (Selection Rounds, Interview logs); rich interactive timeline views. |
| **Styling & UI** | **Tailwind CSS** | High-contrast, responsive UI with modern typography, badge states, and responsive tables without CSS bundle bloat. |
| **Client State / Fetching** | **TanStack Query (React Query)** | Robust server-state caching, automatic background invalidation on mutations, and optimistic bookmark updates. |
| **Backend Framework** | **Python 3.15 + Django 6.1.2 + DRF 3.18.3** | Rapid, secure backend development; built-in auth, declarative database migrations, and built-in Admin panel for moderation. Note: Local development runs on Python 3.15.0; cloud deployment host support for Python 3.15 is unverified. |
| **Database Engine** | **Neon Serverless PostgreSQL (PostgreSQL 18.6)** | Verified persistent connection: dual-endpoint routing with psycopg 3.3.6 and dj-database-url, verified live schema migrations. |
| **Testing Engine** | **pytest + pytest-django** | Clean AAA test structure, fixture-based isolation, parameterized boundary tests, and fast execution. |
| **Hosting & CI/CD** | **Frontend: Static / Vercel**<br>**Backend: WSGI / Render**<br>**Database: Neon Serverless Cloud** | High availability, automated CI/CD from Git, sub-100ms response latencies, and full support for external user access (Ceiling 10). |

---

## 11. Relational Database Schema Design

```
TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email_domain VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'dau.ac.in'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES universities(id) ON DELETE SET NULL, -- Multi-university affiliation
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    institutional_email VARCHAR(255) UNIQUE, -- separate from login email; protected PII
    stable_pseudonym VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'REGISTERED_USER',
    is_institutional_verified BOOLEAN DEFAULT FALSE,
    is_alumni_qualified BOOLEAN DEFAULT FALSE, -- derived flag, TRUE only when declaration is APPROVED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE verification_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE alumni_qualification_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    graduation_year INT NOT NULL,
    degree_program VARCHAR(100) NOT NULL,
    employer_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    employment_start_date DATE NOT NULL,
    employment_end_date DATE,
    declaration_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CHANGES_REQUESTED
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    industry VARCHAR(100) NOT NULL,
    headquarters VARCHAR(150),
    website_url VARCHAR(500),
    careers_url VARCHAR(500),
    logo_url VARCHAR(500),
    overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE company_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    website_url VARCHAR(500),
    proposer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    proposal_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE campus_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE RESTRICT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recruitment_year INT NOT NULL, -- Placement-season end year (e.g., 2026 for July 2025-June 2026 cycle; independent of student graduating class)
    eligibility_summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_drive_university_company_year UNIQUE (university_id, company_id, recruitment_year)
);

TABLE job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_drive_id UUID NOT NULL REFERENCES campus_drives(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    role_type VARCHAR(100) NOT NULL,
    base_salary NUMERIC(12, 2),
    total_ctc NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'INR'
);

TABLE selection_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_drive_id UUID NOT NULL REFERENCES campus_drives(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    round_name VARCHAR(150) NOT NULL,
    round_type VARCHAR(50) NOT NULL, -- ONLINE_ASSESSMENT, CODING_TEST, GROUP_DISCUSSION, TECHNICAL_INTERVIEW, HR_INTERVIEW, HYBRID
    difficulty VARCHAR(50) NOT NULL, -- EASY, MEDIUM, HARD
    duration_minutes INT, -- Round duration in minutes (optional)
    topics_assessed TEXT,
    description TEXT,
    CONSTRAINT uq_round_drive_number UNIQUE (campus_drive_id, round_number)
);

TABLE interview_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_drive_id UUID NOT NULL REFERENCES campus_drives(id) ON DELETE RESTRICT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    candidate_outcome VARCHAR(50) NOT NULL, -- OFFERED, REJECTED, WITHDREW
    overall_experience TEXT NOT NULL,
    preparation_tips TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PublicationStatus
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_user_drive_experience UNIQUE (campus_drive_id, author_id)
);

TABLE round_interview_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_experience_id UUID NOT NULL REFERENCES interview_experiences(id) ON DELETE CASCADE,
    selection_round_id UUID NOT NULL REFERENCES selection_rounds(id) ON DELETE RESTRICT,
    questions_asked TEXT NOT NULL,
    candidate_approach TEXT
);

TABLE company_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
    rating_wlb INT NOT NULL CHECK (rating_wlb BETWEEN 1 AND 5),
    rating_culture INT NOT NULL CHECK (rating_culture BETWEEN 1 AND 5),
    rating_growth INT NOT NULL CHECK (rating_growth BETWEEN 1 AND 5),
    rating_compensation INT NOT NULL CHECK (rating_compensation BETWEEN 1 AND 5),
    employment_status VARCHAR(50) NOT NULL, -- CURRENT_EMPLOYEE, FORMER_EMPLOYEE
    job_role_family VARCHAR(50) NOT NULL, -- Standardized role family enum (SOFTWARE_ENGINEER, DATA_ENGINEER, etc.)
    tenure_band VARCHAR(50) NOT NULL, -- Standardized tenure band (< 1 year, 1-2 years, etc.)
    pros TEXT NOT NULL,
    cons TEXT NOT NULL,
    advice TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PublicationStatus
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE preparation_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    description TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'APPROVED', -- PublicationStatus
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- COMPANY, DRIVE, RESOURCE
    object_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_user_bookmark UNIQUE (user_id, content_type, object_id)
);

TABLE preparation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    campus_drive_id UUID REFERENCES campus_drives(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_content_type VARCHAR(50) NOT NULL, -- INTERVIEW_EXPERIENCE, COMPANY_REVIEW
    target_object_id UUID NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    revised_data JSONB NOT NULL,
    revision_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVISION', -- PENDING_REVISION, MERGED, DISCARDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    target_content_type VARCHAR(50) NOT NULL,
    target_object_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    details TEXT,
    report_status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, TRIAGED, RESOLVED, DISMISSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TABLE moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    target_content_type VARCHAR(50) NOT NULL,
    target_object_id UUID NOT NULL,
    action_taken VARCHAR(50) NOT NULL, -- APPROVED, REJECTED, CHANGES_REQUESTED, REMOVED, QUARANTINED, REPORT_DISMISSED
    reason_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_anti_self_approval CHECK (moderator_id != target_object_id) -- Anti-self-approval invariant
);
```

---

## 12. API Design & Conventions

* **Root Path:** `/api/v1/`
* **Response Envelope Standard:** All responses follow a predictable envelope:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```
* **Error Envelope Standard:**
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "Selection round sequence must be contiguous.",
      "details": { "round_number": "Round 2 missing before Round 3." }
    }
  }
  ```
* **Key Endpoints Overview:**
  * `POST /api/v1/auth/register/` — Create registered user.
  * `POST /api/v1/auth/request-otp/` — Request verification OTP for `@dau.ac.in`.
  * `POST /api/v1/auth/verify-otp/` — Validate OTP, unlock `Verified Contributor`.
  * `GET  /api/v1/companies/` — Search/filter published companies.
  * `GET  /api/v1/companies/{slug}/` — Retrieve company details + drives summary.
  * `GET  /api/v1/drives/?university=dau&year=2025` — Historical campus drives list.
  * `GET  /api/v1/drives/{id}/` — Full drive profile, ordered selection rounds.
  * `POST /api/v1/experiences/` — Submit structured interview experience (queued for moderation).
  * `POST /api/v1/reviews/` — Submit alumni company review (queued for moderation).
  * `GET  /api/v1/workspace/tasks/` — List user's private preparation tasks.
  * `POST /api/v1/workspace/bookmarks/toggle/` — Toggle item bookmark.

---

## 13. Testing Standards & Quality Assurance (IT643)

### 13.1 Strict AAA Pattern (Arrange-Act-Assert)
Every automated test must clearly separate the three steps:
```python
def test_unverified_contributor_cannot_submit_interview_experience():
    # Arrange
    user = create_registered_user(is_institutional_verified=False)
    drive = create_sample_campus_drive()
    payload = {"campus_drive_id": drive.id, "overall_experience": "Great interview."}

    # Act & Assert
    with pytest.raises(PermissionDeniedException) as exc_info:
        ExperienceService.submit_experience(author=user, data=payload)
    
    assert "Institutional email verification required" in str(exc_info.value)
```

### 13.2 Test Hierarchy & Doubles
1. **Unit Tests (Domain Services):** Zero database or network dependencies. Blazingly fast, testing pure business logic (ordering invariants, role checks, pseudonym generator).
2. **Integration Tests (API Endpoints):** Test complete HTTP request-response cycle, database transactions, and permission guards using `pytest-django`.
3. **Test Doubles:** External side-effects (e.g., SMTP email dispatch for OTP) must be isolated behind an `EmailSender` interface and substituted with an in-memory fake test double during testing.

### 13.3 Automated Verification Matrix
To ensure code never diverges from this document and the Ubiquitous Language specification, the following automated test suites enforce every canonical business rule:

| Rule # | Canonical Business Rule / Invariant | Automated Test File | Passing Assertion / Target Service |
| :--- | :--- | :--- | :--- |
| **Rule 1** | **Institutional Verification Barrier** (unverified users blocked from submitting campus intelligence) | `backend/tests/test_business_rule_1_verification_barrier.py` | `IsVerifiedContributor`, `VerificationService.validate_otp` |
| **Rule 2** | **Selection Round Sequence Continuity** (strictly contiguous 1..N sequence, gap detection) | `backend/tests/test_business_rule_2_selection_rounds.py` | `SequenceGapException`, `DuplicateRoundNumberException` |
| **Rule 3** | **Moderation Visibility Guard** (only `APPROVED` and `REPORTED` serialized in public feeds) | `backend/tests/test_business_rule_3_moderation_visibility.py` | `PUBLIC_VISIBLE_STATUSES`, `ModerationService.review_submission` |
| **Rule 4** | **Identity Whitelist Isolation** (zero PII leakage, `stable_pseudonym` only) | `backend/tests/test_business_rule_4_identity_whitelist.py` | `PublicAuthorSerializer` strict whitelist isolation |
| **Rule 5** | **Personal Workspace User Isolation** (users can view/edit only their own tasks/bookmarks) | `backend/tests/test_business_rule_5_workspace_isolation.py` | `WorkspaceService` scoped query filtering & `PermissionDenied` |
| **AD-3** | **Content Revision Traceability** (`APPROVED` live record preservation during drafts) | `backend/tests/test_architectural_decision_3_content_revisions.py` | `RevisionStatus.PENDING_REVISION` & atomic `MERGED` transition |
| **Invariant** | **Anti-Self-Approval Invariant** (moderator cannot review own records across models) | `backend/tests/test_invariant_anti_self_approval.py` | `ModerationService.resolve_record_owner_id` & `PermissionDenied` |
| **Invariant** | **Cross-Drive Invariant** (selection round must belong to same drive as interview experience) | `backend/tests/test_invariant_round_detail_same_drive.py` | `RoundInterviewDetail.clean` `ValidationError` |

---

## 14. Approved Architectural Decisions Log

* **Decision 1 (Company Curation):** Seeded and curated by Platform Administrators / Placement team data. Users can propose new companies, preventing fragmented duplicates (`Amazon`, `Amazon India`).
* **Decision 2 (Stable Pseudonym Generation — Amended):** Decision 2 amended: pseudonym allocated at registration, never publicly shown until the user becomes a Verified Contributor and publishes. Deterministic algorithmic generation using a curated dictionary of adjectives and nouns maximizes privacy and prevents accidental self-doxxing.
* **Decision 3 (Re-Moderation Workflow):** Substantial edits to published content spawn an un-published `ContentRevision` draft for moderator review. The live record remains untouched and visible until approval.
* **Decision 4 (Cloud Infrastructure for Ceiling 10):** Vercel (Frontend) + Render (Backend) + Neon Serverless PostgreSQL (PostgreSQL 18.6). Neon Serverless DB schema persistence verified in this session via migration execution; cloud host runtime deployments are unverified.

---

## 15. Known Limitations & Deferred Work

The following items are deliberately deferred beyond the initial MVP:
1. Native mobile applications (responsive web design fulfills mobile accessibility).
2. AI-assisted interview summary generation (Module F).
3. Direct alumni-student real-time chat (Module G).
4. Multi-university automated billing and onboarding portals.
