import { useState, useEffect } from "react";
import {
  ClockIcon,
  SparklesIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

type TimelineEvent = {
  id: string;
  type: "created" | "updated" | "voted" | "commented" | "member_added" | "document_added" | "status_changed";
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: Record<string, unknown>;
};

type ProjectTimelineProps = {
  projectId: string;
};

const getEventIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "created":
      return SparklesIcon;
    case "updated":
      return ArrowPathIcon;
    case "voted":
      return HeartIcon;
    case "commented":
      return ChatBubbleLeftIcon;
    case "member_added":
      return UserPlusIcon;
    case "document_added":
      return DocumentTextIcon;
    case "status_changed":
      return CheckCircleIcon;
    default:
      return ClockIcon;
  }
};

const getEventColor = (type: TimelineEvent["type"], theme: "dark" | "light") => {
  if (theme === "dark") {
    switch (type) {
      case "created":
        return "text-neon-purple bg-neon-purple/10 border-neon-purple/20";
      case "updated":
        return "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20";
      case "voted":
        return "text-neon-pink bg-neon-pink/10 border-neon-pink/20";
      case "commented":
        return "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20";
      case "member_added":
        return "text-neon-green bg-neon-green/10 border-neon-green/20";
      case "document_added":
        return "text-neon-yellow bg-neon-yellow/10 border-neon-yellow/20";
      case "status_changed":
        return "text-neon-purple bg-neon-purple/10 border-neon-purple/20";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  } else {
    switch (type) {
      case "created":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "updated":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "voted":
        return "text-pink-600 bg-pink-50 border-pink-200";
      case "commented":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "member_added":
        return "text-green-600 bg-green-50 border-green-200";
      case "document_added":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "status_changed":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  }
};

export const ProjectTimeline = ({ projectId }: ProjectTimelineProps) => {
  const { theme } = useThemeStore();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTimeline();
  }, [projectId]);

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      // TODO: Appel API réel
      // const { data } = await apiClient.get(`/v1/projects/${projectId}/timeline/`);

      // Mock data
      const mockEvents: TimelineEvent[] = [
        {
          id: "1",
          type: "created",
          title: "Projet créé",
          description: "Le projet a été créé",
          user: { id: "1", name: "Jean Kouamé" },
          timestamp: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
        {
          id: "2",
          type: "status_changed",
          title: "Statut changé",
          description: "Le statut est passé de 'Idée' à 'Prototype'",
          user: { id: "1", name: "Jean Kouamé" },
          timestamp: new Date(Date.now() - 86400000 * 20).toISOString(),
          metadata: { from: "idea", to: "prototype" },
        },
        {
          id: "3",
          type: "member_added",
          title: "Membre ajouté",
          description: "Marie Diallo a rejoint l'équipe",
          user: { id: "2", name: "Marie Diallo" },
          timestamp: new Date(Date.now() - 86400000 * 15).toISOString(),
        },
        {
          id: "4",
          type: "document_added",
          title: "Document ajouté",
          description: "Cahier des charges.pdf",
          user: { id: "1", name: "Jean Kouamé" },
          timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
          id: "5",
          type: "voted",
          title: "Nouveau vote",
          description: "15 nouveaux votes reçus",
          user: { id: "3", name: "Communauté" },
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: "6",
          type: "commented",
          title: "Nouveau commentaire",
          description: "Commentaire ajouté par un utilisateur",
          user: { id: "4", name: "Awa Koné" },
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "7",
          type: "updated",
          title: "Projet mis à jour",
          description: "Description et objectifs modifiés",
          user: { id: "1", name: "Jean Kouamé" },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      setEvents(mockEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error("Erreur lors du chargement de la timeline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const eventDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return eventDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
          Historique ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div
              className={cn(
                "inline-block animate-spin rounded-full h-8 w-8 border-4",
                theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
              )}
            />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon
              className={cn("h-12 w-12 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-cyan" : "text-gray-400")}
            />
            <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun événement dans l'historique
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className={cn(
                "absolute left-6 top-0 bottom-0 w-0.5",
                theme === "dark" ? "bg-neon-cyan/20" : "bg-gray-200"
              )}
            />

            <div className="space-y-6">
              {events.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const eventColor = getEventColor(event.type, theme);

                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={cn("flex-shrink-0 relative z-10 p-2 rounded-lg border", eventColor)}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {event.title}
                        </p>
                        <span className={cn("text-xs whitespace-nowrap", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                          {formatTime(event.timestamp)}
                        </span>
                      </div>
                      <p className={cn("text-xs mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2">
                        {event.user.avatar ? (
                          <img
                            src={event.user.avatar}
                            alt={event.user.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={cn(
                              "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold",
                              theme === "dark"
                                ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            )}
                          >
                            {event.user.name[0]}
                          </div>
                        )}
                        <span className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                          {event.user.name}
                        </span>
                        {event.metadata && event.type === "status_changed" && (
                          <>
                            <Badge variant="neutral" className="text-xs">
                              {event.metadata.from as string}
                            </Badge>
                            <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>→</span>
                            <Badge variant="primary" className="text-xs">
                              {event.metadata.to as string}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

