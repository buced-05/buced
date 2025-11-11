from __future__ import annotations

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import LoginView, RefreshTokenView, RegisterView, SessionCheckView, UserViewSet

app_name = "users"

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("session/", SessionCheckView.as_view(), name="session"),
]

urlpatterns += router.urls

