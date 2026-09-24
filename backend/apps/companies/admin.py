from django.contrib import admin
from apps.companies.models import Company, CompanyProposal


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'headquarters', 'is_verified', 'created_at']
    search_fields = ['name', 'industry']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(CompanyProposal)
class CompanyProposalAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'author', 'proposal_status', 'created_at']
    list_filter = ['proposal_status']
