from __future__ import annotations

import uuid

from django.db import models

from apps.common.models import TimeStampedModel


class MLModel(TimeStampedModel):
    """Catalogue des modèles ML déployés."""

    class ModelType(models.TextChoices):
        SENTIMENT = "sentiment", "Analyse de sentiment"
        SCORING = "scoring", "Scoring projets"
        RECOMMENDER = "recommender", "Système de recommandation"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model_type = models.CharField(max_length=32, choices=ModelType.choices)
    version = models.CharField(max_length=32)
    hyperparameters = models.JSONField(default=dict, blank=True)
    metrics = models.JSONField(default=dict, blank=True)
    storage_path = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=32, default="ready")

    class Meta:
        verbose_name = "Modèle ML"
        verbose_name_plural = "Modèles ML"
        unique_together = ("model_type", "version")


class Dataset(TimeStampedModel):
    """Datasets utilisés pour l'entraînement."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    version = models.CharField(max_length=32)
    records = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Dataset"
        verbose_name_plural = "Datasets"


class PredictionLog(TimeStampedModel):
    """Historique des prédictions générées."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model = models.ForeignKey(MLModel, on_delete=models.SET_NULL, null=True, related_name="predictions")
    input_payload = models.JSONField()
    output_payload = models.JSONField()
    duration_ms = models.PositiveIntegerField(default=0)
    success = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Journal de prédiction"
        verbose_name_plural = "Journaux de prédiction"

