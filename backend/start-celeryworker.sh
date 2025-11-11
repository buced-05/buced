#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

celery --app=core worker --loglevel=info --concurrency="${CELERY_CONCURRENCY:-4}"

