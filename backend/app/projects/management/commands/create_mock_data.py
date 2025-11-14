from __future__ import annotations

import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from projects.models import Project
from votes.models import Vote

User = get_user_model()


class Command(BaseCommand):
    help = "Crée des données mock pour les projets, utilisateurs et votes"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=20,
            help="Nombre d'utilisateurs à créer (défaut: 20)",
        )
        parser.add_argument(
            "--projects",
            type=int,
            default=50,
            help="Nombre de projets à créer (défaut: 50)",
        )
        parser.add_argument(
            "--votes",
            type=int,
            default=200,
            help="Nombre de votes à créer (défaut: 200)",
        )

    def handle(self, *args, **options):
        num_users = options["users"]
        num_projects = options["projects"]
        num_votes = options["votes"]

        self.stdout.write(self.style.SUCCESS("🚀 Création des données mock..."))

        # Créer des utilisateurs
        self.stdout.write(f"📝 Création de {num_users} utilisateurs...")
        users = self.create_users(num_users)

        # Créer des projets
        self.stdout.write(f"💡 Création de {num_projects} projets...")
        projects = self.create_projects(num_projects, users)

        # Créer des votes
        self.stdout.write(f"⭐ Création de {num_votes} votes...")
        self.create_votes(num_votes, users, projects)

        self.stdout.write(self.style.SUCCESS(f"✅ {num_users} utilisateurs créés"))
        self.stdout.write(self.style.SUCCESS(f"✅ {num_projects} projets créés"))
        self.stdout.write(self.style.SUCCESS(f"✅ {num_votes} votes créés"))
        self.stdout.write(self.style.SUCCESS("🎉 Données mock créées avec succès !"))

    def create_users(self, count: int) -> list[User]:
        """Crée des utilisateurs mock"""
        first_names = [
            "Amara",
            "Fatou",
            "Koffi",
            "Aissatou",
            "Moussa",
            "Aminata",
            "Yacouba",
            "Mariam",
            "Bakary",
            "Hawa",
            "Ibrahim",
            "Awa",
            "Sékou",
            "Aminata",
            "Mamadou",
            "Kadiatou",
            "Ousmane",
            "Fatima",
            "Boubacar",
            "Aicha",
        ]
        last_names = [
            "Traoré",
            "Diallo",
            "Koné",
            "Sangaré",
            "Coulibaly",
            "Touré",
            "Keita",
            "Camara",
            "Doumbia",
            "Diabaté",
            "Kouyaté",
            "Sidibé",
            "Bamba",
            "Fofana",
            "Sylla",
            "Bah",
            "Barry",
            "Diarra",
            "Sissoko",
            "Kanté",
        ]
        establishments = [
            "Université Félix Houphouët-Boigny",
            "Université Nangui Abrogoua",
            "INP-HB Yamoussoukro",
            "École Polytechnique d'Abidjan",
            "ESATIC",
            "Institut National Polytechnique",
            "Université Alassane Ouattara",
            "École Supérieure de Commerce",
        ]

        users = []
        for i in range(count):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            username = f"{first_name.lower()}.{last_name.lower()}{i}"
            email = f"{username}@example.ci"

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "role": random.choice(["student", "advisor", "student", "student"]),  # Plus d'étudiants
                    "establishment": random.choice(establishments),
                    "bio": f"Passionné(e) par l'innovation et l'éducation. Étudiant(e) en {random.choice(['Informatique', 'Ingénierie', 'Économie', 'Sciences', 'Éducation'])}.",
                },
            )
            if created:
                user.set_password("password123")
                user.save()
            users.append(user)

        return users

    def create_projects(self, count: int, users: list[User]) -> list[Project]:
        """Crée des projets mock"""
        project_templates = [
            {
                "title": "EduSolar - Énergie solaire pour les écoles",
                "description": "Installation de panneaux solaires dans les écoles rurales pour améliorer l'accès à l'électricité et permettre l'utilisation d'équipements éducatifs numériques.",
                "category": "environment",
                "objectives": "Électrifier 50 écoles rurales, réduire les coûts énergétiques de 80%, former 200 enseignants à l'utilisation des technologies solaires.",
                "expected_impact": "Amélioration de l'environnement d'apprentissage pour 10 000 élèves, réduction des émissions de CO2, création d'emplois locaux.",
                "required_resources": "Panneaux solaires, batteries, onduleurs, formation technique, partenariats avec entreprises locales.",
            },
            {
                "title": "AgriConnect - Plateforme agricole intelligente",
                "description": "Application mobile connectant les agriculteurs aux marchés, fournissant des informations météo, conseils agronomiques et accès au crédit.",
                "category": "tech",
                "objectives": "Connecter 5000 agriculteurs, augmenter les revenus de 30%, réduire les pertes post-récolte.",
                "expected_impact": "Amélioration de la sécurité alimentaire, augmentation des revenus agricoles, modernisation du secteur agricole.",
                "required_resources": "Développement mobile, serveurs cloud, partenariats avec banques et coopératives.",
            },
            {
                "title": "HealthBot - Assistant santé communautaire",
                "description": "Chatbot intelligent fournissant des informations de santé de base, rappels de vaccination et orientation vers les centres de santé.",
                "category": "health",
                "objectives": "Atteindre 20 000 utilisateurs, améliorer la couverture vaccinale de 25%, réduire les consultations non urgentes.",
                "expected_impact": "Amélioration de l'accès aux informations de santé, meilleure prévention, réduction de la charge sur les centres de santé.",
                "required_resources": "IA conversationnelle, base de données médicale, partenariats avec ministère de la santé.",
            },
            {
                "title": "Code4Kids - Initiation à la programmation",
                "description": "Programme d'initiation à la programmation pour les enfants de 8 à 16 ans utilisant des outils visuels et ludiques.",
                "category": "education",
                "objectives": "Former 1000 enfants par an, créer 20 clubs de code, développer 50 applications par les enfants.",
                "expected_impact": "Développement des compétences numériques, préparation aux métiers de demain, réduction de la fracture numérique.",
                "required_resources": "Ordinateurs/tablettes, logiciels éducatifs, formateurs certifiés, espaces dédiés.",
            },
            {
                "title": "EcoWaste - Gestion intelligente des déchets",
                "description": "Système de collecte et recyclage des déchets avec application de géolocalisation et récompenses pour les citoyens.",
                "category": "environment",
                "objectives": "Collecter 100 tonnes de déchets recyclables par mois, créer 50 emplois verts, sensibiliser 50 000 citoyens.",
                "expected_impact": "Réduction de la pollution, création d'emplois, économie circulaire, amélioration de l'environnement urbain.",
                "required_resources": "Véhicules de collecte, centres de tri, application mobile, partenariats avec entreprises de recyclage.",
            },
            {
                "title": "MentorMatch - Plateforme de mentorat",
                "description": "Mise en relation d'étudiants avec des mentors professionnels pour le développement de carrière et l'orientation.",
                "category": "social",
                "objectives": "Créer 500 paires mentor-mentoré, organiser 100 sessions de mentorat par mois, améliorer l'employabilité de 40%.",
                "expected_impact": "Meilleure orientation professionnelle, développement des compétences, réduction du chômage des jeunes.",
                "required_resources": "Plateforme web, base de données de mentors, outils de communication, événements de networking.",
            },
            {
                "title": "WaterGuard - Surveillance de la qualité de l'eau",
                "description": "Capteurs IoT pour surveiller la qualité de l'eau potable dans les communautés rurales et alerter en cas de contamination.",
                "category": "health",
                "objectives": "Surveiller 100 points d'eau, réduire les maladies hydriques de 60%, former 200 agents communautaires.",
                "expected_impact": "Amélioration de la santé publique, réduction des maladies, meilleure gestion des ressources en eau.",
                "required_resources": "Capteurs IoT, infrastructure réseau, application mobile, formation des agents.",
            },
            {
                "title": "LearnLocal - Contenus éducatifs en langues locales",
                "description": "Plateforme proposant des contenus éducatifs en baoulé, dioula, bété et autres langues locales pour préserver la culture.",
                "category": "education",
                "objectives": "Créer 500 leçons en langues locales, toucher 5000 apprenants, former 100 enseignants.",
                "expected_impact": "Préservation du patrimoine culturel, amélioration de l'apprentissage, fierté identitaire.",
                "required_resources": "Création de contenus, enregistrements audio/vidéo, plateforme digitale, partenariats culturels.",
            },
        ]

        categories = ["tech", "social", "environment", "health", "education"]
        statuses = ["idea", "prototype", "mvp", "selected"]

        projects = []
        for i in range(count):
            template = random.choice(project_templates) if i < len(project_templates) else project_templates[0]
            owner = random.choice(users)

            # Créer une équipe aléatoire (0 à 5 membres)
            team_size = random.randint(0, 5)
            team_members = random.sample([u for u in users if u != owner], min(team_size, len(users) - 1))

            # Dates aléatoires dans les 6 derniers mois
            days_ago = random.randint(0, 180)
            created_at = timezone.now() - timedelta(days=days_ago)

            project = Project.objects.create(
                title=f"{template['title']}{' ' + str(i) if i >= len(project_templates) else ''}",
                description=template["description"],
                category=template.get("category", random.choice(categories)),
                owner=owner,
                status=random.choice(statuses),
                objectives=template.get("objectives", ""),
                expected_impact=template.get("expected_impact", ""),
                required_resources=template.get("required_resources", ""),
                community_score=round(random.uniform(60, 95), 2),
                ai_score=round(random.uniform(65, 90), 2),
                final_score=round(random.uniform(70, 92), 2),
                created_at=created_at,
            )

            # Ajouter les membres de l'équipe
            project.team.set(team_members)

            projects.append(project)

        return projects

    def create_votes(self, count: int, users: list[User], projects: list[Project]) -> None:
        """Crée des votes mock"""
        comments = [
            "Excellent projet ! Très innovant et impactant.",
            "Bonne idée, mais il faudrait plus de détails sur la faisabilité.",
            "Projet prometteur qui répond à un vrai besoin.",
            "J'adore cette approche ! Continuez comme ça.",
            "Intéressant, mais comment allez-vous financer cela ?",
            "Projet très bien pensé, félicitations à l'équipe !",
            "Bonne initiative pour la communauté.",
            "J'aimerais en savoir plus sur les résultats attendus.",
            "Projet ambitieux et nécessaire.",
            "Bravo pour cette innovation sociale !",
            "Très pertinent pour notre contexte local.",
            "Excellent travail d'équipe visible dans ce projet.",
            "Projet qui mérite d'être soutenu.",
            "Innovation remarquable, continuez !",
            "Bonne combinaison de technologie et d'impact social.",
        ]

        sentiments = ["positive", "neutral", "positive", "positive", "neutral"]

        for _ in range(count):
            voter = random.choice(users)
            project = random.choice(projects)

            # Vérifier si ce vote existe déjà
            if Vote.objects.filter(voter=voter, project=project).exists():
                continue

            # Date aléatoire dans les 30 derniers jours
            days_ago = random.randint(0, 30)
            created_at = timezone.now() - timedelta(days=days_ago)

            Vote.objects.create(
                voter=voter,
                project=project,
                rating=random.randint(3, 5),  # Notes entre 3 et 5
                comment=random.choice(comments),
                sentiment=random.choice(sentiments),
                created_at=created_at,
            )

            # Mettre à jour les scores du projet
            votes = project.votes.all()
            if votes.exists():
                avg_rating = sum(v.rating for v in votes) / len(votes)
                project.community_score = round((avg_rating / 5) * 100, 2)
                project.final_score = round((project.community_score + project.ai_score) / 2, 2)
                project.save()

