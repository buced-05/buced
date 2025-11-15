#!/bin/bash
# Script de vérification pré-déploiement pour éviter les conflits
# Vérifie l'environnement, les dépendances et la configuration avant le déploiement

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification pré-déploiement BUCED${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Fonction pour afficher une erreur
error() {
    echo -e "${RED}❌ $1${NC}"
    ERRORS=$((ERRORS + 1))
}

# Fonction pour afficher un avertissement
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# Fonction pour afficher un succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 1. Vérifier Python
echo -e "${BLUE}1. Vérification de Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -ge 3 ] && [ "$PYTHON_MINOR" -ge 11 ]; then
        success "Python $PYTHON_VERSION détecté"
    else
        warning "Python $PYTHON_VERSION détecté (recommandé: Python 3.11+)"
    fi
else
    error "Python 3 n'est pas installé"
fi

# 2. Vérifier l'environnement virtuel
echo ""
echo -e "${BLUE}2. Vérification de l'environnement virtuel...${NC}"
if [ -d "../venv" ] || [ -d "venv" ]; then
    success "Environnement virtuel trouvé"
    if [ -d "../venv" ]; then
        VENV_PATH="../venv"
    else
        VENV_PATH="venv"
    fi
    
    # Vérifier si activé
    if [ -z "$VIRTUAL_ENV" ]; then
        warning "L'environnement virtuel n'est pas activé. Activez-le avec: source $VENV_PATH/bin/activate"
    else
        success "Environnement virtuel activé: $VIRTUAL_ENV"
    fi
else
    warning "Aucun environnement virtuel trouvé. Créez-en un avec: python3 -m venv venv"
fi

# 3. Vérifier pip
echo ""
echo -e "${BLUE}3. Vérification de pip...${NC}"
if command -v pip3 &> /dev/null || command -v pip &> /dev/null; then
    PIP_CMD=$(command -v pip3 || command -v pip)
    PIP_VERSION=$($PIP_CMD --version | cut -d' ' -f2)
    success "pip $PIP_VERSION détecté"
    
    # Vérifier si pip est à jour
    $PIP_CMD install --upgrade pip --quiet --dry-run &> /dev/null || true
else
    error "pip n'est pas installé"
fi

# 4. Vérifier le fichier .env
echo ""
echo -e "${BLUE}4. Vérification de la configuration...${NC}"
if [ -f ".env" ]; then
    success "Fichier .env trouvé"
    
    # Vérifier les variables critiques
    if grep -q "SECRET_KEY" .env && ! grep -q "SECRET_KEY=changeme" .env; then
        success "SECRET_KEY configuré"
    else
        error "SECRET_KEY n'est pas configuré ou utilise la valeur par défaut"
    fi
    
    if grep -q "DJANGO_DEBUG=0" .env || grep -q "DJANGO_DEBUG=False" .env; then
        success "DEBUG désactivé pour la production"
    else
        warning "DEBUG est activé. Assurez-vous de le désactiver en production"
    fi
    
    # Vérifier la configuration de la base de données
    if grep -q "POSTGRES_HOST" .env; then
        POSTGRES_HOST=$(grep "POSTGRES_HOST" .env | cut -d'=' -f2 | tr -d ' ')
        if [ -n "$POSTGRES_HOST" ] && [ "$POSTGRES_HOST" != "postgres" ]; then
            success "Configuration PostgreSQL détectée"
        else
            warning "POSTGRES_HOST non configuré ou utilise la valeur Docker. SQLite sera utilisé."
        fi
    else
        warning "POSTGRES_HOST non défini. SQLite sera utilisé."
    fi
else
    if [ -f ".env.production.example" ]; then
        warning "Fichier .env non trouvé. Copiez .env.production.example vers .env"
    else
        error "Fichier .env non trouvé et aucun exemple disponible"
    fi
fi

# 5. Vérifier les dépendances critiques
echo ""
echo -e "${BLUE}5. Vérification des dépendances critiques...${NC}"
if [ -n "$VIRTUAL_ENV" ] || [ -d "../venv" ] || [ -d "venv" ]; then
    if [ -n "$VIRTUAL_ENV" ]; then
        PYTHON_CMD="python"
    else
        if [ -d "../venv" ]; then
            PYTHON_CMD="../venv/bin/python"
        else
            PYTHON_CMD="venv/bin/python"
        fi
    fi
    
    if [ -f "$PYTHON_CMD" ] || command -v python3 &> /dev/null; then
        if [ -f "$PYTHON_CMD" ]; then
            PYTHON=$PYTHON_CMD
        else
            PYTHON=python3
        fi
        
        # Vérifier Django
        if $PYTHON -c "import django" 2>/dev/null; then
            DJANGO_VERSION=$($PYTHON -c "import django; print(django.get_version())" 2>/dev/null)
            success "Django $DJANGO_VERSION installé"
        else
            warning "Django n'est pas installé"
        fi
        
        # Vérifier les dépendances optionnelles
        if $PYTHON -c "import channels" 2>/dev/null; then
            success "Channels installé (optionnel)"
        else
            warning "Channels non installé (optionnel - WebSockets désactivés)"
        fi
        
        if $PYTHON -c "import celery" 2>/dev/null; then
            success "Celery installé (optionnel)"
        else
            warning "Celery non installé (optionnel - tâches asynchrones désactivées)"
        fi
        
        if $PYTHON -c "import psycopg2" 2>/dev/null; then
            success "psycopg2 installé"
        else
            warning "psycopg2 non installé (SQLite sera utilisé)"
        fi
    fi
else
    warning "Impossible de vérifier les dépendances (venv non activé)"
fi

# 6. Vérifier les fichiers critiques
echo ""
echo -e "${BLUE}6. Vérification des fichiers critiques...${NC}"
if [ -f "manage.py" ]; then
    success "manage.py trouvé"
else
    error "manage.py non trouvé. Êtes-vous dans le bon répertoire?"
fi

if [ -f "requirements-production.txt" ]; then
    success "requirements-production.txt trouvé"
else
    warning "requirements-production.txt non trouvé"
fi

# 7. Vérifier les permissions
echo ""
echo -e "${BLUE}7. Vérification des permissions...${NC}"
if [ -w "." ]; then
    success "Permissions d'écriture OK"
else
    error "Pas de permissions d'écriture dans le répertoire actuel"
fi

# 8. Vérifier l'espace disque
echo ""
echo -e "${BLUE}8. Vérification de l'espace disque...${NC}"
AVAILABLE_SPACE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -ge 1 ]; then
    success "Espace disque disponible: ${AVAILABLE_SPACE}G"
else
    warning "Espace disque limité: ${AVAILABLE_SPACE}G"
fi

# Résumé
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Toutes les vérifications sont passées!${NC}"
    echo ""
    echo "Vous pouvez procéder au déploiement avec:"
    echo "  ./scripts/deploy_production.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Vérifications terminées avec $WARNINGS avertissement(s)${NC}"
    echo ""
    echo "Vous pouvez procéder au déploiement, mais vérifiez les avertissements ci-dessus."
    exit 0
else
    echo -e "${RED}❌ Vérifications échouées avec $ERRORS erreur(s) et $WARNINGS avertissement(s)${NC}"
    echo ""
    echo "Corrigez les erreurs avant de procéder au déploiement."
    exit 1
fi

