#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

celery --app=core beat --loglevel=info

