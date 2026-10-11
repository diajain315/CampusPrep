from django.db import models
from apps.common.mixins import ContributedContentMixin
from apps.companies.models import Company


from apps.common.enums import JobRoleFamily, TenureBand


class CompanyReview(ContributedContentMixin):
    """
    An evaluative workplace assessment submitted by an Alumni Contributor with declared,
    moderator-reviewed Employment Experience at the Company.
    """
    EMPLOYMENT_STATUS_CHOICES = [
        ('CURRENT_EMPLOYEE', 'Current Employee'),
        ('FORMER_EMPLOYEE', 'Former Employee'),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='company_reviews'
    )
    job_role_family = models.CharField(
        max_length=50,
        choices=JobRoleFamily.choices,
        default=JobRoleFamily.OTHER,
        help_text="Standardized functional role family. Mitigates re-identification risk."
    )
    tenure_band = models.CharField(
        max_length=50,
        choices=TenureBand.choices,
        default=TenureBand.ONE_TO_TWO_YEARS,
        help_text="Coarse-grained employment duration band."
    )
    employment_status = models.CharField(
        max_length=30,
        choices=EMPLOYMENT_STATUS_CHOICES,
        default='CURRENT_EMPLOYEE'
    )
    work_life_rating = models.PositiveSmallIntegerField(
        help_text="Rating 1-5"
    )
    culture_rating = models.PositiveSmallIntegerField(
        help_text="Rating 1-5"
    )
    growth_rating = models.PositiveSmallIntegerField(
        help_text="Rating 1-5"
    )
    compensation_rating = models.PositiveSmallIntegerField(
        help_text="Rating 1-5"
    )
    overall_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True
    )
    pros = models.TextField(help_text="Positive aspects of workplace culture and compensation.")
    cons = models.TextField(help_text="Drawbacks, blockers, and areas for improvement.")
    advice_to_management = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        ratings = [self.work_life_rating, self.culture_rating, self.growth_rating, self.compensation_rating]
        self.overall_rating = round(sum(ratings) / len(ratings), 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review: {self.company.name} ({self.overall_rating}★) by {self.author.stable_pseudonym}"
