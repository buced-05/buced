from django.contrib import admin

from .models import Conversation, Message, OrientationRequest, Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "created_at")
    search_fields = ("title", "category")


@admin.register(OrientationRequest)
class OrientationRequestAdmin(admin.ModelAdmin):
    list_display = ("topic", "student", "advisor", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("topic", "student__username", "advisor__username")


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("request", "created_at")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("conversation", "author", "created_at")
    search_fields = ("content",)
