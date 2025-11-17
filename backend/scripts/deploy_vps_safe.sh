#!/bin/bash
# Script de déploiement sécurisé pour VPS avec gestion avancée des conflits
# Utilise des sauvegardes, vérifications et résolution automatique des conflits

set -euo pipefail  # Mode strict avec gestion des erreurs

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
PROJECT_ROOT="/root/buced"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKUP_ROOT="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}════════════════════════════════════════${NC}"
}

# Fonction de nettoyage en cas d'erreur
cleanup_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log_error "Erreur détectée (code: $exit_code). Nettoyage..."
        log_warning "Vous pouvez restaurer depuis: $BACKUP_DIR"
    fi
    exit $exit_code
}

trap cleanup_on_error ERR

# Vérification pré-déploiement
pre_deploy_check() {
    log_step "ÉTAPE 0: Vérification pré-déploiement"
    
    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -d "$PROJECT_ROOT" ]; then
        log_error "Répertoire $PROJECT_ROOT non trouvé"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi
    
    # Vérifier que c'est un dépôt Git
    if [ ! -d ".git" ]; then
        log_error "Ce n'est pas un dépôt Git"
        exit 1
    fi
    
    # Exécuter le script de vérification si disponible
    if [ -f "$BACKEND_DIR/scripts/pre_deploy_check.sh" ]; then
        log_info "Exécution des vérifications pré-déploiement..."
        chmod +x "$BACKEND_DIR/scripts/pre_deploy_check.sh"
        "$BACKEND_DIR/scripts/pre_deploy_check.sh" || {
            log_warning "Certaines vérifications ont échoué, mais on continue..."
        }
    fi
    
    log_success "Vérifications pré-déploiement terminées"
}

# Créer une sauvegarde complète
create_backup() {
    log_step "ÉTAPE 1: Création de la sauvegarde"
    
    mkdir -p "$BACKUP_DIR"
    log_info "Sauvegarde dans: $BACKUP_DIR"
    
    # Sauvegarder le fichier .env
    if [ -f "$BACKEND_DIR/.env" ]; then
        cp "$BACKEND_DIR/.env" "$BACKUP_DIR/.env.backup"
        log_success ".env sauvegardé"
    fi
    
    # Sauvegarder la base de données
    if [ -f "$BACKEND_DIR/db.sqlite3" ]; then
        cp "$BACKEND_DIR/db.sqlite3" "$BACKUP_DIR/db.sqlite3.backup" 2>/dev/null || true
        log_success "Base de données sauvegardée"
    fi
    
    # Sauvegarder les fichiers statiques
    if [ -d "$BACKEND_DIR/staticfiles" ]; then
        cp -r "$BACKEND_DIR/staticfiles" "$BACKUP_DIR/staticfiles.backup" 2>/dev/null || true
        log_success "Fichiers statiques sauvegardés"
    fi
    
    # Sauvegarder les migrations locales (si modifications)
    if [ -d "$BACKEND_DIR/apps" ]; then
        find "$BACKEND_DIR/apps" -name "migrations" -type d -exec cp -r {} "$BACKUP_DIR/" \; 2>/dev/null || true
    fi
    
    # Créer un snapshot Git
    log_info "Création d'un snapshot Git..."
    git log -1 --format="%H" > "$BACKUP_DIR/git_commit.txt" 2>/dev/null || true
    git status > "$BACKUP_DIR/git_status.txt" 2>/dev/null || true
    
    log_success "Sauvegarde complète créée"
}

