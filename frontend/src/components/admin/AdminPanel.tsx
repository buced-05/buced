import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { checkApiHealth } from "../../utils/apiHealth";
import useAuth from "../../hooks/useAuth";
import { projectsService, votesService } from "../../api/services";
import { errorHandler } from "../../utils/errorHandler";

export const AdminPanel = () => {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState<"healthy" | "unhealthy" | "checking">("checking");
  const [stats, setStats] = useState({
    projects: 0,
    votes: 0,
    users: 0,
  });

  useEffect(() => {
    checkHealth();
    fetchStats();
  }, []);

  const checkHealth = async () => {
    setHealthStatus("checking");
    const status = await checkApiHealth();
    setHealthStatus(status.status === "healthy" ? "healthy" : "unhealthy");
  };

  const fetchStats = async () => {
    try {
      const [projectsData, votesData] = await Promise.all([
        projectsService.statistics().catch(() => ({ total: 0 })),
        votesService.list({ pageSize: 1 }).catch(() => ({ count: 0 })),
      ]);
      setStats({
        projects: projectsData.total || 0,
        votes: votesData.count || 0,
        users: 0, // TODO: Add users service
      });
    } catch (error) {
      errorHandler.logError(error, "Fetch Admin Stats");
    }
  };

  // Redirect to Django admin if user is admin
  const goToDjangoAdmin = () => {
    window.open(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/admin/`, "_blank");
  };

  if (user?.role !== "admin") {
    return (
      <Card className={cn(
        "p-8 text-center",
        theme === "dark" ? "bg-[#1A1A2E]" : "bg-white"
      )}>
        <ShieldCheckIcon className={cn(
          "h-16 w-16 mx-auto mb-4",
          theme === "dark" ? "text-red-400" : "text-red-600"
        )} />
        <h2 className={cn(
          "text-2xl font-black mb-2",
          theme === "dark" ? "text-white" : "text-gray-900"
        )}>
          Accès refusé
        </h2>
        <p className={cn(
          "text-sm",
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        )}>
          Vous devez être administrateur pour accéder à ce panel.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-black mb-2",
            theme === "dark" ? "gradient-text" : "text-gray-900"
          )}>
            Panel Administrateur
          </h1>
          <p className={cn(
            "text-sm",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Gestion de la plateforme et monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            healthStatus === "healthy"
              ? theme === "dark"
                ? "bg-green-500/20 text-green-400"
                : "bg-green-100 text-green-700"
              : healthStatus === "unhealthy"
              ? theme === "dark"
                ? "bg-red-500/20 text-red-400"
                : "bg-red-100 text-red-700"
              : theme === "dark"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-yellow-100 text-yellow-700"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full",
              healthStatus === "healthy" ? "bg-green-400" : healthStatus === "unhealthy" ? "bg-red-400" : "bg-yellow-400"
            )} />
            <span className="text-xs font-medium">
              {healthStatus === "healthy" ? "En ligne" : healthStatus === "unhealthy" ? "Hors ligne" : "Vérification..."}
            </span>
          </div>
          <Button variant="primary" onClick={goToDjangoAdmin}>
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Admin Django
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={cn(
          "p-6",
          theme === "dark" ? "bg-[#1A1A2E] border-neon-cyan/30" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm font-medium mb-1",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
                Projets
              </p>
              <p className={cn(
                "text-3xl font-black",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                {stats.projects}
              </p>
            </div>
            <DocumentTextIcon className={cn(
              "h-12 w-12 opacity-50",
              theme === "dark" ? "text-neon-cyan" : "text-blue-600"
            )} />
          </div>
        </Card>

        <Card className={cn(
          "p-6",
          theme === "dark" ? "bg-[#1A1A2E] border-neon-purple/30" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm font-medium mb-1",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
                Votes
              </p>
              <p className={cn(
                "text-3xl font-black",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                {stats.votes}
              </p>
            </div>
            <ChartBarIcon className={cn(
              "h-12 w-12 opacity-50",
              theme === "dark" ? "text-neon-purple" : "text-purple-600"
            )} />
          </div>
        </Card>

        <Card className={cn(
          "p-6",
          theme === "dark" ? "bg-[#1A1A2E] border-neon-pink/30" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-sm font-medium mb-1",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
                Utilisateurs
              </p>
              <p className={cn(
                "text-3xl font-black",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                {stats.users}
              </p>
            </div>
            <UserGroupIcon className={cn(
              "h-12 w-12 opacity-50",
              theme === "dark" ? "text-neon-pink" : "text-pink-600"
            )} />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={cn(
        "p-6",
        theme === "dark" ? "bg-[#1A1A2E] border-gray-700" : "bg-white border-gray-200"
      )}>
        <h2 className={cn(
          "text-xl font-black mb-4",
          theme === "dark" ? "text-white" : "text-gray-900"
        )}>
          Actions rapides
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            onClick={() => navigate("/projects")}
            className="justify-start"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Gérer les projets
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/votes")}
            className="justify-start"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Voir les votes
          </Button>
          <Button
            variant="outline"
            onClick={goToDjangoAdmin}
            className="justify-start"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Admin Django
          </Button>
          <Button
            variant="outline"
            onClick={checkHealth}
            className="justify-start"
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Vérifier la santé
          </Button>
        </div>
      </Card>
    </div>
  );
};

