# Démarrage rapide - Production VPS

## 1. Configuration initiale

```bash
cd backend

# Créer le fichier .env
cp .env.production.example .env
nano .env  # Modifiez avec vos valeurs

# Configurer l'environnement
chmod +x scripts/setup_production.sh
./scripts/setup_production.sh
```

## 2. Configuration PostgreSQL

```bash
sudo -u postgres psql

# Dans PostgreSQL:
CREATE DATABASE buced_prod;
CREATE USER buced_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE buced_prod TO buced_user;
\q
```

## 3. Déploiement

```bash
# Activer l'environnement virtuel
source ../venv/bin/activate

# Déployer
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Créer un superutilisateur
python manage.py createsuperuser
```

## 4. Démarrer le serveur

### Option A: Avec Gunicorn (recommandé pour production)

```bash
gunicorn core.wsgi:application --config gunicorn_config.py
```

### Option B: Avec Daphne (pour WebSockets)

```bash
daphne -b 127.0.0.1 -p 8000 core.asgi:application
```

### Option C: Service systemd

Créez `/etc/systemd/system/buced.service` :

```ini
[Unit]
Description=BUCED Django Application
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/buced/backend
Environment="PATH=/opt/buced/venv/bin"
EnvironmentFile=/opt/buced/backend/.env
ExecStart=/opt/buced/venv/bin/gunicorn core.wsgi:application --config gunicorn_config.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Puis :
```bash
sudo systemctl daemon-reload
sudo systemctl enable buced
sudo systemctl start buced
```

## 5. Configuration Nginx

Voir `DEPLOY.md` pour la configuration complète Nginx.

**Important**: Le panel administrateur Django est accessible à `/boss/` pour éviter les conflits avec le frontend.
Vous pouvez aussi utiliser `/admin/` qui redirige automatiquement vers `/boss/`.

## Variables d'environnement importantes (.env)

```env
# OBLIGATOIRE - Changez cette clé !
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire

# Production
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=votre-domaine.com,91.108.120.78,localhost,127.0.0.1
# Pour foundation.newtiv.com: foundation.newtiv.com,91.108.120.78,localhost,127.0.0.1

# Base de données
POSTGRES_HOST=localhost
POSTGRES_DB=buced_prod
POSTGRES_USER=buced_user
POSTGRES_PASSWORD=votre_mot_de_passe

# CORS (si frontend sur domaine différent)
DJANGO_CORS_ALLOWED_ORIGINS=https://votre-domaine.com,http://91.108.120.78
# Pour foundation.newtiv.com: http://foundation.newtiv.com,https://foundation.newtiv.com,http://91.108.120.78,https://91.108.120.78
```

## Vérification

```bash
# Vérifier la configuration
python manage.py check --deploy

# Tester le serveur
curl http://localhost:8000/api/health/

# Tester le panel admin (après création du superutilisateur)
curl http://localhost:8000/boss/
```

## URLs disponibles

- **API**: http://localhost:8000/api/v1/
- **Panel Admin**: http://localhost:8000/boss/ (ou http://localhost:8000/admin/)
- **API Health**: http://localhost:8000/api/health/
- **Documentation**: http://localhost:8000/api/docs/swagger/

## Commandes utiles

```bash
# Logs
sudo journalctl -u buced -f

# Redémarrer
sudo systemctl restart buced

# Statut
sudo systemctl status buced
```

