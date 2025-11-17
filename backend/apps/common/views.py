"""
Vues communes pour l'application BUCED
Endpoints partagés entre les différentes applications
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.utils import timezone
from django.conf import settings
import logging
import os

# psutil est optionnel pour le monitoring système
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint pour vérifier la connectivité de l'API
    Utilisé par les systèmes de monitoring et load balancers
    """
    try:
        # Test de connexion à la base de données
        db_status = "connected"
        db_response_time = None
        
        try:
            import time
            start_time = time.time()
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            db_response_time = round((time.time() - start_time) * 1000, 2)  # en ms
        except Exception as e:
            db_status = f"error: {str(e)}"
            logger.error(f"Database health check failed: {e}")
        
        # Vérifier l'espace disque (optionnel, nécessite psutil)
        disk_status = "ok"
        if PSUTIL_AVAILABLE:
            try:
                disk_usage = psutil.disk_usage('/')
                disk_percent = disk_usage.percent
                if disk_percent > 90:
                    disk_status = "warning"
                elif disk_percent > 95:
                    disk_status = "critical"
            except Exception:
                disk_status = "unknown"
        else:
            disk_status = "unavailable"
        
        # Vérifier la mémoire (optionnel, nécessite psutil)
        memory_status = "ok"
        if PSUTIL_AVAILABLE:
            try:
                memory = psutil.virtual_memory()
                memory_percent = memory.percent
                if memory_percent > 90:
                    memory_status = "warning"
            except Exception:
                memory_status = "unknown"
        else:
            memory_status = "unavailable"
        
        # Déterminer le statut global
        overall_status = "healthy"
        if db_status != "connected":
            overall_status = "unhealthy"
        elif disk_status == "critical" or memory_status == "critical":
            overall_status = "degraded"
        
        response_data = {
            "status": overall_status,
            "timestamp": timezone.now().isoformat(),
            "services": {
                "database": {
                    "status": db_status,
                    "response_time_ms": db_response_time,
                },
                "disk": {
                    "status": disk_status,
                },
                "memory": {
                    "status": memory_status,
                },
            },
            "version": getattr(settings, "API_VERSION", "1.0.0"),
        }
        
        # Code de statut HTTP approprié
        http_status = status.HTTP_200_OK
        if overall_status == "unhealthy":
            http_status = status.HTTP_503_SERVICE_UNAVAILABLE
        elif overall_status == "degraded":
            http_status = status.HTTP_200_OK  # Toujours 200 mais avec status degraded
        
        return Response(response_data, status=http_status)
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return Response(
            {
                "status": "unhealthy",
                "error": "Health check failed",
                "timestamp": timezone.now().isoformat(),
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_info(request):
    """
    Informations sur l'API pour les utilisateurs authentifiés
    """
    try:
        info = {
            "api": {
                "name": "BUCED API",
                "version": getattr(settings, "API_VERSION", "1.0.0"),
                "description": "API pour la plateforme d'innovation éducative ivoirienne",
            },
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": getattr(request.user, "email", None),
            },
            "endpoints": {
                "documentation": "/api/docs/swagger/",
                "schema": "/api/schema/",
                "health": "/api/health/",
            },
            "timestamp": timezone.now().isoformat(),
        }
        
        return Response(info, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"API info error: {e}")
        return Response(
            {"error": "Unable to retrieve API information"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def server_time(request):
    """
    Retourne l'heure actuelle du serveur
    Utile pour la synchronisation côté client
    """
    return Response({
        "server_time": timezone.now().isoformat(),
        "timezone": str(timezone.get_current_timezone()),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Statistiques de l'utilisateur connecté
    """
    try:
        user = request.user
        
        # Vous pouvez ajouter des statistiques spécifiques ici
        stats = {
            "user_id": user.id,
            "username": user.username,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "date_joined": user.date_joined.isoformat() if hasattr(user, "date_joined") else None,
            "last_login": user.last_login.isoformat() if hasattr(user, "last_login") and user.last_login else None,
        }
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"User stats error: {e}")
        return Response(
            {"error": "Unable to retrieve user statistics"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback(request):
    """
    Endpoint pour recevoir les retours des utilisateurs
    """
    try:
        feedback_text = request.data.get("feedback", "")
        feedback_type = request.data.get("type", "general")
        
        if not feedback_text:
            return Response(
                {"error": "Feedback text is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Ici vous pouvez sauvegarder le feedback dans la base de données
        # ou l'envoyer par email, etc.
        logger.info(f"Feedback from user {request.user.id}: {feedback_type} - {feedback_text[:100]}")
        
        return Response({
            "message": "Feedback received successfully",
            "timestamp": timezone.now().isoformat(),
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Feedback error: {e}")
        return Response(
            {"error": "Unable to process feedback"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
