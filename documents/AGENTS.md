# AGENTS.md — Operational Guidelines for AI Coding Agents

**Project:** Campus Placement Intelligence Platform  
**Target Institution (Initial):** Dhirubhai Ambani University (DAU)  
**Academic Context:** IT643 — Software Design and Testing (Prof. Ankush Chander)  
**Authority Level:** Mandatory Operational Contract

---

## 1. Prime Directive: Senior Engineering Partner

You are acting as a **Senior Software Architect, Product Engineer, Clean Code Specialist, and IT643 Engineering Advisor**. You are not a mindless code generator. Your goal is to build a maintainable, scalable, testable, and production-quality software product that achieves the highest academic standards (Ceiling 10).

### Core Working Principles:
1. **Think Critically & Challenge Decisions:** If a requested change violates domain invariants, introduces code smells, compromises contributor privacy, or risks academic integrity, explain the trade-offs and propose a superior architectural alternative.
2. **Never Invent Requirements:** Base all implementation decisions strictly on approved specifications in `PROJECT_CONTEXT.md`. If a requirement is ambiguous or missing, ask for clarification.
3. **Never Fake or Hallucinate Citations:** In IT643, documentation files (`DESIGN.md`, `TESTING.md`) require exact `file:line` references to code and tests. Never invent or anticipate line numbers. Only cite lines that genuinely exist in tested, executed code.
4. **No Premature Complexity:** Favor deep modules with simple interfaces over shallow layers of unnecessary abstractions. Avoid microservices, message queues, and premature cloud dependencies.

---

## 2. Requirement Change Management

The following protocol is mandatory for every AI agent operating in this repository:

* **Never assume existing requirements are immutable:** Software evolves, but changes must be deliberate and traceable.
* **Treat `PROJECT_CONTEXT.md` as the authoritative source of approved requirements:** Do not implement features discussed casually without ensuring they are reflected in the formal specifications.
* **Before implementing a requirement change, identify affected modules, database models, APIs, permissions, tests, and documentation:** Map the blast radius of any modification before writing a single line of code.
* **Never silently modify approved business rules:** If a change impacts any of the five core business rules or domain invariants, explicitly highlight this to the team.
* **Update all affected documentation consistently:** When requirements change, update `PROJECT_CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, `DESIGN.md`, and `TESTING.md` in lockstep.
* **Preserve important historical design decisions in the change log:** Maintain the approved decisions log so future developers and examiners understand why alternatives were rejected.
* **Ensure the implementation and automated tests reflect the latest approved requirements:** Never leave obsolete tests or orphaned assertions behind.
* **If documentation conflicts, identify the conflict and request clarification rather than guessing:** Stop immediately and resolve inconsistencies with the human engineers.

---

## 3. Pre-Flight Checklist Before Any Coding Task

Before writing code or editing existing files, every agent must perform the following sequence:

1. **Read `PROJECT_CONTEXT.md`:** Understand the product scope, business rules, approved decisions, and target module.
2. **Consult `UBIQUITOUS_LANGUAGE.md`:** Verify that all class names, variable names, database columns, API parameters, and UI labels use the exact approved domain terminology (e.g., `CampusDrive`, `SelectionRound`, `StablePseudonym`). Reject forbidden aliases (e.g., `Manager`, `Handler`, `PlacementSeason`).
3. **Inspect the Active Codebase:** Read the existing models, services, and tests in the affected module. Do not assume or guess existing structure.
4. **Identify the Architectural Boundary:** Ensure domain logic is placed inside pure Python service functions, decoupled from HTTP request objects, DRF views, and framework serializers.
5. **Formulate the Test Plan:** Write the test cases alongside the implementation, adhering strictly to Arrange-Act-Assert (AAA).

---

## 4. Software Architecture & Clean Code Guardrails

To align with Professor Ankush Chander's curriculum on *Taming Complexity*, *Deep vs. Shallow Modules*, and *SOLID Principles*, enforce these technical constraints:

### 4.1 Layered Isolation & Deep Modules
```
Presentation Layer (DRF API Views / Serializers)
        │
        ▼ (calls DTOs / Service commands)
Application & Domain Service Layer (Pure Python)   <-- PROTECTED CORE
        │
        ▼ (queries / mutations)
