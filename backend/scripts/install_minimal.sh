#!/bin/bash
# Installation minimale des dépendances essentielles uniquement
# Évite tous les conflits en installant une par une

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Installation minimale des dépendances essentielles${NC}"
echo ""

# Activer venv si disponible
if [ -d "../venv" ]; then
    source ../venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Mettre à jour pip
echo "Mise à jour de pip..."
pip install --quiet --upgrade pip setuptools wheel

# Installation une par une pour éviter les conflits
echo ""
echo "Installation des dépendances essentielles..."

# Django Core
echo "→ Django Core..."
pip install --quiet Django==5.0.4 || exit 1
pip install --quiet djangorestframework==3.16.1 || exit 1
pip install --quiet djangorestframework-simplejwt==5.3.1 || exit 1

# CORS et filtres
echo "→ CORS et filtres..."
pip install --quiet django-cors-headers==4.9.0 || exit 1
pip install --quiet django-filter==25.1 || exit 1
pip install --quiet django-environ==0.11.2 || exit 1

# Base de données
echo "→ Base de données..."
pip install --quiet psycopg2-binary==2.9.11 || echo "⚠️  psycopg2 optionnel - SQLite sera utilisé"

# Utilitaires
echo "→ Utilitaires..."
pip install --quiet python-dotenv==1.0.1 || exit 1
pip install --quiet Pillow==10.2.0 || exit 1
pip install --quiet whitenoise==6.11.0 || exit 1

# Documentation et serveur
echo "→ Documentation et serveur..."
pip install --quiet drf-spectacular==0.29.0 || exit 1
pip install --quiet gunicorn==21.2.0 || exit 1

# Dépendances optionnelles (ne pas échouer si elles échouent)
echo ""
echo "Installation des dépendances optionnelles..."
pip install --quiet channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1 || echo "⚠️  Channels optionnel - ignoré"
pip install --quiet celery==5.3.6 django-celery-beat==2.6.0 django-celery-results==2.5.1 redis==7.0.1 || echo "⚠️  Celery optionnel - ignoré"

echo ""
echo -e "${GREEN}✅ Installation terminée!${NC}"
echo ""
echo "Vérification:"
python -c "import django; print(f'Django {django.get_version()} installé')" || echo "❌ Erreur Django"

