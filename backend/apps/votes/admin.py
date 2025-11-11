from __future__ import annotations

from django.contrib import admin

from .models import Vote, VoteSummary


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("project", "voter", "rating", "sentiment_label", "weight", "created_at")
    list_filter = ("sentiment_label", "rating")
    search_fields = ("project__title", "voter__email")
    raw_id_fields = ("project", "voter")


@admin.register(VoteSummary)
class VoteSummaryAdmin(admin.ModelAdmin):
    list_display = ("project", "average_rating", "total_votes", "weighted_score", "last_computed_at")
    raw_id_fields = ("project",)

