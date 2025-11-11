from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import KanbanTask, PrototypeSprint

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]


class KanbanTaskSerializer(serializers.ModelSerializer):
    assignee_detail = UserLiteSerializer(source="assignee", read_only=True)

    class Meta:
        model = KanbanTask
        fields = [
            "id",
            "sprint",
            "title",
            "description",
            "assignee",
            "assignee_detail",
            "status",
            "due_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "assignee_detail"]


class PrototypeSprintSerializer(serializers.ModelSerializer):
    tasks = KanbanTaskSerializer(many=True, read_only=True)
    squad_detail = UserLiteSerializer(source="squad", many=True, read_only=True)

    class Meta:
        model = PrototypeSprint
        fields = ["id", "project", "start_date", "end_date", "specification", "status", "squad", "squad_detail", "tasks"]
        read_only_fields = ["id", "start_date", "tasks", "squad_detail"]
