from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import (
    EngagementReportViewSet,
    SponsorMessageViewSet,
    SponsorProfileViewSet,
    SponsorshipViewSet,
)

app_name = "sponsors"

router = DefaultRouter()
router.register("profiles", SponsorProfileViewSet, basename="sponsor-profile")
router.register("engagements", SponsorshipViewSet, basename="sponsorship")
router.register("messages", SponsorMessageViewSet, basename="sponsor-message")
router.register("reports", EngagementReportViewSet, basename="engagement-report")

urlpatterns = router.urls

