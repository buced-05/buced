from __future__ import annotations

from django.contrib import admin

from .models import Project, ProjectDocument, ProjectEngagement, ProjectProgress


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "category", "current_status", "community_score", "ai_score", "final_score")
    list_filter = ("category", "current_status", "state")
    search_fields = ("title", "owner__email")
    autocomplete_fields = ("owner", "team_members")


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ("project", "document_type", "created_at")
    search_fields = ("project__title",)
    raw_id_fields = ("project",)


@admin.register(ProjectProgress)
class ProjectProgressAdmin(admin.ModelAdmin):
    list_display = ("project", "title", "status", "due_date")
    list_filter = ("status",)
    raw_id_fields = ("project",)


@admin.register(ProjectEngagement)
class ProjectEngagementAdmin(admin.ModelAdmin):
    list_display = ("project", "user", "engagement_type", "created_at")
    list_filter = ("engagement_type",)
    raw_id_fields = ("project", "user")

