from __future__ import annotations

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

django_asgi_app = get_asgi_application()

try:
    from apps.notifications import routing as notifications_routing
except ModuleNotFoundError:  # pragma: no cover - app loading guard
    notifications_routing = None

websocket_urlpatterns = []
if notifications_routing and hasattr(notifications_routing, "websocket_urlpatterns"):
    websocket_urlpatterns.extend(notifications_routing.websocket_urlpatterns)

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns),
        ),
    }
)

