import { useState, useEffect, useRef } from "react";
import {
  DocumentTextIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../api/client";

type Document = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_by: {
    id: string;
    name: string;
  };
  uploaded_at: string;
};

type ProjectDocumentsProps = {
  projectId: string;
  isOwner: boolean;
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return PhotoIcon;
  if (type.includes("pdf")) return DocumentIcon;
  if (type.includes("word") || type.includes("document")) return DocumentTextIcon;
  return DocumentIcon;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export const ProjectDocuments = ({ projectId, isOwner }: ProjectDocumentsProps) => {
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get(`/v1/projects/documents/?project=${projectId}`);
      const docs = (data.results || []).map((doc: any) => ({
        id: doc.id.toString(),
        name: doc.file_name,
        url: doc.file_url,
        type: doc.file_type,
        size: 0, // Le backend ne retourne pas la taille pour l'instant
        uploaded_by: {
          id: doc.uploaded_by?.id?.toString() || "0",
          name: doc.uploaded_by?.name || "Inconnu",
        },
        uploaded_at: doc.uploaded_at,
      }));
      setDocuments(docs);
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("project", projectId);

        const { data } = await apiClient.post(`/v1/projects/documents/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const newDocument: Document = {
          id: data.id.toString(),
          name: data.file_name,
          url: data.file_url,
          type: data.file_type,
          size: file.size,
          uploaded_by: {
            id: user?.id?.toString() || "1",
            name: user?.full_name || "Vous",
          },
          uploaded_at: data.uploaded_at,
        };

        setDocuments([newDocument, ...documents]);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      alert(error.response?.data?.detail || "Erreur lors de l'upload du fichier");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      await apiClient.delete(`/v1/projects/documents/${documentId}/`);
      setDocuments(documents.filter((d) => d.id !== documentId));
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      alert(error.response?.data?.detail || "Erreur lors de la suppression");
    }
  };

  const handleDownload = (document: Document) => {
    // TODO: Téléchargement réel via API
    window.open(document.url, "_blank");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DocumentTextIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
            Documents ({documents.length})
          </CardTitle>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <PlusIcon className="h-4 w-4" />
              {isUploading ? "Upload..." : "Ajouter"}
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx,.ppt,.pptx"
        />
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
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon
              className={cn("h-12 w-12 mx-auto mb-4 opacity-50", theme === "dark" ? "text-neon-cyan" : "text-gray-400")}
            />
            <p className={cn("text-sm font-medium mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Aucun document pour le moment
            </p>
            {isOwner && (
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <PlusIcon className="h-4 w-4" />
                Ajouter un document
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((document) => {
              const FileIcon = getFileIcon(document.type);
              const isOwnerDocument = document.uploaded_by.id === user?.id?.toString();

              return (
                <div
                  key={document.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    theme === "dark"
                      ? "border-neon-cyan/20 bg-[#2A2A3E] hover:border-neon-cyan/50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-gray-100"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 p-2 rounded-lg",
                      theme === "dark" ? "bg-neon-cyan/10" : "bg-blue-100"
                    )}
                  >
                    <FileIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-bold truncate", theme === "dark" ? "text-white" : "text-gray-900")}>
                      {document.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        {formatFileSize(document.size)}
                      </span>
                      <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>•</span>
                      <span className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        {document.uploaded_by.name}
                      </span>
                      <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>•</span>
                      <span className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        {formatDate(document.uploaded_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDownload(document)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        theme === "dark"
                          ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      )}
                      title="Télécharger"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                    {(isOwner || isOwnerDocument) && (
                      <button
                        onClick={() => handleDelete(document.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          theme === "dark"
                            ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        )}
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

