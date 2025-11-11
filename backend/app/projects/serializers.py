from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Project, ProjectDocument

User = get_user_model()


class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = ["id", "project", "file_name", "file_url", "file_type", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]


class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "role"]


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserLiteSerializer(read_only=True)
    team = UserLiteSerializer(many=True, read_only=True)
    team_ids = serializers.PrimaryKeyRelatedField(
        source="team",
        many=True,
        queryset=User.objects.all(),
        required=False,
        write_only=True,
    )
    documents = ProjectDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "category",
            "owner",
            "team",
            "team_ids",
            "status",
            "objectives",
            "expected_impact",
            "required_resources",
            "community_score",
            "ai_score",
            "final_score",
            "progress",
            "documents",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "team",
            "community_score",
            "ai_score",
            "final_score",
            "created_at",
            "updated_at",
            "documents",
        ]

    def create(self, validated_data):
        team = validated_data.pop("team", [])
        project = super().create(validated_data)
        if team:
            project.team.set(team)
        return project

    def update(self, instance, validated_data):
        team = validated_data.pop("team", None)
        project = super().update(instance, validated_data)
        if team is not None:
            project.team.set(team)
        return project
