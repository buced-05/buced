from rest_framework import permissions, viewsets

from .models import KanbanTask, PrototypeSprint
from .serializers import KanbanTaskSerializer, PrototypeSprintSerializer


class PrototypeSprintViewSet(viewsets.ModelViewSet):
    queryset = PrototypeSprint.objects.prefetch_related("squad", "tasks").select_related("project").all()
    serializer_class = PrototypeSprintSerializer
    permission_classes = [permissions.IsAuthenticated]


class KanbanTaskViewSet(viewsets.ModelViewSet):
    queryset = KanbanTask.objects.select_related("sprint", "assignee").all()
    serializer_class = KanbanTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
