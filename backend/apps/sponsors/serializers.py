from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import EngagementReport, SponsorMessage, SponsorProfile, Sponsorship

User = get_user_model()


class SponsorProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SponsorProfile
        fields = (
            "id",
            "user",
            "company_name",
            "interests",
            "logo",
            "budget_total",
            "description",
            "website",
            "contact_email",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user", "created_at", "updated_at")


class SponsorshipSerializer(serializers.ModelSerializer):
    sponsor = SponsorProfileSerializer(read_only=True)
    sponsor_id = serializers.PrimaryKeyRelatedField(
        queryset=SponsorProfile.objects.all(), source="sponsor", write_only=True
    )

    class Meta:
        model = Sponsorship
        fields = (
            "id",
            "project",
            "sponsor",
            "sponsor_id",
            "commitment_type",
            "amount",
            "currency",
            "status",
            "details",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "sponsor", "created_at", "updated_at")


class SponsorMessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SponsorMessage
        fields = ("id", "sponsorship", "sender", "content", "attachments", "created_at")
        read_only_fields = ("id", "sender", "created_at")


class EngagementReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementReport
        fields = ("id", "sponsorship", "period_start", "period_end", "impact_metrics", "notes", "created_at")
        read_only_fields = ("id", "created_at")

