from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models

from apps.common.models import SoftDeleteModel, TimeStampedModel


class Project(TimeStampedModel, SoftDeleteModel):
    """Projet soumis sur la plateforme."""

    class Category(models.TextChoices):
        TECHNOLOGY = "technology", "Technologie"
        SOCIAL = "social", "Innovation sociale"
        ENVIRONMENT = "environment", "Environnement"
        HEALTH = "health", "Santé"
        EDUCATION = "education", "Éducation"
        OTHER = "other", "Autre"

    class Status(models.TextChoices):
        IDEA = "idea", "Idée"
        PROTOTYPE = "prototype", "Prototype"
        MVP = "mvp", "MVP"
        INCUBATION = "incubation", "Incubation"
        COMPLETED = "completed", "Réalisé"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_projects",
    )
    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="team_projects",
        blank=True,
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=Category.choices)
    objectives = models.TextField()
    expected_impact = models.TextField()
    resources_needed = models.JSONField(default=list, blank=True)
    current_status = models.CharField(max_length=20, choices=Status.choices, default=Status.IDEA)
    community_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    ai_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    final_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    submission_date = models.DateField(auto_now_add=True)
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    state = models.CharField(max_length=32, default="draft")

    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class ProjectDocument(TimeStampedModel, SoftDeleteModel):
    """Documents associés au projet."""

    class DocumentType(models.TextChoices):
        PRESENTATION = "presentation", "Présentation"
        BUSINESS_PLAN = "business_plan", "Business plan"
        VIDEO = "video", "Vidéo"
        PROTOTYPE = "prototype", "Prototype"
        OTHER = "other", "Autre"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    document = models.FileField(upload_to="projects/documents/")
    document_type = models.CharField(max_length=32, choices=DocumentType.choices)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Document de projet"
        verbose_name_plural = "Documents de projet"

    def __str__(self) -> str:
        return f"{self.document_type} - {self.project.title}"


class ProjectProgress(TimeStampedModel):
    """Suivi des étapes du projet."""

    class ProgressStatus(models.TextChoices):
        TODO = "todo", "À faire"
        IN_PROGRESS = "in_progress", "En cours"
        DONE = "done", "Terminé"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="progress_items")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=ProgressStatus.choices, default=ProgressStatus.TODO)
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Étape de projet"
        verbose_name_plural = "Étapes de projet"
        ordering = ("due_date",)


class ProjectEngagement(TimeStampedModel):
    """Interactions communautaires autour d'un projet."""

    class EngagementType(models.TextChoices):
        VIEW = "view", "Vue"
        LIKE = "like", "Like"
        SHARE = "share", "Partage"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="engagements")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="project_engagements")
    engagement_type = models.CharField(max_length=16, choices=EngagementType.choices)

    class Meta:
        verbose_name = "Engagement projet"
        verbose_name_plural = "Engagements projet"
        unique_together = ("project", "user", "engagement_type")

