import { useState, useEffect } from "react";
import {
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../api/client";

type Comment = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
  updated_at?: string;
};

type ProjectCommentsProps = {
  projectId: string;
};

export const ProjectComments = ({ projectId }: ProjectCommentsProps) => {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // TODO: Appel API réel
      // const { data } = await apiClient.get(`/v1/projects/${projectId}/comments/`);
      
      // Mock data
      const mockComments: Comment[] = [
        {
          id: "1",
          author: { id: "1", name: "Jean Kouamé", avatar: undefined },
          content: "Excellent projet ! J'aimerais en savoir plus sur l'impact attendu.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "2",
          author: { id: "2", name: "Marie Diallo", avatar: undefined },
          content: "Très intéressant. Avez-vous prévu un pilote dans une école ?",
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
      setComments(mockComments);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // TODO: Appel API réel
      // const { data } = await apiClient.post(`/v1/projects/${projectId}/comments/`, {
      //   content: newComment
      // });

      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          id: user?.id?.toString() || "0",
          name: user?.full_name || "Utilisateur",
          avatar: user?.avatar,
        },
        content: newComment,
        created_at: new Date().toISOString(),
      };

      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return;

    try {
      // TODO: Appel API réel
      // await apiClient.patch(`/v1/projects/${projectId}/comments/${id}/`, {
      //   content: editContent
      // });

      setComments(
        comments.map((c) => (c.id === id ? { ...c, content: editContent, updated_at: new Date().toISOString() } : c))
      );
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;

    try {
      // TODO: Appel API réel
      // await apiClient.delete(`/v1/projects/${projectId}/comments/${id}/`);

      setComments(comments.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return commentDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChatBubbleLeftIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
          Commentaires ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="flex-1"
          />
          <Button variant="primary" type="submit" disabled={!newComment.trim()}>
            <PaperAirplaneIcon className="h-4 w-4" />
          </Button>
        </form>

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div
              className={cn(
                "inline-block animate-spin rounded-full h-8 w-8 border-4",
                theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
              )}
            />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <ChatBubbleLeftIcon
              className={cn("h-12 w-12 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-cyan" : "text-gray-400")}
            />
            <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun commentaire pour le moment
            </p>
            <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
              Soyez le premier à commenter !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={cn(
                  "flex gap-3 p-4 rounded-xl border",
                  theme === "dark"
                    ? "border-neon-cyan/20 bg-[#2A2A3E]"
                    : "border-gray-200 bg-gray-50"
                )}
              >
                <div className="flex-shrink-0">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
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
                      {comment.author.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                      {comment.author.name}
                    </p>
                    <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                      {formatTime(comment.created_at)}
                    </span>
                    {comment.updated_at && (
                      <span className={cn("text-xs italic", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                        (modifié)
                      </span>
                    )}
                  </div>
                  {editingId === comment.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => handleEdit(comment.id)}>
                          Enregistrer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(null);
                            setEditContent("");
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={cn("text-sm mb-2", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                        {comment.content}
                      </p>
                      {user?.id?.toString() === comment.author.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditContent(comment.content);
                            }}
                            className={cn(
                              "text-xs p-1 rounded transition-colors",
                              theme === "dark"
                                ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            )}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className={cn(
                              "text-xs p-1 rounded transition-colors",
                              theme === "dark"
                                ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                            )}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

