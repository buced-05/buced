from rest_framework.routers import DefaultRouter

from .views import ProjectDocumentViewSet, ProjectViewSet

router = DefaultRouter()
router.register("items", ProjectViewSet, basename="project")
router.register("documents", ProjectDocumentViewSet, basename="project-document")

urlpatterns = router.urls
