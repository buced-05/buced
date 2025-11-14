#!/bin/bash
# Script d'installation des dépendances par étapes
# Installe d'abord les dépendances essentielles, puis les dépendances ML optionnelles

set -e

echo "📦 Installation des dépendances BUCED..."

# Activer l'environnement virtuel si disponible
if [ -d "../venv" ]; then
    source ../venv/bin/activate
fi

# Mettre à jour pip
echo "⬆️  Mise à jour de pip..."
pip install --upgrade pip setuptools wheel

# Étape 1: Installer les dépendances essentielles (sans ML)
echo ""
echo "📥 Étape 1: Installation des dépendances essentielles..."
pip install \
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

echo ""
echo "✅ Dépendances essentielles installées!"

# Étape 2: Installer les dépendances ML (optionnel, peut échouer)
echo ""
echo "📥 Étape 2: Installation des dépendances ML (optionnel)..."
echo "⚠️  Ces dépendances peuvent prendre du temps et nécessiter beaucoup d'espace..."

# Essayer d'installer spacy avec binaires précompilés
if pip install --prefer-binary spacy==3.7.2; then
    echo "✅ spaCy installé"
else
    echo "⚠️  Échec de l'installation de spaCy (non critique)"
fi

# Installer les autres dépendances ML une par une
for pkg in "numpy==1.26.4" "pandas==2.1.4" "scikit-learn==1.4.1.post1" "nltk==3.8.1"; do
    if pip install "$pkg"; then
        echo "✅ $pkg installé"
    else
        echo "⚠️  Échec de l'installation de $pkg (non critique)"
    fi
done

# TensorFlow et PyTorch sont très lourds - installer seulement si nécessaire
echo ""
read -p "Installer TensorFlow et PyTorch? (très lourd, ~2GB) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📥 Installation de TensorFlow et PyTorch..."
    pip install tensorflow==2.15.0 torch==2.2.1 transformers==4.38.1 || echo "⚠️  Échec (non critique)"
fi

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Pour vérifier l'installation:"
echo "  python manage.py check"

