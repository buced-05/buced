from django.apps import AppConfig


class VotesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "votes"
    verbose_name = "Votes et Évaluations"

    def ready(self) -> None:
        from . import signals  # noqa: F401
