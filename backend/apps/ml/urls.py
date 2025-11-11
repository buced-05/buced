from __future__ import annotations

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DatasetViewSet,
    MLModelViewSet,
    PredictionLogViewSet,
    ProjectScoringView,
    RecommendationView,
    SentimentAnalysisView,
)

app_name = "ml"

router = DefaultRouter()
router.register("models", MLModelViewSet, basename="ml-model")
router.register("datasets", DatasetViewSet, basename="ml-dataset")
router.register("predictions", PredictionLogViewSet, basename="ml-prediction")

urlpatterns = [
    path("sentiment/", SentimentAnalysisView.as_view(), name="sentiment"),
    path("scoring/<uuid:project_id>/", ProjectScoringView.as_view(), name="project-scoring"),
    path("recommendations/", RecommendationView.as_view(), name="recommendations"),
]

urlpatterns += router.urls

