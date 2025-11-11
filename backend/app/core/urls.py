from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/auth/", include("users.urls")),
    path("api/orientation/", include("orientation.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/votes/", include("votes.urls")),
    path("api/prototyping/", include("prototyping.urls")),
    path("api/sponsors/", include("sponsors.urls")),
    path("api/accompagnement/", include("accompagnement.urls")),
    path("api/ml/", include("ml.urls")),
    path("api/", include(router.urls)),
]
