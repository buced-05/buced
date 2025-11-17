"""
URLs pour l'application common
Endpoints partagés et utilitaires
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = "common"

# Router pour les vues basées sur les ViewSets (si vous en ajoutez)
router = DefaultRouter()
# router.register('example', ExampleViewSet, basename='example')

urlpatterns = [
    # Health check et monitoring
    path("health/", views.health_check, name="health-check"),
    path("server-time/", views.server_time, name="server-time"),
    
    # Informations API
    path("info/", views.api_info, name="api-info"),
    
    # Statistiques utilisateur
    path("user/stats/", views.user_stats, name="user-stats"),
    
    # Feedback
    path("feedback/", views.feedback, name="feedback"),
]

# Ajouter les routes du router si nécessaire
# urlpatterns += router.urls

