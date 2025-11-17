#!/bin/bash
# Script de rollback pour restaurer une sauvegarde précédente

set -euo pipefail

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="/root/buced"
BACKEND_DIR="$PROJECT_ROOT/backend"
BACKUP_ROOT="$PROJECT_ROOT/backups"

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

# Lister les sauvegardes disponibles
list_backups() {
    if [ ! -d "$BACKUP_ROOT" ]; then
        log_error "Aucun répertoire de sauvegarde trouvé"
        return 1
    fi
    
    echo -e "${CYAN}Sauvegardes disponibles:${NC}"
    ls -lt "$BACKUP_ROOT" | grep "^d" | awk '{print $9}' | grep -E "^[0-9]{8}_[0-9]{6}$" | head -10
}

# Restaurer une sauvegarde
restore_backup() {
    local backup_date=$1
    
    if [ -z "$backup_date" ]; then
        log_error "Date de sauvegarde non spécifiée"
        echo "Usage: $0 <YYYYMMDD_HHMMSS>"
        echo ""
        list_backups
        exit 1
    fi
    
    local backup_dir="$BACKUP_ROOT/$backup_date"
    
    if [ ! -d "$backup_dir" ]; then
        log_error "Sauvegarde non trouvée: $backup_dir"
        list_backups
        exit 1
    fi
    
    log_warning "ATTENTION: Cette opération va restaurer la sauvegarde du $backup_date"
    read -p "Continuer? (oui/non): " confirm
    
    if [ "$confirm" != "oui" ]; then
        log_info "Opération annulée"
        exit 0
    fi
    
    cd "$BACKEND_DIR"
    
    # Restaurer .env
    if [ -f "$backup_dir/.env.backup" ]; then
        log_info "Restauration de .env..."
        cp "$backup_dir/.env.backup" .env
        log_success ".env restauré"
    fi
    
    # Restaurer la base de données
    if [ -f "$backup_dir/db.sqlite3.backup" ]; then
        log_info "Restauration de la base de données..."
        cp "$backup_dir/db.sqlite3.backup" db.sqlite3
        log_success "Base de données restaurée"
    fi
    
    # Restaurer les fichiers statiques
    if [ -d "$backup_dir/staticfiles.backup" ]; then
        log_info "Restauration des fichiers statiques..."
        rm -rf staticfiles
        cp -r "$backup_dir/staticfiles.backup" staticfiles
        log_success "Fichiers statiques restaurés"
    fi
    
    # Restaurer le commit Git si disponible
    if [ -f "$backup_dir/git_commit.txt" ]; then
        local commit_hash=$(cat "$backup_dir/git_commit.txt")
        log_info "Restauration du commit Git: $commit_hash"
        cd "$PROJECT_ROOT"
        git checkout "$commit_hash" || {
            log_warning "Impossible de restaurer le commit Git"
        }
    fi
    
    log_success "Rollback terminé"
    log_info "Redémarrez les services si nécessaire"
}

# Menu principal
main() {
    if [ $# -eq 0 ]; then
        echo -e "${CYAN}Script de Rollback BUCED${NC}"
        echo ""
        list_backups
        echo ""
        echo "Usage: $0 <YYYYMMDD_HHMMSS>"
        echo "Exemple: $0 20241115_143022"
        exit 0
    fi
    
    restore_backup "$1"
}

main "$@"

