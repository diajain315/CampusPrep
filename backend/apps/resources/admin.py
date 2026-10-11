from django.contrib import admin
from apps.resources.models import PreparationResource


@admin.register(PreparationResource)
class PreparationResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'resource_type', 'author', 'status', 'created_at']
    list_filter = ['resource_type', 'status']
    search_fields = ['title', 'tags']
