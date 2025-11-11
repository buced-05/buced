#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

python manage.py collectstatic --noinput
python manage.py migrate --noinput

if [[ -n "${DJANGO_SUPERUSER_EMAIL:-}" && -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]]; then
  python manage.py createsuperuser \
    --noinput \
    --username "${DJANGO_SUPERUSER_USERNAME:-admin}" \
    --email "${DJANGO_SUPERUSER_EMAIL}"
fi

python manage.py runserver 0.0.0.0:8000

