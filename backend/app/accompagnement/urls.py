from rest_framework.routers import DefaultRouter

from .views import BudgetLineViewSet, MentorshipViewSet, MilestoneViewSet

router = DefaultRouter()
router.register("mentorships", MentorshipViewSet, basename="mentorship")
router.register("milestones", MilestoneViewSet, basename="milestone")
router.register("budgets", BudgetLineViewSet, basename="budget-line")

urlpatterns = router.urls
