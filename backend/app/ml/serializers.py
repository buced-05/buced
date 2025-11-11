from rest_framework import serializers

from .models import MLModel, Recommendation, SentimentAnalysisResult


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ["id", "model_type", "version", "hyperparameters", "accuracy", "trained_at", "is_active"]
        read_only_fields = ["id", "trained_at"]


class SentimentAnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentAnalysisResult
        fields = ["id", "project", "comment_id", "sentiment", "confidence", "analyzed_at"]
        read_only_fields = ["id", "analyzed_at"]


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ["id", "project", "user", "score", "created_at"]
        read_only_fields = ["id", "created_at"]
