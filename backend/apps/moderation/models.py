from django.db import models
from django.conf import settings
from apps.common.enums import (
    PublicationStatus,
    RevisionStatus,
    ReportSeverity,
    ReportReason,
    ReportStatus,
    ModerationActionType,
)


class ContentReport(models.Model):
    """
    A user-submitted flag reporting problematic, inaccurate, NDA-violating,
    or abusive content for moderator intervention.
    """
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='filed_reports'
    )
    content_type = models.CharField(
        max_length=100,
        help_text="Target entity model name (e.g. interviewexperience, companyreview)"
    )
    object_id = models.PositiveIntegerField()
    reason = models.CharField(max_length=50, choices=ReportReason.choices)
    severity = models.CharField(
        max_length=20,
        choices=ReportSeverity.choices,
        default=ReportSeverity.MEDIUM,
        help_text="Urgent severity triggers immediate automatic quarantine (UNDER_REVIEW)."
    )
    details = models.TextField()
    report_status = models.CharField(
        max_length=32,
        choices=ReportStatus.choices,
        default=ReportStatus.PENDING,
        db_index=True
    )
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='resolved_reports'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        self.is_resolved = (self.report_status != ReportStatus.PENDING)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Report #{self.id} on {self.content_type}:{self.object_id} ({self.report_status})"


class ModerationAction(models.Model):
    """
    An auditable administrative or moderator intervention changing a submission's
    Publication Status or approving an Alumni Qualification Declaration.
    """
    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='moderation_actions'
    )
    content_type = models.CharField(max_length=100)
    object_id = models.PositiveIntegerField()
    action = models.CharField(max_length=50, help_text="e.g. APPROVE, REQUEST_CHANGES, REJECT, REMOVE")
    action_taken = models.CharField(
        max_length=50,
        choices=ModerationActionType.choices,
        default=ModerationActionType.APPROVED,
        help_text="Standardized state machine transition"
    )
    previous_status = models.CharField(max_length=32)
    new_status = models.CharField(max_length=32)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Action: {self.action} on {self.content_type}:{self.object_id} by {self.moderator.stable_pseudonym}"


class ContentRevision(models.Model):
    """
    A draft modification applied to an already-published record, requiring re-moderation
    before replacing the live record.
    The live record remains in APPROVED state until this revision is MERGED.
    """
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='content_revisions'
    )
    content_type = models.CharField(max_length=100)
    object_id = models.PositiveIntegerField(help_text="ID of the live approved record")
    revision_status = models.CharField(
        max_length=32,
        choices=RevisionStatus.choices,
        default=RevisionStatus.PENDING_REVISION
    )
    proposed_payload = models.JSONField(
        help_text="Dictionary containing proposed updated field values."
    )
    reviewer_feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Revision #{self.id} for {self.content_type}:{self.object_id} ({self.revision_status})"
