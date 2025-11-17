#!/bin/bash
# Script de déploiement complet pour VPS
# Gère les conflits et les erreurs

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="/root/buced"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo -e "${BLUE}🚀 Déploiement BUCED sur VPS${NC}"
echo ""

# Vérifier que nous sommes à la racine du projet
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}❌ Erreur: Répertoire $PROJECT_ROOT non trouvé${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

# ============================================
# ÉTAPE 1: Mise à jour du code
# ============================================
echo -e "${BLUE}📥 Étape 1: Mise à jour du code depuis Git...${NC}"
git config pull.rebase false
git pull origin main || {
    echo -e "${YELLOW}⚠️  Conflits Git détectés. Résolution...${NC}"
    git stash
    git pull origin main
    git stash pop || true
}
echo -e "${GREEN}✅ Code mis à jour${NC}"
echo ""

# ============================================
# ÉTAPE 2: Configuration Backend
# ============================================
echo -e "${BLUE}🔧 Étape 2: Configuration Backend...${NC}"
cd "$BACKEND_DIR"

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    if [ -f "../infra/env.vps.example" ]; then
        echo -e "${BLUE}📝 Création du fichier .env depuis env.vps.example...${NC}"
        cp ../infra/env.vps.example .env
        echo -e "${RED}⚠️  IMPORTANT: Modifiez .env avec vos valeurs de production${NC}"
        echo -e "${YELLOW}Appuyez sur Entrée pour continuer ou Ctrl+C pour annuler...${NC}"
        read
    else
        echo -e "${RED}❌ Fichier env.vps.example non trouvé${NC}"
        exit 1
    fi
fi

# Activer l'environnement virtuel
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "../venv" ]; then
    source ../venv/bin/activate
else
    echo -e "${YELLOW}⚠️  Environnement virtuel non trouvé. Création...${NC}"
    python3 -m venv venv
    source venv/bin/activate
fi

# Installer/mettre à jour les dépendances
echo -e "${BLUE}📦 Installation des dépendances Python...${NC}"
pip install --quiet --upgrade pip setuptools wheel

if [ -f "requirements-production.txt" ]; then
    pip install --quiet -r requirements-production.txt
elif [ -f "requirements.txt" ]; then
    pip install --quiet -r requirements.txt
else
    echo -e "${RED}❌ Fichier requirements non trouvé${NC}"
    exit 1
fi

# Vérifier la configuration Django
echo -e "${BLUE}✅ Vérification de la configuration Django...${NC}"
python manage.py check --deploy || {
    echo -e "${YELLOW}⚠️  Certaines vérifications ont échoué${NC}"
}

# Migrations
echo -e "${BLUE}🗄️  Gestion des migrations...${NC}"
python manage.py makemigrations --noinput || true
python manage.py migrate --noinput || {
    echo -e "${RED}❌ Erreur lors des migrations${NC}"
    exit 1
}

# Collecter les fichiers statiques
echo -e "${BLUE}📦 Collecte des fichiers statiques...${NC}"
python manage.py collectstatic --noinput --clear || {
    echo -e "${YELLOW}⚠️  Erreur lors de la collecte des fichiers statiques${NC}"
}

# Créer les répertoires nécessaires
mkdir -p media staticfiles logs
chmod 755 media staticfiles logs

echo -e "${GREEN}✅ Backend configuré${NC}"
echo ""

# ============================================
# ÉTAPE 3: Configuration Frontend
# ============================================
echo -e "${BLUE}🎨 Étape 3: Build du Frontend...${NC}"
cd "$FRONTEND_DIR"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Installer les dépendances
if [ ! -d "node_modules" ] || [ "package-lock.json" -nt "node_modules" ]; then
    echo -e "${BLUE}📦 Installation des dépendances Node.js...${NC}"
    npm ci --silent
fi

# Build pour production
echo -e "${BLUE}🔨 Build du frontend...${NC}"
npm run build || {
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
}

# Vérifier que le build a réussi
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Le build n'a pas créé dist/index.html${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend buildé${NC}"
echo ""

# ============================================
# ÉTAPE 4: Configuration Nginx
# ============================================
echo -e "${BLUE}🌐 Étape 4: Configuration Nginx...${NC}"

NGINX_CONFIG="/etc/nginx/sites-available/foundation.newtiv.com"
NGINX_CONFIG_SOURCE="$PROJECT_ROOT/infra/nginx-vps.conf"

if [ -f "$NGINX_CONFIG_SOURCE" ]; then
    echo -e "${BLUE}📝 Copie de la configuration Nginx...${NC}"
    sudo cp "$NGINX_CONFIG_SOURCE" "$NGINX_CONFIG"
    
    # Activer le site
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/foundation.newtiv.com
    
    # Supprimer la config par défaut si elle existe
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Tester la configuration
    echo -e "${BLUE}🧪 Test de la configuration Nginx...${NC}"
    sudo nginx -t || {
        echo -e "${RED}❌ Erreur dans la configuration Nginx${NC}"
        exit 1
    }
    
    # Recharger Nginx
    echo -e "${BLUE}🔄 Rechargement de Nginx...${NC}"
    sudo systemctl reload nginx
    
    echo -e "${GREEN}✅ Nginx configuré${NC}"
else
    echo -e "${YELLOW}⚠️  Fichier de configuration Nginx non trouvé: $NGINX_CONFIG_SOURCE${NC}"
fi
echo ""

# ============================================
# ÉTAPE 5: Redémarrage des services
# ============================================
echo -e "${BLUE}🔄 Étape 5: Redémarrage des services...${NC}"

# Trouver et redémarrer Gunicorn
GUNICORN_PID=$(pgrep -f "gunicorn.*buced\|gunicorn.*core.wsgi" | head -1)
if [ -n "$GUNICORN_PID" ]; then
    echo -e "${BLUE}🔄 Redémarrage de Gunicorn (PID: $GUNICORN_PID)...${NC}"
    kill -HUP "$GUNICORN_PID" || {
        echo -e "${YELLOW}⚠️  Impossible de redémarrer Gunicorn. Démarrage manuel requis.${NC}"
    }
else
    echo -e "${YELLOW}⚠️  Gunicorn non trouvé. Démarrage manuel requis:${NC}"
    echo -e "${BLUE}   cd $BACKEND_DIR && source venv/bin/activate${NC}"
    echo -e "${BLUE}   gunicorn core.wsgi:application --config gunicorn_config.py --daemon${NC}"
fi

echo ""

# ============================================
# RÉSUMÉ
# ============================================
echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo ""
echo -e "${BLUE}📋 Résumé:${NC}"
echo "  - Frontend: http://foundation.newtiv.com"
echo "  - API: http://foundation.newtiv.com/api"
echo "  - Admin: http://foundation.newtiv.com/boss"
echo ""
echo -e "${BLUE}🔍 Vérifications:${NC}"
echo "  1. Testez le site: curl http://foundation.newtiv.com"
echo "  2. Testez l'API: curl http://foundation.newtiv.com/api/health/"
echo "  3. Vérifiez les logs: sudo tail -f /var/log/nginx/foundation_error.log"
echo ""
echo -e "${YELLOW}⚠️  N'oubliez pas:${NC}"
echo "  - Créer un superutilisateur: cd $BACKEND_DIR && python manage.py createsuperuser"
echo "  - Configurer SSL avec Let's Encrypt (optionnel)"
echo ""

