from __future__ import annotations

from django.db import transaction
from django.db.models import Avg, Count, F, Sum
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.ml.services import SentimentAnalysisService
from apps.projects.models import Project

from .models import Vote, VoteSummary
from .serializers import VoteSerializer, VoteSummarySerializer


class VoteViewSet(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Vote.objects.select_related("project", "voter")

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(voter=user)

    def perform_create(self, serializer):
        project = Project.objects.get(id=self.request.data.get("project"))
        sentiment_service = SentimentAnalysisService()
        analysis = sentiment_service.analyse_comment(self.request.data.get("comment", ""))
        with transaction.atomic():
            vote = serializer.save(
                voter=self.request.user,
                sentiment_label=analysis["label"],
                sentiment_score=analysis["score"],
                weight=analysis["weight"],
                ai_score=analysis["ai_score"],
                metadata=analysis["metadata"],
            )
            self._update_summary(project)
        return vote

    def perform_update(self, serializer):
        sentiment_service = SentimentAnalysisService()
        analysis = sentiment_service.analyse_comment(self.request.data.get("comment", ""))
        with transaction.atomic():
            vote = serializer.save(
                sentiment_label=analysis["label"],
                sentiment_score=analysis["score"],
                weight=analysis["weight"],
                ai_score=analysis["ai_score"],
                metadata=analysis["metadata"],
            )
            self._update_summary(vote.project)
        return vote

    def _update_summary(self, project: Project):
        summary, _ = VoteSummary.objects.get_or_create(project=project)
        aggregate = project.votes.aggregate(
            avg=Avg("rating"),
            count=Count("id"),
            weighted_sum=Sum(F("rating") * F("weight")),
            total_weight=Sum("weight"),
        )
        summary.average_rating = aggregate["avg"] or 0
        summary.total_votes = aggregate["count"] or 0
        if aggregate["weighted_sum"] and aggregate["total_weight"]:
            summary.weighted_score = (aggregate["weighted_sum"] / aggregate["total_weight"])
        else:
            summary.weighted_score = summary.average_rating
        summary.save()

        project.community_score = summary.weighted_score
        project.save(update_fields=["community_score"])

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my_votes(self, request):
        queryset = self.get_queryset().filter(voter=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class VoteSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VoteSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = VoteSummary.objects.select_related("project")

