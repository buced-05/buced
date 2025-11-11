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

    @action(detail=False, methods=["get"], url_path="my-votes")
    def my_votes(self, request):
        votes = self.get_queryset().filter(voter=request.user)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)


class EvaluationResultViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = EvaluationResult.objects.select_related("project").all()
    serializer_class = EvaluationResultSerializer
    permission_classes = [permissions.IsAuthenticated]
