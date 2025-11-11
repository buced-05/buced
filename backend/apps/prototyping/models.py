from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel
from apps.projects.models import Project


class Prototype(TimeStampedModel):
    """Prototype généré à partir d'un projet."""

    class Status(models.TextChoices):
        QUEUED = "queued", "En file"
        IN_PROGRESS = "in_progress", "En cours"
        COMPLETED = "completed", "Terminé"
        ON_HOLD = "on_hold", "En pause"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="prototype")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.QUEUED)
    assigned_team = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="assigned_prototypes",
        blank=True,
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    demo_url = models.URLField(blank=True)
    code_repository = models.URLField(blank=True)
    documentation_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Prototype"
        verbose_name_plural = "Prototypes"


class PrototypeTask(TimeStampedModel):
    """Tâches Kanban pour le suivi du prototype."""

    class Column(models.TextChoices):
        BACKLOG = "backlog", "Backlog"
        TODO = "todo", "À faire"
        IN_PROGRESS = "in_progress", "En cours"
        REVIEW = "review", "Revue"
        DONE = "done", "Terminé"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prototype = models.ForeignKey(Prototype, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    column = models.CharField(max_length=20, choices=Column.choices, default=Column.BACKLOG)
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="prototype_tasks",
    )
    due_date = models.DateField(null=True, blank=True)
    priority = models.PositiveSmallIntegerField(default=3)

    class Meta:
        verbose_name = "Tâche prototype"
        verbose_name_plural = "Tâches prototype"
        ordering = ("priority", "created_at")


class TechnicalSpecification(TimeStampedModel):
    """Spécifications techniques générées pour le prototype."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prototype = models.ForeignKey(Prototype, on_delete=models.CASCADE, related_name="specifications")
    content = models.JSONField(default=dict)
    generated_by = models.CharField(max_length=128, default="system")

    class Meta:
        verbose_name = "Spécification technique"
        verbose_name_plural = "Spécifications techniques"

