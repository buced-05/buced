# Bureau des Clubs Éducatifs

Plateforme d’innovation éducative combinant orientation, sélection assistée par IA, prototypage rapide et accompagnement des meilleurs projets ivoiriens.

## Stack
- Backend : Django 5, Django REST Framework, Django Channels, Celery, PostgreSQL, Redis
- Frontend : React (Vite), TypeScript, TailwindCSS, Chart.js/D3.js
- IA : scikit-learn, spaCy, Transformers (BERT FR), TensorFlow/PyTorch
- Infra : Docker, Nginx, GitHub Actions (à venir)

## Démarrage rapide
1. Installer Docker et Docker Compose
2. Copier `infra/env.sample` vers `backend/.env` et compléter les variables sensibles
3. Lancer `docker compose up --build`
4. Accéder au frontend sur http://localhost:5173 et à l'API sur http://localhost:8000/api/v1/
5. Accéder au panel administrateur sur http://localhost:8000/boss/ ou http://localhost:8000/admin/

## Structure
```
backend/   # API Django + WebSockets + services ML
frontend/  # Application React (Vite + Tailwind)
infra/     # Configurations infra (Nginx, envs)
```

## Modules principaux
- Orientation & conseil (matching conseillers, chat, ressources)
- Soumission et suivi de projets (documents, scoring IA, interactions)
- Vote communautaire & analyse de sentiment
- Prototypage rapide avec Kanban, specs automatiques et notifications
- Espace sponsors, messagerie privée, reporting d’impact
- Accompagnement des lauréats (milestones, KPI, mentorat)

## IA & automatisations
- Analyse de sentiment et pondération des votes
- Scoring multi-critères des projets (communauté + IA + experts)
- Génération de spécifications techniques et recommandations
- Tâches Celery pour réentrainement & rafraîchissement des scores

## Déploiement (aperçu)
- Docker compose : backend, frontend, PostgreSQL, Redis
- Nginx (reverse proxy + TLS)
- Monitoring & CI/CD à intégrer (GitHub Actions + Sentry)

## Production VPS
- **Domaine**: foundation.newtiv.com
- **IP Publique**: 91.108.120.78
- **SSH**: `ssh root@91.108.120.78`
- **Panel Admin**: http://foundation.newtiv.com/boss/ ou http://91.108.120.78/boss/

### Déploiement Sans Conflits
```bash
ssh root@91.108.120.78
cd /root/buced/backend
./scripts/deploy_vps_safe.sh  # Gestion automatique des conflits
```
Voir `DEPLOY_CONFLICT_FREE.md` pour le guide complet.

## Roadmap
- Phase 1 : Setup & Authentification ✅
- Phase 2 : Modules core (orientation, projets, votes) ✅
- Phase 3 : IA (sentiment, scoring, recommandations) ✅
- Phase 4 : Prototypage & sponsors ✅
- Phase 5 : Accompagnement & déploiement ✅ (base)

> Prochaines étapes : tests automatisés, CI/CD, intégration paiement mobile, monitoring applicatif.

