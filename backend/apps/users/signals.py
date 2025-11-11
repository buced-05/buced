from __future__ import annotations

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_two_factor_placeholder(sender, instance, created, **kwargs):
    """Initialise le secret 2FA si nécessaire."""
    if created and instance.two_factor_enabled and not instance.two_factor_secret:
        instance.two_factor_secret = instance.password[:32]
        instance.save(update_fields=["two_factor_secret"])

