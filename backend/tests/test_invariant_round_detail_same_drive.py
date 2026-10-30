import pytest
from django.core.exceptions import ValidationError
from apps.users.models import User
from apps.universities.models import University
from apps.companies.models import Company
from apps.drives.models import CampusDrive, SelectionRound
from apps.experiences.models import InterviewExperience, RoundInterviewDetail
from apps.common.enums import CandidateOutcome, RoundType, Difficulty


@pytest.mark.django_db
class TestInvariantRoundDetailSameDrive:
    """
    IT643 Architectural Invariant:
    A RoundInterviewDetail's associated SelectionRound MUST belong to
    the exact same CampusDrive as its parent InterviewExperience.
    Cross-drive selection round leakage is strictly forbidden.
    """

    @pytest.fixture
    def setup_drives(self):
        uni = University.objects.create(
            name="Dhirubhai Ambani University",
            short_name="DAU",
            domain="dau.ac.in",
            city="Gandhinagar",
            state="Gujarat"
        )
        comp_google = Company.objects.create(name="Google India", industry="Technology")
        comp_amazon = Company.objects.create(name="Amazon India", industry="E-Commerce")

        drive_google = CampusDrive.objects.create(
            university=uni,
            company=comp_google,
            recruitment_year=2026,
            eligibility_summary="CPI >= 7.5"
        )
        drive_amazon = CampusDrive.objects.create(
            university=uni,
            company=comp_amazon,
            recruitment_year=2026,
            eligibility_summary="CPI >= 7.0"
        )

        round_google = SelectionRound.objects.create(
            campus_drive=drive_google,
            round_number=1,
            name="Google OA",
            round_type=RoundType.ONLINE_ASSESSMENT,
            difficulty=Difficulty.HARD
        )
        round_amazon = SelectionRound.objects.create(
            campus_drive=drive_amazon,
            round_number=1,
            name="Amazon Online Assessment",
            round_type=RoundType.ONLINE_ASSESSMENT,
            difficulty=Difficulty.MEDIUM
        )

        author = User.objects.create_user(
            username="candidate_student",
            is_verified_contributor=True,
            stable_pseudonym="CampusExplorer_88"
        )

        experience_google = InterviewExperience.objects.create(
            author=author,
            campus_drive=drive_google,
            candidate_outcome=CandidateOutcome.OFFERED,
            overall_feedback="Google drive completed."
        )

        return {
            'author': author,
            'drive_google': drive_google,
            'drive_amazon': drive_amazon,
            'round_google': round_google,
            'round_amazon': round_amazon,
            'experience_google': experience_google,
        }

    def test_round_detail_with_matching_drive_succeeds(self, setup_drives):
        # Arrange
        exp_google = setup_drives['experience_google']
        round_google = setup_drives['round_google']

        # Act
        detail = RoundInterviewDetail.objects.create(
            interview_experience=exp_google,
            selection_round=round_google,
            questions_asked="DSA: Graph shortest path algorithm.",
            topics_covered="Graphs, BFS",
            candidate_approach="Used Dijkstra with priority queue."
        )

        # Assert
        assert detail.id is not None
        assert detail.selection_round.campus_drive_id == detail.interview_experience.campus_drive_id

    def test_round_detail_with_cross_drive_mismatch_raises_validation_error(self, setup_drives):
        # Arrange: Google experience linked to an Amazon selection round
        exp_google = setup_drives['experience_google']
        round_amazon = setup_drives['round_amazon']

        # Act & Assert: Cross-drive round attachment must fail validation
        with pytest.raises(ValidationError) as exc_info:
            RoundInterviewDetail.objects.create(
                interview_experience=exp_google,
                selection_round=round_amazon,
                questions_asked="Amazon Leadership Principles and OA debugging."
            )

        assert "Cross-Drive Invariant Violation" in str(exc_info.value)
