from __future__ import annotations

import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .models import Notification


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """Consommateur WebSocket pour les notifications en temps réel."""

    async def connect(self):
        user = self.scope.get("user")
        if not user or isinstance(user, AnonymousUser) or not user.is_authenticated:
            await self.close()
            return
        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        user = self.scope.get("user")
        if user and user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await super().disconnect(code)

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        if action == "mark_read" and content.get("notification_id"):
            await self._mark_notification_read(content["notification_id"])
        elif action == "ping":
            await self.send_json({"type": "pong"})

    async def notification_message(self, event):
        await self.send_json(event["data"])

    @database_sync_to_async
    def _mark_notification_read(self, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.mark_as_read()
        except Notification.DoesNotExist:
            return

