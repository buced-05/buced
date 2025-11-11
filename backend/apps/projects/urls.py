from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import (
    ProjectDocumentViewSet,
    ProjectEngagementViewSet,
    ProjectProgressViewSet,
    ProjectViewSet,
)

app_name = "projects"

router = DefaultRouter()
router.register("", ProjectViewSet, basename="project")
router.register("documents", ProjectDocumentViewSet, basename="project-document")
router.register("progress", ProjectProgressViewSet, basename="project-progress")
router.register("engagements", ProjectEngagementViewSet, basename="project-engagement")

urlpatterns = router.urls

