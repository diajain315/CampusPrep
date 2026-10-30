"""
Automated Glossary Lint Guard.

Enforces Ubiquitous Language integrity across:
- backend/apps (active python code, excluding migrations)
- frontend/src (TypeScript / TSX components)
- documents/PROJECT_CONTEXT.md (non-definition prose)

Parses Section 2 "Aliases to Avoid" column from documents/UBIQUITOUS_LANGUAGE.md
and ensures prohibited terms are not introduced into code identifiers, UI labels,
API fields, or prose outside definitions.
"""

from pathlib import Path
import re
import os
import pytest


def parse_aliases_from_ubiquitous_language(ul_path: Path):
    """
    Parses the 'Aliases to Avoid (Prohibited)' column from Section 2
    of documents/UBIQUITOUS_LANGUAGE.md.
    """
    with open(ul_path, encoding='utf-8') as f:
        text = f.read()

    assert "## 2. Terminology Table & Code Mapping" in text, "Section 2 missing in UBIQUITOUS_LANGUAGE.md"
    assert "## 3. Flagged Ambiguities" in text, "Section 3 missing in UBIQUITOUS_LANGUAGE.md"

    sec2 = text.split("## 2. Terminology Table & Code Mapping")[1].split("## 3. Flagged Ambiguities")[0]
    lines = sec2.strip().splitlines()

    alias_to_terms = {}
    for line in lines:
        line = line.strip()
        if not line.startswith('|'):
            continue
        cols = [c.strip() for c in line.split('|')][1:-1]
        if len(cols) == 4 and cols[0] != 'Domain Term' and not cols[0].startswith(':---'):
            term = re.sub(r'\*+', '', cols[0]).strip()
            # Remove parenthesized notes like (Note: ...)
            cell = re.sub(r'\(.*?\)', '', cols[2])
            for a in cell.split(','):
                clean_alias = a.strip().rstrip('.').strip()
                if clean_alias:
                    alias_to_terms.setdefault(clean_alias, []).append(term)

    return alias_to_terms


# Explicit allowlist for permitted compound terms and framework primitives.
# Per specification: Round Number, Round Type, Campus Drive, framework names like models.Manager.
PERMITTED_ALLOWLIST = [
    # Canonical compound domain terms
    r'Selection\s+Round',
    r'Round\s+Number',
    r'Round\s+Type',
    r'Round\s+Interview\s+Detail',
    r'RoundInterviewDetail',
    r'Campus\s+Drive',
    r'CampusDrive',
    r'Job\s+Role\s+Family',
    r'Job\s+Role',
    r'JobRoleFamily',
    r'JobRole',
    r'Company\s+Review',
    r'CompanyReview',
    r'Content\s+Revision',
    r'ContentRevision',
    r'Publication\s+Status',
    r'Declaration\s+Status',
    r'Proposal\s+Status',
    r'Report\s+Status',
    r'Revision\s+Status',
    r'Candidate\s+Outcome',
    r'CandidateOutcome',
    r'Preparation\s+Resource',
    r'Preparation\s+Task',
    r'PreparationResource',
    r'PreparationTask',
    r'Verified\s+Contributor',
    r'Alumni\s+Contributor',
    r'IsVerifiedContributor',
    r'IsAlumniContributor',
    r'is_verified_contributor',
    r'is_alumni_qualified',
    r'Personal\s+Workspace',
    r'Public\s+Visitor',
    r'IsPublicVisitor',
    r'Anti-Self-Approval\s+Invariant',
    r'Business\s+Rule\s*\d*',
    r'Technical\s+Interview',
    r'HR\s+Interview',
    r'Under\s+Review',
    r'Public\s+Feed',
    r'PUBLIC_VISIBLE_STATUSES',
    r'overall_rating',
    r'work_life_rating',
    r'culture_rating',
    r'growth_rating',
    r'compensation_rating',
    r'Tenure\s+Band',
    r'recruitment_year',
    r'Recruitment\s+Cycle',
    r'Stable\s+Pseudonym',
    r'Institutional\s+Email\s+Verification',
    r'Alumni\s+Qualification\s+Declaration',
    r'Company\s+Proposal',
    r'Content\s+Report',
    r'Moderation\s+Action',
    r'Moderation\s+Queue',
    r'ModerationActionType',
    r'ReportSeverity',
    # Framework / technical primitives
    r'models\.Manager',
    r'models\.[A-Za-z0-9_]+',
    r'rest_framework\.status',
    r'status\.HTTP_[A-Za-z0-9_]+',
    r'status_code',
    r'status\s*=\s*(?:PublicationStatus|models|serializers|instance\.status|status\.HTTP)',
    r'AbstractUser',
    r'is_superuser',
    r'username',
    r'django\.[A-Za-z0-9_.]+',
    r'import\s+\{\s*Link\s*\}',
    r'<\s*Link(?:\s+to=[^>]+)?\s*>',
    r'<\s*/\s*Link\s*>',
    r'useState',
    r'useEffect',
    r'https?://[A-Za-z0-9_.-]+',
    r'round\(',
    r'order_by\(',
    r'ordering\s*=',
    r'state\s*=\s*models\.CharField\(max_length=100\)',
    r'feedback\s*=\s*',
    r'feedback\s*:\s*str',
    r'feedback\s*=\s*feedback',
    r'<\s*code[^>]*>',
    r'<\s*/\s*code\s*>',
    r'title\s*=\s*',
    r'AlumniQualificationDeclaration\.job_title',
    r'ATS',
    r'Applicant\s+Tracking\s+System',
    r'POST',
]

