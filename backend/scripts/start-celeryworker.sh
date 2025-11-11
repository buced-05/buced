#!/usr/bin/env bash
# shellcheck disable=SC2086
set -o errexit
set -o pipefail
set -o nounset

celery -A core worker --loglevel=info
