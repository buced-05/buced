from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    JWTTokenObtainPairView,
    JWTTokenRefreshView,
    ProfileView,
    RegisterView,
    UserViewSet,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("token/", JWTTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", JWTTokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
