from rest_framework.routers import DefaultRouter

from .views import SponsorMessageViewSet, SponsorProfileViewSet, SponsorshipViewSet

router = DefaultRouter()
router.register("profiles", SponsorProfileViewSet, basename="sponsor-profile")
router.register("engagements", SponsorshipViewSet, basename="sponsorship")
router.register("messages", SponsorMessageViewSet, basename="sponsor-message")

urlpatterns = router.urls
