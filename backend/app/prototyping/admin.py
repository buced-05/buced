from django.contrib import admin

from .models import KanbanTask, PrototypeSprint


@admin.register(PrototypeSprint)
class PrototypeSprintAdmin(admin.ModelAdmin):
    list_display = ("project", "status", "start_date", "end_date")
    list_filter = ("status",)


@admin.register(KanbanTask)
class KanbanTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "sprint", "assignee", "status", "due_date")
    list_filter = ("status",)
    search_fields = ("title",)
