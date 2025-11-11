from django.db import models

from projects.models import Project
from users.models import User


class MLModel(models.Model):
    class ModelType(models.TextChoices):
        SENTIMENT = "sentiment", "Analyse de sentiment"
        SCORING = "scoring", "Scoring IA"
        RECOMMENDATION = "recommendation", "Recommandation"

    model_type = models.CharField(max_length=50, choices=ModelType.choices)
    version = models.CharField(max_length=50)
    hyperparameters = models.JSONField(default=dict)
    accuracy = models.FloatField(default=0)
    trained_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.model_type} v{self.version}"


class SentimentAnalysisResult(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="sentiment_results")
    comment_id = models.PositiveIntegerField()
    sentiment = models.CharField(max_length=20)
    confidence = models.FloatField(default=0)
    analyzed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Sentiment {self.sentiment} ({self.project})"


class Recommendation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="recommendations")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recommendations")
    score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "user")

    def __str__(self) -> str:
        return f"Reco {self.user} -> {self.project}"
