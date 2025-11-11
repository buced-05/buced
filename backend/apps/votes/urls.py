from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import VoteSummaryViewSet, VoteViewSet

app_name = "votes"

router = DefaultRouter()
router.register("", VoteViewSet, basename="vote")
router.register("summaries", VoteSummaryViewSet, basename="vote-summary")

urlpatterns = router.urls

