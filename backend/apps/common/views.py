from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint to verify API connectivity"""
    try:
        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return Response({
            "status": "healthy",
            "database": "connected",
            "message": "API is running correctly"
        }, status=200)
    except Exception as e:
        return Response({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }, status=503)

