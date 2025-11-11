from django.conf import settings
from django.db import models


class Project(models.Model):
    class Status(models.TextChoices):
        IDEA = "idea", "Idée"
        PROTOTYPE = "prototype", "Prototype"
        MVP = "mvp", "MVP"
        SELECTED = "selected", "Sélectionné"

    CATEGORY_CHOICES = [
        ("tech", "Technologie"),
        ("social", "Social"),
        ("environment", "Environnement"),
        ("health", "Santé"),
        ("education", "Éducation"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_projects")
    team = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="team_projects", blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IDEA)
    objectives = models.TextField(blank=True)
    expected_impact = models.TextField(blank=True)
    required_resources = models.TextField(blank=True)
    community_score = models.FloatField(default=0)
    ai_score = models.FloatField(default=0)
    final_score = models.FloatField(default=0)
    progress = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title


class ProjectDocument(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    file_name = models.CharField(max_length=255)
    file_url = models.URLField()
    file_type = models.CharField(max_length=20)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.file_name} ({self.project})"
