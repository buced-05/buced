from rest_framework import serializers

from .models import EvaluationResult, Vote


class VoteSerializer(serializers.ModelSerializer):
    voter_display = serializers.CharField(source="voter.get_full_name", read_only=True)

    class Meta:
        model = Vote
        fields = ["id", "voter", "voter_display", "project", "rating", "comment", "sentiment", "created_at"]
        read_only_fields = ["id", "created_at", "voter_display", "sentiment"]

    def validate_rating(self, value: int) -> int:
        if value < 1 or value > 5:
            raise serializers.ValidationError("La note doit être comprise entre 1 et 5.")
        return value

    def validate_comment(self, value: str) -> str:
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Le commentaire doit contenir au moins 10 caractères.")
        return value.strip()


class EvaluationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationResult
        fields = ["project", "feasibility", "innovation", "impact", "clarity", "ai_score", "updated_at"]
        read_only_fields = ["updated_at"]
