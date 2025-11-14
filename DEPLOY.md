# Guide de déploiement en production VPS

Ce guide vous aidera à déployer BUCED sur un serveur VPS en production.

## Prérequis

- Serveur VPS avec Ubuntu 20.04+ ou Debian 11+
- Python 3.11+
- PostgreSQL 14+
- Redis (optionnel, pour Celery)
- Nginx (recommandé)
- Certificat SSL (Let's Encrypt recommandé)

## Installation des dépendances système

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Python et dépendances
sudo apt install -y python3.11 python3.11-venv python3-pip python3-dev

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib libpq-dev

# Installer Redis (optionnel)
sudo apt install -y redis-server

# Installer Nginx
sudo apt install -y nginx

# Installer Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx
```

## Configuration PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE buced_prod;
CREATE USER buced_user WITH PASSWORD 'votre_mot_de_passe_securise';
ALTER ROLE buced_user SET client_encoding TO 'utf8';
ALTER ROLE buced_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE buced_user SET timezone TO 'Africa/Abidjan';
GRANT ALL PRIVILEGES ON DATABASE buced_prod TO buced_user;
\q
```

## Configuration de l'application

```bash
# Cloner ou copier le projet sur le serveur
cd /opt  # ou votre répertoire préféré
git clone <votre-repo> buced
cd buced/backend

# Créer l'environnement virtuel
python3.11 -m venv ../venv
source ../venv/bin/activate

# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.production.example .env
nano .env  # Modifiez avec vos valeurs

# Exécuter le script de configuration
chmod +x scripts/setup_production.sh
./scripts/setup_production.sh

# Déployer l'application
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Configuration Nginx

Créez le fichier `/etc/nginx/sites-available/buced` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection vers HTTPS (après configuration SSL)
    # return 301 https://$server_name$request_uri;

    client_max_body_size 50M;

    location /static/ {
        alias /opt/buced/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /opt/buced/backend/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /opt/buced/frontend/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

Activez la configuration :

```bash
sudo ln -s /etc/nginx/sites-available/buced /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Configuration SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## Service systemd pour Gunicorn/Daphne

Créez `/etc/systemd/system/buced.service` :

```ini
[Unit]
Description=BUCED Django Application
After=network.target postgresql.service redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/buced/backend
Environment="PATH=/opt/buced/venv/bin"
EnvironmentFile=/opt/buced/backend/.env
ExecStart=/opt/buced/venv/bin/daphne -b 127.0.0.1 -p 8000 core.asgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activez et démarrez le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable buced
sudo systemctl start buced
sudo systemctl status buced
```

## Service Celery Worker (optionnel)

Créez `/etc/systemd/system/buced-celery.service` :

```ini
[Unit]
Description=BUCED Celery Worker
After=network.target redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/buced/backend
Environment="PATH=/opt/buced/venv/bin"
EnvironmentFile=/opt/buced/backend/.env
ExecStart=/opt/buced/venv/bin/celery -A core worker --loglevel=info
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## Commandes utiles

```bash
# Voir les logs de l'application
sudo journalctl -u buced -f

# Redémarrer l'application
sudo systemctl restart buced

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Mettre à jour l'application
cd /opt/buced
git pull
cd backend
source ../venv/bin/activate
./scripts/deploy.sh
sudo systemctl restart buced
```

## Sécurité

1. **Changez le SECRET_KEY** dans `.env`
2. **Configurez un firewall** (UFW) :
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. **Désactivez DEBUG** en production (`DJANGO_DEBUG=0`)
4. **Configurez ALLOWED_HOSTS** avec votre domaine
5. **Utilisez HTTPS** avec Let's Encrypt
6. **Limitez les accès PostgreSQL** dans `/etc/postgresql/*/main/pg_hba.conf`

## Monitoring

- Surveillez les logs : `sudo journalctl -u buced -f`
- Surveillez les ressources : `htop`, `df -h`
- Configurez des alertes pour les erreurs critiques

