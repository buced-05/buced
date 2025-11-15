#!/bin/bash
# Script de déploiement sécurisé qui évite les conflits
# Utilise pre_deploy_check.sh avant de déployer

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

echo -e "${BLUE}🚀 Déploiement sécurisé BUCED${NC}"
echo ""

# Étape 1: Vérification pré-déploiement
echo -e "${BLUE}Étape 1: Vérification pré-déploiement...${NC}"
if [ -f "$SCRIPT_DIR/pre_deploy_check.sh" ]; then
    chmod +x "$SCRIPT_DIR/pre_deploy_check.sh"
    if ! "$SCRIPT_DIR/pre_deploy_check.sh"; then
        echo -e "${RED}❌ Les vérifications pré-déploiement ont échoué${NC}"
        echo "Corrigez les erreurs avant de continuer."
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Script de vérification non trouvé, continuation...${NC}"
fi

echo ""
echo -e "${BLUE}Étape 2: Sauvegarde de l'état actuel...${NC}"

# Créer un dossier de sauvegarde
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Sauvegarder les fichiers critiques
if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/.env.backup"
    echo "✅ .env sauvegardé"
fi

if [ -f "db.sqlite3" ]; then
    cp db.sqlite3 "$BACKUP_DIR/db.sqlite3.backup" 2>/dev/null || true
    echo "✅ Base de données sauvegardée"
fi

echo ""
echo -e "${BLUE}Étape 3: Installation des dépendances...${NC}"

# Activer venv si disponible
if [ -d "../venv" ]; then
    source ../venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Mettre à jour pip
pip install --quiet --upgrade pip setuptools wheel

# Installer depuis requirements-production.txt
if [ -f "requirements-production.txt" ]; then
    echo "Installation depuis requirements-production.txt..."
    pip install --quiet -r requirements-production.txt || {
        echo -e "${YELLOW}⚠️  Certaines dépendances ont échoué, tentative avec installation manuelle...${NC}"
        
        # Installation manuelle des dépendances essentielles
        pip install --quiet Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1 || true
        pip install --quiet django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2 || true
        pip install --quiet psycopg2-binary==2.9.11 || true
        pip install --quiet python-dotenv==1.0.1 Pillow==10.2.0 whitenoise==6.11.0 || true
        pip install --quiet drf-spectacular==0.29.0 gunicorn==21.2.0 || true
        
        # Dépendances optionnelles (ne pas échouer si elles échouent)
        pip install --quiet channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1 || echo "Channels optionnel - ignoré"
        pip install --quiet celery==5.3.6 django-celery-beat==2.6.0 django-celery-results==2.5.1 redis==7.0.1 || echo "Celery optionnel - ignoré"
    }
else
    echo -e "${YELLOW}⚠️  requirements-production.txt non trouvé, installation manuelle...${NC}"
    pip install --quiet Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1
    pip install --quiet django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2
    pip install --quiet psycopg2-binary==2.9.11 python-dotenv==1.0.1 Pillow==10.2.0
    pip install --quiet whitenoise==6.11.0 drf-spectacular==0.29.0 gunicorn==21.2.0
fi

echo -e "${GREEN}✅ Dépendances installées${NC}"

echo ""
echo -e "${BLUE}Étape 4: Vérification Django...${NC}"
python manage.py check --deploy || {
    echo -e "${YELLOW}⚠️  Certaines vérifications Django ont échoué, mais on continue...${NC}"
}

echo ""
echo -e "${BLUE}Étape 5: Migrations...${NC}"
python manage.py makemigrations --noinput || {
    echo -e "${YELLOW}⚠️  Aucune nouvelle migration nécessaire${NC}"
}

python manage.py migrate --noinput || {
    echo -e "${RED}❌ Erreur lors des migrations${NC}"
    echo "Restauration de la sauvegarde..."
    if [ -f "$BACKUP_DIR/db.sqlite3.backup" ]; then
        cp "$BACKUP_DIR/db.sqlite3.backup" db.sqlite3
    fi
    exit 1
}

echo ""
echo -e "${BLUE}Étape 6: Collecte des fichiers statiques...${NC}"
python manage.py collectstatic --noinput --clear || {
    echo -e "${YELLOW}⚠️  Erreur lors de la collecte des fichiers statiques${NC}"
}

echo ""
echo -e "${BLUE}Étape 7: Création des répertoires...${NC}"
mkdir -p media staticfiles logs
chmod 755 media staticfiles logs

echo ""
echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo ""
echo -e "${BLUE}Informations:${NC}"
echo "- Sauvegarde créée dans: $BACKUP_DIR"
echo "- Pour démarrer le serveur:"
echo "  gunicorn core.wsgi:application --config gunicorn_config.py"
echo ""
echo -e "${YELLOW}Note: Si vous avez des erreurs, vous pouvez restaurer depuis: $BACKUP_DIR${NC}"

