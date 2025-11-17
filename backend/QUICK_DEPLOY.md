# 🚀 Déploiement rapide sans conflits - VPS

## Commande unique pour déployer

```bash
cd ~/buced/backend && chmod +x scripts/*.sh && ./scripts/safe_deploy.sh
```

## Étapes détaillées

### 1. Préparation (première fois uniquement)

```bash
cd ~/buced/backend

# Créer venv avec Python 3.11
python3.11 -m venv ../venv
source ../venv/bin/activate

# Configurer .env
cp .env.production.example .env
nano .env  # Modifiez SECRET_KEY et autres variables
```

### 2. Vérification pré-déploiement

```bash
chmod +x scripts/pre_deploy_check.sh
./scripts/pre_deploy_check.sh
```

### 3. Déploiement sécurisé

```bash
chmod +x scripts/safe_deploy.sh
./scripts/safe_deploy.sh
```

### 4. Démarrer le serveur

```bash
# Avec Gunicorn (recommandé)
gunicorn core.wsgi:application --config gunicorn_config.py

# OU avec runserver (test)
python manage.py runserver 0.0.0.0:8000
```

## 🔄 Mise à jour (déploiements suivants)

```bash
cd ~/buced/backend
source ../venv/bin/activate
./scripts/safe_deploy.sh
```

## ⚠️ En cas d'erreur

Les sauvegardes sont automatiquement créées dans `backups/`. Pour restaurer:

```bash
cd ~/buced/backend
ls backups/  # Voir les sauvegardes
cp backups/YYYYMMDD_HHMMSS/.env.backup .env
```

## 📋 Checklist rapide

- [ ] Python 3.11+ installé
- [ ] venv créé et activé
- [ ] .env configuré (SECRET_KEY unique, DEBUG=0)
- [ ] Scripts exécutables (chmod +x)
- [ ] Vérification passée (pre_deploy_check.sh)
- [ ] Déploiement réussi (safe_deploy.sh)
- [ ] Superutilisateur créé (`python manage.py createsuperuser`)

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

