from __future__ import annotations

import math
from typing import Iterable

import nltk
from celery import shared_task
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Avg
from django.utils import timezone
from nltk.sentiment import SentimentIntensityAnalyzer

from notifications.services import notify_user
from projects.models import Project
from sponsors.models import SponsorProfile
from votes.models import EvaluationResult, Vote

from .models import Recommendation, SentimentAnalysisResult

User = get_user_model()


def _download_vader() -> None:
    try:
        nltk.data.find("sentiment/vader_lexicon.zip")
    except LookupError:
        nltk.download("vader_lexicon")


def _sentiment_label(score: float) -> str:
    if score >= 0.6:
        return "very_positive"
    if score >= 0.2:
        return "positive"
    if score > -0.2:
        return "neutral"
    if score > -0.6:
        return "negative"
    return "very_negative"


def _analyse_sentiments(votes: Iterable[Vote]) -> list[tuple[Vote, str, float]]:
    _download_vader()
    sia = SentimentIntensityAnalyzer()
    analysed = []
    for vote in votes:
        polarity = sia.polarity_scores(vote.comment or "")
        compound = polarity["compound"]
        analysed.append((vote, _sentiment_label(compound), abs(compound)))
    return analysed


@shared_task(bind=True, ignore_result=True)
def run_sentiment_analysis(self, project_id: int) -> None:
    project = Project.objects.filter(pk=project_id).first()
    if not project:
        return
    votes = list(Vote.objects.filter(project=project).order_by("id"))
    if not votes:
        SentimentAnalysisResult.objects.filter(project=project).delete()
        project.ai_score = project.ai_score or 0
        project.save(update_fields=["ai_score", "updated_at"])
        return

    analysed_votes = _analyse_sentiments(votes)
    with transaction.atomic():
        for vote, sentiment, confidence in analysed_votes:
            vote.sentiment = sentiment
            vote.save(update_fields=["sentiment"])
            SentimentAnalysisResult.objects.update_or_create(
                project=project,
                comment_id=vote.pk,
                defaults={"sentiment": sentiment, "confidence": round(confidence, 3)},
            )


def _score_from_length(text: str, *, alpha: float, max_score: float = 100.0) -> float:
    if not text:
        return max_score * 0.2
    words = len(text.split())
    score = min(max_score, math.log(words + 1, 1.5) * alpha)
    return round(score, 2)


@shared_task(bind=True, ignore_result=True)
def update_scoring_metrics(self, project_id: int) -> None:
    project = Project.objects.select_related("evaluation").prefetch_related("votes", "team").filter(pk=project_id).first()
    if not project:
        return

    evaluation, _ = EvaluationResult.objects.get_or_create(project=project)
    votes = project.votes.all()
    vote_data = votes.aggregate(avg_rating=Avg("rating"))
    average_rating = vote_data["avg_rating"] or 0
    community_score = round((average_rating / 5) * 100, 2) if average_rating else 0

    clarity = _score_from_length(project.description, alpha=12)
    feasibility_penalty = len(project.required_resources.splitlines()) if project.required_resources else 0
    feasibility = max(35.0, 95.0 - feasibility_penalty * 5 + project.team.count() * 3)
    feasibility = round(min(feasibility, 100.0), 2)
    innovation = _score_from_length(project.objectives or project.description, alpha=10)
    impact = _score_from_length(project.expected_impact, alpha=14)

    ai_score = round(0.35 * feasibility + 0.3 * innovation + 0.2 * clarity + 0.15 * impact, 2)
    expert_score = round((feasibility + innovation + clarity) / 3, 2)
    impact_score = round(impact, 2)
    final_score = round(
        community_score * 0.4 + ai_score * 0.3 + expert_score * 0.2 + impact_score * 0.1,
        2,
    )

    with transaction.atomic():
        evaluation.feasibility = feasibility
        evaluation.innovation = innovation
        evaluation.impact = impact_score
        evaluation.clarity = clarity
        evaluation.ai_score = ai_score
        evaluation.updated_at = timezone.now()
        evaluation.save()

        project.community_score = community_score
        project.ai_score = ai_score
        project.final_score = final_score
        project.updated_at = timezone.now()
        project.save(update_fields=["community_score", "ai_score", "final_score", "updated_at"])


@shared_task(bind=True, ignore_result=True)
def generate_recommendations(self, user_id: int) -> None:
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return

    interest_categories: list[str] = []
    sponsor_role = None
    if hasattr(User, "Roles"):
        sponsor_role = getattr(User.Roles, "SPONSOR", "sponsor")
    if sponsor_role and user.role == sponsor_role and hasattr(user, "sponsor_profile"):
        sponsor_profile: SponsorProfile = user.sponsor_profile
        interest_categories = [interest.lower() for interest in sponsor_profile.interests or []]

    queryset = Project.objects.exclude(owner=user).order_by("-final_score", "-community_score")
    if interest_categories:
        queryset = queryset.filter(category__in=interest_categories)

    top_projects = list(queryset[:10])
    if not top_projects:
        Recommendation.objects.filter(user=user).delete()
        return

    with transaction.atomic():
        Recommendation.objects.filter(user=user).delete()
        Recommendation.objects.bulk_create(
            [
                Recommendation(
                    user=user,
                    project=project,
                    score=project.final_score or project.community_score,
                )
                for project in top_projects
            ],
            ignore_conflicts=True,
        )

    notify_user(
        recipient=user,
        title="Nouvelles recommandations disponibles",
        message="Nous avons mis à jour les projets qui pourraient vous intéresser.",
        url="/projects/recommended",
    )
