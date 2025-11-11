from __future__ import annotations

from django.db import models


class TimeStampedModel(models.Model):
    """Abstract model with created and updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("-created_at",)


class SoftDeleteQuerySet(models.QuerySet):
    """Custom queryset to support soft deletion."""

    def alive(self):
        return self.filter(is_deleted=False)

    def deleted(self):
        return self.filter(is_deleted=True)


class SoftDeleteModel(models.Model):
    """Provide soft deletion behaviour via an is_deleted flag."""

    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteQuerySet.as_manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):  # type: ignore[override]
        self.is_deleted = True
        self.save(update_fields=["is_deleted"])

    def hard_delete(self):
        super().delete()

