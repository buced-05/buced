from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import SponsorMessage, SponsorProfile, Sponsorship

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]


class SponsorMessageSerializer(serializers.ModelSerializer):
    author_detail = UserLiteSerializer(source="author", read_only=True)

    class Meta:
        model = SponsorMessage
        fields = ["id", "sponsorship", "author", "author_detail", "content", "created_at"]
        read_only_fields = ["id", "created_at", "author_detail"]


class SponsorshipSerializer(serializers.ModelSerializer):
    messages = SponsorMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Sponsorship
        fields = ["id", "sponsor", "project", "amount", "type", "created_at", "messages"]
        read_only_fields = ["id", "created_at", "messages"]


class SponsorProfileSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)
    sponsorships = SponsorshipSerializer(many=True, read_only=True)
    interests = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = SponsorProfile
        fields = ["id", "user", "company", "interests", "total_budget", "description", "sponsorships"]
        read_only_fields = ["id", "user", "sponsorships"]
