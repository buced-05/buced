from django.conf import settings
from django.db import models

from projects.models import Project


class Mentorship(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="mentorship")
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="mentored_projects")
    kpis = models.JSONField(default=dict, blank=True)
    budget_allocated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"Mentorat - {self.project.title}"


class Milestone(models.Model):
    mentorship = models.ForeignKey(Mentorship, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    progress = models.PositiveSmallIntegerField(default=0)

    def __str__(self) -> str:
        return self.title


class BudgetLine(models.Model):
    mentorship = models.ForeignKey(Mentorship, on_delete=models.CASCADE, related_name="budget_lines")
    label = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.label} ({self.amount})"
