from __future__ import annotations

from django.db.models import Avg, Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.ml.services import ProjectScoringService

from .models import Project, ProjectDocument, ProjectEngagement, ProjectProgress
from .serializers import (
    ProjectDocumentSerializer,
    ProjectEngagementSerializer,
    ProjectProgressSerializer,
    ProjectSerializer,
)


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user and (request.user.is_staff or obj.owner == request.user))


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = Project.objects.prefetch_related("team_members", "documents", "progress_items")
    filterset_fields = ("category", "current_status", "state")
    search_fields = ("title", "description", "expected_impact")
    ordering_fields = ("created_at", "community_score", "ai_score", "final_score")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role in {user.Role.COUNSELOR, user.Role.ADMIN}:
            return self.queryset
        return self.queryset.filter(Q(owner=user) | Q(team_members=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsOwnerOrAdmin])
    def publish(self, request, pk=None):
        project = self.get_object()
        project.state = "published"
        project.save(update_fields=["state"])
        return Response({"detail": "Projet publié."})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def record_view(self, request, pk=None):
        project = self.get_object()
        ProjectEngagement.objects.get_or_create(
            project=project,
            user=request.user,
            engagement_type=ProjectEngagement.EngagementType.VIEW,
        )
        project.views_count = project.engagements.filter(
            engagement_type=ProjectEngagement.EngagementType.VIEW
        ).count()
        project.save(update_fields=["views_count"])
        return Response({"views": project.views_count})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        project = self.get_object()
        _, created = ProjectEngagement.objects.get_or_create(
            project=project,
            user=request.user,
            engagement_type=ProjectEngagement.EngagementType.LIKE,
        )
        if not created:
            return Response({"detail": "Déjà liké."}, status=status.HTTP_200_OK)
        project.likes_count = project.engagements.filter(
            engagement_type=ProjectEngagement.EngagementType.LIKE
        ).count()
        project.save(update_fields=["likes_count"])
        return Response({"likes": project.likes_count})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def refresh_scores(self, request, pk=None):
        project = self.get_object()
        scoring_service = ProjectScoringService()
        scores = scoring_service.score_project(project)
        project.ai_score = scores["ai_score"]
        project.final_score = scores["final_score"]
        project.save(update_fields=["ai_score", "final_score"])
        return Response(scores)


class ProjectDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProjectDocument.objects.select_related("project")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(Q(project__owner=user) | Q(project__team_members=user)).distinct()

    def perform_create(self, serializer):
        project_id = self.request.data.get("project_id")
        project = get_object_or_404(Project, id=project_id)
        if project.owner != self.request.user and self.request.user not in project.team_members.all():
            raise permissions.PermissionDenied("Vous ne pouvez pas modifier ce projet.")
        serializer.save(project=project)


class ProjectProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProjectProgress.objects.select_related("project")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(Q(project__owner=user) | Q(project__team_members=user)).distinct()

    def perform_create(self, serializer):
        project_id = self.request.data.get("project_id")
        project = get_object_or_404(Project, id=project_id)
        if project.owner != self.request.user and self.request.user not in project.team_members.all():
            raise permissions.PermissionDenied("Vous ne pouvez pas modifier ce projet.")
        serializer.save(project=project)


class ProjectEngagementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectEngagementSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProjectEngagement.objects.select_related("project", "user")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(user=user)

