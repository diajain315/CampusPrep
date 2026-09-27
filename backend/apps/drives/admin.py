from django.contrib import admin
from apps.drives.models import CampusDrive, JobRole, SelectionRound


class JobRoleInline(admin.TabularInline):
    model = JobRole
    extra = 1


class SelectionRoundInline(admin.TabularInline):
    model = SelectionRound
    extra = 1
    ordering = ['round_number']


@admin.register(CampusDrive)
class CampusDriveAdmin(admin.ModelAdmin):
    list_display = ['company', 'university', 'recruitment_year', 'is_active', 'created_at']
    list_filter = ['recruitment_year', 'is_active', 'university']
    search_fields = ['company__name', 'university__name']
    inlines = [JobRoleInline, SelectionRoundInline]


@admin.register(JobRole)
class JobRoleAdmin(admin.ModelAdmin):
    list_display = ['title', 'campus_drive', 'role_type', 'total_ctc', 'currency']
    list_filter = ['role_type', 'currency']


@admin.register(SelectionRound)
class SelectionRoundAdmin(admin.ModelAdmin):
    list_display = ['campus_drive', 'round_number', 'name', 'round_type', 'difficulty']
    list_filter = ['round_type', 'difficulty']
    ordering = ['campus_drive', 'round_number']
