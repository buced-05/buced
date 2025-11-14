import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  EyeIcon,
  StarIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { useLanguageStore } from "../../stores/language";
import { cn } from "../../utils/cn";
import { projectsService, votesService } from "../../api/services";
import type { Project, Vote } from "../../types/api";
import useAuth from "../../hooks/useAuth";
import { errorHandler, safeAsync } from "../../utils/errorHandler";
import { safeArray, safeString, safeNumber } from "../../utils/validation";
import { CompactComments } from "../../components/feed/CompactComments";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import "dayjs/locale/es";
import "dayjs/locale/ko";
import "dayjs/locale/zh";
import "dayjs/locale/en";

dayjs.extend(relativeTime);

const localeMap: Record<string, string> = {
  fr: "fr",
  es: "es",
  ko: "ko",
  zh: "zh",
  en: "en",
};

interface FeedItem {
  id: string;
  type: "project" | "vote" | "achievement" | "milestone";
  project?: Project;
  vote?: Vote;
  timestamp: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  content?: string;
  achievement?: {
    title: string;
    description: string;
    icon: string;
  };
}

// Gradients pour les images de fond
const projectGradients = [
  { dark: "from-purple-500 via-pink-500 to-red-500", light: "from-purple-400 via-pink-400 to-red-400" },
  { dark: "from-cyan-500 via-blue-500 to-indigo-500", light: "from-cyan-400 via-blue-400 to-indigo-400" },
  { dark: "from-green-500 via-emerald-500 to-teal-500", light: "from-green-400 via-emerald-400 to-teal-400" },
  { dark: "from-yellow-500 via-orange-500 to-red-500", light: "from-yellow-400 via-orange-400 to-red-400" },
  { dark: "from-pink-500 via-rose-500 to-fuchsia-500", light: "from-pink-400 via-rose-400 to-fuchsia-400" },
  { dark: "from-blue-500 via-cyan-500 to-teal-500", light: "from-blue-400 via-cyan-400 to-teal-400" },
];

const getGradientForProject = (projectId: number, isDark: boolean) => {
  const gradient = projectGradients[projectId % projectGradients.length];
  return isDark ? gradient.dark : gradient.light;
};

const FeedPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  
  useEffect(() => {
    const locale = localeMap[language] || "fr";
    dayjs.locale(locale);
  }, [language]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "projects" | "votes" | "achievements">("all");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Array<{
    id: number;
    user: { id: number; name: string; avatar?: string };
    content: string;
    created_at: string;
  }>>>({});
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeed();
  }, [filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading]);

  const createMockData = (): Project[] => {
    const firstNames = ["Amadou", "Fatou", "Koffi", "Aissatou", "Moussa", "Awa", "Yao", "Kouamé", "Léa", "Kouassi", "Marie", "Jean", "Sophie", "Paul", "Aminata", "Ibrahim", "Hawa", "Bakary", "Aminata", "Sékou", "Mariam", "Ousmane", "Kadiatou", "Boubacar", "Aicha"];
    const lastNames = ["Traoré", "Diallo", "Koné", "Sangaré", "Coulibaly", "Kouassi", "Kouadio", "Yao", "Bamba", "Toure", "Cissé", "Keita", "Sylla", "Camara", "Bah", "Barry", "Sow", "Ba", "Ndiaye", "Diop", "Diawara", "Konaté", "Fofana", "Sidibé", "Dembélé"];
    const establishments = [
      "INP-HB", 
      "Université Félix Houphouët-Boigny", 
      "ESATIC", 
      "Université Nangui Abrogoua", 
      "École Polytechnique",
      "Université Alassane Ouattara",
      "INPHB",
      "École Supérieure de Commerce",
      "Université de Cocody",
      "Institut National Polytechnique"
    ];
    const categories = ["tech", "agritech", "health", "education", "environment", "social", "energy", "finance"];
    const statuses = ["idea", "prototype", "mvp", "development", "selected"];
    
    const projectTemplates = [
      {
        titles: ["EduSolar - Énergie solaire pour les écoles", "SolarEdu - Panneaux solaires éducatifs", "SunSchool - Électricité solaire pour l'éducation", "EcoSchool - Écoles autonomes en énergie"],
        descriptions: ["Installation de panneaux solaires dans les écoles rurales pour améliorer l'accès à l'électricité et permettre l'utilisation d'équipements éducatifs numériques.", "Solution solaire innovante permettant aux écoles d'avoir une source d'énergie fiable et durable.", "Système d'énergie renouvelable spécialement conçu pour les établissements scolaires."],
        category: "energy",
        objectives: ["Électrifier 50 écoles rurales", "Alimenter 100 écoles en énergie propre", "Créer 200 écoles autonomes"],
        impacts: ["Amélioration pour 10 000 élèves", "Réduction des coûts énergétiques", "Accès à l'éducation numérique"]
      },
      {
        titles: ["AgriConnect - Plateforme agricole intelligente", "FarmLink - Connecter les agriculteurs", "AgriTech CI - Innovation agricole", "SmartFarm - Agriculture intelligente"],
        descriptions: ["Application mobile connectant les agriculteurs aux marchés, fournissant des informations météo et conseils agronomiques.", "Plateforme digitale révolutionnant l'agriculture en Côte d'Ivoire.", "Solution technologique pour moderniser l'agriculture locale."],
        category: "agritech",
        objectives: ["Connecter 5000 agriculteurs", "Atteindre 10 000 utilisateurs", "Créer un réseau de 20 000 agriculteurs"],
        impacts: ["Augmentation des revenus de 30%", "Amélioration de la productivité", "Réduction des pertes post-récolte"]
      },
      {
        titles: ["HealthBot - Assistant santé communautaire", "MediBot - Santé mobile", "HealthConnect - Connecter la santé", "CareBot - Soins intelligents"],
        descriptions: ["Chatbot intelligent fournissant des informations de santé de base, rappels de vaccination et orientation vers les centres de santé.", "Application de santé mobile utilisant l'IA pour améliorer l'accès aux soins.", "Plateforme de santé digitale pour les communautés rurales."],
        category: "health",
        objectives: ["Atteindre 20 000 utilisateurs", "Servir 50 000 personnes", "Créer un réseau de 100 000 utilisateurs"],
        impacts: ["Amélioration de la couverture vaccinale", "Réduction de la mortalité infantile", "Accès facilité aux soins"]
      },
      {
        titles: ["Code4Kids - Initiation à la programmation", "KidsCode - Programmer dès l'enfance", "EduCode - Éducation au code", "CodeLab - Laboratoire de programmation"],
        descriptions: ["Programme d'initiation à la programmation pour les enfants de 8 à 16 ans utilisant des outils visuels et ludiques.", "Formation en programmation adaptée aux jeunes générations.", "Initiative éducative pour développer les compétences numériques."],
        category: "education",
        objectives: ["Former 1000 enfants par an", "Former 5000 enfants", "Créer 10 000 jeunes programmeurs"],
        impacts: ["Développement des compétences numériques", "Préparation aux métiers du futur", "Réduction de la fracture numérique"]
      },
      {
        titles: ["EcoWaste - Gestion intelligente des déchets", "WasteSmart - Déchets intelligents", "RecycleCI - Recyclage intelligent", "EcoCollect - Collecte écologique"],
        descriptions: ["Système de collecte et recyclage des déchets avec application de géolocalisation et récompenses pour les citoyens.", "Solution innovante pour une meilleure gestion des déchets urbains.", "Plateforme de recyclage connectant citoyens et centres de traitement."],
        category: "environment",
        objectives: ["Collecter 100 tonnes par mois", "Recycler 500 tonnes", "Créer un réseau de 1000 points de collecte"],
        impacts: ["Réduction de la pollution", "Création d'emplois verts", "Amélioration de l'environnement urbain"]
      },
      {
        titles: ["MarketPlace CI - Marché local digital", "LocalMarket - Marché de proximité", "VillageMarket - Marché villageois", "CommunityMarket - Marché communautaire"],
        descriptions: ["Plateforme e-commerce connectant les commerçants locaux aux consommateurs dans toute la Côte d'Ivoire.", "Marketplace digitale pour promouvoir les produits locaux et l'économie locale.", "Application mobile facilitant les achats locaux et le commerce de proximité."],
        category: "tech",
        objectives: ["Connecter 1000 commerçants", "Atteindre 50 000 utilisateurs", "Créer un réseau de 200 000 utilisateurs"],
        impacts: ["Soutien à l'économie locale", "Création d'emplois", "Facilitation des échanges commerciaux"]
      },
      {
        titles: ["MicroFinance CI - Financement participatif", "FundMe CI - Financement collaboratif", "CrowdFund CI - Financement de masse", "InvestCI - Investissement local"],
        descriptions: ["Plateforme de microfinance permettant aux entrepreneurs locaux d'accéder à des prêts et financements.", "Système de financement participatif pour soutenir les projets innovants.", "Application de financement collaboratif pour l'entrepreneuriat local."],
        category: "finance",
        objectives: ["Financer 500 projets", "Mobiliser 1 milliard FCFA", "Créer 2000 emplois"],
        impacts: ["Soutien à l'entrepreneuriat", "Création d'emplois", "Développement économique local"]
      },
      {
        titles: ["EduPlatform - Plateforme e-learning", "LearnCI - Apprentissage en ligne", "StudyHub - Hub d'études", "EduHub - Centre éducatif digital"],
        descriptions: ["Plateforme d'apprentissage en ligne offrant des cours accessibles à tous les niveaux.", "Solution e-learning pour démocratiser l'accès à l'éducation de qualité.", "Plateforme éducative digitale avec contenu adapté au contexte ivoirien."],
        category: "education",
        objectives: ["Former 10 000 étudiants", "Créer 500 cours", "Atteindre 100 000 apprenants"],
        impacts: ["Démocratisation de l'éducation", "Amélioration des compétences", "Accès à la formation continue"]
      },
      {
        titles: ["TransportSmart - Mobilité intelligente", "MoveCI - Transport connecté", "TransitCI - Transit intelligent", "MobilityHub - Hub de mobilité"],
        descriptions: ["Application de transport intelligent optimisant les déplacements urbains et réduisant les temps de trajet.", "Plateforme de mobilité connectant les usagers et les transporteurs.", "Solution de transport durable pour améliorer la mobilité urbaine."],
        category: "tech",
        objectives: ["Servir 50 000 utilisateurs", "Optimiser 1 million de trajets", "Réduire les émissions de 30%"],
        impacts: ["Amélioration de la mobilité", "Réduction de la pollution", "Optimisation des transports"]
      },
      {
        titles: ["WaterGuard - Gestion de l'eau", "AquaCI - Eau intelligente", "WaterSmart - Eau connectée", "HydroCI - Hydrologie digitale"],
        descriptions: ["Système intelligent de gestion et monitoring de l'eau pour les communautés rurales.", "Solution technologique pour améliorer l'accès à l'eau potable.", "Plateforme de gestion de l'eau utilisant l'IoT et l'IA."],
        category: "environment",
        objectives: ["Servir 100 communautés", "Améliorer l'accès pour 50 000 personnes", "Réduire le gaspillage de 40%"],
        impacts: ["Amélioration de l'accès à l'eau", "Réduction du gaspillage", "Santé publique améliorée"]
      }
    ];

    const mockProjects: Project[] = [];
    const now = Date.now();

    // Générer 30 projets variés
    for (let i = 1; i <= 30; i++) {
      const template = projectTemplates[Math.floor(Math.random() * projectTemplates.length)];
      const titleIndex = Math.floor(Math.random() * template.titles.length);
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const descriptionIndex = Math.floor(Math.random() * template.descriptions.length);
      const objectiveIndex = Math.floor(Math.random() * template.objectives.length);
      const impactIndex = Math.floor(Math.random() * template.impacts.length);
      
      // Scores variés mais réalistes
      const communityScore = Math.floor(Math.random() * 25) + 75; // 75-100
      const aiScore = Math.floor(Math.random() * 25) + 75; // 75-100
      const finalScore = Math.round((communityScore * 0.6 + aiScore * 0.4) * 10) / 10;
      
      // Dates variées (derniers 30 jours)
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      // Générer une équipe aléatoire (0-4 membres)
      const teamSize = Math.floor(Math.random() * 5);
      const team: any[] = [];
      const usedNames = new Set<string>();
      for (let j = 0; j < teamSize; j++) {
        let teamFirstName, teamLastName, teamKey;
        do {
          teamFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          teamLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          teamKey = `${teamFirstName}-${teamLastName}`;
        } while (usedNames.has(teamKey));
        usedNames.add(teamKey);
        
        team.push({
          id: 100 + j,
          first_name: teamFirstName,
          last_name: teamLastName,
          email: `${teamFirstName.toLowerCase()}.${teamLastName.toLowerCase()}@example.ci`,
          role: "student" as const,
          establishment: establishments[Math.floor(Math.random() * establishments.length)],
          username: `${teamFirstName.toLowerCase()}${teamLastName.toLowerCase()}`,
          date_joined: new Date(now - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      mockProjects.push({
        id: i,
        title: template.titles[titleIndex],
        description: template.descriptions[descriptionIndex],
        category: template.category,
        status,
        owner: {
          id: i,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.ci`,
          role: Math.random() > 0.8 ? "advisor" : "student",
          establishment: establishments[Math.floor(Math.random() * establishments.length)],
          username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
          date_joined: new Date(now - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        } as any,
        team,
        objectives: template.objectives[objectiveIndex],
        expected_impact: template.impacts[impactIndex],
        required_resources: "Ressources techniques, financières et humaines nécessaires",
        community_score: communityScore,
        ai_score: aiScore,
        final_score: finalScore,
        progress: {},
        documents: [],
        created_at: createdAt,
        updated_at: new Date(now - Math.random() * daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return mockProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const [projectsData, votesData] = await Promise.all([
        safeAsync(
          () => projectsService.list({ page: 1, pageSize: 20 }),
          { results: [], next: null },
          'Fetch Projects'
        ),
        safeAsync(
          () => votesService.list({ page: 1, pageSize: 20 }),
          { results: [], next: null },
          'Fetch Votes'
        ),
      ]);

      const items: FeedItem[] = [];
      let projects = safeArray(projectsData?.results, []);

      // Toujours utiliser les données mock pour avoir un flux riche
      // Mélanger avec les données réelles si disponibles
      const mockProjects = createMockData();
      if (projects.length === 0) {
        projects = mockProjects;
      } else {
        // Mélanger les projets réels avec les mock pour avoir plus de contenu
        projects = [...projects, ...mockProjects.slice(0, 10)].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      // Ajouter les projets avec validation
      projects.forEach((project) => {
        if (!project || !project.id) return; // Skip invalid projects
        
        const itemId = `project-${project.id}`;
        const owner = project.owner || {};
        const firstName = safeString(owner.first_name, '');
        const lastName = safeString(owner.last_name, '');
        
        items.push({
          id: itemId,
          type: "project",
          project,
          timestamp: safeString(project.created_at, new Date().toISOString()),
          user: {
            id: safeNumber(owner.id, 0),
            name: `${firstName} ${lastName}`.trim() || 'Utilisateur',
          },
        });
        // Initialiser les compteurs
        if (!viewCounts[itemId]) {
          setViewCounts((prev) => ({
            ...prev,
            [itemId]: Math.floor(Math.random() * 500) + 100,
          }));
        }
        if (!likeCounts[itemId]) {
          setLikeCounts((prev) => ({
            ...prev,
            [itemId]: Math.floor(Math.random() * 50) + 10,
          }));
        }
      });

      // Ajouter les votes récents avec validation
      safeArray(votesData?.results, []).forEach((vote) => {
        if (!vote || !vote.id) return; // Skip invalid votes
        
        const voter = vote.voter || {};
        const firstName = safeString(voter.first_name, '');
        const lastName = safeString(voter.last_name, '');
        
        items.push({
          id: `vote-${vote.id}`,
          type: "vote",
          vote,
          timestamp: safeString(vote.created_at, new Date().toISOString()),
          user: {
            id: safeNumber(voter.id, 0),
            name: `${firstName} ${lastName}`.trim() || 'Utilisateur',
          },
        });
      });

      // Noms pour générer les données mock
      const firstNames = ["Amadou", "Fatou", "Koffi", "Aissatou", "Moussa", "Awa", "Yao", "Kouamé", "Léa", "Kouassi", "Marie", "Jean", "Sophie", "Paul", "Aminata", "Ibrahim", "Hawa", "Bakary", "Aminata", "Sékou", "Mariam", "Ousmane", "Kadiatou", "Boubacar", "Aicha"];
      const lastNames = ["Traoré", "Diallo", "Koné", "Sangaré", "Coulibaly", "Kouassi", "Kouadio", "Yao", "Bamba", "Toure", "Cissé", "Keita", "Sylla", "Camara", "Bah", "Barry", "Sow", "Ba", "Ndiaye", "Diop", "Diawara", "Konaté", "Fofana", "Sidibé", "Dembélé"];

        // Générer des votes mock si pas de votes réels ou pour enrichir le flux
        if ((votesData.results || []).length < 10) {
          const mockVotes: Vote[] = [];
          const mockComments = [
          "Excellent projet ! Très innovant et prometteur.",
          "Bonne idée mais il faudrait approfondir certains aspects techniques.",
          "Projet intéressant avec un fort potentiel d'impact social.",
          "Bravo pour cette initiative ! J'aimerais en savoir plus.",
          "Très bonne approche, continuez dans cette direction.",
          "Projet ambitieux qui répond à un vrai besoin.",
          "Impressionnant ! Comment puis-je contribuer ?",
          "Excellente idée, j'espère que ça va aboutir.",
          "Projet bien pensé avec une vision claire.",
          "Félicitations pour cette innovation !",
          "Très prometteur, je suis convaincu du potentiel.",
          "Bonne initiative pour la communauté.",
          "Projet qui mérite d'être soutenu.",
          "Très intéressant, j'attends avec impatience la suite.",
          "Excellente approche pour résoudre ce problème.",
          "Innovation remarquable !",
          "Projet qui va changer les choses.",
          "Bravo pour cette créativité !",
          "Initiative louable et bien structurée.",
          "Projet avec un fort impact potentiel."
        ];
        const sentiments = ["positive", "neutral", "positive", "positive", "neutral", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive", "positive"];

        for (let i = 1; i <= 20; i++) {
          const projectId = projects[Math.floor(Math.random() * projects.length)]?.id || Math.floor(Math.random() * 30) + 1;
          const rating = Math.floor(Math.random() * 3) + 3; // 3-5
          const commentText = mockComments[Math.floor(Math.random() * mockComments.length)];
          const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
          const voterId = Math.floor(Math.random() * 25) + 1;
          const hoursAgo = Math.floor(Math.random() * 168); // Dernières 7 jours
          
          mockVotes.push({
            id: 1000 + i,
            voter: voterId,
            voter_display: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            project: projectId,
            rating,
            comment: commentText,
            sentiment,
            created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
          } as Vote);
        }

        mockVotes.forEach((vote) => {
          items.push({
            id: `vote-${vote.id}`,
            type: "vote",
            vote,
            timestamp: vote.created_at,
            user: {
              id: vote.voter,
              name: vote.voter_display,
            },
          });
        });
      }

      // Ajouter des achievements variés pour la démo
      const achievementTemplates = [
        {
          titles: ["Nouveau niveau atteint !", "Niveau Expert débloqué", "Niveau Maître atteint", "Niveau Légende atteint", "Niveau Champion débloqué"],
          descriptions: ["Vous avez atteint le niveau Expert", "Félicitations ! Vous êtes maintenant Expert", "Vous avez atteint le niveau Maître", "Incroyable ! Vous êtes maintenant Légende", "Extraordinaire ! Vous êtes Champion"],
          icon: "trophy",
        },
        {
          titles: ["100 votes donnés", "250 votes donnés", "500 votes donnés", "1000 votes donnés", "2000 votes donnés"],
          descriptions: ["Félicitations pour votre engagement !", "Merci pour votre contribution active !", "Vous êtes un membre très actif !", "Vous êtes un pilier de la communauté !", "Vous êtes une légende de la communauté !"],
          icon: "star",
        },
        {
          titles: ["Projet sélectionné", "Projet financé", "Projet lauréat", "Top projet du mois", "Projet de l'année"],
          descriptions: ["Votre projet a été sélectionné pour le financement", "Félicitations ! Votre projet a reçu un financement", "Votre projet est lauréat du concours", "Votre projet est le top projet du mois !", "Votre projet est le projet de l'année !"],
          icon: "bolt",
        },
        {
          titles: ["Premier projet créé", "5 projets créés", "10 projets créés", "20 projets créés", "50 projets créés"],
          descriptions: ["Bienvenue ! Vous avez créé votre premier projet", "Vous avez créé 5 projets, continuez !", "Impressionnant ! Vous avez créé 10 projets", "Extraordinaire ! Vous avez créé 20 projets", "Légendaire ! Vous avez créé 50 projets"],
          icon: "sparkles",
        },
        {
          titles: ["Membre de l'équipe", "Leader d'équipe", "Créateur de communauté", "Influenceur", "Ambassadeur"],
          descriptions: ["Vous avez rejoint une équipe de projet", "Vous dirigez maintenant une équipe", "Vous avez créé une communauté active", "Vous êtes un influenceur reconnu", "Vous êtes un ambassadeur de l'innovation"],
          icon: "user-group",
        },
        {
          titles: ["Premier vote", "10 votes donnés", "50 votes donnés", "100 votes donnés", "500 votes donnés"],
          descriptions: ["Vous avez donné votre premier vote", "Vous avez voté 10 fois, merci !", "Vous avez voté 50 fois, excellent !", "Vous avez voté 100 fois, bravo !", "Vous avez voté 500 fois, incroyable !"],
          icon: "star",
        },
        {
          titles: ["Top contributeur", "Mentor actif", "Expert reconnu", "Innovateur", "Pionnier"],
          descriptions: ["Vous êtes un top contributeur cette semaine", "Vous êtes un mentor très actif", "Vous êtes reconnu comme expert", "Vous êtes un innovateur reconnu", "Vous êtes un pionnier de l'innovation"],
          icon: "trophy",
        }
      ];

      const achievements = [];
      for (let i = 0; i < 15; i++) {
        const template = achievementTemplates[Math.floor(Math.random() * achievementTemplates.length)];
        const titleIndex = Math.floor(Math.random() * template.titles.length);
        const userId = Math.floor(Math.random() * 25) + 1;
        const hoursAgo = Math.floor(Math.random() * 168); // Dernières 7 jours
        
        achievements.push({
          id: `achievement-${i + 1}`,
          title: template.titles[titleIndex],
          description: template.descriptions[titleIndex],
          icon: template.icon,
          time: Date.now() - hoursAgo * 60 * 60 * 1000,
          userId,
        });
      }

      achievements.forEach((ach) => {
        items.push({
          id: ach.id,
          type: "achievement",
          timestamp: new Date(ach.time).toISOString(),
          user: {
            id: ach.userId,
            name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
          },
          achievement: {
            title: ach.title,
            description: ach.description,
            icon: ach.icon,
          },
        });
      });

      // Trier par timestamp
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setFeedItems(items);
      setHasMore(projectsData.next !== null || votesData.next !== null);
    } catch (err) {
      console.error("Erreur lors du chargement du flux:", err);
      // En cas d'erreur, utiliser les données mock
      const mockProjects = createMockData();
      const items: FeedItem[] = mockProjects.map((project) => ({
        id: `project-${project.id}`,
        type: "project",
        project,
        timestamp: project.created_at,
        user: {
          id: project.owner.id,
          name: `${project.owner.first_name} ${project.owner.last_name}`,
        },
      }));
      setFeedItems(items);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const [projectsData, votesData] = await Promise.all([
        projectsService.list({ page: nextPage, pageSize: 20 }),
        votesService.list({ page: nextPage, pageSize: 20 }),
      ]);

      const newItems: FeedItem[] = [];

      projectsData.results?.forEach((project) => {
        const itemId = `project-${project.id}`;
        newItems.push({
          id: itemId,
          type: "project",
          project,
          timestamp: project.created_at,
          user: {
            id: project.owner.id,
            name: `${project.owner.first_name} ${project.owner.last_name}`,
          },
        });
        if (!viewCounts[itemId]) {
          setViewCounts((prev) => ({
            ...prev,
            [itemId]: Math.floor(Math.random() * 500) + 100,
          }));
        }
        if (!likeCounts[itemId]) {
          setLikeCounts((prev) => ({
            ...prev,
            [itemId]: Math.floor(Math.random() * 50) + 10,
          }));
        }
      });

      votesData.results?.forEach((vote) => {
        newItems.push({
          id: `vote-${vote.id}`,
          type: "vote",
          vote,
          timestamp: vote.created_at || new Date().toISOString(),
          user: {
            id: vote.voter?.id || 0,
            name: vote.voter?.first_name ? `${vote.voter.first_name} ${vote.voter.last_name}` : "Utilisateur",
          },
        });
      });

      setFeedItems((prev) => [...prev, ...newItems]);
      setHasMore(projectsData.next !== null || votesData.next !== null);
      setPage(nextPage);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (itemId: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [itemId]: (prevCounts[itemId] || 0) - 1,
        }));
      } else {
        newSet.add(itemId);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [itemId]: (prevCounts[itemId] || 0) + 1,
        }));
      }
      return newSet;
    });
  };

  const handleSave = (itemId: string) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleShare = async (item: FeedItem) => {
    if (navigator.share && item.project) {
      try {
        await navigator.share({
          title: item.project.title,
          text: item.project.description,
          url: `${window.location.origin}/projects/${item.project.id}`,
        });
      } catch (err) {
        // L'utilisateur a annulé le partage
      }
    } else {
      const url = `${window.location.origin}/projects/${item.project?.id}`;
      navigator.clipboard.writeText(url);
      alert("Lien copié dans le presse-papiers !");
    }
  };

  const filteredItems = feedItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "projects") return item.type === "project";
    if (filter === "votes") return item.type === "vote";
    if (filter === "achievements") return item.type === "achievement";
    return true;
  });

  const renderProjectCard = (item: FeedItem, index: number) => {
    if (!item.project) return null;

    const project = item.project;
    const isLiked = likedItems.has(item.id);
    const isSaved = savedItems.has(item.id);
    const gradient = getGradientForProject(project.id, theme === "dark");
    const viewCount = viewCounts[item.id] || Math.floor(Math.random() * 500) + 100;
    const likeCount = (likeCounts[item.id] || Math.floor(Math.random() * 50) + 10) + (isLiked ? 1 : 0);

    return (
      <Card
        key={item.id}
        className={cn(
          "overflow-hidden group hover:scale-[1.02] transition-all duration-300",
          theme === "dark" ? "hover:shadow-neon-lg" : "hover:shadow-xl"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Header avec animation */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          theme === "dark" 
            ? "border-neon-cyan/10 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent"
            : "border-gray-200 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent"
        )}>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110",
                theme === "dark"
                  ? "bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink text-white"
                  : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white"
              )}
            >
              {item.user?.name.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className={cn("font-bold text-sm", theme === "dark" ? "text-white" : "text-gray-900")}>
                {item.user?.name}
              </p>
              <p className={cn("text-xs flex items-center gap-1", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                <span>{dayjs(item.timestamp).fromNow()}</span>
                {project.status === "selected" && (
                  <Badge variant="primary" className="ml-2 text-xs px-1.5 py-0.5">
                    <StarIconSolid className="h-3 w-3 inline mr-1" />
                    Sélectionné
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <Badge
            variant="primary"
            className={cn(
              "transition-all duration-300 group-hover:scale-110",
              theme === "dark" && "bg-gradient-to-r from-neon-purple to-neon-pink"
            )}
          >
            {project.category}
          </Badge>
        </div>

        {/* Image/Content Area avec gradient animé */}
        <div
          className={cn(
            "relative aspect-[4/3] flex items-center justify-center cursor-pointer overflow-hidden group/image",
            theme === "dark" ? "bg-[#0F0F1E]" : "bg-gray-100"
          )}
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          {/* Gradient animé en arrière-plan */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br animate-gradient-shift",
              gradient,
              theme === "dark" ? "opacity-60" : "opacity-70"
            )}
          />
          
          {/* Pattern overlay */}
          <div className={cn(
            "absolute inset-0",
            theme === "dark" ? "opacity-10" : "opacity-5"
          )} style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${theme === "dark" ? "white" : "gray"} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />

          {/* Icône centrale avec animation */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <SparklesIcon
              className={cn(
                "h-24 w-24 transition-all duration-500 group-hover/image:scale-125 group-hover/image:rotate-12",
                theme === "dark" ? "text-white/30" : "text-gray-400/40"
              )}
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t",
              theme === "dark" ? "from-black/80 via-black/40 to-transparent" : "from-black/60 via-black/30 to-transparent"
            )} />
          </div>

          {/* Contenu overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <h3 className={cn("text-2xl font-black mb-2 text-white drop-shadow-lg")}>{project.title}</h3>
            <p className={cn("text-sm text-white/90 line-clamp-2 mb-3")}>{project.description}</p>
            
            {/* Mini stats */}
            <div className="flex items-center gap-4 text-white/80 text-xs">
              <div className="flex items-center gap-1">
                <TrophyIcon className="h-4 w-4" />
                <span className="font-bold">{project.final_score.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserGroupIcon className="h-4 w-4" />
                <span>{project.team?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                <span>{viewCount}</span>
              </div>
            </div>
          </div>

          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Stats Bar améliorée */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          theme === "dark"
            ? "border-neon-cyan/10 bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent"
            : "border-gray-200 bg-gradient-to-r from-transparent via-purple-50/50 to-transparent"
        )}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group/stat">
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300 group-hover/stat:scale-110",
                theme === "dark" ? "bg-neon-yellow/20 group-hover/stat:bg-neon-yellow/30" : "bg-yellow-100 group-hover/stat:bg-yellow-200"
              )}>
                <TrophyIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")} />
              </div>
              <div>
                <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Score</p>
                <span className={cn("text-sm font-black", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")}>
                  {project.final_score.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 group/stat">
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300 group-hover/stat:scale-110",
                theme === "dark" ? "bg-neon-green/20 group-hover/stat:bg-neon-green/30" : "bg-green-100 group-hover/stat:bg-green-200"
              )}>
                <UserGroupIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-green" : "text-green-600")} />
              </div>
              <div>
                <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Équipe</p>
                <span className={cn("text-sm font-black", theme === "dark" ? "text-neon-green" : "text-green-600")}>
                  {project.team?.length || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 group/stat">
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300 group-hover/stat:scale-110",
                theme === "dark" ? "bg-neon-cyan/20 group-hover/stat:bg-neon-cyan/30" : "bg-blue-100 group-hover/stat:bg-blue-200"
              )}>
                <EyeIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
              </div>
              <div>
                <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Vues</p>
                <span className={cn("text-sm font-black", theme === "dark" ? "text-neon-cyan" : "text-blue-600")}>
                  {viewCount}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={project.status === "selected" ? "primary" : "outline"}
            className={cn(
              "transition-all duration-300 group-hover:scale-110",
              project.status === "selected" && theme === "dark" && "bg-gradient-to-r from-neon-green to-emerald-500 text-white"
            )}
          >
            {project.status}
          </Badge>
        </div>

        {/* Actions améliorées */}
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => handleLike(item.id)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200 group/like",
                isLiked
                  ? theme === "dark"
                    ? "text-neon-pink"
                    : "text-pink-600"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-neon-pink"
                  : "text-gray-600 hover:text-pink-600"
              )}
            >
              {isLiked ? (
                <HeartIconSolid className="h-7 w-7 fill-current animate-pulse group-hover/like:scale-125 transition-transform" />
              ) : (
                <HeartIcon className="h-7 w-7 group-hover/like:scale-125 transition-transform" />
              )}
              <span className="text-sm font-bold">{likeCount}</span>
            </button>

            <button
              onClick={() => {
                try {
                  if (project.id) {
                    navigate(`/projects/${project.id}`);
                  }
                } catch (error) {
                  errorHandler.logError(error, 'Navigate to Project from Actions');
                }
              }}
              className={cn(
                "flex items-center gap-2 transition-all duration-200 hover:scale-110",
                theme === "dark" ? "text-gray-400 hover:text-neon-cyan" : "text-gray-600 hover:text-blue-600"
              )}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-bold">{Math.max(0, Math.floor(Math.random() * 50))}</span>
            </button>

            <button
              onClick={() => handleShare(item)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200 hover:scale-110",
                theme === "dark" ? "text-gray-400 hover:text-neon-green" : "text-gray-600 hover:text-green-600"
              )}
            >
              <ShareIcon className="h-7 w-7" />
            </button>
          </div>

          <button
            onClick={() => handleSave(item.id)}
            className={cn(
              "transition-all duration-200 hover:scale-125",
              isSaved
                ? theme === "dark"
                  ? "text-neon-yellow"
                  : "text-yellow-600"
                : theme === "dark"
                ? "text-gray-400 hover:text-neon-yellow"
                : "text-gray-600 hover:text-yellow-600"
            )}
          >
            {isSaved ? (
              <BookmarkIconSolid className="h-7 w-7 fill-current animate-bounce" />
            ) : (
              <BookmarkIcon className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Description avec animation */}
        {project.description && (
          <div className={cn(
            "px-4 pb-4 border-t pt-4",
            theme === "dark" ? "border-neon-cyan/10" : "border-gray-200"
          )}>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              <span className="font-bold hover:underline cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                {item.user?.name}
              </span>{" "}
              {project.description.length > 200
                ? `${project.description.substring(0, 200)}... ` : project.description}
              {project.description.length > 200 && (
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className={cn("font-medium hover:underline", theme === "dark" ? "text-neon-cyan" : "text-blue-600")}
                >
                  voir plus
                </button>
              )}
            </p>
          </div>
        )}

        {/* Commentaires compacts */}
        <CompactComments
          itemId={item.id}
          comments={comments[item.id] || []}
          commentCount={Math.floor(Math.random() * 20) + 5}
          onAddComment={(content) => {
            const newComment = {
              id: Date.now(),
              user: {
                id: user?.id || 0,
                name: user?.full_name || user?.first_name || "Utilisateur",
              },
              content,
              created_at: new Date().toISOString(),
            };
            setComments((prev) => ({
              ...prev,
              [item.id]: [...(prev[item.id] || []), newComment],
            }));
          }}
          onViewAll={() => {
            try {
              if (project.id) {
                navigate(`/projects/${project.id}`);
              }
            } catch (error) {
              errorHandler.logError(error, 'Navigate to Project from Comments');
            }
          }}
        />
      </Card>
    );
  };

  const renderVoteCard = (item: FeedItem, index: number) => {
    if (!item.vote) return null;

    const isLiked = likedItems.has(item.id);

    return (
      <Card
        key={item.id}
        className={cn(
          "p-6 group hover:scale-[1.02] transition-all duration-300",
          theme === "dark" 
            ? "hover:shadow-neon-lg bg-gradient-to-br from-[#1A1A2E] to-[#2A2A3E]" 
            : "hover:shadow-lg bg-white"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
              theme === "dark"
                ? "bg-gradient-to-br from-neon-pink via-neon-purple to-neon-cyan text-white"
                : "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white"
            )}
          >
            {item.user?.name.charAt(0).toUpperCase() || "V"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("font-bold text-base", theme === "dark" ? "text-white" : "text-gray-900")}>
                {item.user?.name}
              </span>
              <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                {dayjs(item.timestamp).fromNow()}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                theme === "dark" ? "bg-neon-pink/20 border border-neon-pink/30" : "bg-pink-100 border border-pink-200"
              )}>
                <FireIcon className={cn("h-6 w-6 animate-pulse", theme === "dark" ? "text-neon-pink" : "text-pink-600")} />
                <span className={cn("font-black text-lg", theme === "dark" ? "text-neon-pink" : "text-pink-600")}>
                  {Math.max(0, Math.min(5, safeNumber(item.vote.rating, 0)))}/5
                </span>
              </div>
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = Math.max(0, Math.min(5, safeNumber(item.vote?.rating, 0)));
                return (
                  <StarIconSolid
                    key={i}
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      i < rating
                        ? theme === "dark"
                          ? "text-neon-yellow fill-neon-yellow"
                          : "text-yellow-500 fill-yellow-500"
                        : theme === "dark"
                        ? "text-gray-600"
                        : "text-gray-300"
                    )}
                  />
                );
              })}
            </div>
            {item.vote.comment && (
              <p className={cn("text-sm mb-4 leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                {item.vote.comment}
              </p>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(item.id)}
                className={cn(
                  "flex items-center gap-2 transition-all duration-200 hover:scale-110",
                  isLiked
                    ? theme === "dark"
                      ? "text-neon-pink"
                      : "text-pink-600"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-neon-pink"
                    : "text-gray-600 hover:text-pink-600"
                )}
              >
                {isLiked ? (
                  <HeartIconSolid className="h-6 w-6 fill-current animate-pulse" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
                <span className="text-sm font-medium">J'aime</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderAchievementCard = (item: FeedItem, index: number) => {
    if (!item.achievement) return null;

    const iconMap = {
      trophy: TrophyIcon,
      star: StarIcon,
      bolt: BoltIcon,
      sparkles: SparklesIcon,
      "user-group": UserGroupIcon,
    };

    const Icon = iconMap[item.achievement.icon as keyof typeof iconMap] || TrophyIcon;

    return (
      <Card
        key={item.id}
        className={cn(
          "p-6 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden",
          theme === "dark"
            ? "bg-gradient-to-br from-[#1A1A2E] via-[#2A2A3E] to-[#1A1A2E] border-neon-yellow/30 hover:border-neon-yellow/50"
            : "bg-white border-yellow-200 hover:border-yellow-300"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Effet de brillance */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-shimmer" />
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div
            className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12",
              theme === "dark"
                ? "bg-gradient-to-br from-neon-yellow via-yellow-400 to-orange-500"
                : "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500"
            )}
          >
            <Icon className={cn("h-10 w-10 text-white drop-shadow-lg")} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                {item.user?.name}
              </span>
              <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                {dayjs(item.timestamp).fromNow()}
              </span>
            </div>
            <h4 className={cn("font-black text-xl mb-2", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")}>
              {safeString(item.achievement.title, t("common.achievement") || "Réalisation")}
            </h4>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
              {safeString(item.achievement.description, "")}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 pb-8">
      {/* Header amélioré */}
      <header className={cn(
        "sticky top-0 z-10 backdrop-blur-xl p-4 sm:p-6 shadow-lg border-b",
        theme === "dark"
          ? "bg-[#0A0A0F]/95 border-neon-cyan/20"
          : "bg-white/95 border-gray-200"
      )}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className={cn("text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 sm:mb-2", theme === "dark" ? "gradient-text" : "text-gray-900")}>
              {t("feed.title")}
            </h2>
            <p className={cn("text-xs sm:text-sm font-medium hidden sm:block", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {t("feed.description")}
            </p>
          </div>
        </div>

        {/* Filters améliorés */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { key: "all", labelKey: "feed.filterAll", activeDark: "bg-gradient-to-r from-neon-cyan to-neon-purple", activeLight: "bg-blue-600" },
            { key: "projects", labelKey: "feed.filterProjects", activeDark: "bg-gradient-to-r from-neon-purple to-neon-pink", activeLight: "bg-purple-600" },
            { key: "votes", labelKey: "feed.filterVotes", activeDark: "bg-gradient-to-r from-neon-pink to-neon-purple", activeLight: "bg-pink-600" },
            { key: "achievements", labelKey: "feed.filterAchievements", activeDark: "bg-gradient-to-r from-neon-yellow to-yellow-400", activeLight: "bg-yellow-600" },
          ].map((filterOption) => {
            const isActive = filter === filterOption.key;
            return (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as typeof filter)}
                className={cn(
                  "px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 relative overflow-hidden group",
                  isActive
                    ? theme === "dark"
                      ? `${filterOption.activeDark} text-white shadow-lg`
                      : `${filterOption.activeLight} text-white shadow-lg`
                    : theme === "dark"
                    ? "bg-[#2A2A3E] text-gray-300 hover:bg-[#3A3A4E] hover:text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <span className="relative z-10">{t(filterOption.labelKey)}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Feed */}
      <div className="space-y-8">
        {isLoading && feedItems.length === 0 ? (
          <div className="text-center py-20">
            <div
              className={cn(
                "inline-block animate-spin rounded-full h-16 w-16 border-4 mb-6",
                theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
              )}
            />
            <p className={cn("font-medium text-lg", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {t("feed.loading")}
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="p-16 text-center">
            <SparklesIcon className={cn("h-16 w-16 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-purple" : "text-purple-500")} />
            <p className={cn("font-medium text-lg", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {t("feed.noContent")}
            </p>
          </Card>
        ) : (
          <>
            {filteredItems.map((item, index) => {
              if (item.type === "project") return renderProjectCard(item, index);
              if (item.type === "vote") return renderVoteCard(item, index);
              if (item.type === "achievement") return renderAchievementCard(item, index);
              return null;
            })}

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-10" />

            {isLoading && feedItems.length > 0 && (
              <div className="text-center py-12">
                <div
                  className={cn(
                    "inline-block animate-spin rounded-full h-10 w-10 border-4",
                    theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
                  )}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
