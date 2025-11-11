from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import AccompanimentProgram, MentorshipSession, Milestone, ProgressReport

User = get_user_model()


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ("id", "program", "title", "description", "status", "due_date", "budget_used", "created_at")
        read_only_fields = ("id", "created_at", "program")


class ProgressReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressReport
        fields = ("id", "program", "summary", "achievements", "blockers", "next_steps", "created_at")
        read_only_fields = ("id", "created_at", "program")


class MentorshipSessionSerializer(serializers.ModelSerializer):
    mentor = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = MentorshipSession
        fields = ("id", "program", "mentor", "scheduled_for", "duration_minutes", "notes", "outcome", "created_at")
        read_only_fields = ("id", "created_at", "program")


class AccompanimentProgramSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    mentor = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)
    milestones = MilestoneSerializer(many=True, read_only=True)
    reports = ProgressReportSerializer(many=True, read_only=True)
    sessions = MentorshipSessionSerializer(many=True, read_only=True)

    class Meta:
        model = AccompanimentProgram
        fields = (
            "id",
            "project",
            "mentor",
            "budget_allocated",
            "status",
            "objectives",
            "kpis",
            "milestones",
            "reports",
            "sessions",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "project", "created_at", "updated_at")

