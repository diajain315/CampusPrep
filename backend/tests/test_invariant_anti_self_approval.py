import pytest
from datetime import date
from django.core.exceptions import PermissionDenied
from apps.users.models import User, AlumniQualificationDeclaration
from apps.universities.models import University
from apps.companies.models import Company, CompanyProposal
from apps.drives.models import CampusDrive
from apps.experiences.models import InterviewExperience
from apps.moderation.models import ContentRevision
from apps.moderation.services import ModerationService
from apps.common.enums import (
    CandidateOutcome,
    PublicationStatus,
    DeclarationStatus,
    ProposalStatus,
    RevisionStatus,
)


@pytest.mark.django_db
class TestInvariantAntiSelfApproval:
    """
    IT643 Architectural Invariant: Anti-Self-Approval.
    A Moderator or Administrator can NEVER perform a Moderation Action
    on any record that they own.
    Covers distinct ownership fields across models:
    - author_id (InterviewExperience)
    - user_id (AlumniQualificationDeclaration)
    - author_id (CompanyProposal)
    - author_id (ContentRevision)
    """

    @pytest.fixture
    def setup_data(self):
        moderator = User.objects.create_user(
            username="mod_tester",
            password="password123",
            is_moderator=True,
            is_verified_contributor=True,
            stable_pseudonym="ModExplorer_1"
        )
        university = University.objects.create(
            name="Dhirubhai Ambani University",
            short_name="DAU",
            domain="dau.ac.in",
            city="Gandhinagar",
            state="Gujarat"
        )
        company = Company.objects.create(
            name="Tata Consultancy Services",
            industry="IT Services"
        )
        drive = CampusDrive.objects.create(
            university=university,
            company=company,
            recruitment_year=2026,
            eligibility_summary="All B.Tech streams"
        )
        return {
            'moderator': moderator,
            'university': university,
            'company': company,
            'drive': drive,
        }

    def test_moderator_cannot_approve_own_interview_experience(self, setup_data):
        # Arrange
        moderator = setup_data['moderator']
        experience = InterviewExperience.objects.create(
            author=moderator,
            campus_drive=setup_data['drive'],
            candidate_outcome=CandidateOutcome.OFFERED,
            overall_feedback="Self authored interview account."
        )

        # Act & Assert
        with pytest.raises(PermissionDenied) as exc_info:
            ModerationService.review_submission(
                moderator=moderator,
                instance=experience,
                new_status=PublicationStatus.APPROVED
            )
        assert "cannot moderate their own submission" in str(exc_info.value)

    def test_moderator_cannot_approve_own_alumni_qualification_declaration(self, setup_data):
        # Arrange
        moderator = setup_data['moderator']
        declaration = AlumniQualificationDeclaration.objects.create(
            user=moderator,
            graduation_year=2024,
            degree_program="B.Tech ICT",
            employer_name="Tata Consultancy Services",
            job_title="Software Engineer",
            start_date=date(2024, 7, 1)
        )

        # Act & Assert
        with pytest.raises(PermissionDenied) as exc_info:
            ModerationService.review_declaration(
                moderator=moderator,
                declaration=declaration,
                new_status=DeclarationStatus.APPROVED
            )
        assert "cannot moderate their own submission" in str(exc_info.value)

    def test_moderator_cannot_approve_own_company_proposal(self, setup_data):
        # Arrange
        moderator = setup_data['moderator']
        proposal = CompanyProposal.objects.create(
            author=moderator,
            name="Infosys Limited",
            industry="IT Consulting",
            justification="Major campus recruiter"
        )

        # Act & Assert
        with pytest.raises(PermissionDenied) as exc_info:
            ModerationService.review_proposal(
                moderator=moderator,
                proposal=proposal,
                new_status=ProposalStatus.APPROVED
            )
        assert "cannot moderate their own submission" in str(exc_info.value)

    def test_moderator_cannot_merge_own_content_revision(self, setup_data):
        # Arrange
        moderator = setup_data['moderator']
        live_experience = InterviewExperience.objects.create(
            author=moderator,
            campus_drive=setup_data['drive'],
            candidate_outcome=CandidateOutcome.OFFERED,
            overall_feedback="Initial approved text",
            status=PublicationStatus.APPROVED
        )
        revision = ContentRevision.objects.create(
            author=moderator,
            content_type=live_experience._meta.model_name,
            object_id=live_experience.id,
            revision_status=RevisionStatus.PENDING_REVISION,
            proposed_payload={"overall_feedback": "Revised self text"}
        )

        # Act & Assert
        with pytest.raises(PermissionDenied) as exc_info:
            ModerationService.merge_revision(
                moderator=moderator,
                revision_id=revision.id
            )
        assert "cannot moderate their own submission" in str(exc_info.value)
