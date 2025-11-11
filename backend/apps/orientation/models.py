from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models

from apps.common.models import SoftDeleteModel, TimeStampedModel


class OrientationRequest(TimeStampedModel, SoftDeleteModel):
    """Demande d'orientation soumise par un étudiant."""

    class Status(models.TextChoices):
        PENDING = "pending", "En attente"
        MATCHED = "matched", "Assignée"
        IN_PROGRESS = "in_progress", "En cours"
        COMPLETED = "completed", "Terminée"
        CANCELLED = "cancelled", "Annulée"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orientation_requests",
    )
    counselor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="assigned_orientation_requests",
        null=True,
        blank=True,
    )
    topic = models.CharField(max_length=255)
    description = models.TextField()
    answers = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    recommendations = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Demande d'orientation"
        verbose_name_plural = "Demandes d'orientation"

    def __str__(self) -> str:
        return f"{self.topic} - {self.student.get_full_name()}"


class OrientationConversation(TimeStampedModel):
    """Conversation de suivi entre étudiant et conseiller."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.OneToOneField(
        OrientationRequest,
        related_name="conversation",
        on_delete=models.CASCADE,
    )
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="orientation_conversations")
    last_message_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Conversation d'orientation"
        verbose_name_plural = "Conversations d'orientation"

    def __str__(self) -> str:
        return f"Conversation pour {self.request}"


class ConversationMessage(TimeStampedModel):
    """Messages échangés pendant la conversation d'orientation."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        OrientationConversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orientation_messages",
    )
    content = models.TextField()
    attachment = models.FileField(upload_to="orientation/messages/", blank=True, null=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ("created_at",)

    def __str__(self) -> str:
        return f"Message de {self.sender} dans {self.conversation}"


class Resource(TimeStampedModel, SoftDeleteModel):
    """Ressource pédagogique robuste."""

    class Category(models.TextChoices):
        ORIENTATION = "orientation", "Orientation"
        TRAINING = "training", "Formation"
        SCHOLARSHIP = "scholarship", "Bourse"
        OTHER = "other", "Autre"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="orientation/resources/", blank=True, null=True)
    url = models.URLField(blank=True)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.ORIENTATION)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Ressource pédagogique"
        verbose_name_plural = "Ressources pédagogiques"

    def __str__(self) -> str:
        return self.title

