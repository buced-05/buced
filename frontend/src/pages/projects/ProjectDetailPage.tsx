import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsService, votesService } from "../../api/services";
import apiClient from "../../api/client";
import type { Project } from "../../types/api";
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  EyeIcon,
  UserGroupIcon,
  SparklesIcon,
  CalendarIcon,
  ShareIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { ProjectComments } from "../../components/projects/ProjectComments";
import { ProjectShare } from "../../components/projects/ProjectShare";
import { ProjectTeam } from "../../components/projects/ProjectTeam";
import { ProjectDocuments } from "../../components/projects/ProjectDocuments";
import { ProjectTimeline } from "../../components/projects/ProjectTimeline";
import { ProjectFavorites } from "../../components/projects/ProjectFavorites";
import useAuth from "../../hooks/useAuth";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchProject();
      checkVoteStatus();
    }
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await projectsService.retrieve(id!);
      setProject(data);
      // Calculer le nombre de likes depuis les votes
      // TODO: Ajouter un champ likes_count dans le serializer backend
      setLikesCount(0); // Temporaire
    } catch (err: any) {
      console.error("Erreur lors du chargement du projet:", err);
      setError(err.response?.data?.detail || "Erreur lors du chargement du projet");
    } finally {
      setIsLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    if (!id) return;
    try {
      // Vérifier si l'utilisateur a déjà voté
      const data = await votesService.list({ filters: { project: parseInt(id) } });
      if (data.results && data.results.length > 0) {
        setHasVoted(true);
      }
    } catch (err) {
      // L'utilisateur n'a pas encore voté
      setHasVoted(false);
    }
  };

  const handleVote = async () => {
    if (!id || !project) return;

    try {
      if (hasVoted) {
        // Retirer le vote
        // Pour l'instant, on utilise apiClient directement pour cette opération spécifique
        const votesData = await votesService.list({ filters: { project: parseInt(id) } });
        if (votesData.results && votesData.results.length > 0) {
          const userVote = votesData.results.find((v: any) => v.voter === project.owner.id);
          if (userVote) {
            await votesService.delete(userVote.id);
            setHasVoted(false);
            setLikesCount((prev) => Math.max(0, prev - 1));
            await fetchProject(); // Rafraîchir les scores
          }
        }
      } else {
        // Ajouter un vote
        await votesService.submit({
          project: parseInt(id),
          rating: 5, // Note par défaut
          comment: "",
        });
        setHasVoted(true);
        setLikesCount((prev) => prev + 1);
        await fetchProject(); // Rafraîchir les scores
      }
    } catch (err: any) {
      console.error("Erreur lors du vote:", err);
      alert(err.response?.data?.detail || "Erreur lors du vote");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className={`inline-block animate-spin rounded-full h-12 w-12 border-4 ${
            theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
          }`}
        />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <Card>
          <CardContent className="p-12 text-center">
            <p className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
              {error || "Projet non trouvé"}
            </p>
            <Button variant="primary" onClick={() => navigate("/projects")}>
              Retour aux projets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h2 className={`text-2xl md:text-3xl font-black ${
            theme === "dark" ? "gradient-text" : "text-gray-900"
          }`}>
            {project.title}
          </h2>
          <p className={`text-sm font-medium mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Détails du projet et évaluations
          </p>
        </div>
        <div className="flex gap-2">
          <ProjectFavorites projectId={project.id} />
          <Button variant="outline" size="md" onClick={() => setShowShare(!showShare)}>
            <ShareIcon className="h-4 w-4" />
            Partager
          </Button>
        </div>
      </header>

      {showShare && (
        <ProjectShare
          projectId={project.id}
          projectTitle={project.title}
          onClose={() => setShowShare(false)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Description</CardTitle>
                <Badge variant="primary">{project.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                {project.description}
              </p>
              {project.objectives && (
                <div className="mt-4">
                  <h4 className={`text-sm font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Objectifs
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {project.objectives}
                  </p>
                </div>
              )}
              {project.expected_impact && (
                <div className="mt-4">
                  <h4 className={`text-sm font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Impact attendu
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {project.expected_impact}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SparklesIcon className={`h-5 w-5 ${
                  theme === "dark" ? "text-neon-purple" : "text-purple-600"
                }`} />
                Scores & Évaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className={`text-center p-4 rounded-lg border ${
                  theme === "dark"
                    ? "border-neon-cyan/20 bg-[#2A2A3E]"
                    : "border-blue-200 bg-blue-50"
                }`}>
                  <p className={`text-3xl font-black ${
                    theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                  }`}>
                    {project.community_score}
                  </p>
                  <p className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Score Communauté
                  </p>
                </div>
                <div className={`text-center p-4 rounded-lg border ${
                  theme === "dark"
                    ? "border-neon-purple/20 bg-[#2A2A3E]"
                    : "border-purple-200 bg-purple-50"
                }`}>
                  <p className={`text-3xl font-black ${
                    theme === "dark" ? "text-neon-purple" : "text-purple-600"
                  }`}>
                    {project.ai_score}
                  </p>
                  <p className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Score IA
                  </p>
                </div>
                <div className={`text-center p-4 rounded-lg border ${
                  theme === "dark"
                    ? "border-neon-pink/20 bg-[#2A2A3E]"
                    : "border-pink-200 bg-pink-50"
                }`}>
                  <p className={`text-3xl font-black ${
                    theme === "dark" ? "text-neon-pink" : "text-pink-600"
                  }`}>
                    {project.final_score}
                  </p>
                  <p className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Score Final
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                      <p className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-500" : "text-gray-600"
                      }`}>
                        Auteur
                      </p>
                      <p className={`text-sm font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {project.owner.first_name} {project.owner.last_name}
                      </p>
                    </div>
                    {project.owner.establishment && (
                      <div>
                        <p className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-500" : "text-gray-600"
                        }`}>
                          Établissement
                        </p>
                        <p className={`text-sm font-semibold ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {project.owner.establishment}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-500" : "text-gray-600"
                      }`}>
                        Statut
                      </p>
                      <Badge variant="primary" className="mt-1">{project.status}</Badge>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(project.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  <HeartIcon className={`h-5 w-5 ${
                    hasVoted 
                      ? theme === "dark" ? "text-neon-pink fill-neon-pink" : "text-pink-600 fill-pink-600"
                      : theme === "dark" ? "text-neon-pink" : "text-pink-600"
                  }`} />
                  <span>Likes</span>
                </div>
                <p className={`text-lg font-black ${
                  theme === "dark" ? "text-neon-pink" : "text-pink-600"
                }`}>
                  {likesCount}
                </p>
              </div>
              {project.team && project.team.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    <UserGroupIcon className={`h-5 w-5 ${
                      theme === "dark" ? "text-neon-green" : "text-green-600"
                    }`} />
                    <span>Équipe</span>
                  </div>
                  <p className={`text-lg font-black ${
                    theme === "dark" ? "text-neon-green" : "text-green-600"
                  }`}>
                    {project.team.length}
                  </p>
                </div>
              )}
              <Button 
                variant={hasVoted ? "secondary" : "primary"} 
                size="lg" 
                className="w-full mt-4" 
                onClick={handleVote}
              >
                <HeartIcon className={`h-5 w-5 ${hasVoted ? "fill-current" : ""}`} />
                {hasVoted ? "Retirer mon vote" : "Voter pour ce projet"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Documents Section */}
      <div className="mt-6">
        <ProjectDocuments projectId={project.id.toString()} isOwner={project.owner.id === user?.id} />
      </div>

      {/* Team Section */}
      <div className="mt-6">
        <ProjectTeam projectId={project.id.toString()} isOwner={project.owner.id === user?.id} />
      </div>

      {/* Timeline Section */}
      <div className="mt-6">
        <ProjectTimeline projectId={project.id.toString()} />
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <ProjectComments projectId={project.id.toString()} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;


