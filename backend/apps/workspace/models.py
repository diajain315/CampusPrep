from django.db import models
from django.conf import settings


class PreparationTask(models.Model):
    """
    A private, actionable preparation item created by a Registered User
    in their Personal Workspace. Strictly isolated per user.
    """
    CATEGORY_CHOICES = [
        ('DSA', 'Data Structures & Algorithms'),
        ('SYSTEM_DESIGN', 'System Design'),
        ('CORE_CS', 'Core CS Subjects'),
        ('HR_BEHAVIORAL', 'HR & Behavioral'),
        ('MOCK_INTERVIEW', 'Mock Interview'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='preparation_tasks'
    )
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='DSA')
    due_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['is_completed', 'due_date', '-created_at']

    def __str__(self):
        status = "Done" if self.is_completed else "Pending"
        return f"[{status}] {self.title} ({self.user.stable_pseudonym})"


class Bookmark(models.Model):
    """
    A private saved reference created by a Registered User linking to a Company,
    Campus Drive, or Preparation Resource.
    """
    CONTENT_TYPE_CHOICES = [
        ('COMPANY', 'Company'),
        ('CAMPUS_DRIVE', 'Campus Drive'),
        ('RESOURCE', 'Preparation Resource'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    object_id = models.PositiveIntegerField()
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"Bookmark: {self.content_type} #{self.object_id} for {self.user.stable_pseudonym}"
