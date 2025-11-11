#!/usr/bin/env bash
# shellcheck disable=SC2086
set -o errexit
set -o pipefail
set -o nounset

python manage.py migrate --noinput
python manage.py collectstatic --noinput

daphne -b 0.0.0.0 -p 8000 core.asgi:application
