from __future__ import annotations

from rest_framework import serializers

from .models import Vote, VoteSummary


class VoteSerializer(serializers.ModelSerializer):
    voter = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Vote
        fields = (
            "id",
            "project",
            "voter",
            "rating",
            "comment",
            "sentiment_label",
            "sentiment_score",
            "weight",
            "ai_score",
            "metadata",
            "created_at",
        )
        read_only_fields = ("id", "sentiment_label", "sentiment_score", "weight", "ai_score", "metadata", "created_at")


class VoteSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteSummary
        fields = ("id", "project", "average_rating", "total_votes", "weighted_score", "last_computed_at")
        read_only_fields = ("id", "project", "average_rating", "total_votes", "weighted_score", "last_computed_at")

