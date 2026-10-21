from django.contrib import admin
from apps.workspace.models import PreparationTask, Bookmark


@admin.register(PreparationTask)
class PreparationTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'due_date', 'is_completed', 'created_at']
    list_filter = ['category', 'is_completed']
    search_fields = ['title', 'user__username']


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'object_id', 'note', 'created_at']
    list_filter = ['content_type']
