from django.contrib import admin

from .models import Project, ProjectDocument


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "owner", "status", "community_score", "ai_score", "final_score")
    list_filter = ("category", "status")
    search_fields = ("title", "description")


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ("file_name", "project", "file_type", "uploaded_at")
