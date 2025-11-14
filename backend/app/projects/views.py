import math

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

try:
    from apps.ml.tasks import generate_recommendations
except ImportError:
    # Fallback si ml n'est pas disponible
    def generate_recommendations(*args, **kwargs):
        pass

from .models import Project, ProjectDocument
from .serializers import ProjectDocumentSerializer, ProjectSerializer

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = (
        Project.objects.prefetch_related("team", "documents", "votes")
        .select_related("owner")
        .all()
    )
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Override to handle potential database errors gracefully"""
        try:
            return super().get_queryset()
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error getting projects queryset: {e}")
            # Return empty queryset if there's a database error
            return Project.objects.none()
    
    filterset_fields = ["category", "status"]
    search_fields = ["title", "description", "expected_impact", "objectives"]
    ordering_fields = ["final_score", "community_score", "ai_score", "created_at"]
    ordering = ["-final_score", "-community_score"]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        try:
            generate_recommendations.delay(user_id=self.request.user.pk)
        except Exception:
            generate_recommendations.apply(kwargs={"user_id": self.request.user.pk})
        return project

    @action(detail=True, methods=["post"], url_path="assign-team")
    def assign_team(self, request, pk=None):
        project = self.get_object()
        team_ids = request.data.get("team_ids", [])
        if not isinstance(team_ids, list):
            return Response({"detail": "team_ids must be a list of user IDs."}, status=status.HTTP_400_BAD_REQUEST)
        team_members = User.objects.filter(id__in=team_ids)
        project.team.set(team_members)
        serializer = self.get_serializer(project)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="top-selection")
    def top_selection(self, request):
        total_projects = self.get_queryset().count()
        if total_projects == 0:
            return Response([])
        top_count = max(1, math.ceil(total_projects * 0.02))
        top_count = max(top_count, 5) if total_projects >= 5 else top_count
        projects = self.get_queryset().order_by("-final_score")[:top_count]
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="statistics")
    def statistics(self, request):
        queryset = self.get_queryset()
        total = queryset.count()
        by_category = queryset.values("category").order_by("category")
        category_counts = queryset.values("category").annotate(count=Count("id"))
        avg_scores = queryset.aggregate(
            avg_final_score=Avg("final_score"),
            avg_ai_score=Avg("ai_score"),
            avg_community_score=Avg("community_score"),
        )
        return Response(
            {
                "total": total,
                "by_category": [
                    {
                        "category": item["category"],
                        "count": item["count"],
                    }
                    for item in category_counts
                ],
                **{key: round(value or 0, 2) for key, value in avg_scores.items()},
            }
        )


class ProjectDocumentViewSet(viewsets.ModelViewSet):
    queryset = ProjectDocument.objects.select_related("project").all()
    serializer_class = ProjectDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
