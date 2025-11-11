from typing import Optional

from django.contrib.auth import get_user_model

from .models import Notification

User = get_user_model()


def notify_user(*, recipient: User, title: str, message: str, url: Optional[str] = None) -> Notification:
    return Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        url=url or "",
    )
