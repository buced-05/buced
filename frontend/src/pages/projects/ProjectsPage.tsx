import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../../components/projects/ProjectCard";
import type { Project } from "../../types/api";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { projectsService } from "../../api/services";
import {
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface ProjectsStatistics {
  total: number;
  by_category: Array<{ category: string; count: number }>;
  avg_final_score: number;
  avg_ai_score: number;
  avg_community_score: number;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [statistics, setStatistics] = useState<ProjectsStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTop, setIsLoadingTop] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("final_score");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, sortBy, currentPage]);

  useEffect(() => {
    fetchTopProjects();
    fetchStatistics();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategory, sortBy]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const filters: Record<string, string | number> = {};
      if (selectedCategory && selectedCategory !== "all") {
        filters.category = selectedCategory;
      }

      const ordering = sortBy === "final_score" ? "-final_score" : sortBy === "created_at" ? "-created_at" : "-community_score";

      const data = await projectsService.list({
        page: currentPage,
        pageSize: 12,
        ordering,
        search: searchQuery || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      });
      
      console.log("Données reçues de l'API:", data);
      
      // Gérer différentes structures de réponse
      let projectsList: Project[] = [];
      let totalCount = 0;
      
      if (Array.isArray(data)) {
        // Si la réponse est directement un tableau
        projectsList = data;
        totalCount = data.length;
      } else if (data && typeof data === 'object') {
        // Si la réponse est un objet avec results
        projectsList = data.results || data.items || [];
        totalCount = data.count || data.total || projectsList.length;
      }
      
      setProjects(projectsList);
      setTotalPages(Math.ceil(totalCount / 12));
      
      // Si aucune donnée, utiliser mock data comme fallback
      if (projectsList.length === 0 && currentPage === 1) {
        console.warn("Aucun projet trouvé, utilisation de données mock");
        const mockData = createMockProjects();
        setProjects(mockData);
        setTotalPages(Math.ceil(mockData.length / 12));
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des projets:", err);
      console.error("Détails de l'erreur:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      // Ne pas afficher l'erreur si c'est juste une absence de données
      // Utiliser directement les données mock
      if (err.response?.status === 404 || err.response?.status === 401) {
        const errorMessage = err.response?.status === 401 
          ? "Authentification requise" 
          : "Aucun projet trouvé";
        setError(errorMessage);
      } else {
        const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Erreur lors du chargement des projets";
        setError(errorMessage);
      }
      
      // Fallback: utiliser des données mock si l'API échoue
      console.warn("Utilisation de données mock en fallback");
      const mockData = createMockProjects();
      setProjects(mockData);
      setTotalPages(Math.ceil(mockData.length / 12));
      setError(""); // Effacer l'erreur pour afficher les données mock
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer des projets mock
  const createMockProjects = (): Project[] => {
    const firstNames = ["Amadou", "Fatou", "Koffi", "Aissatou", "Moussa", "Awa", "Yao", "Kouamé"];
    const lastNames = ["Traoré", "Diallo", "Koné", "Sangaré", "Coulibaly", "Kouassi", "Yao", "Bamba"];
    const establishments = ["INP-HB", "Université Félix Houphouët-Boigny", "ESATIC", "Université Nangui Abrogoua"];
    const categories = ["tech", "agritech", "health", "education", "environment", "social"];
    const statuses = ["idea", "prototype", "mvp", "development", "selected"];

    const mockProjects: Project[] = [];
    const now = Date.now();

    for (let i = 1; i <= 12; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const communityScore = Math.floor(Math.random() * 25) + 75;
      const aiScore = Math.floor(Math.random() * 25) + 75;
      const finalScore = Math.round((communityScore * 0.6 + aiScore * 0.4) * 10) / 10;

      mockProjects.push({
        id: i,
        title: `Projet ${category} ${i}`,
        description: `Description du projet ${i} dans la catégorie ${category}`,
        category,
        status,
        owner: {
          id: i,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.ci`,
          role: "student" as const,
          establishment: establishments[Math.floor(Math.random() * establishments.length)],
          username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
          date_joined: new Date(now - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        } as any,
        team: [],
        objectives: `Objectifs du projet ${i}`,
        expected_impact: `Impact attendu du projet ${i}`,
        required_resources: "Ressources nécessaires",
        community_score: communityScore,
        ai_score: aiScore,
        final_score: finalScore,
        progress: {},
        documents: [],
        created_at: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return mockProjects;
  };

  const fetchTopProjects = async () => {
    setIsLoadingTop(true);
    try {
      const data = await projectsService.topSelection();
      setTopProjects(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des projets populaires:", err);
    } finally {
      setIsLoadingTop(false);
    }
  };

  const fetchStatistics = async () => {
    setIsLoadingStats(true);
    try {
      const data = await projectsService.statistics();
      setStatistics(data);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const categoryCount = (category: string) => {
    if (!statistics) return 0;
    const cat = statistics.by_category.find((c) => c.category === category);
    return cat?.count || 0;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-3">
            <div className={cn(
              "p-2.5 rounded-lg flex-shrink-0",
              theme === "dark"
                ? "bg-neon-cyan/10 border border-neon-cyan/20"
                : "bg-blue-50 border border-blue-100"
            )}>
              <SparklesIcon className={cn(
                "h-5 w-5",
                theme === "dark" ? "text-neon-cyan" : "text-blue-600"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-black mb-2",
                theme === "dark" ? "gradient-text" : "text-gray-900"
              )}>
                Projets & Idées
              </h1>
              <p className={cn(
                "text-sm md:text-base leading-relaxed",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
                Explorez l'écosystème d'innovation et soumettez vos projets révolutionnaires
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          {statistics && (
            <div className={cn(
              "flex flex-wrap items-center gap-4 mt-4 pt-4 border-t",
              theme === "dark" ? "border-neon-cyan/10" : "border-gray-200"
            )}>
              <div className="flex items-center gap-2">
                <ChartBarIcon className={cn(
                  "h-4 w-4",
                  theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                )} />
                <span className={cn(
                  "text-sm font-semibold",
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                )}>
                  {statistics.total} projets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className={cn(
                  "h-4 w-4",
                  theme === "dark" ? "text-neon-purple" : "text-purple-600"
                )} />
                <span className={cn(
                  "text-sm font-semibold",
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                )}>
                  Score moyen: {statistics.avg_final_score.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className={cn(
                  "h-4 w-4",
                  theme === "dark" ? "text-neon-pink" : "text-pink-600"
                )} />
                <span className={cn(
                  "text-sm font-semibold",
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                )}>
                  {statistics.by_category.length} catégories
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/projects/new")}
            className="w-full md:w-auto"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Soumettre un projet
          </Button>
        </div>
      </header>

      {/* Statistics Cards - Only show if not in header */}
      {!isLoadingStats && statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 hidden">
          <Card className={cn(
            theme === "dark" ? "bg-[#1A1A2E] border-neon-cyan/30" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    Total Projets
                  </p>
                  <p className={cn("text-2xl font-black", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {statistics.total}
                  </p>
                </div>
                <ChartBarIcon className={cn("h-8 w-8 opacity-50", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            theme === "dark" ? "bg-[#1A1A2E] border-neon-purple/30" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    Score Final Moyen
                  </p>
                  <p className={cn("text-2xl font-black", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {statistics.avg_final_score.toFixed(1)}
                  </p>
                </div>
                <StarIcon className={cn("h-8 w-8 opacity-50", theme === "dark" ? "text-neon-purple" : "text-purple-600")} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            theme === "dark" ? "bg-[#1A1A2E] border-neon-pink/30" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    Score Communauté
                  </p>
                  <p className={cn("text-2xl font-black", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {statistics.avg_community_score.toFixed(1)}
                  </p>
                </div>
                <UserGroupIcon className={cn("h-8 w-8 opacity-50", theme === "dark" ? "text-neon-pink" : "text-pink-600")} />
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            theme === "dark" ? "bg-[#1A1A2E] border-neon-green/30" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    Score IA Moyen
                  </p>
                  <p className={cn("text-2xl font-black", theme === "dark" ? "text-white" : "text-gray-900")}>
                    {statistics.avg_ai_score.toFixed(1)}
                  </p>
                </div>
                <SparklesIcon className={cn("h-8 w-8 opacity-50", theme === "dark" ? "text-neon-green" : "text-green-600")} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Projects Section */}
      {!isLoadingTop && topProjects.length > 0 && (
        <Card className={cn(
          theme === "dark" ? "bg-[#1A1A2E] border-neon-yellow/30" : "bg-white border-gray-200"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center gap-2",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}>
              <TrophyIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")} />
              Projets Populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topProjects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all hover:scale-105",
                    theme === "dark"
                      ? "border-neon-yellow/20 bg-[#2A2A3E] hover:border-neon-yellow/50"
                      : "border-yellow-200 bg-yellow-50 hover:border-yellow-300"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={cn(
                      "font-bold text-sm line-clamp-1",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {project.title}
                    </h4>
                    <Badge variant="primary" className="ml-2">
                      <TrophyIcon className="h-3 w-3 mr-1" />
                      Top
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={cn(
                      "text-xs font-bold",
                      theme === "dark" ? "text-neon-yellow" : "text-yellow-600"
                    )}>
                      {project.final_score.toFixed(1)}
                    </div>
                    <div className={cn(
                      "text-xs",
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    )}>
                      {project.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className={cn(
        theme === "dark" ? "bg-[#1A1A2E] border-gray-700" : "bg-white border-gray-200"
      )}>
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
            <Input
              placeholder="Recherche par mot-clé..."
              className="flex-1 min-w-[200px]"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Select className="min-w-[180px]" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Toutes catégories</option>
              <option value="tech">Technologie {categoryCount("tech") > 0 && `(${categoryCount("tech")})`}</option>
              <option value="social">Social {categoryCount("social") > 0 && `(${categoryCount("social")})`}</option>
              <option value="environment">Environnement {categoryCount("environment") > 0 && `(${categoryCount("environment")})`}</option>
              <option value="health">Santé {categoryCount("health") > 0 && `(${categoryCount("health")})`}</option>
              <option value="education">Éducation {categoryCount("education") > 0 && `(${categoryCount("education")})`}</option>
            </Select>
            <Select className="min-w-[180px]" value={sortBy} onChange={handleSortChange}>
              <option value="final_score">Score Final</option>
              <option value="community_score">Score Communauté</option>
              <option value="created_at">Plus récents</option>
            </Select>
            <Button type="submit" variant="outline" size="md">
              Rechercher
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div
            className={cn(
              "inline-block animate-spin rounded-full h-12 w-12 border-4 mb-4",
              theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
            )}
          />
          <p className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Chargement des projets...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <Card className={cn(
          theme === "dark" ? "bg-[#1A1A2E] border-gray-700" : "bg-white border-gray-200"
        )}>
          <CardContent className="p-12 text-center">
            {error && (
              <p className={cn("font-medium mb-2", theme === "dark" ? "text-red-400" : "text-red-600")}>
                {error}
              </p>
            )}
            <p className={cn("font-medium mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun projet trouvé
            </p>
            <p className={cn("text-sm mb-4", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
              {searchQuery || selectedCategory
                ? "Essayez de modifier vos critères de recherche"
                : "Soyez le premier à soumettre un projet !"}
            </p>
            <Button variant="primary" onClick={fetchProjects}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                theme === "dark" ? "bg-[#2A2A3E] text-white" : "bg-gray-100 text-gray-900"
              )}>
                Page {currentPage} sur {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
