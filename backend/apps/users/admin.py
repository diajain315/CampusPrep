from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.users.models import User, AlumniQualificationDeclaration, VerificationChallenge


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'stable_pseudonym', 'institutional_email', 'is_verified_contributor', 'is_alumni_qualified', 'is_moderator']
    search_fields = ['username', 'stable_pseudonym', 'institutional_email']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Platform Roles & Identity', {
            'fields': (
                'stable_pseudonym',
                'institutional_email',
                'is_verified_contributor',
                'is_alumni_qualified',
                'is_moderator',
                'is_administrator',
            )
        }),
    )


@admin.register(AlumniQualificationDeclaration)
class AlumniQualificationDeclarationAdmin(admin.ModelAdmin):
    list_display = ['user', 'employer_name', 'job_title', 'graduation_year', 'is_approved', 'reviewed_at']
    list_filter = ['is_approved', 'graduation_year']


@admin.register(VerificationChallenge)
class VerificationChallengeAdmin(admin.ModelAdmin):
    list_display = ['user', 'email', 'otp_code', 'expires_at', 'is_used']
    list_filter = ['is_used']
