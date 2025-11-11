from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MLModel, Recommendation, SentimentAnalysisResult
from .serializers import (
    MLModelSerializer,
    RecommendationSerializer,
    SentimentAnalysisResultSerializer,
)
from .tasks import generate_recommendations, run_sentiment_analysis, update_scoring_metrics


class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all().order_by("-trained_at")
    serializer_class = MLModelSerializer
    permission_classes = [permissions.IsAuthenticated]


class SentimentAnalysisResultViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = SentimentAnalysisResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.request.query_params.get("project")
        queryset = SentimentAnalysisResult.objects.all()
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    @action(detail=False, methods=["post"], url_path="run")
    def run_analysis(self, request):
        project_id = request.data.get("project_id")
        if not project_id:
            return Response({"detail": "project_id is required"}, status=400)
        run_sentiment_analysis.delay(project_id=project_id)
        update_scoring_metrics.delay(project_id=project_id)
        return Response({"detail": "Sentiment analysis triggered"})


class RecommendationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Recommendation.objects.filter(user=user)

    @action(detail=False, methods=["post"], url_path="refresh")
    def refresh(self, request):
        generate_recommendations.delay(user_id=request.user.pk)
        return Response({"detail": "Recommendations refresh triggered"})
