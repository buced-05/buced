#!/bin/bash
# Script pour vérifier les conflits potentiels avant déploiement

set -euo pipefail

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="/root/buced"
BACKEND_DIR="$PROJECT_ROOT/backend"

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

cd "$PROJECT_ROOT"

echo -e "${BLUE}🔍 Vérification des conflits potentiels${NC}"
echo ""

CONFLICTS_FOUND=0

# 1. Vérifier l'état Git
log_info "1. Vérification de l'état Git..."
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Modifications locales non commitées détectées:"
    git status --short
    CONFLICTS_FOUND=$((CONFLICTS_FOUND + 1))
else
    log_success "Aucune modification locale"
fi

# 2. Vérifier les différences avec origin/main
log_info ""
log_info "2. Vérification des différences avec origin/main..."
git fetch origin main --quiet || {
    log_error "Impossible de récupérer depuis origin/main"
    exit 1
}

LOCAL=$(git rev-parse @ 2>/dev/null || echo "")
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ -z "$LOCAL" ] || [ -z "$REMOTE" ]; then
    log_warning "Impossible de comparer les branches"
    CONFLICTS_FOUND=$((CONFLICTS_FOUND + 1))
elif [ "$LOCAL" != "$REMOTE" ]; then
    log_warning "Branche locale différente de origin/main"
    echo "  Local:  $LOCAL"
    echo "  Remote: $REMOTE"
    
    # Vérifier les fichiers modifiés
    CHANGED_FILES=$(git diff --name-only origin/main 2>/dev/null || true)
    if [ -n "$CHANGED_FILES" ]; then
        log_info "Fichiers modifiés:"
        echo "$CHANGED_FILES" | sed 's/^/  - /'
    fi
    CONFLICTS_FOUND=$((CONFLICTS_FOUND + 1))
else
    log_success "Branche locale à jour avec origin/main"
fi

# 3. Vérifier les fichiers critiques modifiés localement
log_info ""
log_info "3. Vérification des fichiers critiques..."

CRITICAL_FILES=(
    "$BACKEND_DIR/.env"
    "$BACKEND_DIR/core/settings.py"
    "$PROJECT_ROOT/infra/nginx-vps.conf"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        if git diff --quiet origin/main -- "$file" 2>/dev/null; then
            log_success "$(basename $file) - Pas de conflit"
        else
            log_warning "$(basename $file) - Modifié localement"
            CONFLICTS_FOUND=$((CONFLICTS_FOUND + 1))
        fi
    fi
done

# 4. Vérifier les dépendances
log_info ""
log_info "4. Vérification des dépendances..."

if [ -f "$BACKEND_DIR/requirements-production.txt" ]; then
    if git diff --quiet origin/main -- "$BACKEND_DIR/requirements-production.txt" 2>/dev/null; then
        log_success "requirements-production.txt - Pas de conflit"
    else
        log_warning "requirements-production.txt - Modifié, conflit possible"
        CONFLICTS_FOUND=$((CONFLICTS_FOUND + 1))
    fi
fi

# Résumé
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
if [ $CONFLICTS_FOUND -eq 0 ]; then
    log_success "Aucun conflit détecté - Déploiement sûr"
    exit 0
else
    log_warning "$CONFLICTS_FOUND conflit(s) potentiel(s) détecté(s)"
    echo ""
    echo "Recommandations:"
    echo "  1. Utilisez deploy_vps_safe.sh pour une gestion automatique"
    echo "  2. Ou résolvez manuellement les conflits avant de déployer"
    echo "  3. Créez une sauvegarde avant le déploiement"
    exit 1
fi

