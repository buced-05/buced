import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";

type ProjectFavoritesProps = {
  projectId: string;
  initialFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
};

export const ProjectFavorites = ({
  projectId,
  initialFavorite = false,
  onToggle,
}: ProjectFavoritesProps) => {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [projectId]);

  const fetchFavoriteStatus = async () => {
    if (!user) return;

    try {
      // TODO: Appel API réel
      // const { data } = await apiClient.get(`/v1/projects/${projectId}/favorite/`);
      // setIsFavorite(data.is_favorite);
    } catch (error) {
      console.error("Erreur lors du chargement du statut favori:", error);
    }
  };

  const handleToggle = async () => {
    if (!user) {
      alert("Vous devez être connecté pour ajouter aux favoris");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Appel API réel
      // if (isFavorite) {
      //   await apiClient.delete(`/v1/projects/${projectId}/favorite/`);
      // } else {
      //   await apiClient.post(`/v1/projects/${projectId}/favorite/`);
      // }

      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      onToggle?.(newFavoriteStatus);
    } catch (error) {
      console.error("Erreur lors de la modification du favori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading || !user}
      className={cn(
        "transition-all duration-200",
        isFavorite
          ? theme === "dark"
            ? "text-neon-pink hover:text-neon-pink"
            : "text-pink-600 hover:text-pink-700"
          : theme === "dark"
          ? "text-gray-400 hover:text-neon-pink"
          : "text-gray-600 hover:text-pink-600"
      )}
    >
      {isFavorite ? (
        <HeartIconSolid className="h-5 w-5 fill-current" />
      ) : (
        <HeartIcon className="h-5 w-5" />
      )}
      <span className="ml-2">{isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
    </Button>
  );
};

