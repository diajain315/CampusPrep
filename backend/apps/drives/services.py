from django.db import transaction
from apps.drives.models import CampusDrive, SelectionRound
from apps.common.exceptions import (
    SequenceGapException,
    DuplicateRoundNumberException,
    ProcessIncompleteException,
)


class DriveService:
    """
    Pure Python domain service encapsulating Business Rule 1:
    Selection Process Contiguity. Selection rounds must start at 1
    and be strictly contiguous without gaps.
    """

    @staticmethod
    def get_selection_process(drive: CampusDrive):
        """
        Retrieves the complete, ordered progression of stages for a Campus Drive.
        """
        return drive.selection_rounds.order_by('round_number')

    @staticmethod
    def add_selection_round(
        drive: CampusDrive,
        round_number: int,
        name: str,
        round_type: str,
        difficulty: str = "MEDIUM",
        description: str = ""
    ) -> SelectionRound:
        """
        Inserts a new Selection Round into the Drive, enforcing strict contiguity:
        Round numbers must be 1-based and strictly sequential (1, 2, 3...).
        Gaps (e.g., adding Round 3 when only Round 1 exists) raise SequenceGapException.
        Duplicates raise DuplicateRoundNumberException.
        """
        existing_rounds = list(drive.selection_rounds.values_list('round_number', flat=True).order_by('round_number'))
        expected_next = len(existing_rounds) + 1

        if round_number in existing_rounds:
            raise DuplicateRoundNumberException(
                f"Round number {round_number} already exists for this Campus Drive."
            )

        if round_number != expected_next:
            raise SequenceGapException(
                f"Selection rounds must be strictly contiguous. Expected Round {expected_next}, but received {round_number}."
            )

        return SelectionRound.objects.create(
            campus_drive=drive,
            round_number=round_number,
            name=name,
            round_type=round_type,
            difficulty=difficulty,
            description=description
        )

    @staticmethod
    @transaction.atomic
    def reorder_selection_rounds(drive: CampusDrive, round_ids: list[int]) -> list[SelectionRound]:
        """
        Re-sequences rounds atomically so they remain 1..N contiguous.
        """
        rounds = {r.id: r for r in drive.selection_rounds.all()}
        if len(round_ids) != len(rounds) or set(round_ids) != set(rounds.keys()):
            raise SequenceGapException("Reorder list must contain all existing round IDs exactly once.")

        # Temporarily use high offsets to avoid unique constraint clash during permutation
        for idx, r_id in enumerate(round_ids, start=1000):
            r = rounds[r_id]
            r.round_number = idx
            r.save(update_fields=['round_number'])

        updated = []
        for idx, r_id in enumerate(round_ids, start=1):
            r = rounds[r_id]
            r.round_number = idx
            r.save(update_fields=['round_number'])
            updated.append(r)

        return updated

    @staticmethod
    def validate_selection_process(drive: CampusDrive) -> bool:
        """
        Validates that the selection process contains at least one round
        and that rounds are strictly numbered 1 to N without gaps.
        """
        round_numbers = list(drive.selection_rounds.values_list('round_number', flat=True).order_by('round_number'))
        if not round_numbers:
            raise ProcessIncompleteException("A campus drive selection process must have at least one round.")

        expected = list(range(1, len(round_numbers) + 1))
        if round_numbers != expected:
            raise SequenceGapException(f"Selection round sequence has gaps or invalid numbering: {round_numbers} != {expected}")

        return True
