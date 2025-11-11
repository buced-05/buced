from __future__ import annotations

import logging

from celery import shared_task

from .models import MLModel

logger = logging.getLogger(__name__)


@shared_task
def retrain_sentiment_model(model_id: str) -> None:
    model = MLModel.objects.filter(id=model_id).first()
    if not model:
        logger.warning("Modèle %s introuvable pour réentraînement.", model_id)
        return
    logger.info("Réentraînement du modèle de sentiment %s", model.version)
    model.metrics["last_retrained"] = "now"
    model.save(update_fields=["metrics"])


@shared_task
def refresh_project_scores():
    logger.info("Tâche programmée de rafraîchissement des scores projets déclenchée.")

