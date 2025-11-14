import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/api";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../stores/theme";
import apiClient from "../../api/client";
import useAuth from "../../hooks/useAuth";

type ProjectCardProps = {
  project: Project;
};

const statusColors: Record<string, { variant: "default" | "success" | "warning" | "primary" | "secondary" }> = {
  idea: { variant: "default" },
  prototype: { variant: "primary" },
  mvp: { variant: "success" },
  incubation: { variant: "secondary" },
  completed: { variant: "warning" }
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const statusConfig = statusColors[project.status] ?? statusColors.idea;
  const [hasVoted, setHasVoted] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    checkVoteStatus();
    fetchVotesCount();
  }, [project.id]);

  const checkVoteStatus = async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.get(`/v1/votes/community/?project=${project.id}`);
      if (data.results && data.results.length > 0) {
        const userVote = data.results.find((v: any) => v.voter === user.id);
        setHasVoted(!!userVote);
      }
    } catch (err) {
      setHasVoted(false);
    }
  };

  const fetchVotesCount = async () => {
    try {
      const { data } = await apiClient.get(`/v1/votes/community/?project=${project.id}`);
      setLikesCount(data.count || 0);
    } catch (err) {
      setLikesCount(0);
    }
  };

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (hasVoted) {
        // Retirer le vote
        const { data: votesData } = await apiClient.get(`/v1/votes/community/?project=${project.id}`);
        if (votesData.results && votesData.results.length > 0) {
          const userVote = votesData.results.find((v: any) => v.voter === user.id);
          if (userVote) {
            await apiClient.delete(`/v1/votes/community/${userVote.id}/`);
            setHasVoted(false);
            setLikesCount((prev) => Math.max(0, prev - 1));
          }
        }
      } else {
        // Ajouter un vote
        await apiClient.post(`/v1/votes/community/`, {
          project: project.id,
          rating: 5,
          comment: "",
        });
        setHasVoted(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error: any) {
      console.error("Erreur lors du vote:", error);
      if (error.response?.status !== 401) {
        alert(error.response?.data?.detail || "Erreur lors du vote");
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <header className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {project.title}
            </h3>
            <p className={`text-xs uppercase tracking-wide font-bold mt-1 ${
              theme === "dark" ? "text-neon-cyan" : "text-blue-600"
            }`}>
              {project.category}
            </p>
          </div>
                <Badge variant={statusConfig.variant as any}>{project.status}</Badge>
        </header>
        <p className={`mt-3 line-clamp-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {project.description}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-bold">
          <div className={`rounded-xl border p-3 ${
            theme === "dark" 
              ? "border-neon-cyan/20 bg-[#2A2A3E]" 
              : "border-blue-200 bg-blue-50"
          }`}>
            <p className={theme === "dark" ? "text-gray-500" : "text-gray-600"}>Communauté</p>
            <p className={`text-lg font-black ${
              theme === "dark" ? "text-neon-cyan" : "text-blue-600"
            }`}>
              {project.community_score.toFixed(1)}
            </p>
          </div>
          <div className={`rounded-xl border p-3 ${
            theme === "dark" 
              ? "border-neon-purple/20 bg-[#2A2A3E]" 
              : "border-purple-200 bg-purple-50"
          }`}>
            <p className={theme === "dark" ? "text-gray-500" : "text-gray-600"}>IA</p>
            <p className={`text-lg font-black ${
              theme === "dark" ? "text-neon-purple" : "text-purple-600"
            }`}>
              {project.ai_score.toFixed(1)}
            </p>
          </div>
          <div className={`rounded-xl border p-3 ${
            theme === "dark" 
              ? "border-neon-pink/20 bg-[#2A2A3E]" 
              : "border-pink-200 bg-pink-50"
          }`}>
            <p className={theme === "dark" ? "text-gray-500" : "text-gray-600"}>Likes</p>
            <p className={`text-lg font-black ${
              theme === "dark" ? "text-neon-pink" : "text-pink-600"
            }`}>
              {likesCount}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/projects/${project.id}`)}>
            Détails
          </Button>
          <Button
            variant={hasVoted ? "secondary" : "outline"}
            size="sm"
            className="flex-1"
            onClick={handleVote}
            type="button"
          >
            <HeartIcon className={`h-4 w-4 ${hasVoted ? "fill-current" : ""}`} />
            {hasVoted ? "Voté" : "Voter"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
export { ProjectCard };
