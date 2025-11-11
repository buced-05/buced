from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.services import notify_user
from projects.models import Project

from .models import SponsorProfile, Sponsorship


def _trigger_recommendations(user_id: int) -> None:
    from ml.tasks import generate_recommendations

    try:
        generate_recommendations.delay(user_id=user_id)
    except Exception:
        generate_recommendations.apply(kwargs={"user_id": user_id})


@receiver(post_save, sender=SponsorProfile)
def refresh_recommendations_for_sponsor(sender, instance: SponsorProfile, created: bool, **kwargs) -> None:
    _trigger_recommendations(user_id=instance.user_id)


@receiver(post_save, sender=Sponsorship)
def notify_sponsorship(sender, instance: Sponsorship, created: bool, **kwargs) -> None:
    project: Project = instance.project
    notify_user(
        recipient=project.owner,
        title="Nouveau soutien",
        message=f"{instance.sponsor.company} soutient désormais votre projet à hauteur de {instance.amount}.",
        url=f"/projects/{project.pk}",
    )
    _trigger_recommendations(user_id=instance.sponsor.user_id)
