from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import EvaluationResult, Vote
from .serializers import EvaluationResultSerializer, VoteSerializer


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.select_related("voter", "project").all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(voter=self.request.user)

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        try:
            queryset = super().get_queryset()
            # For list view, show all votes (needed for project detail pages)
            # For detail/update/delete, permissions are checked in perform_destroy
            return queryset
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error getting votes queryset: {e}")
            # Return empty queryset if there's a database error
            return Vote.objects.none()

    def perform_destroy(self, instance):
        """Only allow users to delete their own votes"""
        if instance.voter != self.request.user and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own votes.")
        instance.delete()

    @action(detail=False, methods=["get"], url_path="my-votes")
    def my_votes(self, request):
        votes = self.get_queryset().filter(voter=request.user)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)


class EvaluationResultViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = EvaluationResult.objects.select_related("project").all()
    serializer_class = EvaluationResultSerializer
    permission_classes = [permissions.IsAuthenticated]
