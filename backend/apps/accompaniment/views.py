from __future__ import annotations

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.projects.models import Project

from .models import AccompanimentProgram, MentorshipSession, Milestone, ProgressReport
from .serializers import (
    AccompanimentProgramSerializer,
    MentorshipSessionSerializer,
    MilestoneSerializer,
    ProgressReportSerializer,
)


class ProgramPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: AccompanimentProgram):
        user = request.user
        if not user.is_authenticated:
            return False
        if user.is_staff:
            return True
        if obj.project.owner == user:
            return True
        if obj.mentor == user:
            return True
        return False


class AccompanimentProgramViewSet(viewsets.ModelViewSet):
    serializer_class = AccompanimentProgramSerializer
    permission_classes = [permissions.IsAuthenticated, ProgramPermission]
    queryset = AccompanimentProgram.objects.select_related("project", "mentor").prefetch_related("milestones")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(Q(project__owner=user) | Q(mentor=user))

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.request.data.get("project_id"))
        serializer.save(project=project)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, ProgramPermission])
    def change_status(self, request, pk=None):
        program = self.get_object()
        status_choice = request.data.get("status")
        if status_choice not in dict(AccompanimentProgram.Status.choices):
            return Response({"detail": "Statut invalide."}, status=status.HTTP_400_BAD_REQUEST)
        program.status = status_choice
        program.save(update_fields=["status"])
        return Response({"detail": "Statut mis à jour."})


class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Milestone.objects.select_related("program", "program__project")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(Q(program__project__owner=user) | Q(program__mentor=user)).distinct()

    def perform_create(self, serializer):
        program = get_object_or_404(AccompanimentProgram, id=self.request.data.get("program_id"))
        serializer.save(program=program)


class ProgressReportViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProgressReport.objects.select_related("program", "program__project")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(Q(program__project__owner=user) | Q(program__mentor=user)).distinct()

    def perform_create(self, serializer):
        program = get_object_or_404(AccompanimentProgram, id=self.request.data.get("program_id"))
        serializer.save(program=program)


class MentorshipSessionViewSet(viewsets.ModelViewSet):
    serializer_class = MentorshipSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MentorshipSession.objects.select_related("program", "mentor")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(Q(program__project__owner=user) | Q(mentor=user)).distinct()

    def perform_create(self, serializer):
        program = get_object_or_404(AccompanimentProgram, id=self.request.data.get("program_id"))
        serializer.save(program=program)