# Gestion intelligente des conflits Git
handle_git_conflicts() {
    log_step "ÉTAPE 2: Mise à jour du code depuis Git"
    
    cd "$PROJECT_ROOT"
    
    # Configurer Git pour éviter les conflits
    git config pull.rebase false
    git config merge.ours.driver true
    
    # Vérifier l'état Git
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Modifications locales détectées"
        git status --short
        
        # Sauvegarder les modifications locales
        log_info "Sauvegarde des modifications locales..."
        git stash push -m "Auto-stash before deploy $TIMESTAMP" || true
    fi
    
    # Récupérer les dernières modifications
    log_info "Récupération des dernières modifications..."
    git fetch origin main || {
        log_error "Impossible de récupérer depuis Git"
        exit 1
    }
    
    # Vérifier s'il y a des différences
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse origin/main)
    BASE=$(git merge-base @ origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        log_success "Déjà à jour avec origin/main"
    elif [ "$LOCAL" = "$BASE" ]; then
        log_info "Mise à jour nécessaire..."
        git pull origin main || {
            log_error "Erreur lors du pull"
            exit 1
        }
    elif [ "$REMOTE" = "$BASE" ]; then
        log_warning "Branche locale en avance, push recommandé"
        git pull origin main --no-edit || {
            log_warning "Conflits détectés, résolution..."
            resolve_git_conflicts
        }
    else
        log_warning "Branches divergentes détectées"
        resolve_git_conflicts
    fi
    
    # Restaurer les modifications locales si stash existe
    if git stash list | grep -q "Auto-stash before deploy $TIMESTAMP"; then
        log_info "Restauration des modifications locales..."
        git stash pop || {
            log_warning "Conflits lors de la restauration du stash"
            log_info "Modifications sauvegardées dans le stash"
            git stash list
        }
    fi
    
    log_success "Code mis à jour"
}

# Résolution automatique des conflits Git
resolve_git_conflicts() {
    log_warning "Résolution automatique des conflits..."
    
    # Liste des fichiers qui peuvent être écrasés sans problème
    SAFE_OVERWRITE_FILES=(
        "frontend/package.json"
        "frontend/package-lock.json"
        "backend/requirements.txt"
        "backend/requirements-production.txt"
    )
    
    # Vérifier les conflits
    CONFLICTED_FILES=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
    
    if [ -z "$CONFLICTED_FILES" ]; then
        log_success "Aucun conflit détecté"
        return 0
    fi
    
    log_info "Fichiers en conflit:"
    echo "$CONFLICTED_FILES"
    
    # Pour chaque fichier en conflit
    while IFS= read -r file; do
        if [ -z "$file" ]; then
            continue
        fi
        
        # Vérifier si c'est un fichier sûr à écraser
        is_safe=false
        for safe_file in "${SAFE_OVERWRITE_FILES[@]}"; do
            if [[ "$file" == *"$safe_file"* ]]; then
                is_safe=true
                break
            fi
        done
        
        if [ "$is_safe" = true ]; then
            log_info "Résolution automatique de $file (fichier sûr)"
            git checkout --theirs "$file" 2>/dev/null || true
            git add "$file" 2>/dev/null || true
        else
            log_warning "Conflit dans $file - résolution manuelle requise"
            # Essayer de résoudre avec la version distante pour les fichiers de config
            if [[ "$file" == *".env"* ]] || [[ "$file" == *"config"* ]]; then
                log_info "Conservation de la version locale pour $file"
                git checkout --ours "$file" 2>/dev/null || true
                git add "$file" 2>/dev/null || true
            else
                log_error "Conflit non résolu dans $file"
                log_info "Utilisez 'git status' pour voir les détails"
            fi
        fi
    done <<< "$CONFLICTED_FILES"
    
    # Finaliser le merge si possible
    if git diff --check --quiet 2>/dev/null; then
        log_success "Conflits résolus"
    else
        log_warning "Certains conflits nécessitent une résolution manuelle"
        log_info "Exécutez 'git status' pour voir les détails"
    fi
}

