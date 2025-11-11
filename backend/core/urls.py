from __future__ import annotations

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/docs/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("api/v1/auth/", include("apps.users.urls", namespace="users")),
    path("api/v1/orientation/", include("apps.orientation.urls", namespace="orientation")),
    path("api/v1/projects/", include("apps.projects.urls", namespace="projects")),
    path("api/v1/votes/", include("apps.votes.urls", namespace="votes")),
    path("api/v1/prototyping/", include("apps.prototyping.urls", namespace="prototyping")),
    path("api/v1/sponsors/", include("apps.sponsors.urls", namespace="sponsors")),
    path("api/v1/accompagnement/", include("apps.accompaniment.urls", namespace="accompaniment")),
    path("api/v1/notifications/", include("apps.notifications.urls", namespace="notifications")),
    path("api/v1/ml/", include("apps.ml.urls", namespace="ml")),
]

