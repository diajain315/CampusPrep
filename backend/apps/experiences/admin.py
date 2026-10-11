from django.contrib import admin
from apps.experiences.models import InterviewExperience, RoundInterviewDetail


class RoundInterviewDetailInline(admin.StackedInline):
    model = RoundInterviewDetail
    extra = 1


@admin.register(InterviewExperience)
class InterviewExperienceAdmin(admin.ModelAdmin):
    list_display = ['campus_drive', 'author', 'candidate_outcome', 'status', 'created_at']
    list_filter = ['candidate_outcome', 'status']
    inlines = [RoundInterviewDetailInline]