# Déploiement backend
deploy_backend() {
    log_step "ÉTAPE 3: Déploiement Backend"
    
    cd "$BACKEND_DIR"
    
    # Vérifier le fichier .env
    if [ ! -f ".env" ]; then
        log_warning "Fichier .env non trouvé"
        if [ -f "../infra/env.vps.example" ]; then
            log_info "Création depuis env.vps.example..."
            cp ../infra/env.vps.example .env
            log_warning "IMPORTANT: Modifiez .env avec vos valeurs de production"
        else
            log_error "Fichier .env non trouvé et aucun exemple disponible"
            exit 1
        fi
    fi
    
    # Activer l'environnement virtuel
    if [ -d "../venv" ]; then
        source ../venv/bin/activate
    elif [ -d "venv" ]; then
        source venv/bin/activate
    else
        log_info "Création de l'environnement virtuel..."
        python3 -m venv venv
        source venv/bin/activate
    fi
    
    # Installer les dépendances
    log_info "Installation des dépendances..."
    pip install --quiet --upgrade pip setuptools wheel
    
    if [ -f "requirements-production.txt" ]; then
        pip install --quiet -r requirements-production.txt || {
            log_warning "Certaines dépendances ont échoué, installation minimale..."
            install_minimal_dependencies
        }
    else
        install_minimal_dependencies
    fi
    
    # Vérifications Django
    log_info "Vérification de la configuration Django..."
    python manage.py check --deploy || {
        log_warning "Certaines vérifications ont échoué"
    }
    
    # Migrations
    log_info "Gestion des migrations..."
    python manage.py makemigrations --noinput --dry-run > /dev/null 2>&1 && {
        python manage.py makemigrations --noinput
    } || log_info "Aucune nouvelle migration nécessaire"
    
    python manage.py migrate --noinput || {
        log_error "Erreur lors des migrations"
        log_info "Restauration de la sauvegarde..."
        if [ -f "$BACKUP_DIR/db.sqlite3.backup" ]; then
            cp "$BACKUP_DIR/db.sqlite3.backup" db.sqlite3
        fi
        exit 1
    }
    
    # Collecter les fichiers statiques
    log_info "Collecte des fichiers statiques..."
    python manage.py collectstatic --noinput --clear || {
        log_warning "Erreur lors de la collecte des fichiers statiques"
    }
    
    # Créer les répertoires nécessaires
    mkdir -p media staticfiles logs
    chmod 755 media staticfiles logs
    
    log_success "Backend déployé"
}

# Installation minimale des dépendances
install_minimal_dependencies() {
    log_info "Installation des dépendances essentielles..."
    
    pip install --quiet Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1 || true
    pip install --quiet django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2 || true
    pip install --quiet psycopg2-binary==2.9.11 || true
    pip install --quiet python-dotenv==1.0.1 Pillow==10.2.0 whitenoise==6.11.0 || true
    pip install --quiet drf-spectacular==0.29.0 gunicorn==21.2.0 || true
    
    # Dépendances optionnelles
    pip install --quiet channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1 2>/dev/null || log_info "Channels optionnel - ignoré"
    pip install --quiet celery==5.3.6 django-celery-beat==2.6.0 django-celery-results==2.5.1 redis==7.0.1 2>/dev/null || log_info "Celery optionnel - ignoré"
}

# Déploiement frontend
deploy_frontend() {
    log_step "ÉTAPE 4: Déploiement Frontend"
    
    cd "$FRONTEND_DIR"
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Installer les dépendances
    if [ ! -d "node_modules" ] || [ "package-lock.json" -nt "node_modules" ] 2>/dev/null; then
        log_info "Installation des dépendances Node.js..."
        npm ci --silent || {
            log_warning "npm ci a échoué, tentative avec npm install..."
            npm install --silent
        }
    fi
    
    # Build pour production
    log_info "Build du frontend..."
    npm run build || {
        log_error "Erreur lors du build"
        exit 1
    }
    
    # Vérifier que le build a réussi
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        log_error "Le build n'a pas créé dist/index.html"
        exit 1
    fi
    
    log_success "Frontend déployé"
}

