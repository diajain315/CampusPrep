import pytest
from apps.users.models import User
from apps.universities.models import University
from apps.companies.models import Company
from apps.drives.models import CampusDrive
from apps.experiences.models import InterviewExperience
from apps.moderation.services import ModerationService
from apps.common.enums import (
    PublicationStatus,
    ReportSeverity,
    ReportReason,
    CandidateOutcome,
    PUBLIC_VISIBLE_STATUSES,
)


@pytest.mark.django_db
class TestBusinessRule3ModerationVisibilityGuard:
    """
    IT643 Canonical Business Rule 3:
    Only content whose Publication Status is APPROVED or REPORTED
    (PUBLIC_VISIBLE_STATUSES) is serialized in public query feeds;
    all other states (DRAFT, PENDING, CHANGES_REQUESTED, UNDER_REVIEW,
    REJECTED, REMOVED) are strictly excluded.
    """

    @pytest.fixture
    def setup_data(self):
        author = User.objects.create_user(
            username="student_user",
            password="testpassword123",
            stable_pseudonym="CampusExplorer_101",
            is_verified_contributor=True
        )
        moderator = User.objects.create_user(
            username="mod_user",
            password="testpassword123",
            stable_pseudonym="CampusModerator_01",
            is_moderator=True
        )
        uni = University.objects.create(name="DAU", short_name="DAU", domain="dau.ac.in", city="Gandhinagar", state="Gujarat")
        comp = Company.objects.create(name="Amazon", industry="Cloud/Retail")
        drive = CampusDrive.objects.create(university=uni, company=comp, recruitment_year=2026)

        experience = InterviewExperience.objects.create(
            author=author,
            campus_drive=drive,
            candidate_outcome=CandidateOutcome.OFFERED,
            overall_feedback="Comprehensive 3-round interview experience."
        )
        return {
            'author': author,
            'moderator': moderator,
            'experience': experience,
        }

    def test_new_submission_starts_in_pending_status_and_is_hidden(self, setup_data):
        # Arrange & Act: Submission created
        exp = setup_data['experience']

        # Assert: Initial status is PENDING and strictly excluded from public feeds
        assert exp.status == PublicationStatus.PENDING
        assert exp.status not in PUBLIC_VISIBLE_STATUSES

    def test_moderator_approval_publishes_submission(self, setup_data):
        # Arrange
        exp = setup_data['experience']
        mod = setup_data['moderator']

        # Act
        action = ModerationService.review_submission(
            moderator=mod,
            instance=exp,
            new_status=PublicationStatus.APPROVED,
            feedback="Verified quality standards."
        )

        # Assert: Transitioned to APPROVED and visible in public feeds
        exp.refresh_from_db()
        assert exp.status == PublicationStatus.APPROVED
        assert exp.status in PUBLIC_VISIBLE_STATUSES
        assert action.action == "TRANSITION_APPROVED"

    def test_urgent_report_quarantines_content_to_under_review(self, setup_data):
        # Arrange: Approved live experience
        exp = setup_data['experience']
        exp.status = PublicationStatus.APPROVED
        exp.save()

        reporter = setup_data['author']

        # Act: Submit URGENT report
        report = ModerationService.submit_content_report(
            reporter=reporter,
            content_type="interviewexperience",
            object_id=exp.id,
            reason=ReportReason.NDA_VIOLATION,
            severity=ReportSeverity.URGENT,
            details="Contains confidential proprietary OA question prompts."
        )

        # Assert: Immediately transitioned to UNDER_REVIEW (hidden from public)
        exp.refresh_from_db()
        assert report.severity == ReportSeverity.URGENT
        assert exp.status == PublicationStatus.UNDER_REVIEW
        assert exp.status not in PUBLIC_VISIBLE_STATUSES

    def test_non_urgent_report_marks_as_reported_retaining_public_visibility(self, setup_data):
        # Arrange: Approved live experience
        exp = setup_data['experience']
        exp.status = PublicationStatus.APPROVED
        exp.save()

        reporter = setup_data['author']

        # Act: Submit MEDIUM severity report
        report = ModerationService.submit_content_report(
            reporter=reporter,
            content_type="interviewexperience",
            object_id=exp.id,
            reason=ReportReason.INACCURATE,
            severity=ReportSeverity.MEDIUM,
            details="Round duration stated as 90 mins instead of 45 mins."
        )

        # Assert: Marked as REPORTED, but still visible in PUBLIC_VISIBLE_STATUSES
        exp.refresh_from_db()
        assert report.severity == ReportSeverity.MEDIUM
        assert exp.status == PublicationStatus.REPORTED
        assert exp.status in PUBLIC_VISIBLE_STATUSES
