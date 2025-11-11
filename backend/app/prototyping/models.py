from django.conf import settings
from django.db import models

from projects.models import Project


class PrototypeSprint(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="sprints")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    squad = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="assigned_sprints", blank=True)
    specification = models.TextField(blank=True)
    status = models.CharField(max_length=20, default="active")

    def __str__(self) -> str:
        return f"Sprint {self.project.title}"


class KanbanTask(models.Model):
    class Status(models.TextChoices):
        TODO = "todo", "À faire"
        IN_PROGRESS = "in_progress", "En cours"
        DONE = "done", "Terminé"

    sprint = models.ForeignKey(PrototypeSprint, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title
