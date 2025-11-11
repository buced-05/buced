from __future__ import annotations

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.projects.models import Project

from .models import EngagementReport, SponsorMessage, SponsorProfile, Sponsorship
from .serializers import (
    EngagementReportSerializer,
    SponsorMessageSerializer,
    SponsorProfileSerializer,
    SponsorshipSerializer,
)


class IsSponsor(permissions.BasePermission):
    """Vérifie que l'utilisateur est un sponsor."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == request.user.Role.SPONSOR)


class SponsorProfileViewSet(viewsets.ModelViewSet):
    serializer_class = SponsorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SponsorProfile.objects.select_related("user")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        if user.role == user.Role.SPONSOR:
            return self.queryset.filter(user=user)
        return SponsorProfile.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SponsorshipViewSet(viewsets.ModelViewSet):
    serializer_class = SponsorshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Sponsorship.objects.select_related("project", "sponsor", "sponsor__user")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        if user.role == user.Role.SPONSOR:
            return self.queryset.filter(sponsor__user=user)
        return self.queryset.filter(project__owner=user)

    def perform_create(self, serializer):
        if self.request.user.role != self.request.user.Role.SPONSOR:
            raise permissions.PermissionDenied("Seuls les sponsors peuvent créer des engagements.")
        project = Project.objects.get(id=self.request.data.get("project"))
        serializer.save(sponsor=self.request.user.sponsor_profile, project=project)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def change_status(self, request, pk=None):
        sponsorship = self.get_object()
        new_status = request.data.get("status")
        if new_status not in dict(Sponsorship.Status.choices):
            return Response({"detail": "Statut invalide."}, status=status.HTTP_400_BAD_REQUEST)
        sponsorship.status = new_status
        sponsorship.save(update_fields=["status"])
        return Response({"detail": "Statut mis à jour."})


class SponsorMessageViewSet(viewsets.ModelViewSet):
    serializer_class = SponsorMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SponsorMessage.objects.select_related("sponsorship", "sender")

    def perform_create(self, serializer):
        sponsorship_id = self.request.data.get("sponsorship")
        sponsorship = Sponsorship.objects.get(id=sponsorship_id)
        serializer.save(sender=self.request.user, sponsorship=sponsorship)


class EngagementReportViewSet(viewsets.ModelViewSet):
    serializer_class = EngagementReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = EngagementReport.objects.select_related("sponsorship", "sponsorship__project")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        if user.role == user.Role.SPONSOR:
            return self.queryset.filter(sponsorship__sponsor__user=user)
        return self.queryset.filter(sponsorship__project__owner=user)

