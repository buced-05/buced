from __future__ import annotations

import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.common.models import TimeStampedModel
from apps.projects.models import Project


class Vote(TimeStampedModel):
    """Vote communautaire pour un projet."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="votes")
    voter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="votes")
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    sentiment_label = models.CharField(max_length=32, default="neutral")
    sentiment_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    weight = models.DecimalField(max_digits=4, decimal_places=2, default=1.0)
    ai_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("project", "voter")
        verbose_name = "Vote"
        verbose_name_plural = "Votes"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"Vote {self.rating} par {self.voter} pour {self.project}"


class VoteSummary(TimeStampedModel):
    """Agrégation des évaluations d'un projet."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="vote_summary")
    average_rating = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total_votes = models.PositiveIntegerField(default=0)
    weighted_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    last_computed_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Synthèse vote"
        verbose_name_plural = "Synthèses votes"

