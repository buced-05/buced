from __future__ import annotations

import os
from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    SECRET_KEY=(str, "django-insecure-change-me"),
    POSTGRES_DB=(str, "clubs"),
    POSTGRES_USER=(str, "clubs_user"),
    POSTGRES_PASSWORD=(str, "clubs_password"),
    POSTGRES_HOST=(str, "postgres"),
    POSTGRES_PORT=(int, 5432),
    REDIS_URL=(str, "redis://redis:6379/0"),
    DJANGO_ALLOWED_HOSTS=(list, ["*"]),
    CORS_ALLOWED_ORIGINS=(list, []),
    SECURE_SSL_REDIRECT=(bool, False),
)

environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DJANGO_DEBUG")

# Sécurité en production (sera configuré après CORS_ALLOWED_ORIGINS)
SECURE_SSL_REDIRECT = False

# Configuration des domaines autorisés pour VPS
ALLOWED_HOSTS_ENV = env("DJANGO_ALLOWED_HOSTS")
if isinstance(ALLOWED_HOSTS_ENV, str):
    # Si c'est une chaîne, la convertir en liste
    ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_ENV.split(",") if host.strip()]
else:
    ALLOWED_HOSTS = ALLOWED_HOSTS_ENV if isinstance(ALLOWED_HOSTS_ENV, list) else ["*"]

# Ajouter automatiquement le domaine et l'IP en production
if not DEBUG:
    # Domaines par défaut pour production VPS
    default_hosts = [
        "foundation.newtiv.com",
        "91.108.120.78",
        "localhost",
        "127.0.0.1",
    ]
    for host in default_hosts:
        if host not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(host)

SITE_ID = 1

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Third party
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
]

# Ajouter channels seulement s'il est installé (évite les conflits)
try:
    import channels
    INSTALLED_APPS.append("channels")
except ImportError:
    pass

INSTALLED_APPS += [
    # Project apps
    "apps.common",
    "apps.users",
    "apps.orientation",
    "apps.projects",
    "apps.votes",
    "apps.prototyping",
    "apps.sponsors",
    "apps.accompaniment",
    "apps.notifications",
    "apps.ml",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# ASGI seulement si channels est installé
try:
    import channels
    ASGI_APPLICATION = "core.asgi.application"
except ImportError:
    ASGI_APPLICATION = None

# Configuration de la base de données
# Utilise SQLite par défaut si POSTGRES_HOST n'est pas configuré ou est "postgres" (Docker)
# Pour utiliser PostgreSQL, définissez POSTGRES_HOST dans votre fichier .env
# En production VPS, utilisez "localhost" pour PostgreSQL local
POSTGRES_HOST = env("POSTGRES_HOST")
USE_POSTGRES = POSTGRES_HOST and POSTGRES_HOST != "postgres"

# En production, forcer PostgreSQL si DEBUG=False et POSTGRES_HOST est défini
if not DEBUG and POSTGRES_HOST and POSTGRES_HOST != "postgres":
    USE_POSTGRES = True

if USE_POSTGRES:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("POSTGRES_DB"),
            "USER": env("POSTGRES_USER"),
            "PASSWORD": env("POSTGRES_PASSWORD"),
            "HOST": POSTGRES_HOST,
            "PORT": env("POSTGRES_PORT"),
        }
    }
else:
    # Utiliser SQLite pour le développement local
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Abidjan"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
        "rest_framework.filters.SearchFilter",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Bureau des Clubs Educatifs API",
    "DESCRIPTION": "API pour la plateforme d'innovation éducative ivoirienne.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# Configuration CORS pour VPS
CORS_ALLOWED_ORIGINS_ENV = env("CORS_ALLOWED_ORIGINS")
if CORS_ALLOWED_ORIGINS_ENV:
    if isinstance(CORS_ALLOWED_ORIGINS_ENV, str):
        CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_ENV.split(",") if origin.strip()]
    else:
        CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_ENV if isinstance(CORS_ALLOWED_ORIGINS_ENV, list) else []
else:
    CORS_ALLOWED_ORIGINS = []

# Ajouter les origines par défaut pour production VPS
if not DEBUG:
    default_origins = [
        "http://foundation.newtiv.com",
        "https://foundation.newtiv.com",
        "http://91.108.120.78",
        "https://91.108.120.78",
    ]
    for origin in default_origins:
        if origin not in CORS_ALLOWED_ORIGINS:
            CORS_ALLOWED_ORIGINS.append(origin)

CORS_ALLOW_ALL_ORIGINS = DEBUG or len(CORS_ALLOWED_ORIGINS) == 0
CORS_ALLOW_CREDENTIALS = True

# Configuration de sécurité en production (après CORS_ALLOWED_ORIGINS)
if not DEBUG:
    # HTTPS uniquement si SSL est activé (via Nginx)
    SECURE_SSL_REDIRECT = env("SECURE_SSL_REDIRECT", default=False, cast=bool)
    # Désactiver les cookies sécurisés si pas de HTTPS pour éviter les conflits
    SESSION_COOKIE_SECURE = SECURE_SSL_REDIRECT
    CSRF_COOKIE_SECURE = SECURE_SSL_REDIRECT
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
    # HSTS seulement si HTTPS est activé
    if SECURE_SSL_REDIRECT:
        SECURE_HSTS_SECONDS = 31536000  # 1 an
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True
    
    # Configuration pour être derrière un proxy Nginx
    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https') if SECURE_SSL_REDIRECT else None
    
    # CSRF trusted origins (copie de CORS_ALLOWED_ORIGINS)
    CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy() if CORS_ALLOWED_ORIGINS else []

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Configuration Channels (WebSockets) - optionnel si Redis n'est pas disponible
try:
    import channels_redis  # type: ignore
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [env("REDIS_URL")],
            },
        },
    }
except ImportError:
    # Fallback vers InMemoryChannelLayer si channels-redis n'est pas installé
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        },
    }

# Configuration Celery (optionnel - seulement si installé)
try:
    import celery
    CELERY_BROKER_URL = env("REDIS_URL")
    CELERY_RESULT_BACKEND = env("REDIS_URL")
    CELERY_ACCEPT_CONTENT = ["json"]
    CELERY_TASK_SERIALIZER = "json"
    CELERY_RESULT_SERIALIZER = "json"
    CELERY_TIMEZONE = TIME_ZONE
except ImportError:
    # Celery non installé - désactiver les tâches asynchrones
    CELERY_BROKER_URL = None
    CELERY_RESULT_BACKEND = None

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{levelname}] {asctime} {name}: {message}",
            "style": "{",
        },
        "simple": {
            "format": "[{levelname}] {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024  # 20MB
FILE_UPLOAD_PERMISSIONS = 0o644

