from django.db import models
from apps.common.mixins import ContributedContentMixin
from apps.common.enums import CandidateOutcome
from apps.drives.models import CampusDrive, SelectionRound


class InterviewExperience(ContributedContentMixin):
    """
    A structured, first-hand account submitted by a candidate detailing their
    participation in a specific Campus Drive.
    Subject to Pre-publication Moderation.
    """
    campus_drive = models.ForeignKey(
        CampusDrive,
        on_delete=models.CASCADE,
        related_name='interview_experiences'
    )
    candidate_outcome = models.CharField(
        max_length=20,
        choices=CandidateOutcome.choices,
        help_text="Final recruitment result (OFFERED, REJECTED, WITHDREW)."
    )
    overall_feedback = models.TextField(
        help_text="Candidate's comprehensive account and general reflections."
    )
    preparation_advice = models.TextField(
        blank=True,
        help_text="Recommended preparation strategies and resources."
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Experience: {self.campus_drive} ({self.candidate_outcome}) by {self.author.stable_pseudonym}"


class RoundInterviewDetail(models.Model):
    """
    The breakdown within an Interview Experience detailing questions asked,
    topics assessed, and candidate approach for a specific Selection Round.
    """
    interview_experience = models.ForeignKey(
        InterviewExperience,
        on_delete=models.CASCADE,
        related_name='round_details'
    )
    selection_round = models.ForeignKey(
        SelectionRound,
        on_delete=models.CASCADE,
        related_name='candidate_details'
    )
    questions_asked = models.TextField(
        help_text="Coding questions, system design prompts, or behavioral questions asked."
    )
    topics_covered = models.TextField(
        blank=True,
        help_text="Core technical or functional topics assessed."
    )
    candidate_approach = models.TextField(
        blank=True,
        help_text="Strategy and explanation used by candidate."
    )
    tips = models.TextField(blank=True)

    class Meta:
        ordering = ['selection_round__round_number']

    def clean(self):
        super().clean()
        if hasattr(self, 'selection_round') and hasattr(self, 'interview_experience'):
            if self.selection_round.campus_drive_id != self.interview_experience.campus_drive_id:
                from django.core.exceptions import ValidationError
                raise ValidationError(
                    "Cross-Drive Invariant Violation: SelectionRound must belong to the exact same CampusDrive as the InterviewExperience."
                )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Detail for Round {self.selection_round.round_number} ({self.interview_experience_id})"

