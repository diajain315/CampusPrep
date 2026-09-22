import pytest
from django.core.exceptions import PermissionDenied
from apps.users.models import User, AlumniQualificationDeclaration
from apps.users.permissions import IsVerifiedContributor, IsAlumniContributor
from apps.users.services import VerificationService
from apps.universities.models import University
from apps.companies.models import Company
from apps.drives.models import CampusDrive
from apps.experiences.models import InterviewExperience
from apps.common.enums import CandidateOutcome, PublicationStatus
from apps.moderation.services import ModerationService


@pytest.mark.django_db
class TestBusinessRule1InstitutionalVerificationBarrier:
    """
    IT643 Canonical Business Rule 1:
    An unverified user cannot author or submit an Interview Experience,
    Campus Drive, or Company Review.
    """

    @pytest.fixture
    def setup_entities(self):
        uni = University.objects.create(
            name="Dhirubhai Ambani University",
            short_name="DAU",
            domain="dau.ac.in",
            city="Gandhinagar",
            state="Gujarat"
        )
        comp = Company.objects.create(name="Oracle", industry="Enterprise Software")
        drive = CampusDrive.objects.create(
            university=uni,
            company=comp,
            recruitment_year=2026,
            eligibility_summary="B.Tech CPI >= 7.0"
        )
        unverified_user = User.objects.create_user(
            username="unverified_student",
            password="password123",
            stable_pseudonym="CampusExplorer_1"
        )
        verified_user = User.objects.create_user(
            username="verified_student",
            password="password123",
            stable_pseudonym="CampusExplorer_2",
            institutional_email="202201001@dau.ac.in",
            is_verified_contributor=True
        )
        return {
            'university': uni,
            'company': comp,
            'drive': drive,
            'unverified_user': unverified_user,
            'verified_user': verified_user,
        }

    def test_unverified_user_fails_permission_check(self, setup_entities):
        # Arrange
        unverified_user = setup_entities['unverified_user']
        perm = IsVerifiedContributor()

        class FakeRequest:
            user = unverified_user

        # Act & Assert: Unverified user is rejected by permission check
        assert perm.has_permission(FakeRequest(), None) is False

    def test_verified_user_passes_permission_check(self, setup_entities):
        # Arrange
        verified_user = setup_entities['verified_user']
        perm = IsVerifiedContributor()

        class FakeRequest:
            user = verified_user

        # Act & Assert: Verified contributor passes barrier
        assert perm.has_permission(FakeRequest(), None) is True

    def test_verification_workflow_promotes_user_to_verified_contributor(self, setup_entities):
        # Arrange
        user = setup_entities['unverified_user']
        assert user.is_verified_contributor is False

        # Act: Dispatch OTP and validate
        challenge = VerificationService.generate_otp(user, "student@dau.ac.in")
        success = VerificationService.validate_otp(user, challenge.otp_code)

        # Assert: Promoted to verified contributor
        assert success is True
        user.refresh_from_db()
        assert user.is_verified_contributor is True
        assert user.institutional_email == "student@dau.ac.in"

    def test_alumni_review_barrier_requires_approved_declaration(self, setup_entities):
        # Arrange: User with verified email but no approved alumni declaration
        verified_user = setup_entities['verified_user']
        perm = IsAlumniContributor()

        class FakeRequest:
            user = verified_user

        # Act & Assert: Rejected until declaration is approved
        assert perm.has_permission(FakeRequest(), None) is False

        # Now approve declaration
        verified_user.is_alumni_qualified = True
        verified_user.save()

        assert perm.has_permission(FakeRequest(), None) is True
