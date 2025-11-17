"""
Vues centrales pour l'application BUCED
Gère les erreurs, la maintenance et les informations système
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db import connection
from django.utils import timezone
import logging
import platform
import sys

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["GET"])
def system_info(request):
    """
    Endpoint pour obtenir des informations sur le système
    Accessible uniquement en développement ou avec authentification admin
    """
    if settings.DEBUG or request.user.is_staff:
        try:
            # Test de connexion à la base de données
            db_status = "connected"
            db_name = "unknown"
            try:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT current_database()")
                    db_name = cursor.fetchone()[0]
            except Exception as e:
                db_status = f"error: {str(e)}"
            
            info = {
                "system": {
                    "platform": platform.platform(),
                    "python_version": sys.version,
                    "django_version": __import__("django").get_version(),
                },
                "database": {
                    "status": db_status,
                    "name": db_name,
                    "engine": settings.DATABASES["default"]["ENGINE"].split(".")[-1],
                },
                "application": {
                    "debug": settings.DEBUG,
                    "allowed_hosts": settings.ALLOWED_HOSTS[:5],  # Limiter l'affichage
                    "timezone": str(timezone.now().tzinfo),
                },
                "timestamp": timezone.now().isoformat(),
            }
            
            return JsonResponse(info, status=200)
        except Exception as e:
            logger.error(f"Error in system_info: {e}")
            return JsonResponse(
                {"error": "Unable to retrieve system information"},
                status=500
            )
    else:
        return JsonResponse(
            {"error": "Unauthorized"},
            status=403
        )


@csrf_exempt
@require_http_methods(["GET"])
def maintenance_mode(request):
    """
    Vérifie si l'application est en mode maintenance
    """
    # Vous pouvez ajouter une variable d'environnement MAINTENANCE_MODE
    maintenance = getattr(settings, "MAINTENANCE_MODE", False)
    
    return JsonResponse({
        "maintenance": maintenance,
        "message": "Service temporarily unavailable" if maintenance else "Service is operational"
    }, status=503 if maintenance else 200)


def handler404(request, exception):
    """
    Handler personnalisé pour les erreurs 404
    """
    return JsonResponse({
        "error": "Not Found",
        "message": "The requested resource was not found",
        "path": request.path,
        "status_code": 404
    }, status=404)


def handler500(request):
    """
    Handler personnalisé pour les erreurs 500
    """
    logger.error(f"Internal server error: {request.path}")
    return JsonResponse({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred",
        "status_code": 500
    }, status=500)


def handler403(request, exception):
    """
    Handler personnalisé pour les erreurs 403
    """
    return JsonResponse({
        "error": "Forbidden",
        "message": "You don't have permission to access this resource",
        "status_code": 403
    }, status=403)


def handler400(request, exception):
    """
    Handler personnalisé pour les erreurs 400
    """
    return JsonResponse({
        "error": "Bad Request",
        "message": "The request was invalid",
        "status_code": 400
    }, status=400)

