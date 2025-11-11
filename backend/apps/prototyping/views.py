from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.ml.services import SpecificationGeneratorService
from apps.projects.models import Project

from .models import Prototype, PrototypeTask, TechnicalSpecification
from .serializers import (
    PrototypeSerializer,
    PrototypeTaskSerializer,
    TechnicalSpecificationSerializer,
)


class PrototypeViewSet(viewsets.ModelViewSet):
    serializer_class = PrototypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Prototype.objects.select_related("project").prefetch_related("assigned_team", "tasks")

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy", "generate_spec"}:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.request.data.get("project_id"))
        serializer.save(project=project)

    @action(detail=True, methods=["post"])
    def generate_spec(self, request, pk=None):
        prototype = self.get_object()
        generator = SpecificationGeneratorService()
        payload = generator.generate(prototype)
        spec = TechnicalSpecification.objects.create(prototype=prototype, content=payload, generated_by="ml_engine")
        return Response(TechnicalSpecificationSerializer(spec).data, status=status.HTTP_201_CREATED)


class PrototypeTaskViewSet(viewsets.ModelViewSet):
    serializer_class = PrototypeTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PrototypeTask.objects.select_related("prototype", "assignee")

    def perform_create(self, serializer):
        prototype = get_object_or_404(Prototype, id=self.request.data.get("prototype_id"))
        serializer.save(prototype=prototype)


class TechnicalSpecificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TechnicalSpecificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TechnicalSpecification.objects.select_related("prototype")

