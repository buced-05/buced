# Guide de prévention des conflits de déploiement VPS

Ce guide vous aide à éviter les conflits lors du déploiement sur votre VPS.

## 🛡️ Stratégie de prévention

### 1. Utiliser les scripts de déploiement sécurisés

**Toujours utiliser `safe_deploy.sh` au lieu de déployer manuellement:**

```bash
cd ~/buced/backend
chmod +x scripts/safe_deploy.sh scripts/pre_deploy_check.sh
./scripts/safe_deploy.sh
```

Ce script:
- ✅ Vérifie l'environnement avant le déploiement
- ✅ Crée des sauvegardes automatiques
- ✅ Gère les erreurs gracieusement
- ✅ Installe uniquement les dépendances essentielles
- ✅ Évite les conflits de versions

### 2. Vérification pré-déploiement

**Avant chaque déploiement, exécutez:**

```bash
cd ~/buced/backend
./scripts/pre_deploy_check.sh
```

Ce script vérifie:
- ✅ Version de Python (recommandé: 3.11+)
- ✅ Environnement virtuel
- ✅ Configuration .env
- ✅ Dépendances critiques
- ✅ Permissions et espace disque

### 3. Utiliser requirements-production.txt

**Ne jamais installer depuis requirements.txt complet:**

```bash
# ❌ MAUVAIS - peut causer des conflits
pip install -r requirements.txt

# ✅ BON - dépendances essentielles uniquement
pip install -r requirements-production.txt
```

### 4. Configuration .env sécurisée

**Créez un .env basé sur .env.production.example:**

```bash
cd ~/buced/backend
cp .env.production.example .env
nano .env
```

**Variables critiques à configurer:**

```env
# OBLIGATOIRE - Changez cette clé!
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire

# Production
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=votre-domaine.com,91.108.120.78,localhost,127.0.0.1
# Pour foundation.newtiv.com: foundation.newtiv.com,91.108.120.78,localhost,127.0.0.1

# Base de données (optionnel - SQLite par défaut)
POSTGRES_HOST=localhost  # ou laissez vide pour SQLite
POSTGRES_DB=buced_prod
POSTGRES_USER=buced_user
POSTGRES_PASSWORD=votre_mot_de_passe_securise
```

### 5. Installation progressive des dépendances

**Si vous avez des conflits, installez une par une:**

```bash
# Activer venv
source venv/bin/activate

# Django Core (essentiel)
pip install Django==5.0.4
pip install djangorestframework==3.16.1
pip install djangorestframework-simplejwt==5.3.1

# CORS et filtres
pip install django-cors-headers==4.9.0
pip install django-filter==25.1
pip install django-environ==0.11.2

# Base de données
pip install psycopg2-binary==2.9.11

# Utilitaires
pip install python-dotenv==1.0.1
pip install Pillow==10.2.0
pip install whitenoise==6.11.0

# Documentation et serveur
pip install drf-spectacular==0.29.0
pip install gunicorn==21.2.0

# Optionnel - seulement si nécessaire
pip install channels==4.3.1 || echo "Channels optionnel"
pip install celery==5.3.6 || echo "Celery optionnel"
```

### 6. Gestion des dépendances optionnelles

**L'application fonctionne SANS ces dépendances:**

- ❌ **spacy** - Non nécessaire (ML optionnel)
- ❌ **tensorflow** - Non nécessaire (ML optionnel)
- ❌ **torch** - Non nécessaire (ML optionnel)
- ⚠️ **channels** - Optionnel (WebSockets désactivés si absent)
- ⚠️ **celery** - Optionnel (tâches asynchrones désactivées si absent)

**Si vous installez ces dépendances et avez des conflits, ignorez-les simplement.**

### 7. Utiliser Python 3.11 spécifiquement

**Évitez Python 3.13+ qui peut avoir des conflits:**

```bash
# Installer Python 3.11
sudo apt install python3.11 python3.11-venv python3.11-dev

# Créer venv avec Python 3.11
python3.11 -m venv venv
source venv/bin/activate
```

### 8. Base de données: SQLite par défaut

**Pour éviter les conflits PostgreSQL, utilisez SQLite:**

```env
# Dans .env, ne définissez PAS POSTGRES_HOST ou utilisez une valeur invalide
# L'application utilisera SQLite automatiquement
```

SQLite fonctionne parfaitement pour la plupart des cas d'usage et évite les problèmes de connexion PostgreSQL.

### 9. Ordre de déploiement recommandé

```bash
# 1. Vérification
cd ~/buced/backend
./scripts/pre_deploy_check.sh

# 2. Sauvegarde (automatique avec safe_deploy.sh)
# Les sauvegardes sont créées dans backups/

# 3. Déploiement
./scripts/safe_deploy.sh

# 4. Vérification post-déploiement
python manage.py check
python manage.py runserver 0.0.0.0:8000  # Test rapide

# 5. Démarrer en production
gunicorn core.wsgi:application --config gunicorn_config.py
```

### 10. En cas de conflit

**Si vous rencontrez un conflit:**

1. **Arrêtez le processus:**
   ```bash
   # Trouver le processus
   ps aux | grep gunicorn
   
   # Arrêter
   sudo kill -9 <PID>
   ```

2. **Restaurez depuis la sauvegarde:**
   ```bash
   cd ~/buced/backend
   ls backups/  # Voir les sauvegardes disponibles
   cp backups/YYYYMMDD_HHMMSS/.env.backup .env
   ```

3. **Réessayez avec safe_deploy.sh:**
   ```bash
   ./scripts/safe_deploy.sh
   ```

## 📋 Checklist avant déploiement

- [ ] Python 3.11+ installé
- [ ] Environnement virtuel créé et activé
- [ ] Fichier .env configuré avec SECRET_KEY unique
- [ ] DEBUG=0 dans .env
- [ ] Vérification pré-déploiement passée
- [ ] Sauvegarde créée (automatique avec safe_deploy.sh)
- [ ] requirements-production.txt utilisé (pas requirements.txt complet)
- [ ] Migrations testées localement
- [ ] Espace disque suffisant (>1GB)

## 🔧 Commandes rapides

```bash
# Déploiement complet sécurisé
cd ~/buced/backend && ./scripts/safe_deploy.sh

# Vérification uniquement
cd ~/buced/backend && ./scripts/pre_deploy_check.sh

# Installation minimale (sans conflits)
cd ~/buced/backend
source venv/bin/activate
pip install -r requirements-production.txt

# Test rapide
python manage.py check
python manage.py runserver 0.0.0.0:8000

# Tester les URLs importantes
curl http://localhost:8000/api/health/
curl http://localhost:8000/boss/
```

## 🌐 URLs importantes

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

## ⚠️ À éviter absolument

- ❌ Ne jamais installer `requirements.txt` complet sur VPS
- ❌ Ne jamais utiliser Python 3.13+ sans tester d'abord
- ❌ Ne jamais déployer sans sauvegarde
- ❌ Ne jamais laisser DEBUG=1 en production
- ❌ Ne jamais utiliser SECRET_KEY par défaut
- ❌ Ne jamais installer spacy/tensorflow/torch si non nécessaire

## 📞 Support

Si vous rencontrez toujours des conflits après avoir suivi ce guide:

1. Vérifiez les logs: `tail -f logs/django.log`
2. Vérifiez les erreurs: `python manage.py check --deploy`
3. Consultez `TROUBLESHOOTING.md` pour des solutions spécifiques

