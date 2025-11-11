from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import PrototypeTaskViewSet, PrototypeViewSet, TechnicalSpecificationViewSet

app_name = "prototyping"

router = DefaultRouter()
router.register("", PrototypeViewSet, basename="prototype")
router.register("tasks", PrototypeTaskViewSet, basename="prototype-task")
router.register("specifications", TechnicalSpecificationViewSet, basename="prototype-specification")

urlpatterns = router.urls

