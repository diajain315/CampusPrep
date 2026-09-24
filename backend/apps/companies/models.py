from django.db import models
from django.utils.text import slugify
from apps.common.mixins import ContributedContentMixin


class Company(models.Model):
    """
    A persistent commercial organization or corporate employer that conducts recruitment.
    """
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    industry = models.CharField(max_length=150)
    website = models.URLField(max_length=300, blank=True)
    overview = models.TextField(blank=True)
    headquarters = models.CharField(max_length=150, blank=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


from apps.common.enums import ProposalStatus


class CompanyProposal(ContributedContentMixin):
    """
    A contributor submission proposing a company record not yet present
    in the admin-seeded company directory. Requires moderation before creation of Company.
    """
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=150)
    website = models.URLField(max_length=300, blank=True)
    justification = models.TextField(
        help_text="Reason for adding this company (e.g. upcoming recruitment event)"
    )
    proposal_status = models.CharField(
        max_length=32,
        choices=ProposalStatus.choices,
        default=ProposalStatus.PENDING,
        db_index=True
    )

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if hasattr(self, 'status') and self.status:
            if self.status in ProposalStatus.values:
                self.proposal_status = self.status
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Proposal: {self.name} (Status: {self.proposal_status})"

