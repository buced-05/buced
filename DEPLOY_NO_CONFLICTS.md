# Guide de déploiement SANS CONFLITS - VPS

Ce guide évite tous les conflits en installant uniquement les dépendances essentielles, une par une.

## 🚀 Déploiement en 5 étapes

### Étape 1: Préparation

```bash
cd ~/buced/backend

# Créer venv avec Python 3.11 (évite les conflits avec Python 3.13)
python3.11 -m venv ../venv
source ../venv/bin/activate

# Mettre à jour pip
pip install --upgrade pip setuptools wheel
```

### Étape 2: Installation des dépendances (UNE PAR UNE)

```bash
# Django Core
pip install Django==5.0.4
pip install djangorestframework==3.16.1
pip install djangorestframework-simplejwt==5.3.1

# CORS et filtres
pip install django-cors-headers==4.9.0
pip install django-filter==25.1
pip install django-environ==0.11.2

# Base de données
pip install psycopg2-binary==2.9.11

# Channels (optionnel - peut être ignoré)
pip install channels==4.3.1 || echo "Channels optionnel"
pip install channels-redis==4.1.0 || echo "Channels-redis optionnel"
pip install daphne==4.2.1 || echo "Daphne optionnel"

# Celery (optionnel)
pip install celery==5.3.6 || echo "Celery optionnel"
pip install django-celery-beat==2.6.0 || echo "Celery-beat optionnel"
pip install django-celery-results==2.5.1 || echo "Celery-results optionnel"
pip install redis==7.0.1 || echo "Redis optionnel"

# Utilitaires
pip install python-dotenv==1.0.1
pip install Pillow==10.2.0
pip install whitenoise==6.11.0

# Documentation API
pip install drf-spectacular==0.29.0

# Serveur WSGI
pip install gunicorn==21.2.0
```

### Étape 3: Configuration

```bash
# Créer .env
cp .env.production.example .env
nano .env  # Modifier avec vos valeurs

# IMPORTANT: Pour éviter les conflits PostgreSQL, utilisez SQLite temporairement:
# Ne définissez pas POSTGRES_HOST ou utilisez une valeur invalide
# L'application utilisera SQLite automatiquement
```

### Étape 4: Déploiement

```bash
# Utiliser le script de déploiement
chmod +x scripts/deploy_production.sh
./scripts/deploy_production.sh

# OU manuellement:
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### Étape 5: Démarrer

```bash
# Avec Gunicorn (recommandé)
gunicorn core.wsgi:application --config gunicorn_config.py

# OU avec runserver (développement)
python manage.py runserver 0.0.0.0:8000
```

## ✅ Vérification

```bash
# Vérifier que tout fonctionne
python manage.py check

# Tester l'API
curl http://localhost:8000/api/health/

# Tester le panel admin
curl http://localhost:8000/boss/
```

## 🌐 URLs disponibles

Après le déploiement :

- **API**: http://localhost:8000/api/v1/
- **Panel Admin**: http://localhost:8000/boss/ (ou http://localhost:8000/admin/ qui redirige)
- **API Health**: http://localhost:8000/api/health/
- **Documentation**: http://localhost:8000/api/docs/swagger/

En production avec domaine :
- **Frontend**: http://votre-domaine.com (ou http://91.108.120.78)
- **API**: http://votre-domaine.com/api (ou http://91.108.120.78/api)
- **Panel Admin**: http://votre-domaine.com/boss/ (ou http://91.108.120.78/boss/)

**Production VPS**:
- **Domaine**: foundation.newtiv.com
- **IP Publique**: 91.108.120.78
- **SSH**: `ssh root@91.108.120.78`

## 🔧 Si vous avez des erreurs

1. **"No module named 'X'"**: Installez le module manquant avec `pip install X`
2. **Erreur PostgreSQL**: Utilisez SQLite temporairement (ne définissez pas POSTGRES_HOST)
3. **Erreur channels**: Ignorez-le, l'application fonctionnera sans WebSockets
4. **Conflits de versions**: Utilisez Python 3.11 au lieu de 3.13

## 📝 Notes importantes

- **Ne pas installer spacy/tensorflow/torch** pour éviter les conflits
- **Channels est optionnel** - l'application fonctionne sans WebSockets
- **Celery est optionnel** - les tâches asynchrones peuvent être désactivées
- **SQLite fonctionne** pour démarrer rapidement, migrez vers PostgreSQL plus tard

## 🎯 Déploiement minimal (sans aucune dépendance optionnelle)

```bash
# Seulement Django et REST Framework
pip install Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1
pip install django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2
pip install psycopg2-binary==2.9.11 python-dotenv==1.0.1 Pillow==10.2.0
pip install whitenoise==6.11.0 drf-spectacular==0.29.0 gunicorn==21.2.0

# Configurer et déployer
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn core.wsgi:application --config gunicorn_config.py
```

