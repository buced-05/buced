import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  SparklesIcon,
  HeartIcon,
  EyeIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";

const StatsPage = () => {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projectsCreated: 0,
    projectsVoted: 0,
    totalViews: 0,
    totalLikes: 0,
    commentsMade: 0,
    teamMemberships: 0,
    averageScore: 0,
    topCategory: "",
    achievements: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Appel API réel
      // const { data } = await apiClient.get("/v1/users/stats/");

      // Mock data
      setTimeout(() => {
        setStats({
          projectsCreated: 5,
          projectsVoted: 23,
          totalViews: 1240,
          totalLikes: 89,
          commentsMade: 12,
          teamMemberships: 3,
          averageScore: 87.5,
          topCategory: "Technologie",
          achievements: ["Premier projet", "100 votes", "Équipe complète"],
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Projets créés",
      value: stats.projectsCreated,
      icon: SparklesIcon,
      color: theme === "dark" ? "text-neon-purple" : "text-purple-600",
      bgColor: theme === "dark" ? "bg-neon-purple/10 border-neon-purple/20" : "bg-purple-50 border-purple-200",
    },
    {
      title: "Votes donnés",
      value: stats.projectsVoted,
      icon: HeartIcon,
      color: theme === "dark" ? "text-neon-pink" : "text-pink-600",
      bgColor: theme === "dark" ? "bg-neon-pink/10 border-neon-pink/20" : "bg-pink-50 border-pink-200",
    },
    {
      title: "Vues totales",
      value: stats.totalViews,
      icon: EyeIcon,
      color: theme === "dark" ? "text-neon-cyan" : "text-blue-600",
      bgColor: theme === "dark" ? "bg-neon-cyan/10 border-neon-cyan/20" : "bg-blue-50 border-blue-200",
    },
    {
      title: "Likes reçus",
      value: stats.totalLikes,
      icon: HeartIcon,
      color: theme === "dark" ? "text-neon-pink" : "text-pink-600",
      bgColor: theme === "dark" ? "bg-neon-pink/10 border-neon-pink/20" : "bg-pink-50 border-pink-200",
    },
    {
      title: "Commentaires",
      value: stats.commentsMade,
      icon: ChartBarIcon,
      color: theme === "dark" ? "text-neon-green" : "text-green-600",
      bgColor: theme === "dark" ? "bg-neon-green/10 border-neon-green/20" : "bg-green-50 border-green-200",
    },
    {
      title: "Équipes",
      value: stats.teamMemberships,
      icon: UserGroupIcon,
      color: theme === "dark" ? "text-neon-yellow" : "text-yellow-600",
      bgColor: theme === "dark" ? "bg-neon-yellow/10 border-neon-yellow/20" : "bg-yellow-50 border-yellow-200",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header>
        <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>
          Mes Statistiques
        </h2>
        <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          Suivez votre activité et vos contributions sur la plateforme
        </p>
      </header>

      {isLoading ? (
        <div className="text-center py-12">
          <div
            className={cn(
              "inline-block animate-spin rounded-full h-12 w-12 border-4 mb-4",
              theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
            )}
          />
          <p className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Chargement des statistiques...
          </p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                        <Icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                      <ArrowTrendingUpIcon
                        className={cn("h-5 w-5 opacity-50", theme === "dark" ? "text-gray-500" : "text-gray-400")}
                      />
                    </div>
                    <p className={cn("text-3xl font-black mb-1", stat.color)}>{stat.value}</p>
                    <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      {stat.title}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance & Achievements */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")} />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    Score moyen
                  </span>
                  <span className={cn("text-2xl font-black", theme === "dark" ? "text-neon-cyan" : "text-blue-600")}>
                    {stats.averageScore}%
                  </span>
                </div>
                <div className={cn("h-3 rounded-full overflow-hidden", theme === "dark" ? "bg-[#2A2A3E]" : "bg-gray-200")}>
                  <div
                    className={cn("h-full transition-all duration-500", theme === "dark" ? "bg-neon-cyan" : "bg-blue-600")}
                    style={{ width: `${stats.averageScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                    Catégorie favorite
                  </span>
                  <Badge variant="primary">{stats.topCategory}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")} />
                  Réalisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.achievements.length > 0 ? (
                  <div className="space-y-2">
                    {stats.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          theme === "dark"
                            ? "border-neon-yellow/20 bg-neon-yellow/5"
                            : "border-yellow-200 bg-yellow-50"
                        )}
                      >
                        <TrophyIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-yellow" : "text-yellow-600")} />
                        <span className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrophyIcon
                      className={cn("h-12 w-12 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-yellow" : "text-gray-400")}
                    />
                    <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Aucune réalisation pour le moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-purple" : "text-purple-600")} />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Projet créé", item: "EduSolar", time: "Il y a 2 jours" },
                  { action: "Vote donné", item: "AgriConnect", time: "Il y a 3 jours" },
                  { action: "Commentaire ajouté", item: "HealthBot", time: "Il y a 5 jours" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border",
                      theme === "dark" ? "border-neon-cyan/20 bg-[#2A2A3E]" : "border-gray-200 bg-gray-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 h-2 w-2 rounded-full",
                        theme === "dark" ? "bg-neon-cyan" : "bg-blue-600"
                      )}
                    />
                    <div className="flex-1">
                      <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                        {activity.action}
                      </p>
                      <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        {activity.item}
                      </p>
                    </div>
                    <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StatsPage;

