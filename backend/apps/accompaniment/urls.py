from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import (
    AccompanimentProgramViewSet,
    MentorshipSessionViewSet,
    MilestoneViewSet,
    ProgressReportViewSet,
)

app_name = "accompaniment"

router = DefaultRouter()
router.register("programs", AccompanimentProgramViewSet, basename="accompaniment-program")
router.register("milestones", MilestoneViewSet, basename="accompaniment-milestone")
router.register("reports", ProgressReportViewSet, basename="accompaniment-report")
router.register("sessions", MentorshipSessionViewSet, basename="accompaniment-session")

urlpatterns = router.urls

