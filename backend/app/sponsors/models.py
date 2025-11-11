from django.conf import settings
from django.db import models

from projects.models import Project


class SponsorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sponsor_profile")
    company = models.CharField(max_length=255)
    interests = models.JSONField(default=list, blank=True)
    total_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.company} ({self.user})"


class Sponsorship(models.Model):
    sponsor = models.ForeignKey(SponsorProfile, on_delete=models.CASCADE, related_name="sponsorships")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="sponsorships")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=100, default="financial")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.sponsor} -> {self.project}"


class SponsorMessage(models.Model):
    sponsorship = models.ForeignKey(Sponsorship, on_delete=models.CASCADE, related_name="messages")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Message {self.pk}"
