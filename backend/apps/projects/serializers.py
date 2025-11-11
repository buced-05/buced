from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Project, ProjectDocument, ProjectEngagement, ProjectProgress

User = get_user_model()


class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = ("id", "project", "document", "document_type", "description", "created_at")
        read_only_fields = ("id", "created_at", "project")


class ProjectProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProgress
        fields = ("id", "project", "title", "description", "status", "due_date", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at", "project")


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    progress_items = ProjectProgressSerializer(many=True, read_only=True)
    team_members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

    class Meta:
        model = Project
        fields = (
            "id",
            "owner",
            "team_members",
            "title",
            "description",
            "category",
            "objectives",
            "expected_impact",
            "resources_needed",
            "current_status",
            "community_score",
            "ai_score",
            "final_score",
            "submission_date",
            "views_count",
            "likes_count",
            "state",
            "documents",
            "progress_items",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "owner",
            "community_score",
            "ai_score",
            "final_score",
            "submission_date",
            "views_count",
            "likes_count",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        team_members = validated_data.pop("team_members", [])
        project = Project.objects.create(**validated_data)
        if team_members:
            project.team_members.set(team_members)
        return project

    def update(self, instance, validated_data):
        team_members = validated_data.pop("team_members", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if team_members is not None:
            instance.team_members.set(team_members)
        return instance


class ProjectEngagementSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ProjectEngagement
        fields = ("id", "project", "user", "engagement_type", "created_at")
        read_only_fields = ("id", "user", "created_at")

