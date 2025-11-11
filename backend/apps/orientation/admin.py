from __future__ import annotations

from django.contrib import admin

from .models import ConversationMessage, OrientationConversation, OrientationRequest, Resource


@admin.register(OrientationRequest)
class OrientationRequestAdmin(admin.ModelAdmin):
    list_display = ("topic", "student", "counselor", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("topic", "student__email", "counselor__email")
    autocomplete_fields = ("student", "counselor")


@admin.register(OrientationConversation)
class OrientationConversationAdmin(admin.ModelAdmin):
    list_display = ("request", "last_message_at")
    raw_id_fields = ("request",)


@admin.register(ConversationMessage)
class ConversationMessageAdmin(admin.ModelAdmin):
    list_display = ("conversation", "sender", "created_at")
    search_fields = ("content",)
    raw_id_fields = ("conversation", "sender")


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "created_at")
    list_filter = ("category",)
    search_fields = ("title", "description")

