from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from votes.models import EvaluationResult

from .models import Project


def _dispatch_scoring(project_id: int) -> None:
    from ml.tasks import update_scoring_metrics

    try:
        update_scoring_metrics.delay(project_id=project_id)
    except Exception:
        update_scoring_metrics.apply(args=(project_id,))


@receiver(post_save, sender=Project)
def ensure_evaluation(sender, instance: Project, created: bool, **kwargs) -> None:
    if created:
        EvaluationResult.objects.get_or_create(project=instance)
    _dispatch_scoring(project_id=instance.pk)


@receiver(m2m_changed, sender=Project.team.through)
def project_team_changed(sender, instance: Project, action: str, **kwargs) -> None:
    if action in {"post_add", "post_remove", "post_clear"}:
        _dispatch_scoring(project_id=instance.pk)
