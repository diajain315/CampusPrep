import pytest
from apps.users.models import User
from apps.companies.models import Company
from apps.reviews.models import CompanyReview
from apps.moderation.services import ModerationService
from apps.common.enums import PublicationStatus, RevisionStatus, JobRoleFamily, TenureBand


@pytest.mark.django_db
class TestArchitecturalDecision3ContentRevisionTraceability:
    """
    IT643 Architectural Decision 3:
    Re-moderation loop on edits. Editing an already-published record spawns
    a draft ContentRevision (PENDING_REVISION). The live record remains APPROVED
    throughout the review, and merges atomically upon moderator approval.
    """

    @pytest.fixture
    def setup_review(self):
        author = User.objects.create_user(
            username="alumni_review_author",
            is_alumni_qualified=True,
            stable_pseudonym="CampusAlum_77"
        )
        moderator = User.objects.create_user(
            username="board_moderator",
            is_moderator=True,
            stable_pseudonym="Mod_Inspector"
        )
        company = Company.objects.create(name="Microsoft IDC", industry="Enterprise Software")
        review = CompanyReview.objects.create(
            author=author,
            company=company,
            job_role_family=JobRoleFamily.SOFTWARE_ENGINEER,
            tenure_band=TenureBand.ONE_TO_TWO_YEARS,
            work_life_rating=4,
            culture_rating=5,
            growth_rating=4,
            compensation_rating=5,
            pros="Great learning curve and inclusive mentors.",
            cons="Bureaucracy in cross-org approvals.",
            status=PublicationStatus.APPROVED
        )
        return {
            'author': author,
            'moderator': moderator,
            'review': review,
        }

    def test_creating_revision_preserves_live_record_in_approved_status(self, setup_review):
        # Arrange
        review = setup_review['review']
        author = setup_review['author']
        assert review.status == PublicationStatus.APPROVED

        # Act: Author submits revised pros and advice
        revision = ModerationService.create_revision(
            author=author,
            instance=review,
            proposed_payload={
                'pros': "Updated: Great learning curve, inclusive mentors, and newly expanded hybrid policy.",
                'advice_to_management': "Accelerate internal promotion feedback loops."
            }
        )

        # Assert: Live record is still APPROVED with original text
        review.refresh_from_db()
        assert review.status == PublicationStatus.APPROVED
        assert review.pros == "Great learning curve and inclusive mentors."

        # Assert: Revision created with PENDING_REVISION status
        assert revision.revision_status == RevisionStatus.PENDING_REVISION
        assert revision.object_id == review.id
        assert "hybrid policy" in revision.proposed_payload['pros']

    def test_moderator_merging_revision_updates_live_record(self, setup_review):
        # Arrange
        review = setup_review['review']
        author = setup_review['author']
        moderator = setup_review['moderator']

        revision = ModerationService.create_revision(
            author=author,
            instance=review,
            proposed_payload={'pros': "Enhanced pros description approved by team."}
        )

        # Act: Moderator merges the revision
        success = ModerationService.merge_revision(
            moderator=moderator,
            revision_id=revision.id
        )

        # Assert: Merged atomically
        assert success is True
        revision.refresh_from_db()
        review.refresh_from_db()

        assert revision.revision_status == RevisionStatus.MERGED
        assert review.pros == "Enhanced pros description approved by team."
        assert review.status == PublicationStatus.APPROVED
