from django.contrib import admin
from apps.reviews.models import CompanyReview


@admin.register(CompanyReview)
class CompanyReviewAdmin(admin.ModelAdmin):
    list_display = ['company', 'author', 'job_role_family', 'tenure_band', 'overall_rating', 'status', 'created_at']
    list_filter = ['status', 'employment_status', 'job_role_family', 'tenure_band']
    search_fields = ['company__name']
