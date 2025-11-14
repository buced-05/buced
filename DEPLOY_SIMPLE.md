# Guide de déploiement simplifié - VPS

Ce guide évite les conflits de dépendances en installant uniquement les dépendances essentielles.

## Prérequis

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Python et dépendances
sudo apt install -y python3.11 python3.11-venv python3-pip python3-dev

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib libpq-dev

# Installer Nginx (optionnel)
sudo apt install -y nginx
```

## Déploiement rapide

### 1. Configuration PostgreSQL

```bash
sudo -u postgres psql

# Dans PostgreSQL:
CREATE DATABASE buced_prod;
CREATE USER buced_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE buced_prod TO buced_user;
\q
```

### 2. Configuration de l'application

```bash
cd ~/buced/backend

# Créer l'environnement virtuel
python3.11 -m venv ../venv
source ../venv/bin/activate

# Configurer .env
cp .env.production.example .env
nano .env  # Modifiez avec vos valeurs

# Déployer (installe uniquement les dépendances essentielles)
chmod +x scripts/deploy_production.sh
./scripts/deploy_production.sh
```

### 3. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### 4. Démarrer le serveur

```bash
# Option A: Avec Gunicorn (recommandé)
gunicorn core.wsgi:application --config gunicorn_config.py

# Option B: Avec Daphne (pour WebSockets)
daphne -b 127.0.0.1 -p 8000 core.asgi:application
```

## Configuration Nginx (optionnel)

Créez `/etc/nginx/sites-available/buced` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    client_max_body_size 50M;

    location /static/ {
        alias /root/buced/backend/staticfiles/;
    }

    location /media/ {
        alias /root/buced/backend/media/;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /root/buced/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Activez :
```bash
sudo ln -s /etc/nginx/sites-available/buced /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Service systemd

Créez `/etc/systemd/system/buced.service` :

```ini
[Unit]
Description=BUCED Django Application
After=network.target postgresql.service

[Service]
User=root
WorkingDirectory=/root/buced/backend
Environment="PATH=/root/buced/venv/bin"
EnvironmentFile=/root/buced/backend/.env
ExecStart=/root/buced/venv/bin/gunicorn core.wsgi:application --config gunicorn_config.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Activez :
```bash
sudo systemctl daemon-reload
sudo systemctl enable buced
sudo systemctl start buced
```

## Variables d'environnement importantes (.env)

```env
# CRITIQUE - Changez cette clé !
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire

# Production
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=votre-domaine.com,IP_DU_VPS

# Base de données
POSTGRES_HOST=localhost
POSTGRES_DB=buced_prod
POSTGRES_USER=buced_user
POSTGRES_PASSWORD=votre_mot_de_passe

# CORS
DJANGO_CORS_ALLOWED_ORIGINS=https://votre-domaine.com
```

## Résolution des problèmes

### Erreur: "No module named 'channels'"
```bash
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1
```

### Erreur de connexion PostgreSQL
- Vérifiez que PostgreSQL est démarré: `sudo systemctl status postgresql`
- Vérifiez les credentials dans `.env`
- Testez la connexion: `psql -U buced_user -d buced_prod -h localhost`

### Erreur lors des migrations
```bash
# Vérifier la configuration
python manage.py check

# Réessayer les migrations
python manage.py migrate
```

## Commandes utiles

```bash
# Voir les logs
sudo journalctl -u buced -f

# Redémarrer
sudo systemctl restart buced

# Statut
sudo systemctl status buced

# Mettre à jour l'application
cd ~/buced/backend
source ../venv/bin/activate
git pull
./scripts/deploy_production.sh
sudo systemctl restart buced
```

