#!/bin/bash
# Script de configuration initiale pour production VPS

set -e

echo "🔧 Configuration de BUCED pour la production..."

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL n'est pas installé. Installation recommandée pour la production."
fi

# Vérifier Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis n'est pas installé. Installation recommandée pour Celery."
fi

# Créer le fichier .env si il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env
        echo "✅ Fichier .env créé. Veuillez le modifier avec vos valeurs de production."
    else
        echo "❌ Fichier .env.production.example non trouvé"
        exit 1
    fi
fi

# Créer les répertoires nécessaires
echo "📁 Création des répertoires..."
mkdir -p media staticfiles logs

# Définir les permissions
echo "🔐 Configuration des permissions..."
chmod 755 media staticfiles logs

echo "✅ Configuration terminée!"
echo ""
echo "Prochaines étapes:"
echo "1. Modifiez le fichier .env avec vos valeurs de production"
echo "2. Configurez PostgreSQL et créez la base de données"
echo "3. Exécutez: ./scripts/deploy.sh"

