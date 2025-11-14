import { useState, useEffect } from "react";
import {
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  CheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../api/client";
import type { Project } from "../../types/api";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "member" | "invited";
  joined_at?: string;
};

type ProjectTeamProps = {
  projectId: string;
  isOwner: boolean;
};

export const ProjectTeam = ({ projectId, isOwner }: ProjectTeamProps) => {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [projectId]);

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      // Récupérer le projet pour obtenir l'équipe
      const { data: projectData } = await apiClient.get<Project>(`/v1/projects/items/${projectId}/`);
      
      const teamMembers: TeamMember[] = projectData.team.map((member) => ({
        id: member.id.toString(),
        name: `${member.first_name} ${member.last_name}`,
        email: member.email,
        avatar: undefined,
        role: projectData.owner.id === member.id ? "owner" : "member",
        joined_at: projectData.created_at, // Approximation
      }));

      setMembers(teamMembers);
      // TODO: Récupérer les invitations depuis une API dédiée si elle existe
      setInvitations([]);
    } catch (error) {
      console.error("Erreur lors du chargement de l'équipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    try {
      // Chercher l'utilisateur par email d'abord
      // TODO: Créer un endpoint pour inviter par email ou utiliser assign-team
      const { data: projectData } = await apiClient.get<Project>(`/v1/projects/items/${projectId}/`);
      
      // Pour l'instant, on utilise assign-team avec l'ID utilisateur
      // Il faudrait un endpoint pour inviter par email
      alert("Fonctionnalité d'invitation par email à implémenter côté backend");
      
      // Simulation temporaire
      const newInvitation: TeamMember = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        role: "invited",
      };

      setInvitations([...invitations, newInvitation]);
      setEmail("");
    } catch (error: any) {
      console.error("Erreur lors de l'invitation:", error);
      alert(error.response?.data?.detail || "Erreur lors de l'invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce membre de l'équipe ?")) return;

    try {
      // Récupérer le projet actuel
      const { data: projectData } = await apiClient.get<Project>(`/v1/projects/items/${projectId}/`);
      
      // Retirer le membre de l'équipe
      const updatedTeamIds = projectData.team
        .filter((member) => member.id.toString() !== memberId)
        .map((member) => member.id);

      await apiClient.post(`/v1/projects/items/${projectId}/assign-team/`, {
        team_ids: updatedTeamIds,
      });

      setMembers(members.filter((m) => m.id !== memberId));
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      alert(error.response?.data?.detail || "Erreur lors de la suppression du membre");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // TODO: Appel API réel
      // await apiClient.delete(`/v1/projects/${projectId}/team/invitations/${invitationId}/`);

      setInvitations(invitations.filter((i) => i.id !== invitationId));
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserGroupIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
          Équipe ({members.length + invitations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Form */}
        {isOwner && (
          <form onSubmit={handleInvite} className="space-y-2">
            <label className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
              Inviter un membre
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                startAdornment={<EnvelopeIcon className="h-5 w-5" />}
                className="flex-1"
                required
              />
              <Button variant="primary" type="submit" loading={isInviting} className="flex-shrink-0">
                <UserPlusIcon className="h-4 w-4" />
                Inviter
              </Button>
            </div>
          </form>
        )}

        {/* Members List */}
        <div className="space-y-3">
          <h4 className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Membres ({members.length})
          </h4>
          {isLoading ? (
            <div className="text-center py-4">
              <div
                className={cn(
                  "inline-block animate-spin rounded-full h-6 w-6 border-4",
                  theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
                )}
              />
            </div>
          ) : members.length === 0 ? (
            <p className={cn("text-sm text-center py-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun membre dans l'équipe
            </p>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    theme === "dark" ? "border-neon-cyan/20 bg-[#2A2A3E]" : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex-shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                          theme === "dark"
                            ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        )}
                      >
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                        {member.name}
                      </p>
                      {member.role === "owner" && (
                        <Badge variant="primary" className="text-xs">
                          Propriétaire
                        </Badge>
                      )}
                    </div>
                    <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      {member.email}
                    </p>
                    {member.joined_at && (
                      <div className="flex items-center gap-1 mt-1">
                        <ClockIcon className={cn("h-3 w-3", theme === "dark" ? "text-gray-500" : "text-gray-400")} />
                        <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                          Rejoint le {formatDate(member.joined_at)}
                        </span>
                      </div>
                    )}
                  </div>
                  {isOwner && member.role !== "owner" && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className={cn(
                        "p-1 rounded-lg transition-colors",
                        theme === "dark"
                          ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="space-y-3">
            <h4 className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
              Invitations en attente ({invitations.length})
            </h4>
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    theme === "dark"
                      ? "border-neon-yellow/20 bg-neon-yellow/5"
                      : "border-yellow-200 bg-yellow-50"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                        theme === "dark"
                          ? "bg-neon-yellow/20 text-neon-yellow"
                          : "bg-yellow-100 text-yellow-600"
                      )}
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                        {invitation.name}
                      </p>
                      <Badge variant="warning" className="text-xs">
                        En attente
                      </Badge>
                    </div>
                    <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      {invitation.email}
                    </p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleCancelInvitation(invitation.id)}
                      className={cn(
                        "p-1 rounded-lg transition-colors",
                        theme === "dark"
                          ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

