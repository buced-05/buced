import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  SparklesIcon,
  UserGroupIcon,
  DocumentTextIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select } from "../../components/ui/select";
import { useThemeStore } from "../../stores/theme";
import ProjectCard from "../../components/projects/ProjectCard";
import { cn } from "../../utils/cn";
import type { Project } from "../../types/api";
import type { PaginatedResponse } from "../../types/api";
import apiClient from "../../api/client";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [results, setResults] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    performSearch();
  }, [category, status, sortBy]);

  const performSearch = async () => {
    if (!query.trim() && !category && !status) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query.trim()) {
        params.search = query.trim();
      }
      if (category) {
        params.category = category;
      }
      if (status) {
        params.status = status;
      }
      if (sortBy && sortBy !== "relevance") {
        params.ordering = sortBy;
      }

      const { data } = await apiClient.get<PaginatedResponse<Project>>("/v1/projects/items/", { params });
      setResults(data.results || []);
    } catch (error: any) {
      console.error("Erreur de recherche:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, category, status, sort: sortBy });
    performSearch();
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setStatus("");
    setSortBy("relevance");
    setSearchParams({});
    setResults([]);
  };

  const categories = [
    { value: "", label: "Toutes les catégories" },
    { value: "tech", label: "Technologie" },
    { value: "social", label: "Social" },
    { value: "environment", label: "Environnement" },
    { value: "health", label: "Santé" },
    { value: "education", label: "Éducation" },
  ];

  const statuses = [
    { value: "", label: "Tous les statuts" },
    { value: "idea", label: "Idée" },
    { value: "prototype", label: "Prototype" },
    { value: "mvp", label: "MVP" },
    { value: "selected", label: "Sélectionné" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "-final_score", label: "Score final" },
    { value: "-community_score", label: "Score communauté" },
    { value: "-ai_score", label: "Score IA" },
    { value: "-created_at", label: "Plus récent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header>
        <h2 className={`text-2xl md:text-3xl font-black ${
          theme === "dark" ? "gradient-text" : "text-gray-900"
        }`}>
          Recherche avancée
        </h2>
        <p className={`text-sm font-medium mt-1 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Trouvez des projets, des utilisateurs et des ressources
        </p>
      </header>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher des projets, utilisateurs..."
                  startAdornment={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button variant="primary" type="submit" loading={isLoading}>
                Rechercher
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5" />
                Filtres
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className={`grid gap-4 md:grid-cols-3 pt-4 border-t ${
                theme === "dark" ? "border-neon-cyan/20" : "border-gray-200"
              }`}>
                <div className="space-y-2">
                  <label className={`text-sm font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    Catégorie
                  </label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    Statut
                  </label>
                  <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statuses.map((stat) => (
                      <option key={stat.value} value={stat.value}>
                        {stat.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    Trier par
                  </label>
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {(category || status || query) && (
                  <div className="md:col-span-3 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <XMarkIcon className="h-4 w-4" />
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 mb-4 ${
            theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
          }`} />
          <p className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Recherche en cours...
          </p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {results.length} résultat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : query || category || status ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MagnifyingGlassIcon className={cn(
              "h-16 w-16 mx-auto mb-4 opacity-50",
              theme === "dark" ? "text-neon-cyan" : "text-gray-400"
            )} />
            <p className={cn("font-medium mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun résultat trouvé
            </p>
            <p className={cn("text-sm", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
              Essayez de modifier vos critères de recherche
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default SearchPage;

