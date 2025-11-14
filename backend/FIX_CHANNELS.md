# Correction de l'erreur "No module named 'channels'"

## Solution rapide

Sur votre VPS, exécutez :

```bash
cd ~/buced/backend
source ../venv/bin/activate

# Installer channels et dépendances
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1

# Vérifier l'installation
python manage.py check
```

## Installation complète des dépendances essentielles

Si vous voulez installer toutes les dépendances essentielles d'un coup :

```bash
pip install \
    Django==5.0.4 \
    djangorestframework==3.16.1 \
    djangorestframework-simplejwt==5.3.1 \
    django-cors-headers==4.9.0 \
    django-filter==25.1 \
    django-environ==0.11.2 \
    psycopg2-binary==2.9.11 \
    channels==4.3.1 \
    channels-redis==4.1.0 \
    daphne==4.2.1 \
    celery==5.3.6 \
    django-celery-beat==2.6.0 \
    django-celery-results==2.5.1 \
    redis==7.0.1 \
    python-dotenv==1.0.1 \
    Pillow==10.2.0 \
    whitenoise==6.11.0 \
    drf-spectacular==0.29.0 \
    gunicorn==21.2.0
```

## Après l'installation

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver 0.0.0.0:8000
```

