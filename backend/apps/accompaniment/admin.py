from __future__ import annotations

from django.contrib import admin

from .models import AccompanimentProgram, MentorshipSession, Milestone, ProgressReport


@admin.register(AccompanimentProgram)
class AccompanimentProgramAdmin(admin.ModelAdmin):
    list_display = ("project", "mentor", "status", "budget_allocated")
    list_filter = ("status",)
    raw_id_fields = ("project", "mentor")


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("program", "title", "status", "due_date")
    list_filter = ("status",)
    raw_id_fields = ("program",)


@admin.register(ProgressReport)
class ProgressReportAdmin(admin.ModelAdmin):
    list_display = ("program", "created_at")
    raw_id_fields = ("program",)


@admin.register(MentorshipSession)
class MentorshipSessionAdmin(admin.ModelAdmin):
    list_display = ("program", "mentor", "scheduled_for", "duration_minutes")
    raw_id_fields = ("program", "mentor")

