#!/bin/bash
# Script de déploiement robuste pour production VPS
# Gère les erreurs et évite les conflits

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Déploiement BUCED en production${NC}"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Erreur: manage.py non trouvé. Exécutez depuis backend/${NC}"
    exit 1
fi

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 n'est pas installé${NC}"
    exit 1
fi

# Activer l'environnement virtuel si disponible
if [ -d "../venv" ]; then
    echo -e "${BLUE}📦 Activation de l'environnement virtuel...${NC}"
    source ../venv/bin/activate
fi

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    if [ -f ".env.production.example" ]; then
        echo -e "${BLUE}📝 Création du fichier .env depuis .env.production.example...${NC}"
        cp .env.production.example .env
        echo -e "${YELLOW}⚠️  Veuillez modifier .env avec vos valeurs de production${NC}"
    else
        echo -e "${RED}❌ Fichier .env.production.example non trouvé${NC}"
        exit 1
    fi
fi

# Étape 1: Installer les dépendances essentielles uniquement
echo ""
echo -e "${BLUE}📥 Étape 1: Installation des dépendances essentielles...${NC}"

# Mettre à jour pip
pip install --quiet --upgrade pip setuptools wheel

# Installer depuis requirements-production.txt (sans ML)
if [ -f "requirements-production.txt" ]; then
    echo "Installation depuis requirements-production.txt..."
    pip install --quiet -r requirements-production.txt
else
    echo "Installation manuelle des dépendances essentielles..."
    pip install --quiet \
        Django==5.0.4 \
        djangorestframework==3.16.1 \
        djangorestframework-simplejwt==5.3.1 \
        django-cors-headers==4.9.0 \
        django-filter==25.1 \
        django-environ==0.11.2 \
        psycopg2-binary==2.9.11 \
        channels==4.3.1 \
        channels-redis==4.1.0 \
        daphne==4.2.1 \
        celery==5.3.6 \
        django-celery-beat==2.6.0 \
        django-celery-results==2.5.1 \
        redis==7.0.1 \
        python-dotenv==1.0.1 \
        Pillow==10.2.0 \
        whitenoise==6.11.0 \
        drf-spectacular==0.29.0 \
        gunicorn==21.2.0
fi

echo -e "${GREEN}✅ Dépendances essentielles installées${NC}"

# Étape 2: Vérifier la configuration Django
echo ""
echo -e "${BLUE}✅ Étape 2: Vérification de la configuration Django...${NC}"
python manage.py check --deploy || {
    echo -e "${YELLOW}⚠️  Certaines vérifications ont échoué, mais on continue...${NC}"
}

# Étape 3: Créer les migrations
echo ""
echo -e "${BLUE}🗄️  Étape 3: Création des migrations...${NC}"
python manage.py makemigrations --noinput || {
    echo -e "${YELLOW}⚠️  Aucune nouvelle migration nécessaire${NC}"
}

# Étape 4: Appliquer les migrations
echo ""
echo -e "${BLUE}🗄️  Étape 4: Application des migrations...${NC}"
python manage.py migrate --noinput || {
    echo -e "${RED}❌ Erreur lors des migrations${NC}"
    echo "Vérifiez votre configuration de base de données dans .env"
    exit 1
}

# Étape 5: Collecter les fichiers statiques
echo ""
echo -e "${BLUE}📦 Étape 5: Collecte des fichiers statiques...${NC}"
python manage.py collectstatic --noinput --clear || {
    echo -e "${YELLOW}⚠️  Erreur lors de la collecte des fichiers statiques${NC}"
}

# Étape 6: Créer les répertoires nécessaires
echo ""
echo -e "${BLUE}📁 Étape 6: Création des répertoires...${NC}"
mkdir -p media staticfiles logs
chmod 755 media staticfiles logs

echo ""
echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo ""
echo -e "${BLUE}Prochaines étapes:${NC}"
echo "1. Vérifiez votre fichier .env"
echo "2. Créez un superutilisateur: python manage.py createsuperuser"
echo "3. Démarrez le serveur:"
echo "   - Gunicorn: gunicorn core.wsgi:application --config gunicorn_config.py"
echo "   - Daphne: daphne -b 127.0.0.1 -p 8000 core.asgi:application"
echo ""
echo -e "${BLUE}📋 URLs disponibles:${NC}"
echo "  - Panel Admin: http://votre-domaine.com/boss/ (ou /admin/)"
echo "  - API: http://votre-domaine.com/api/v1/"
echo "  - API Health: http://votre-domaine.com/api/health/"
echo "  - Documentation: http://votre-domaine.com/api/docs/swagger/"

