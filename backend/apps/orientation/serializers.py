from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ConversationMessage, OrientationConversation, OrientationRequest, Resource

User = get_user_model()


class OrientationRequestSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    counselor = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = OrientationRequest
        fields = (
            "id",
            "student",
            "counselor",
            "topic",
            "description",
            "answers",
            "status",
            "scheduled_at",
            "recommendations",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "recommendations")


class OrientationMatchSerializer(serializers.Serializer):
    counselor_id = serializers.UUIDField()


class ConversationMessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ConversationMessage
        fields = ("id", "conversation", "sender", "content", "attachment", "created_at", "read_at")
        read_only_fields = ("id", "created_at", "read_at", "conversation")


class OrientationConversationSerializer(serializers.ModelSerializer):
    messages = ConversationMessageSerializer(many=True, read_only=True)

    class Meta:
        model = OrientationConversation
        fields = ("id", "request", "participants", "last_message_at", "messages")
        read_only_fields = ("id", "request", "participants", "last_message_at", "messages")


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = (
            "id",
            "title",
            "description",
            "file",
            "url",
            "category",
            "tags",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

