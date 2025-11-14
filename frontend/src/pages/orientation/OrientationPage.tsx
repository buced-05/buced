import { useState, useEffect } from "react";
import { PlusIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import OrientationRequestCard from "../../components/orientation/OrientationRequestCard";
import NewRequestModal from "./NewRequestModal";
import AddResourceModal from "./AddResourceModal";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { orientationService } from "../../api/services";
import type { OrientationRequest, Resource } from "../../types/api";

const OrientationPage = () => {
  const { theme } = useThemeStore();
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [addResourceOpen, setAddResourceOpen] = useState(false);
  const [requests, setRequests] = useState<OrientationRequest[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [requestsData, resourcesData] = await Promise.all([
        orientationService.listRequests().catch(() => ({ results: [] })),
        orientationService.listResources().catch(() => ({ results: [] })),
      ]);

      setRequests(requestsData.results || []);
      setResources(resourcesData.results || []);

      // Si pas de données, utiliser les données mock
      if ((requestsData.results || []).length === 0) {
        setRequests([
          { id: 1, student: 1, student_name: "Awa Koné", advisor: null, advisor_name: null, topic: "Orientation IA & Data", context: "", status: "matched", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, student: 2, student_name: "Yao Kouadio", advisor: null, advisor_name: null, topic: "Entrepreneuriat social", context: "", status: "pending", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 3, student: 3, student_name: "Kouamé Léa", advisor: null, advisor_name: null, topic: "Ingénierie environnementale", context: "", status: "in_progress", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ]);
      }

      if ((resourcesData.results || []).length === 0) {
        setResources([
          { id: 1, title: "Guide filières scientifiques 2025", category: "Orientation", description: "", url: "", created_at: new Date().toISOString() },
          { id: 2, title: "Mentors disponibles - Q4", category: "Mentorat", description: "", url: "", created_at: new Date().toISOString() },
          { id: 3, title: "Bourses & financements innovants", category: "Financement", description: "", url: "", created_at: new Date().toISOString() },
        ]);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRequest = async (data: { studentName: string; topic: string; description: string }) => {
    try {
      await orientationService.createRequest({
        topic: data.topic,
        context: data.description,
      });
      await fetchData();
      setNewRequestOpen(false);
    } catch (err: any) {
      console.error("Erreur lors de la création:", err);
      alert(err.response?.data?.detail || "Erreur lors de la création de la demande");
    }
  };

  const handleAddResource = async (data: { title: string; category: string; description: string; url?: string }) => {
    try {
      await orientationService.createResource({
        title: data.title,
        category: data.category,
        description: data.description,
        url: data.url || "",
      });
      await fetchData();
      setAddResourceOpen(false);
    } catch (err: any) {
      console.error("Erreur lors de l'ajout:", err);
      alert(err.response?.data?.detail || err.message || "Erreur lors de l'ajout de la ressource");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Orientation & Conseil</h2>
          <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Assignez les demandes, suivez les conversations et partagez des ressources.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md" onClick={() => setAddResourceOpen(true)}>
            <DocumentPlusIcon className="h-4 w-4" />
            Ajouter une ressource
          </Button>
          <Button variant="primary" size="md" onClick={() => setNewRequestOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </header>

    {error && (
      <div className={cn(
        "rounded-lg border p-3 text-sm",
        theme === "dark"
          ? "border-red-500/50 bg-red-500/10 text-red-400"
          : "border-red-300 bg-red-50 text-red-600"
      )}>
        {error}
      </div>
    )}

    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className={cn(
              "inline-block animate-spin rounded-full h-12 w-12 border-4 mb-4",
              theme === "dark" ? "border-neon-purple border-t-transparent" : "border-purple-600 border-t-transparent"
            )} />
            <p className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Chargement des demandes...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <Card className={cn(theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
            <CardContent className="p-12 text-center">
              <p className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                Aucune demande d'orientation pour le moment
              </p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <OrientationRequestCard 
              key={request.id} 
              request={{
                id: request.id.toString(),
                studentName: request.student_name,
                topic: request.topic,
                status: request.status as "pending" | "matched" | "in_progress" | "completed",
              }} 
            />
          ))
        )}
      </div>
      <Card className={cn(theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
        <CardHeader>
          <CardTitle className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>Ressources pédagogiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {resources.map((resource) => (
              <li
                key={resource.id}
                className={cn("rounded-xl border p-4 transition-all duration-300 cursor-pointer", theme === "dark" ? "border-neon-purple/20 bg-[#2A2A3E] hover:border-neon-purple/50" : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-gray-100")}
              >
                <p className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{resource.title}</p>
                <p className={cn("text-xs uppercase tracking-wide font-semibold mt-1", theme === "dark" ? "text-neon-purple" : "text-purple-600")}>
                  {resource.category}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>

    <NewRequestModal
      open={newRequestOpen}
      onClose={() => setNewRequestOpen(false)}
      onSubmit={handleNewRequest}
    />
    <AddResourceModal
      open={addResourceOpen}
      onClose={() => setAddResourceOpen(false)}
      onSubmit={handleAddResource}
    />
  </div>
  );
};

export default OrientationPage;
