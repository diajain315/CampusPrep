from django.db import models
from django.conf import settings
from apps.universities.models import University
from apps.companies.models import Company
from apps.common.enums import RoundType, Difficulty


class CampusDrive(models.Model):
    """
    A discrete, point-in-time recruitment event conducted by a specific Company
    at a specific University for a given recruitment cycle.
    """
    university = models.ForeignKey(
        University,
        on_delete=models.CASCADE,
        related_name='campus_drives'
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='campus_drives'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='authored_campus_drives',
        help_text="Author/contributor who initiated the drive record."
    )
    recruitment_year = models.PositiveIntegerField(
        help_text="Placement-season end year (e.g., 2026 for July 2025-June 2026 cycle; independent of student graduating class)."
    )
    eligibility_summary = models.TextField(
        blank=True,
        help_text="Academic, disciplinary, and cohort prerequisites."
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('university', 'company', 'recruitment_year')
        ordering = ['-recruitment_year', 'company__name']

    def __str__(self):
        return f"{self.company.name} @ {self.university.short_name} ({self.recruitment_year})"


class JobRole(models.Model):
    """
    A specific employment role offered by a Company during a Campus Drive,
    containing compensation disclosures.
    """
    ROLE_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('INTERNSHIP', 'Internship'),
        ('PPO', 'Pre-Placement Offer'),
    ]

    campus_drive = models.ForeignKey(
        CampusDrive,
        on_delete=models.CASCADE,
        related_name='job_roles'
    )
    title = models.CharField(max_length=200)
    role_type = models.CharField(max_length=50, choices=ROLE_TYPE_CHOICES, default='FULL_TIME')
    total_ctc = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Disclosed total CTC compensation in standard units."
    )
    base_salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Guaranteed fixed base salary."
    )
    currency = models.CharField(max_length=10, default="INR")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.role_type}) - {self.campus_drive}"


class SelectionRound(models.Model):
    """
    An individual evaluation stage within a Campus Drive Selection Process.
    Guarantees strict 1-based contiguous sequence invariant.
    """
    campus_drive = models.ForeignKey(
        CampusDrive,
        on_delete=models.CASCADE,
        related_name='selection_rounds'
    )
    round_number = models.PositiveIntegerField(
        help_text="1-based contiguous sequential round number (Round 1, 2, ...)"
    )
    name = models.CharField(max_length=150, help_text="e.g., Online Assessment, Technical Interview 1")
    round_type = models.CharField(max_length=50, choices=RoundType.choices)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    duration_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Duration of evaluation round in minutes."
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('campus_drive', 'round_number')
        ordering = ['round_number']

    def __str__(self):
        return f"Round {self.round_number}: {self.name} ({self.campus_drive})"