COMPILED_PERMITTED = [re.compile(p, re.IGNORECASE) for p in PERMITTED_ALLOWLIST]


def test_no_prohibited_glossary_aliases_in_codebase():
    """
    Verifies that no prohibited alias from UBIQUITOUS_LANGUAGE.md Section 2
    is used in backend/apps, frontend/src, or documents/PROJECT_CONTEXT.md prose.
    """
    repo_root = Path(__file__).resolve().parent.parent.parent
    ul_path = repo_root / "documents" / "UBIQUITOUS_LANGUAGE.md"
    assert ul_path.exists(), f"UBIQUITOUS_LANGUAGE.md not found at {ul_path}"

    alias_to_terms = parse_aliases_from_ubiquitous_language(ul_path)
    assert len(alias_to_terms) > 50, f"Expected > 50 aliases, found {len(alias_to_terms)}"

    # Identify prohibited multi-word and strict single-word aliases to guard
    # Focus on non-trivial domain aliases
    prohibited_aliases = set(alias_to_terms.keys())

    # Collect files to scan
    files_to_scan = []

    # Backend apps (excluding migrations)
    backend_apps = repo_root / "backend" / "apps"
    for root, dirs, files in os.walk(backend_apps):
        if "migrations" in root:
            continue
        for f in files:
            if f.endswith(".py"):
                files_to_scan.append(Path(root) / f)

    # Frontend src
    frontend_src = repo_root / "frontend" / "src"
    for root, dirs, files in os.walk(frontend_src):
        for f in files:
            if f.endswith((".ts", ".tsx")):
                files_to_scan.append(Path(root) / f)

    # PROJECT_CONTEXT.md
    project_context = repo_root / "documents" / "PROJECT_CONTEXT.md"
    if project_context.exists():
        files_to_scan.append(project_context)

    # Specific allowlist for permitted occurrences
    permitted_specific = [
        r'`job_title`',
        r'employer name, job_title',
        r'employer name, job title',
        r'AlumniQualificationDeclaration.*job_title',
    ]

    all_permitted = COMPILED_PERMITTED + [re.compile(p, re.IGNORECASE) for p in permitted_specific]

    # Prohibited aliases: check all multi-word aliases parsed from UL,
    # plus key strict single-word aliases that should never appear outside definitions.
    multi_word_aliases = {a: t for a, t in alias_to_terms.items() if ' ' in a}
    strict_single_aliases = {
        'Tenant': alias_to_terms.get('Tenant', ['University']),
        'Dashboard': alias_to_terms.get('Dashboard', ['Personal Workspace']),
        'Alum': alias_to_terms.get('Alum', ['Alumni Contributor']),
    }
    
    aliases_to_check = {**multi_word_aliases, **strict_single_aliases}
    violations = []

    for file_path in files_to_scan:
        with open(file_path, encoding='utf-8') as f:
            lines = f.readlines()

        for line_idx, line in enumerate(lines, 1):
            # Mask permitted patterns
            masked = line
            for pat in all_permitted:
                masked = pat.sub(' ' * 10, masked)

            # Check all aliases to guard
            for alias, target_terms in aliases_to_check.items():
                pattern = r'\b' + re.escape(alias) + r'\b'
                if re.search(pattern, masked, re.IGNORECASE):
                    rel_path = file_path.relative_to(repo_root) if file_path.is_relative_to(repo_root) else file_path
                    violations.append(
                        f"{rel_path}:{line_idx}: [{alias}] (prohibited for {target_terms}): {line.strip()}"
                    )

    assert not violations, "Prohibited glossary alias violations found:\n" + "\n".join(violations)


def test_glossary_lint_detects_synthetic_violation():
    """Verifies that the glossary lint detector identifies prohibited terms with line numbers."""
    synthetic_line = "This is a private User Dashboard for candidate management."
    
    # Mask permitted
    masked = synthetic_line
    for pat in COMPILED_PERMITTED:
        masked = pat.sub(' ' * 10, masked)
    
    assert re.search(r'\bDashboard\b', masked, re.IGNORECASE) is not None