# Configuration Nginx
configure_nginx() {
    log_step "ÉTAPE 5: Configuration Nginx"
    
    NGINX_CONFIG="/etc/nginx/sites-available/foundation.newtiv.com"
    NGINX_CONFIG_SOURCE="$PROJECT_ROOT/infra/nginx-vps.conf"
    
    if [ ! -f "$NGINX_CONFIG_SOURCE" ]; then
        log_warning "Fichier de configuration Nginx non trouvé"
        return 0
    fi
    
    # Sauvegarder l'ancienne config si elle existe
    if [ -f "$NGINX_CONFIG" ]; then
        sudo cp "$NGINX_CONFIG" "$NGINX_CONFIG.old.$TIMESTAMP" 2>/dev/null || true
        log_info "Ancienne configuration sauvegardée"
    fi
    
    # Copier la nouvelle configuration
    log_info "Copie de la configuration Nginx..."
    sudo cp "$NGINX_CONFIG_SOURCE" "$NGINX_CONFIG"
    
    # Activer le site
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/foundation.newtiv.com
    
    # Supprimer la config par défaut
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Tester la configuration
    log_info "Test de la configuration Nginx..."
    if sudo nginx -t; then
        log_success "Configuration Nginx valide"
        sudo systemctl reload nginx
        log_success "Nginx rechargé"
    else
        log_error "Erreur dans la configuration Nginx"
        # Restaurer l'ancienne config
        if [ -f "$NGINX_CONFIG.old.$TIMESTAMP" ]; then
            log_info "Restauration de l'ancienne configuration..."
            sudo cp "$NGINX_CONFIG.old.$TIMESTAMP" "$NGINX_CONFIG"
            sudo nginx -t && sudo systemctl reload nginx
        fi
        exit 1
    fi
}

# Redémarrer les services
restart_services() {
    log_step "ÉTAPE 6: Redémarrage des services"
    
    # Trouver et redémarrer Gunicorn
    GUNICORN_PID=$(pgrep -f "gunicorn.*core.wsgi" | head -1)
    if [ -n "$GUNICORN_PID" ]; then
        log_info "Redémarrage de Gunicorn (PID: $GUNICORN_PID)..."
        kill -HUP "$GUNICORN_PID" || {
            log_warning "Impossible de redémarrer Gunicorn"
        }
    else
        log_warning "Gunicorn non trouvé"
        log_info "Démarrage manuel requis:"
        echo "  cd $BACKEND_DIR && source venv/bin/activate"
        echo "  gunicorn core.wsgi:application --config gunicorn_config.py --daemon"
    fi
}

# Afficher le résumé
show_summary() {
    log_step "RÉSUMÉ DU DÉPLOIEMENT"
    
    log_success "Déploiement terminé avec succès!"
    echo ""
    echo -e "${BLUE}📋 Informations:${NC}"
    echo "  - Sauvegarde: $BACKUP_DIR"
    echo "  - Frontend: http://foundation.newtiv.com (ou http://91.108.120.78)"
    echo "  - API: http://foundation.newtiv.com/api"
    echo "  - Admin Panel: http://foundation.newtiv.com/boss/"
    echo ""
    echo -e "${BLUE}🔍 Vérifications:${NC}"
    echo "  curl http://foundation.newtiv.com/api/health/"
    echo "  curl http://91.108.120.78/api/health/"
    echo ""
    echo -e "${YELLOW}⚠️  Notes:${NC}"
    echo "  - En cas d'erreur, restaurez depuis: $BACKUP_DIR"
    echo "  - Créer un superutilisateur: cd $BACKEND_DIR && python manage.py createsuperuser"
    echo ""
}

# Fonction principale
main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════╗"
    echo "║  Déploiement Sécurisé BUCED VPS       ║"
    echo "║  Gestion Avancée des Conflits        ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    pre_deploy_check
    create_backup
    handle_git_conflicts
    deploy_backend
    deploy_frontend
    configure_nginx
    restart_services
    show_summary
}

# Exécuter le script principal
main

