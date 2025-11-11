from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Prototype, PrototypeTask, TechnicalSpecification

User = get_user_model()


class TechnicalSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalSpecification
        fields = ("id", "prototype", "content", "generated_by", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at", "prototype")


class PrototypeTaskSerializer(serializers.ModelSerializer):
    assignee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)

    class Meta:
        model = PrototypeTask
        fields = ("id", "prototype", "title", "description", "column", "assignee", "due_date", "priority", "created_at")
        read_only_fields = ("id", "created_at", "prototype")


class PrototypeSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    assigned_team = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    tasks = PrototypeTaskSerializer(many=True, read_only=True)
    specifications = TechnicalSpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Prototype
        fields = (
            "id",
            "project",
            "status",
            "assigned_team",
            "start_date",
            "end_date",
            "demo_url",
            "code_repository",
            "documentation_url",
            "notes",
            "tasks",
            "specifications",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "project", "created_at", "updated_at")

    def update(self, instance, validated_data):
        team = validated_data.pop("assigned_team", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if team is not None:
            instance.assigned_team.set(team)
        return instance

