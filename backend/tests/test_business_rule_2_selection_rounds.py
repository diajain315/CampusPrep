import pytest
from apps.universities.models import University
from apps.companies.models import Company
from apps.drives.models import CampusDrive
from apps.drives.services import DriveService
from apps.common.enums import RoundType, Difficulty
from apps.common.exceptions import SequenceGapException, DuplicateRoundNumberException, ProcessIncompleteException


@pytest.mark.django_db
class TestBusinessRule2SelectionRoundSequenceContinuity:
    """
    IT643 Canonical Business Rule 2:
    Selection rounds must form a strictly contiguous, 1-based positive
    integer sequence (1, 2, ..., N) with zero gaps or duplicate round numbers.
    """

    @pytest.fixture
    def sample_drive(self):
        uni = University.objects.create(
            name="Dhirubhai Ambani University",
            short_name="DAU",
            domain="dau.ac.in",
            city="Gandhinagar",
            state="Gujarat"
        )
        comp = Company.objects.create(
            name="Google India",
            industry="Technology",
            website="https://careers.google.com"
        )
        return CampusDrive.objects.create(
            university=uni,
            company=comp,
            recruitment_year=2026,
            eligibility_summary="B.Tech ICT/CS CPI >= 7.5"
        )

    def test_adding_rounds_sequentially_succeeds(self, sample_drive):
        # Arrange & Act: Add Round 1 and Round 2
        round_1 = DriveService.add_selection_round(
            drive=sample_drive,
            round_number=1,
            name="Online Assessment",
            round_type=RoundType.ONLINE_ASSESSMENT,
            difficulty=Difficulty.MEDIUM
        )
        round_2 = DriveService.add_selection_round(
            drive=sample_drive,
            round_number=2,
            name="Technical Interview 1",
            round_type=RoundType.TECHNICAL_INTERVIEW,
            difficulty=Difficulty.HARD
        )

        # Assert: Valid contiguity
        assert round_1.round_number == 1
        assert round_2.round_number == 2
        assert DriveService.validate_selection_process(sample_drive) is True

    def test_adding_round_with_sequence_gap_raises_exception(self, sample_drive):
        # Arrange: Drive currently has only Round 1
        DriveService.add_selection_round(
            drive=sample_drive,
            round_number=1,
            name="Online Assessment",
            round_type=RoundType.ONLINE_ASSESSMENT
        )

        # Act & Assert: Attempting to insert Round 3 directly creates a gap
        with pytest.raises(SequenceGapException) as exc_info:
            DriveService.add_selection_round(
                drive=sample_drive,
                round_number=3,
                name="Technical Interview",
                round_type=RoundType.TECHNICAL_INTERVIEW
            )

        assert "Selection rounds must be strictly contiguous" in str(exc_info.value)
        assert "Expected Round 2, but received 3" in str(exc_info.value)

    def test_adding_duplicate_round_number_raises_exception(self, sample_drive):
        # Arrange: Setup Round 1
        DriveService.add_selection_round(
            drive=sample_drive,
            round_number=1,
            name="Online Assessment",
            round_type=RoundType.ONLINE_ASSESSMENT
        )

        # Act & Assert: Attempting to insert another Round 1 raises DuplicateRoundNumberException
        with pytest.raises(DuplicateRoundNumberException) as exc_info:
            DriveService.add_selection_round(
                drive=sample_drive,
                round_number=1,
                name="Duplicate OA",
                round_type=RoundType.CODING_TEST
            )

        assert "already exists for this Campus Drive" in str(exc_info.value)

    def test_empty_selection_process_fails_validation(self, sample_drive):
        # Arrange: Drive with 0 rounds
        # Act & Assert: Validation fails if process has no rounds
        with pytest.raises(ProcessIncompleteException) as exc_info:
            DriveService.validate_selection_process(sample_drive)

        assert "must have at least one round" in str(exc_info.value)
