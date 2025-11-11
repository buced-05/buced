from django.db.models import Avg
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.utils import timezone

from notifications.services import notify_user

from .models import Vote


def _dispatch_task(task_name: str, *, project_id: int, user_id: int | None = None) -> None:
    from ml import tasks as ml_tasks

    task = getattr(ml_tasks, task_name)
    try:
        if user_id is not None:
            task.delay(user_id=user_id)
        else:
            task.delay(project_id=project_id)
    except Exception:
        if user_id is not None:
            task.apply(kwargs={"user_id": user_id})
        else:
            task.apply(kwargs={"project_id": project_id})


def _recompute_project_scores(project_id: int) -> None:
    from projects.models import Project

    project = Project.objects.get(pk=project_id)
    aggregation = project.votes.aggregate(avg_rating=Avg("rating"))
    average = aggregation["avg_rating"] or 0
    project.community_score = round((average / 5) * 100, 2) if average else 0
    project.updated_at = timezone.now()
    project.save(update_fields=["community_score", "updated_at"])

    _dispatch_task("run_sentiment_analysis", project_id=project_id)
    _dispatch_task("update_scoring_metrics", project_id=project_id)


@receiver(post_save, sender=Vote)
def handle_vote_save(sender, instance: Vote, created: bool, **kwargs) -> None:
    _recompute_project_scores(project_id=instance.project_id)
    if created:
        owner = instance.project.owner
        if owner != instance.voter:
            notify_user(
                recipient=owner,
                title="Nouveau vote",
                message=f"{instance.voter.get_full_name() or instance.voter.username} a évalué votre projet.",
                url=f"/projects/{instance.project_id}",
            )


@receiver(post_delete, sender=Vote)
def handle_vote_delete(sender, instance: Vote, **kwargs) -> None:
    _recompute_project_scores(project_id=instance.project_id)
