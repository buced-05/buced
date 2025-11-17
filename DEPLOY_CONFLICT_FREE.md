# Guide de Déploiement Sans Conflits sur VPS

Ce guide explique comment éviter et résoudre les conflits lors du déploiement sur VPS.

## 🛡️ Stratégie Anti-Conflits

### Scripts Disponibles

1. **`deploy_vps_safe.sh`** - Déploiement sécurisé avec gestion automatique des conflits (RECOMMANDÉ)
2. **`deploy_vps.sh`** - Déploiement standard avec gestion basique des conflits
3. **`check_conflicts.sh`** - Vérification des conflits avant déploiement
4. **`rollback.sh`** - Restauration d'une sauvegarde précédente

## 🚀 Déploiement Recommandé (Sans Conflits)

### Option 1: Déploiement Sécurisé Automatique (Recommandé)

```bash
# Se connecter au VPS
ssh root@91.108.120.78

# Aller dans le répertoire du projet
cd /root/buced

# Vérifier les conflits avant déploiement (optionnel mais recommandé)
cd backend
./scripts/check_conflicts.sh

# Déploiement sécurisé avec gestion automatique des conflits
./scripts/deploy_vps_safe.sh
```

**Ce script fait automatiquement:**
- ✅ Vérification pré-déploiement
- ✅ Sauvegarde complète avant déploiement
- ✅ Gestion intelligente des conflits Git
- ✅ Résolution automatique des conflits dans les fichiers sûrs
- ✅ Conservation des fichiers critiques (.env, config)
- ✅ Rollback automatique en cas d'erreur

### Option 2: Déploiement Standard

```bash
cd /root/buced/backend
./scripts/deploy_vps.sh
```

## 🔍 Vérification des Conflits

Avant chaque déploiement, vérifiez les conflits potentiels:

```bash
cd /root/buced/backend
./scripts/check_conflicts.sh
```

Ce script vérifie:
- Modifications locales non commitées
- Différences avec origin/main
- Fichiers critiques modifiés
- Conflits de dépendances

## 🔄 Gestion des Conflits

### Conflits Git Automatiques

Le script `deploy_vps_safe.sh` résout automatiquement les conflits dans:

**Fichiers sûrs à écraser** (version distante utilisée):
- `frontend/package.json`
- `frontend/package-lock.json`
- `backend/requirements.txt`
- `backend/requirements-production.txt`

**Fichiers protégés** (version locale conservée):
- `backend/.env`
- Fichiers de configuration

### Résolution Manuelle des Conflits

Si des conflits nécessitent une résolution manuelle:

```bash
cd /root/buced

# Voir les conflits
git status

# Résoudre un fichier spécifique
git checkout --ours <fichier>  # Garder version locale
git checkout --theirs <fichier>  # Prendre version distante

# Après résolution
git add <fichier>
git commit -m "Résolution conflit <fichier>"
```

## 💾 Sauvegardes et Rollback

### Sauvegardes Automatiques

Les scripts créent automatiquement des sauvegardes dans `/root/buced/backups/`:
- `.env`
- Base de données (`db.sqlite3`)
- Fichiers statiques
- État Git

### Restauration d'une Sauvegarde

```bash
cd /root/buced/backend

# Lister les sauvegardes disponibles
./scripts/rollback.sh

# Restaurer une sauvegarde spécifique
./scripts/rollback.sh 20241115_143022
```

## 📋 Checklist Avant Déploiement

- [ ] Vérifier les conflits: `./scripts/check_conflicts.sh`
- [ ] Créer une sauvegarde manuelle si nécessaire
- [ ] Vérifier que `.env` est configuré correctement
- [ ] S'assurer que les modifications locales sont commitées ou stashées
- [ ] Utiliser `deploy_vps_safe.sh` pour un déploiement sécurisé

## ⚠️ Fichiers à Surveiller

Ces fichiers peuvent causer des conflits:

1. **`.env`** - Toujours conservé en version locale
2. **`core/settings.py`** - Peut avoir des modifications locales
3. **`nginx-vps.conf`** - Configuration spécifique au VPS
4. **`requirements*.txt`** - Résolu automatiquement

## 🔧 Résolution des Problèmes Courants

### Problème: "Conflits Git non résolus"

```bash
# Voir les fichiers en conflit
git status

# Résoudre automatiquement avec le script
./scripts/deploy_vps_safe.sh

# Ou résoudre manuellement
git checkout --ours <fichier>
git add <fichier>
git commit -m "Résolution conflit"
```

### Problème: "Erreur lors des migrations"

```bash
# Restaurer la base de données depuis la sauvegarde
cd /root/buced/backend
./scripts/rollback.sh <date_sauvegarde>

# Ou restaurer manuellement
cp backups/YYYYMMDD_HHMMSS/db.sqlite3.backup db.sqlite3
```

### Problème: "Fichiers statiques corrompus"

```bash
cd /root/buced/backend
source venv/bin/activate

# Restaurer depuis la sauvegarde
cp -r backups/YYYYMMDD_HHMMSS/staticfiles.backup staticfiles

# Ou recréer
python manage.py collectstatic --noinput --clear
```

## 📝 Bonnes Pratiques

1. **Toujours utiliser `deploy_vps_safe.sh`** pour les déploiements en production
2. **Vérifier les conflits avant** chaque déploiement avec `check_conflicts.sh`
3. **Créer des sauvegardes** avant les déploiements majeurs
4. **Tester en local** avant de déployer sur le VPS
5. **Committer les modifications** avant de déployer
6. **Documenter les modifications** dans les commits

## 🎯 Workflow Recommandé

```bash
# 1. Vérifier les conflits
./scripts/check_conflicts.sh

# 2. Déployer avec gestion automatique des conflits
./scripts/deploy_vps_safe.sh

# 3. Vérifier que tout fonctionne
curl http://foundation.newtiv.com/api/health/
curl http://91.108.120.78/api/health/

# 4. En cas de problème, rollback
./scripts/rollback.sh <date>
```

## 📞 Support

En cas de conflits non résolus:

1. Vérifiez les logs: `tail -f /var/log/nginx/foundation_error.log`
2. Consultez la sauvegarde: `ls -lt /root/buced/backups/`
3. Restaurez depuis la dernière sauvegarde fonctionnelle
4. Contactez l'équipe de développement si nécessaire

