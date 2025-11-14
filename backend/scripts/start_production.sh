#!/bin/bash
# Script de démarrage pour production avec Gunicorn

set -e

# Activer l'environnement virtuel si disponible
if [ -d "../venv" ]; then
    source ../venv/bin/activate
fi

# Exécuter les migrations
python manage.py migrate --noinput

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Démarrer Gunicorn
exec gunicorn core.wsgi:application \
    --config gunicorn_config.py \
    --bind 0.0.0.0:8000 \
    --access-logfile - \
    --error-logfile -

