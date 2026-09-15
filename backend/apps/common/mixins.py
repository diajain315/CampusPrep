from django.db import models
from django.conf import settings
from apps.common.enums import PublicationStatus


class ContributedContentMixin(models.Model):
    """
    Abstract base mixin for all moderatable contributor submissions.
    Ensures consistent lifecycle status, author tracking, and audit timestamps.
    """
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='%(app_label)s_%(class)s_contributions',
        help_text="Protected contributor identity. Never serialized in public API endpoints."
    )
    status = models.CharField(
        max_length=32,
        choices=PublicationStatus.choices,
        default=PublicationStatus.PENDING,
        db_index=True,
        help_text="Lifecycle visibility state."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
