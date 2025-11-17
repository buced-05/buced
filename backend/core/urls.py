"""
Configuration des URLs principales de l'application BUCED
Gère le routage central et les endpoints communs
"""

from __future__ import annotations

from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

# Import des vues centrales
try:
    from core.views import (
        system_info,
        maintenance_mode,
        handler404,
        handler500,
        handler403,
        handler400,
    )
    CORE_VIEWS_AVAILABLE = True
except ImportError:
    CORE_VIEWS_AVAILABLE = False

# Import du health check depuis common
try:
    from apps.common.views import health_check
    HEALTH_CHECK_AVAILABLE = True
except ImportError:
    HEALTH_CHECK_AVAILABLE = False
    def health_check(request):
        from rest_framework.response import Response
        return Response({"status": "healthy", "message": "API is running"}, status=200)

# Configuration du site admin
admin.site.site_header = "BUCED Administration"
admin.site.site_title = "BUCED Admin"
admin.site.index_title = "Bureau des Clubs Éducatifs"

urlpatterns = [
    # ============================================
    # Panel Administrateur
    # ============================================
    # Panel admin à /boss pour éviter les conflits avec le frontend
    path("boss/", admin.site.urls, name="admin"),
    # Garder aussi /admin pour compatibilité et redirection
    path("admin/", admin.site.urls, name="admin-alt"),
    
    # ============================================
    # Endpoints de santé et système
    # ============================================
    path("api/health/", health_check, name="health-check"),
    
    # ============================================
    # Documentation API
    # ============================================
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
    
    # ============================================
    # Routes API v1
    # ============================================
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

# Ajouter les routes conditionnelles
if CORE_VIEWS_AVAILABLE:
    urlpatterns += [
        path("api/system/", system_info, name="system-info"),
        path("api/maintenance/", maintenance_mode, name="maintenance-mode"),
    ]

# Routes communes (si disponibles)
try:
    urlpatterns.append(path("api/v1/common/", include("apps.common.urls", namespace="common")))
except ImportError:
    pass

# Servir les fichiers statiques et média en développement
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Handlers d'erreurs personnalisés (si disponibles)
if CORE_VIEWS_AVAILABLE:
    handler404 = handler404
    handler500 = handler500
    handler403 = handler403
    handler400 = handler400
