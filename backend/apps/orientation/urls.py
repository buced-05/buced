from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import (
    ConversationMessageViewSet,
    OrientationConversationViewSet,
    OrientationRequestViewSet,
    ResourceViewSet,
)

app_name = "orientation"

router = DefaultRouter()
router.register("requests", OrientationRequestViewSet, basename="orientation-request")
router.register("conversations", OrientationConversationViewSet, basename="orientation-conversation")
router.register("messages", ConversationMessageViewSet, basename="orientation-message")
router.register("resources", ResourceViewSet, basename="orientation-resource")

urlpatterns = router.urls

