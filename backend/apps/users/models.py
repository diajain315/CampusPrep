from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.enums import DeclarationStatus


class User(AbstractUser):
    """
    Platform User model with strict separation between Private Account Identity
    and Public Display Identity.
    """
    institutional_email = models.EmailField(
        unique=True,
        null=True,
        blank=True,
        help_text="Official university email (@dau.ac.in). Protected PII - NEVER exposed in public APIs."
    )
    stable_pseudonym = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="Persistent, non-identifying public display handle (e.g., CampusExplorer_42)."
    )
    is_verified_contributor = models.BooleanField(
        default=False,
        help_text="True if user has validated control of an active institutional email."
    )
    is_alumni_qualified = models.BooleanField(
        default=False,
        help_text="True if an Alumni Qualification Declaration has been reviewed and approved by a Moderator."
    )
    is_moderator = models.BooleanField(
        default=False,
        help_text="Authorized to review pending submissions, request revisions, and resolve reports."
    )
    is_administrator = models.BooleanField(
        default=False,
        help_text="Platform manager responsible for institutions, company seed data, and role assignments."
    )

    def save(self, *args, **kwargs):
        if not self.stable_pseudonym:
            from apps.users.services import VerificationService
            self.stable_pseudonym = VerificationService.generate_stable_pseudonym(self.id or 0)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.stable_pseudonym} ({self.username})"


class AlumniQualificationDeclaration(models.Model):
    """
    Formal declaration submitted by a contributor detailing graduation year, degree program,
    and verified employment history. Requires Moderator review before granting Alumni Contributor status.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='alumni_declarations'
    )
    graduation_year = models.PositiveIntegerField()
    degree_program = models.CharField(max_length=120)
    employer_name = models.CharField(max_length=200)
    job_title = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    declaration_status = models.CharField(
        max_length=32,
        choices=DeclarationStatus.choices,
        default=DeclarationStatus.PENDING,
        db_index=True,
        help_text="Review lifecycle state (PENDING, APPROVED, REJECTED, CHANGES_REQUESTED)."
    )
    is_approved = models.BooleanField(default=False)
    reviewed_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_alumni_declarations'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.is_approved = (self.declaration_status == DeclarationStatus.APPROVED)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Declaration: {self.user.stable_pseudonym} @ {self.employer_name} ({self.declaration_status})"


class VerificationChallenge(models.Model):
    """
    Cryptographic OTP challenge (6 digits, 15-minute expiry) dispatched during
    Institutional Email Verification.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='verification_challenges'
    )
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Challenge for {self.email} ({'Used' if self.is_used else 'Active'})"
