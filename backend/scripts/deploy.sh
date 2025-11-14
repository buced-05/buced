#!/bin/bash
# Script de déploiement pour production VPS

set -e

echo "🚀 Déploiement de BUCED en production..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Erreur: manage.py non trouvé. Exécutez ce script depuis le répertoire backend.${NC}"
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé. Créez-le à partir de .env.production.example${NC}"
    exit 1
fi

# Activer l'environnement virtuel si disponible
if [ -d "../venv" ]; then
    echo "📦 Activation de l'environnement virtuel..."
    source ../venv/bin/activate
fi

# Installer/mettre à jour les dépendances
echo "📥 Installation des dépendances..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Exécuter les migrations
echo "🗄️  Exécution des migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques
echo "📦 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --clear

# Vérifier la configuration Django
echo "✅ Vérification de la configuration..."
python manage.py check --deploy

# Créer un superutilisateur si nécessaire (optionnel)
echo -e "${YELLOW}💡 Pour créer un superutilisateur, exécutez:${NC}"
echo "   python manage.py createsuperuser"

echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo ""
echo "Pour démarrer le serveur:"
echo "  - Avec Gunicorn: gunicorn core.wsgi:application --bind 0.0.0.0:8000"
echo "  - Avec Daphne (WebSockets): daphne -b 0.0.0.0 -p 8000 core.asgi:application"

