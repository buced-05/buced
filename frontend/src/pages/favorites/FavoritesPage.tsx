import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import ProjectCard from "../../components/projects/ProjectCard";
import type { Project } from "../../types/api";
import useAuth from "../../hooks/useAuth";

const FavoritesPage = () => {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      // TODO: Appel API réel
      // const { data } = await apiClient.get("/v1/projects/favorites/");

      // Mock data
      const mockFavorites: Project[] = [
        {
          id: 1,
          title: "EduSolar",
          description: "Solution solaire pour l'éducation en zone rurale",
          category: "Énergie",
          status: "prototype",
          owner: { id: 1, username: "", email: "", first_name: "", last_name: "", role: "student", date_joined: "" },
          team: [],
          progress: {},
          documents: [],
          community_score: 88.5,
          ai_score: 92.1,
          final_score: 90.3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "AgriConnect",
          description: "Plateforme mobile pour les agripreneurs",
          category: "AgriTech",
          status: "mvp",
          owner: { id: 2, username: "", email: "", first_name: "", last_name: "", role: "student", date_joined: "" },
          team: [],
          progress: {},
          documents: [],
          community_score: 85.2,
          ai_score: 88.7,
          final_score: 87.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setFavorites(mockFavorites);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <Card>
          <CardContent className="p-12 text-center">
            <HeartIcon className={cn("h-16 w-16 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-pink" : "text-pink-400")} />
            <p className={cn("font-medium mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Connectez-vous pour voir vos favoris
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header>
        <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>
          Mes Favoris
        </h2>
        <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          Projets que vous avez sauvegardés
        </p>
      </header>

      {isLoading ? (
        <div className="text-center py-12">
          <div
            className={cn(
              "inline-block animate-spin rounded-full h-12 w-12 border-4 mb-4",
              theme === "dark" ? "border-neon-pink border-t-transparent" : "border-pink-600 border-t-transparent"
            )}
          />
          <p className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Chargement des favoris...
          </p>
        </div>
      ) : favorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <HeartIcon className={cn("h-16 w-16 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-pink" : "text-pink-400")} />
            <p className={cn("font-medium mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun favori pour le moment
            </p>
            <p className={cn("text-sm", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
              Ajoutez des projets à vos favoris pour les retrouver facilement
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className={cn("text-sm font-medium mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            {favorites.length} projet{favorites.length > 1 ? "s" : ""} favori{favorites.length > 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

