from rest_framework.routers import DefaultRouter

from .views import EvaluationResultViewSet, VoteViewSet

router = DefaultRouter()
router.register("community", VoteViewSet, basename="vote")
router.register("evaluations", EvaluationResultViewSet, basename="evaluation")

urlpatterns = router.urls
