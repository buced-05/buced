from __future__ import annotations

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import Project

from .models import Dataset, MLModel, PredictionLog
from .serializers import DatasetSerializer, MLModelSerializer, PredictionLogSerializer
from .services import ProjectScoringService, RecommendationService, SentimentAnalysisService


class SentimentAnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        comment = request.data.get("comment", "")
        service = SentimentAnalysisService()
        result = service.analyse_comment(comment)
        return Response(result, status=status.HTTP_200_OK)


class ProjectScoringView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id: str):
        project = Project.objects.get(id=project_id)
        service = ProjectScoringService()
        scores = service.score_project(project)
        return Response(scores, status=status.HTTP_200_OK)


class RecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recommender = RecommendationService()
        projects = recommender.recommend_projects_for_user(request.user)
        return Response({"projects": projects}, status=status.HTTP_200_OK)


class MLModelViewSet(viewsets.ModelViewSet):
    serializer_class = MLModelSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = MLModel.objects.all()


class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Dataset.objects.all()


class PredictionLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PredictionLogSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = PredictionLog.objects.select_related("model")

