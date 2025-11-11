from rest_framework import permissions, viewsets

from .models import BudgetLine, Mentorship, Milestone
from .serializers import BudgetLineSerializer, MentorshipSerializer, MilestoneSerializer


class MentorshipViewSet(viewsets.ModelViewSet):
    queryset = Mentorship.objects.select_related("project", "mentor").prefetch_related("milestones", "budget_lines")
    serializer_class = MentorshipSerializer
    permission_classes = [permissions.IsAuthenticated]


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.select_related("mentorship").all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]


class BudgetLineViewSet(viewsets.ModelViewSet):
    queryset = BudgetLine.objects.select_related("mentorship").all()
    serializer_class = BudgetLineSerializer
    permission_classes = [permissions.IsAuthenticated]
