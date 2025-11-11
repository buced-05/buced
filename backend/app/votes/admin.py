from django.contrib import admin

from .models import EvaluationResult, Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("project", "voter", "rating", "sentiment", "created_at")
    list_filter = ("rating", "sentiment")
    search_fields = ("project__title", "voter__username")


@admin.register(EvaluationResult)
class EvaluationResultAdmin(admin.ModelAdmin):
    list_display = ("project", "feasibility", "innovation", "impact", "clarity", "ai_score")
