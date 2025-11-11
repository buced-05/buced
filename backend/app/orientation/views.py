from collections import Counter

from django.contrib.auth import get_user_model
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from notifications.services import notify_user

from .models import Conversation, Message, OrientationRequest, Resource
from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    OrientationRequestSerializer,
    ResourceSerializer,
)

User = get_user_model()


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().order_by("-created_at")
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrientationRequestViewSet(viewsets.ModelViewSet):
    queryset = OrientationRequest.objects.select_related("student", "advisor").all()
    serializer_class = OrientationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save(student=self.request.user)
        advisors = User.objects.filter(role=getattr(User.Roles, "ADVISOR", "advisor"), is_active=True)
        if advisors.exists():
            advisor_load = Counter(
                OrientationRequest.objects.filter(
                    advisor__in=advisors,
                    status__in=[
                        OrientationRequest.Status.PENDING,
                        OrientationRequest.Status.IN_PROGRESS,
                    ],
                ).values_list("advisor_id", flat=True)
            )
            advisor = min(advisors, key=lambda user: advisor_load.get(user.id, 0))
            instance.advisor = advisor
            instance.status = OrientationRequest.Status.IN_PROGRESS
            instance.save(update_fields=["advisor", "status"])
            notify_user(
                recipient=advisor,
                title="Nouvelle demande d'orientation",
                message=f"Une nouvelle demande '{instance.topic}' vous a été assignée.",
                url=f"/orientation/requests/{instance.pk}",
            )

    @action(detail=True, methods=["post"], url_path="assign")
    def assign_advisor(self, request, pk=None):
        orientation_request = self.get_object()
        advisor_id = request.data.get("advisor_id")
        advisor_role = getattr(User.Roles, "ADVISOR", "advisor")

        if advisor_id:
            advisor = User.objects.filter(pk=advisor_id, role=advisor_role).first()
            if not advisor:
                return Response({"detail": "Advisor not found or invalid role."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            advisors = User.objects.filter(role=advisor_role, is_active=True)
            if not advisors.exists():
                return Response({"detail": "No advisors available."}, status=status.HTTP_404_NOT_FOUND)
            advisor_load = Counter(
                OrientationRequest.objects.filter(
                    advisor__in=advisors,
                    status__in=[
                        OrientationRequest.Status.PENDING,
                        OrientationRequest.Status.IN_PROGRESS,
                    ],
                ).values_list("advisor_id", flat=True)
            )
            advisor = min(advisors, key=lambda user: advisor_load.get(user.id, 0))

        orientation_request.advisor = advisor
        orientation_request.status = OrientationRequest.Status.IN_PROGRESS
        orientation_request.save(update_fields=["advisor", "status"])
        notify_user(
            recipient=advisor,
            title="Demande d'orientation assignée",
            message=f"La demande '{orientation_request.topic}' vous a été attribuée.",
            url=f"/orientation/requests/{orientation_request.pk}",
        )
        serializer = self.get_serializer(orientation_request)
        return Response(serializer.data)


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Conversation.objects.prefetch_related("messages").all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Message.objects.select_related("conversation", "author").all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        message = serializer.save(author=self.request.user)
        if message.conversation.request.advisor:
            notify_user(
                recipient=message.conversation.request.advisor,
                title="Nouveau message dans une conversation",
                message=f"Un nouveau message a été déposé pour '{message.conversation.request.topic}'.",
                url=f"/orientation/requests/{message.conversation.request.pk}",
            )
