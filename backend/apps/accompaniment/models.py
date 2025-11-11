from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel
from apps.projects.models import Project


class AccompanimentProgram(TimeStampedModel):
    """Programme d'accompagnement pour les lauréats."""

    class Status(models.TextChoices):
        PLANNED = "planned", "Planifié"
        ACTIVE = "active", "Actif"
        COMPLETED = "completed", "Terminé"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name="accompaniment_program")
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="accompaniment_programs",
    )
    budget_allocated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PLANNED)
    objectives = models.TextField(blank=True)
    kpis = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Programme d'accompagnement"
        verbose_name_plural = "Programmes d'accompagnement"


class Milestone(TimeStampedModel):
    """Jalons de suivi pour le programme."""

    class MilestoneStatus(models.TextChoices):
        PENDING = "pending", "En attente"
        IN_PROGRESS = "in_progress", "En cours"
        VALIDATED = "validated", "Validé"
        BLOCKED = "blocked", "Bloqué"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(AccompanimentProgram, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=MilestoneStatus.choices, default=MilestoneStatus.PENDING)
    due_date = models.DateField(null=True, blank=True)
    budget_used = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Jalon"
        verbose_name_plural = "Jalons"


class ProgressReport(TimeStampedModel):
    """Rapport hebdomadaire de suivi."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(AccompanimentProgram, on_delete=models.CASCADE, related_name="reports")
    summary = models.TextField()
    achievements = models.JSONField(default=list, blank=True)
    blockers = models.JSONField(default=list, blank=True)
    next_steps = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Rapport d'avancement"
        verbose_name_plural = "Rapports d'avancement"


class MentorshipSession(TimeStampedModel):
    """Sessions de mentorat planifiées."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(AccompanimentProgram, on_delete=models.CASCADE, related_name="sessions")
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mentoring_sessions",
    )
    scheduled_for = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    notes = models.TextField(blank=True)
    outcome = models.TextField(blank=True)

    class Meta:
        verbose_name = "Session de mentorat"
        verbose_name_plural = "Sessions de mentorat"

