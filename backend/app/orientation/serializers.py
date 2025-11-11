from rest_framework import serializers

from .models import Conversation, Message, OrientationRequest, Resource


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "conversation", "author", "author_name", "content", "created_at"]
        read_only_fields = ["id", "created_at", "author_name"]


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "request", "messages", "created_at"]
        read_only_fields = ["id", "messages", "created_at"]


class OrientationRequestSerializer(serializers.ModelSerializer):
    conversations = ConversationSerializer(many=True, read_only=True)
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)
    advisor_name = serializers.CharField(source="advisor.get_full_name", read_only=True)

    class Meta:
        model = OrientationRequest
        fields = [
            "id",
            "student",
            "student_name",
            "advisor",
            "advisor_name",
            "topic",
            "context",
            "status",
            "created_at",
            "updated_at",
            "conversations",
        ]
        read_only_fields = ["id", "student", "created_at", "updated_at", "conversations", "student_name", "advisor_name"]
