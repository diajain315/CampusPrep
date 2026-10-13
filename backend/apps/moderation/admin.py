from django.contrib import admin
from apps.moderation.models import ContentReport, ModerationAction, ContentRevision


@admin.register(ContentReport)
class ContentReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'content_type', 'object_id', 'reporter', 'severity', 'reason', 'is_resolved', 'created_at']
    list_filter = ['severity', 'reason', 'is_resolved']
    search_fields = ['content_type', 'details']


@admin.register(ModerationAction)
class ModerationActionAdmin(admin.ModelAdmin):
    list_display = ['id', 'action', 'content_type', 'object_id', 'moderator', 'previous_status', 'new_status', 'created_at']
    list_filter = ['action']


@admin.register(ContentRevision)
class ContentRevisionAdmin(admin.ModelAdmin):
    list_display = ['id', 'content_type', 'object_id', 'author', 'revision_status', 'created_at']
    list_filter = ['revision_status']
