from django.contrib import admin

from .models import MLModel, Recommendation, SentimentAnalysisResult


@admin.register(MLModel)
class MLModelAdmin(admin.ModelAdmin):
    list_display = ("model_type", "version", "accuracy", "trained_at", "is_active")
    list_filter = ("model_type", "is_active")


@admin.register(SentimentAnalysisResult)
class SentimentAnalysisResultAdmin(admin.ModelAdmin):
    list_display = ("project", "comment_id", "sentiment", "confidence", "analyzed_at")
    list_filter = ("sentiment",)


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ("project", "user", "score", "created_at")
