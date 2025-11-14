from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Lower


class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = "student", "Étudiant"
        ADVISOR = "advisor", "Conseiller"
        ADMIN = "admin", "Administrateur"
        SPONSOR = "sponsor", "Sponsor"
        JURY = "jury", "Membre du jury"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.STUDENT,
    )
    establishment = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    cover_photo = models.ImageField(upload_to="cover_photos/", blank=True, null=True)
    bio = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(Lower("email"), name="users_user_email_lower_unique"),
        ]

    def is_privileged(self) -> bool:
        return self.role in {self.Roles.ADMIN, self.Roles.JURY}

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.get_full_name()} ({self.role})"
