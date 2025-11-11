from rest_framework.routers import DefaultRouter

from .views import MLModelViewSet, RecommendationViewSet, SentimentAnalysisResultViewSet

router = DefaultRouter()
router.register("models", MLModelViewSet, basename="ml-model")
router.register("sentiment", SentimentAnalysisResultViewSet, basename="sentiment-analysis")
router.register("recommendations", RecommendationViewSet, basename="recommendation")

urlpatterns = router.urls
