# Guide d'installation des dépendances

## Installation rapide (essentielles uniquement)

Si vous avez des problèmes avec les dépendances ML lourdes (spacy, tensorflow, torch), installez d'abord les dépendances essentielles :

```bash
cd backend
source ../venv/bin/activate

# Installer les dépendances essentielles
pip install Django==5.0.4 djangorestframework==3.16.1 djangorestframework-simplejwt==5.3.1
pip install django-cors-headers==4.9.0 django-filter==25.1 django-environ==0.11.2
pip install psycopg2-binary==2.9.11
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1
pip install celery==5.3.6 django-celery-beat==2.6.0 django-celery-results==2.5.1 redis==7.0.1
pip install python-dotenv==1.0.1 Pillow==10.2.0 whitenoise==6.11.0
pip install drf-spectacular==0.29.0 gunicorn==21.2.0
```

## Installation complète

### Option 1: Utiliser le script automatique

```bash
chmod +x scripts/install_dependencies.sh
./scripts/install_dependencies.sh
```

### Option 2: Installation manuelle

```bash
# Mettre à jour pip
pip install --upgrade pip setuptools wheel

# Installer depuis requirements.txt (peut échouer sur spacy)
pip install -r requirements.txt

# Si spacy échoue, installer avec binaires précompilés
pip install --prefer-binary spacy==3.7.2
```

## Résolution des problèmes

### Erreur: "No module named 'channels'"

```bash
pip install channels==4.3.1 channels-redis==4.1.0 daphne==4.2.1
```

### Erreur lors de la compilation de spacy/blis

```bash
# Installer les dépendances système
sudo apt install build-essential python3-dev gcc g++ libblas-dev liblapack-dev libopenblas-dev

# Installer spacy avec binaires précompilés
pip install --prefer-binary spacy==3.7.2
```

### Erreur: "No module named 'daphne'"

```bash
pip install daphne==4.2.1
```

## Vérification

```bash
# Vérifier que Django fonctionne
python manage.py check

# Vérifier les modules installés
python -c "import channels; import daphne; print('✅ Channels et Daphne installés')"
```

## Dépendances optionnelles (ML)

Si vous n'avez pas besoin des fonctionnalités ML immédiatement, vous pouvez ignorer :
- spacy
- tensorflow
- torch
- transformers
- scikit-learn

Ces modules sont utilisés pour l'analyse de sentiment et les recommandations, mais l'application fonctionnera sans eux.

