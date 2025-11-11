from __future__ import annotations

import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models

from apps.common.models import TimeStampedModel
from .managers import UserManager


class User(TimeStampedModel, AbstractBaseUser, PermissionsMixin):
    """Représentation des utilisateurs de la plateforme."""

    class Role(models.TextChoices):
        STUDENT = "student", "Étudiant"
        COUNSELOR = "counselor", "Conseiller"
        ADMIN = "admin", "Administrateur"
        SPONSOR = "sponsor", "Sponsor"
        JURY = "jury", "Membre du jury"
        MENTOR = "mentor", "Mentor"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    role = models.CharField(
        max_length=32,
        choices=Role.choices,
        default=Role.STUDENT,
    )
    establishment = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to="profiles/", blank=True, null=True)
    bio = models.TextField(blank=True)
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        validators=[
            RegexValidator(
                regex=r"^\+?\d{7,15}$",
                message="Le numéro de téléphone doit contenir entre 7 et 15 chiffres.",
            )
        ],
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=64, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self) -> str:
        return self.first_name or self.email

