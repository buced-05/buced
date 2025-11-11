from __future__ import annotations

import math
from statistics import mean
from typing import Any

from django.utils import timezone

from apps.projects.models import Project

from .models import MLModel, PredictionLog


class SentimentAnalysisService:
    """Service d'analyse de sentiment simplifié (plaçeholder)."""

    POSITIVE_WORDS = {"excellent", "génial", "innovant", "impact", "fort", "succès"}
    NEGATIVE_WORDS = {"difficile", "faible", "risque", "problème", "limité"}

    def analyse_comment(self, comment: str) -> dict[str, Any]:
        comment_lower = comment.lower()
        positive_hits = sum(word in comment_lower for word in self.POSITIVE_WORDS)
        negative_hits = sum(word in comment_lower for word in self.NEGATIVE_WORDS)

        if positive_hits > negative_hits:
            label = "positive"
        elif negative_hits > positive_hits:
            label = "negative"
        else:
            label = "neutral"

        score = max(min(positive_hits - negative_hits, 5), -5)
        normalized_score = round((score + 5) * 10, 2)  # 0 - 100
        weight = 1.0 + positive_hits * 0.1
        ai_score = normalized_score

        payload = {
            "label": label,
            "score": normalized_score,
            "weight": round(weight, 2),
            "ai_score": ai_score,
            "metadata": {"positive_hits": positive_hits, "negative_hits": negative_hits},
        }

        self._log_prediction("sentiment", {"comment": comment}, payload)
        return payload

    def _log_prediction(self, model_type: str, input_payload: dict[str, Any], output_payload: dict[str, Any]):
        model = MLModel.objects.filter(model_type=model_type).order_by("-created_at").first()
        PredictionLog.objects.create(
            model=model,
            input_payload=input_payload,
            output_payload=output_payload,
            duration_ms=5,
            success=True,
        )


class ProjectScoringService:
    """Service de scoring IA des projets."""

    CRITERIA_WEIGHTS = {
        "description_quality": 0.2,
        "feasibility": 0.2,
        "innovation": 0.2,
        "impact": 0.2,
        "community_engagement": 0.1,
        "team_profile": 0.1,
    }

    def score_project(self, project: Project) -> dict[str, float]:
        description_quality = min(len(project.description) / 500, 1) * 100
        feasibility = 80 if project.resources_needed else 60
        innovation = 90 if "innovation" in project.description.lower() else 75
        impact = min(len(project.expected_impact) / 400, 1) * 100
        community_engagement = float(project.community_score)
        team_profile = 85 if project.team_members.count() >= 3 else 70

        feature_scores = {
            "description_quality": description_quality,
            "feasibility": feasibility,
            "innovation": innovation,
            "impact": impact,
            "community_engagement": community_engagement,
            "team_profile": team_profile,
        }

        ai_score = sum(feature_scores[key] * weight for key, weight in self.CRITERIA_WEIGHTS.items())
        final_score = round((ai_score * 0.3) + (community_engagement * 0.4) + (project.final_score * 0.3), 2)

        payload = {
            "ai_score": round(ai_score, 2),
            "final_score": round(final_score, 2),
            "features": feature_scores,
        }
        self._log_prediction("scoring", {"project_id": str(project.id)}, payload)
        return payload

    def _log_prediction(self, model_type: str, input_payload: dict[str, Any], output_payload: dict[str, Any]):
        model = MLModel.objects.filter(model_type=model_type).order_by("-created_at").first()
        PredictionLog.objects.create(
            model=model,
            input_payload=input_payload,
            output_payload=output_payload,
            duration_ms=12,
            success=True,
        )


class SpecificationGeneratorService:
    """Génère une structure de spécifications à partir du projet/prototype."""

    def generate(self, prototype) -> dict[str, Any]:
        project = prototype.project
        spec = {
            "generated_at": timezone.now().isoformat(),
            "project_title": project.title,
            "summary": project.description[:280],
            "objectives": project.objectives,
            "deliverables": [
                {"name": "MVP Fonctionnel", "due_in_days": 7},
                {"name": "Documentation Technique", "due_in_days": 10},
            ],
            "technology_stack": ["Django", "React", "PostgreSQL", "Redis"],
            "team": [member.get_full_name() for member in prototype.assigned_team.all()],
        }
        self._log_prediction("scoring", {"prototype_id": str(prototype.id)}, spec)
        return spec

    def _log_prediction(self, model_type: str, input_payload: dict[str, Any], output_payload: dict[str, Any]):
        model = MLModel.objects.filter(model_type=model_type).order_by("-created_at").first()
        PredictionLog.objects.create(
            model=model,
            input_payload=input_payload,
            output_payload=output_payload,
            duration_ms=8,
            success=True,
        )


class RecommendationService:
    """Système de recommandation simple (collaboratif)."""

    def recommend_projects_for_user(self, user) -> list[str]:
        project_ids = list(user.votes.values_list("project_id", flat=True))
        self._log_prediction("recommender", {"user_id": str(user.id)}, {"recommendations": project_ids})
        return project_ids

    def recommend_sponsors_for_project(self, project: Project) -> list[str]:
        sponsors = list(project.sponsorships.values_list("sponsor_id", flat=True))
        self._log_prediction("recommender", {"project_id": str(project.id)}, {"recommendations": sponsors})
        return sponsors

    def _log_prediction(self, model_type: str, input_payload: dict[str, Any], output_payload: dict[str, Any]):
        model = MLModel.objects.filter(model_type=model_type).order_by("-created_at").first()
        PredictionLog.objects.create(
            model=model,
            input_payload=input_payload,
            output_payload=output_payload,
            duration_ms=4,
            success=True,
        )

