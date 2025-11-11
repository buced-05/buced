from django.conf import settings
from django.db import models

from projects.models import Project


class Vote(models.Model):
    voter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="votes")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    sentiment = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("voter", "project")

    def __str__(self) -> str:
        return f"{self.voter} -> {self.project} ({self.rating})"


class EvaluationResult(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="evaluation")
    feasibility = models.FloatField(default=0)
    innovation = models.FloatField(default=0)
    impact = models.FloatField(default=0)
    clarity = models.FloatField(default=0)
    ai_score = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Évaluation {self.project}"
