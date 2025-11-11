from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ConversationMessage, OrientationConversation, OrientationRequest, Resource
from .serializers import (
    ConversationMessageSerializer,
    OrientationConversationSerializer,
    OrientationMatchSerializer,
    OrientationRequestSerializer,
    ResourceSerializer,
)

User = get_user_model()


class OrientationRequestViewSet(viewsets.ModelViewSet):
    serializer_class = OrientationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = OrientationRequest.objects.select_related("student", "counselor")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        if user.role == User.Role.COUNSELOR:
            return self.queryset.filter(counselor=user)
        return self.queryset.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def match(self, request, pk=None):
        orientation_request = self.get_object()
        serializer = OrientationMatchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        counselor = get_object_or_404(User, id=serializer.validated_data["counselor_id"], role=User.Role.COUNSELOR)
        with transaction.atomic():
            orientation_request.counselor = counselor
            orientation_request.status = OrientationRequest.Status.MATCHED
            orientation_request.save(update_fields=["counselor", "status"])
            conversation, _ = OrientationConversation.objects.get_or_create(request=orientation_request)
            conversation.participants.set([orientation_request.student, counselor])
        return Response(
            {"detail": f"Conseiller {counselor.get_full_name()} assigné."},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        orientation_request = self.get_object()
        new_status = request.data.get("status")
        if new_status not in dict(OrientationRequest.Status.choices):
            return Response({"detail": "Statut invalide."}, status=status.HTTP_400_BAD_REQUEST)
        orientation_request.status = new_status
        orientation_request.save(update_fields=["status"])
        return Response({"detail": "Statut mis à jour."})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def set_recommendations(self, request, pk=None):
        orientation_request = self.get_object()
        recommendations = request.data.get("recommendations", [])
        orientation_request.recommendations = recommendations
        orientation_request.save(update_fields=["recommendations"])
        return Response({"detail": "Recommandations enregistrées."})


class OrientationConversationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrientationConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = OrientationConversation.objects.prefetch_related("participants", "messages")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(participants=user)


class ConversationMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ConversationMessage.objects.select_related("conversation", "sender")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(conversation__participants=user)

    def perform_create(self, serializer):
        conversation_id = self.request.data.get("conversation_id")
        conversation = get_object_or_404(
            OrientationConversation,
            id=conversation_id,
            participants=self.request.user,
        )
        message = serializer.save(conversation=conversation, sender=self.request.user)
        conversation.last_message_at = message.created_at
        conversation.save(update_fields=["last_message_at"])


class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Resource.objects.all()

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

