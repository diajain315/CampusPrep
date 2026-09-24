from django.db import models


class University(models.Model):
    """
    An educational institution whose students, alumni, and recruitment events
    are represented on the platform.
    """
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50, unique=True, help_text="e.g., DAU")
    domain = models.CharField(
        max_length=100,
        unique=True,
        help_text="Institutional domain used for verification (e.g., dau.ac.in)"
    )
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="India")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Universities"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.short_name})"
