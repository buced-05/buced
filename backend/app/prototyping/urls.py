from rest_framework.routers import DefaultRouter

from .views import KanbanTaskViewSet, PrototypeSprintViewSet

router = DefaultRouter()
router.register("sprints", PrototypeSprintViewSet, basename="prototype-sprint")
router.register("tasks", KanbanTaskViewSet, basename="kanban-task")

urlpatterns = router.urls
