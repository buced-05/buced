from rest_framework.routers import DefaultRouter

from .views import (
    ConversationViewSet,
    MessageViewSet,
    OrientationRequestViewSet,
    ResourceViewSet,
)

router = DefaultRouter()
router.register("resources", ResourceViewSet, basename="resource")
router.register("requests", OrientationRequestViewSet, basename="orientation-request")
router.register("conversations", ConversationViewSet, basename="conversation")
router.register("messages", MessageViewSet, basename="message")

urlpatterns = router.urls