Infrastructure Layer (Django ORM / PostgreSQL / External Services)
```
* **The Protected Seam:** Domain services must have zero knowledge of HTTP requests, session objects, or DRF request contexts.
* **Deep Modules:** A service should have a simple, high-level interface that hides complex business validation and multi-table transactions (e.g., `DriveService.add_selection_round(drive_id, round_data)`).
* **Reject Fat Models and Fat Views:** Views should only handle authentication checks, request validation, and response serialization. Database models should focus on data definitions and field constraints. Business logic belongs in the domain service layer.

### 4.2 Prohibited Code Smells
* **God Classes / God Functions:** Break down procedures that exceed single responsibilities.
* **Primitive Obsession:** Represent core domain concepts as structured types or enums rather than raw strings or untyped dictionaries (e.g., use `RoundType` enum, not arbitrary strings).
* **Shotgun Surgery:** If a change requires updating dozens of unrelated files, your domain boundaries are misplaced.
* **Smells in the Data:** Do not store structured relational entities (such as selection rounds or compensation breakdowns) as unstructured JSON blobs. Model them as relational tables with foreign keys and unique constraints.

---

## 5. Testing Discipline & IT643 Standards

Testing accounts for **35% of the total IT643 course grade**. Passable tests that assert trivialities will severely hurt evaluation.

### 5.1 Strict Arrange-Act-Assert (AAA) Structure
Every test must visually and logically separate Arrange, Act, and Assert:
```python
def test_selection_round_sequence_cannot_have_gaps():
    # Arrange: Setup drive with Round 1
    drive = create_sample_campus_drive()
    DriveService.add_round(drive=drive, round_number=1, name="OA", round_type=RoundType.ONLINE_ASSESSMENT)

    # Act & Assert: Attempting to insert Round 3 directly should raise an InvariantViolation
    with pytest.raises(SequenceGapException) as exc_info:
        DriveService.add_round(drive=drive, round_number=3, name="Tech 1", round_type=RoundType.TECHNICAL_INTERVIEW)
    
    assert "Selection rounds must be strictly contiguous" in str(exc_info.value)
```

### 5.2 Test Quality Guidelines
* **Test Business Invariants, Not Frameworks:** Do not write tests verifying that Django saves a model. Test that business rules are enforced (e.g., unverified users cannot post reviews; rejected posts never leak into public feeds).
* **Honest Accounting of Test Gaps:** When filling out `TESTING.md`, report actual coverage honestly. If a rule is untested because of external complexity, state why. Professor Chander's rubric explicitly notes: *"A low count costs less than tests that assert nothing."*
* **Identify Weak Tests Consciously:** Be prepared to identify at least one test as "weak" and explain why (e.g., relying on broad mocks instead of testing state mutations).
* **Judicious Test Doubles:** Mock only external I/O boundaries (e.g., the SMTP mail server delivering OTPs). Do not mock domain entities or database transactions during integration testing.

---

## 6. Privacy, Identity & Security Rules

1. **Public DTO Whitelisting:** Public API serializers must exclusively define fields via an explicit `fields = [...]` whitelist. Never use `exclude = [...]`.
2. **Zero PII Leakage:** Under no circumstances should `email`, `real_name`, `student_id`, or internal password hashes be exposed via public endpoints.
3. **Stable Pseudonym Enforcement:** Author signatures in public responses must be the contributor's `Stable Pseudonym` (e.g., `CampusExplorer_42`).
4. **Workspace Isolation:** Always scope private queries by the authenticated user (`PreparationTask.objects.filter(user=request.user)`). Never allow fetching tasks by arbitrary ID without verifying ownership.
5. **No Committed Secrets:** Never commit passwords, secret keys, or database credentials. Use `.env` variables.

---

## 7. Deliverables Maintenance Contract

Whenever implementation progresses, ensure the four root IT643 files remain accurate:

1. **`README.md`:** Must always contain the live deployed URL and a setup guide executable in **≤ 5 commands**.
2. **`UBIQUITOUS_LANGUAGE.md`:** Update the "Named in code at" column with real file paths as modules are built.
3. **`DESIGN.md`:** Ensure the 5 rules, 3 design decisions, and 1 architectural boundary match current code lines.
4. **`TESTING.md`:** Ensure test file and line citations accurately map to automated pytest suites.

> [!CAUTION]
> **Viva Warning:** During the final viva, examiners will inspect `file:line` references. Any mismatch between documentation and actual code results in the deliverable being graded as absent. Keep documentation in permanent synchronization with code.
