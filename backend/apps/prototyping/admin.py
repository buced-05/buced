from __future__ import annotations

from django.contrib import admin

from .models import Prototype, PrototypeTask, TechnicalSpecification


@admin.register(Prototype)
class PrototypeAdmin(admin.ModelAdmin):
    list_display = ("project", "status", "start_date", "end_date")
    list_filter = ("status",)
    search_fields = ("project__title",)
    filter_horizontal = ("assigned_team",)


@admin.register(PrototypeTask)
class PrototypeTaskAdmin(admin.ModelAdmin):
    list_display = ("prototype", "title", "column", "assignee", "priority", "due_date")
    list_filter = ("column",)
    search_fields = ("title", "prototype__project__title")
    raw_id_fields = ("prototype", "assignee")


@admin.register(TechnicalSpecification)
class TechnicalSpecificationAdmin(admin.ModelAdmin):
    list_display = ("prototype", "generated_by", "created_at")
    raw_id_fields = ("prototype",)

