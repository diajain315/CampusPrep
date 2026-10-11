from django.db import models
from apps.common.mixins import ContributedContentMixin


class PreparationResource(ContributedContentMixin):
    """
    A curated reference, coding sheet, syllabus, external link, or practice guide
    intended to assist students across the platform in placement preparation.
    """
    RESOURCE_TYPE_CHOICES = [
        ('CODING_SHEET', 'Coding Sheet'),
        ('ROADMAP', 'Roadmap'),
        ('CHEATSHEET', 'Cheat Sheet'),
        ('INTERVIEW_QUESTIONS', 'Interview Questions'),
        ('EXTERNAL_COURSE', 'External Course'),
    ]

    title = models.CharField(max_length=255)
    resource_type = models.CharField(
        max_length=50,
        choices=RESOURCE_TYPE_CHOICES,
        default='CODING_SHEET'
    )
    url = models.URLField(max_length=500, blank=True)
    content = models.TextField(
        blank=True,
        help_text="Markdown notes, summary, or description of the resource."
    )
    tags = models.CharField(
        max_length=255,
        blank=True,
        help_text="Comma-separated topics (e.g., DSA, Dynamic Programming, Graphs)"
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.resource_type})"
