# Guide de résolution des problèmes de déploiement

## Problèmes courants et solutions

### 1. Conflits de dépendances Python

**Symptôme**: Erreurs lors de `pip install`, conflits de versions

**Solution**:
```bash
# Utiliser requirements-production.txt (sans ML)
pip install -r requirements-production.txt

# Ou installer uniquement les dépendances essentielles
pip install Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1
pip install django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2
pip install psycopg2-binary==2.9.11
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1
pip install celery==5.3.6 django-celery-beat==2.6.0 django-celery-results==2.5.1 redis==7.0.1
pip install python-dotenv==1.0.1 Pillow==10.2.0 whitenoise==6.11.0
pip install drf-spectacular==0.29.0 gunicorn==21.2.0
```

### 2. Erreur "No module named 'channels'"

**Solution**:
```bash
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1
```

**Note**: Si channels n'est pas installé, l'application fonctionnera quand même (WebSockets désactivés).

### 3. Erreur de connexion PostgreSQL

**Vérifications**:
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Tester la connexion
psql -U buced_user -d buced_prod -h localhost

# Vérifier le fichier .env
cat .env | grep POSTGRES
```

**Solution**: Utiliser SQLite temporairement en production si PostgreSQL pose problème:
```env
# Dans .env, ne pas définir POSTGRES_HOST ou utiliser une valeur invalide
# L'application utilisera SQLite automatiquement
```

### 4. Erreur lors des migrations

**Solution**:
```bash
# Vérifier la configuration
python manage.py check

# Réessayer avec verbose
python manage.py migrate --verbosity=2

# Si erreur de base de données, réinitialiser (ATTENTION: perte de données)
# python manage.py flush
# python manage.py migrate
```

### 5. Erreur "ModuleNotFoundError" pour les apps

**Solution**: Vérifier que les imports dans `core/settings.py` utilisent `apps.`:
```python
INSTALLED_APPS = [
    ...
    "apps.users",  # Pas "users"
    "apps.projects",  # Pas "projects"
    ...
]
```

### 6. Conflits de versions Python

**Symptôme**: Erreurs avec Python 3.13 ou versions récentes

**Solution**: Utiliser Python 3.11 spécifiquement:
```bash
# Installer Python 3.11
sudo apt install python3.11 python3.11-venv python3.11-dev

# Créer venv avec Python 3.11
python3.11 -m venv venv
source venv/bin/activate
```

### 7. Problèmes avec spacy/tensorflow/torch

**Solution**: Ignorer ces dépendances pour l'instant:
```bash
# Ne pas installer les dépendances ML
# L'application fonctionnera sans elles
# Installer seulement les dépendances essentielles
pip install -r requirements-production.txt
```

### 8. Erreur package.json dupliqué

**Solution**:
```bash
cd frontend

# Vérifier le fichier
cat package.json | python3 -m json.tool

# Si erreur, recréer le fichier
./fix-package-json.sh
# Ou utiliser le contenu de BUILD_PRODUCTION.md
```

### 9. Problèmes de permissions

**Solution**:
```bash
# Donner les bonnes permissions
chmod 755 media staticfiles logs
chown -R www-data:www-data media staticfiles  # Si utilise www-data
```

### 10. Port déjà utilisé

**Solution**:
```bash
# Vérifier quel processus utilise le port 8000
sudo lsof -i :8000

# Tuer le processus si nécessaire
sudo kill -9 <PID>

# Ou utiliser un autre port
python manage.py runserver 0.0.0.0:8001
```

## Déploiement minimal (sans conflits)

Pour éviter tous les conflits, utilisez cette approche minimale:

```bash
# 1. Créer venv avec Python 3.11
python3.11 -m venv venv
source venv/bin/activate

# 2. Installer uniquement les dépendances essentielles
pip install Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1
pip install django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2
pip install psycopg2-binary==2.9.11
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1
pip install celery==5.3.6 django-celery-beat==2.6.0 django-celery-results==2.5.1 redis==7.0.1
pip install python-dotenv==1.0.1 Pillow==10.2.0 whitenoise==6.11.0
pip install drf-spectacular==0.29.0 gunicorn==21.2.0

# 3. Configurer .env
cp .env.production.example .env
nano .env

# 4. Déployer
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

# 5. Démarrer
gunicorn core.wsgi:application --config gunicorn_config.py
```

## Vérification finale

```bash
# Vérifier que tout fonctionne
python manage.py check --deploy

# Tester l'API
curl http://localhost:8000/api/health/

# Tester le panel admin
curl http://localhost:8000/boss/

# Vérifier les logs
tail -f logs/django.log  # Si configuré
```

## URLs importantes

Après le déploiement, les URLs suivantes sont disponibles :

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

