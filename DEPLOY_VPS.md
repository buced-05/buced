# Guide de Déploiement VPS

Ce guide explique comment déployer BUCED sur un VPS sans conflits.

## 📋 Prérequis

- VPS avec Ubuntu/Debian
- Accès root ou sudo
- Git installé
- Python 3.11+
- Node.js 18+
- Nginx installé
- PostgreSQL (optionnel, SQLite par défaut)

## 🚀 Déploiement Rapide

### 1. Cloner le projet

```bash
cd /root
git clone https://github.com/buced-05/buced.git
cd buced
```

### 2. Configuration Backend

```bash
cd backend

# Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Copier le fichier d'environnement
cp ../infra/env.vps.example .env

# Éditer .env avec vos valeurs
nano .env
```

**Important**: Modifiez au minimum:
- `SECRET_KEY` (générez une clé sécurisée)
- `POSTGRES_PASSWORD` (si vous utilisez PostgreSQL)
- `DJANGO_ALLOWED_HOSTS` (déjà configuré pour foundation.newtiv.com)

### 3. Installer les dépendances Backend

```bash
pip install --upgrade pip
pip install -r requirements-production.txt
# ou requirements.txt si requirements-production.txt n'existe pas
```

### 4. Configuration Django

```bash
# Migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic --noinput
```

### 5. Configuration Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Build pour production
npm run build
```

### 6. Configuration Nginx

```bash
# Copier la configuration
sudo cp ../infra/nginx-vps.conf /etc/nginx/sites-available/foundation.newtiv.com

# Activer le site
sudo ln -s /etc/nginx/sites-available/foundation.newtiv.com /etc/nginx/sites-enabled/

# Supprimer la config par défaut si nécessaire
sudo rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 7. Démarrer le Backend

```bash
cd /root/buced/backend
source venv/bin/activate

# Démarrer Gunicorn en arrière-plan
gunicorn core.wsgi:application --config gunicorn_config.py --daemon

# Ou utiliser le script de démarrage
./start.sh
```

## 🔄 Déploiement Automatique

Utilisez le script de déploiement automatique:

```bash
cd /root/buced
chmod +x backend/scripts/deploy_vps.sh
./backend/scripts/deploy_vps.sh
```

Ce script:
- ✅ Met à jour le code depuis Git
- ✅ Résout automatiquement les conflits
- ✅ Configure le backend
- ✅ Build le frontend
- ✅ Configure Nginx
- ✅ Redémarre les services

## 🌐 URLs

Après le déploiement:

- **Frontend**: http://foundation.newtiv.com
- **API**: http://foundation.newtiv.com/api
- **Admin Panel**: http://foundation.newtiv.com/boss
- **API Health**: http://foundation.newtiv.com/api/health/

## 🔧 Configuration DNS

Assurez-vous que votre DNS pointe vers l'IP du VPS:

```
Type: A
Name: foundation
Value: 91.108.120.78
TTL: 3600
```

## 🔍 Vérification

```bash
# Tester le frontend
curl http://foundation.newtiv.com

# Tester l'API
curl http://foundation.newtiv.com/api/health/

# Vérifier les logs
sudo tail -f /var/log/nginx/foundation_error.log
sudo tail -f /var/log/nginx/foundation_access.log
```

## 🛠️ Dépannage

### Problème: ERR_CONNECTION_REFUSED

1. Vérifier que Nginx est actif: `sudo systemctl status nginx`
2. Vérifier que Gunicorn est actif: `ps aux | grep gunicorn`
3. Vérifier les ports: `sudo netstat -tlnp | grep :80`

### Problème: 502 Bad Gateway

1. Vérifier que Gunicorn écoute sur 127.0.0.1:8000
2. Vérifier les logs Nginx: `sudo tail -f /var/log/nginx/foundation_error.log`
3. Redémarrer Gunicorn

### Problème: Conflits Git

Le script `deploy_vps.sh` gère automatiquement les conflits avec `git stash` et `git pull`.

## 📝 Notes

- Le panel admin est accessible à `/boss` pour éviter les conflits
- L'IP publique (91.108.120.78) est automatiquement acceptée
- Les fichiers statiques sont servis par Nginx (pas Django)
- Le frontend est servi depuis `/root/buced/frontend/dist`

## 🔐 Sécurité

Pour activer HTTPS avec Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d foundation.newtiv.com
```

Puis modifiez `.env`:
```
SECURE_SSL_REDIRECT=1
```

Et redéployez.

