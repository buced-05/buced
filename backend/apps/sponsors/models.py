from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel
from apps.projects.models import Project


class SponsorProfile(TimeStampedModel):
    """Profil sponsor avec préférences et budget."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sponsor_profile")
    company_name = models.CharField(max_length=255)
    interests = models.JSONField(default=list, blank=True)
    logo = models.ImageField(upload_to="sponsors/logos/", blank=True, null=True)
    budget_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    contact_email = models.EmailField(blank=True)

    class Meta:
        verbose_name = "Profil sponsor"
        verbose_name_plural = "Profils sponsors"

    def __str__(self) -> str:
        return self.company_name


class Sponsorship(TimeStampedModel):
    """Engagement d'un sponsor sur un projet."""

    class CommitmentType(models.TextChoices):
        FINANCIAL = "financial", "Financier"
        MATERIAL = "material", "Matériel"
        MENTORING = "mentoring", "Mentorat"

    class Status(models.TextChoices):
        PENDING = "pending", "En attente"
        ACTIVE = "active", "Actif"
        COMPLETED = "completed", "Terminé"
        CANCELLED = "cancelled", "Annulé"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="sponsorships")
    sponsor = models.ForeignKey(SponsorProfile, on_delete=models.CASCADE, related_name="sponsorships")
    commitment_type = models.CharField(max_length=20, choices=CommitmentType.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=8, default="XOF")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    details = models.TextField(blank=True)

    class Meta:
        verbose_name = "Sponsoring"
        verbose_name_plural = "Sponsoring"
        unique_together = ("project", "sponsor", "commitment_type")


class SponsorMessage(TimeStampedModel):
    """Échanges entre sponsor et porteur."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sponsorship = models.ForeignKey(Sponsorship, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sponsor_messages")
    content = models.TextField()
    attachments = models.FileField(upload_to="sponsors/messages/", blank=True, null=True)

    class Meta:
        verbose_name = "Message sponsor"
        verbose_name_plural = "Messages sponsors"
        ordering = ("created_at",)


class EngagementReport(TimeStampedModel):
    """Reporting d'impact pour le sponsor."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sponsorship = models.ForeignKey(Sponsorship, on_delete=models.CASCADE, related_name="reports")
    period_start = models.DateField()
    period_end = models.DateField()
    impact_metrics = models.JSONField(default=dict)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Rapport d'engagement"
        verbose_name_plural = "Rapports d'engagement"

