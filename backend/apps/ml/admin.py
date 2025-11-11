from __future__ import annotations

from django.contrib import admin

from .models import Dataset, MLModel, PredictionLog


@admin.register(MLModel)
class MLModelAdmin(admin.ModelAdmin):
    list_display = ("model_type", "version", "status", "created_at")
    list_filter = ("model_type", "status")
    search_fields = ("model_type", "version")


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ("name", "version", "records", "created_at")
    search_fields = ("name", "version")


@admin.register(PredictionLog)
class PredictionLogAdmin(admin.ModelAdmin):
    list_display = ("model", "success", "duration_ms", "created_at")
    list_filter = ("success",)
    raw_id_fields = ("model",)

