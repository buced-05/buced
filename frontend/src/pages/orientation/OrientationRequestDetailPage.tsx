import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UserIcon, CalendarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const OrientationRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const handleOpenMessaging = () => {
    navigate(`/orientation/${id}/messaging`);
  };

  // Mock data - à remplacer par un appel API
  const request = {
    id: id ?? "1",
    studentName: "Awa Koné",
    topic: "Orientation IA & Data",
    status: "matched" as const,
    scheduledAt: "12 nov. 2025 - 14h",
    description: "Étudiante en dernière année de licence, intéressée par les carrières en intelligence artificielle et science des données. Souhaite comprendre les parcours académiques et professionnels disponibles en Côte d'Ivoire.",
    counselor: "Dr. Kouamé",
    establishment: "Université Félix Houphouët-Boigny",
    email: "awa.kone@example.com",
    phone: "+225 07 12 34 56 78",
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/orientation")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Fiche de demande</h2>
          <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Détails de la demande d'orientation
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className={cn(theme === "dark" ? "border-neon-cyan/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>{request.topic}</CardTitle>
                <Badge variant="primary">{request.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className={cn("leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{request.description}</p>
            </CardContent>
          </Card>

          <Card className={cn(theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", theme === "dark" ? "text-white" : "text-gray-900")}>
                <ChatBubbleLeftRightIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-purple" : "text-purple-600")} />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Aucun message pour le moment</p>
              <Button variant="primary" size="md" className="mt-4" onClick={handleOpenMessaging}>
                Ouvrir la messagerie sécurisée
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={cn(theme === "dark" ? "border-neon-pink/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
            <CardHeader>
              <CardTitle className={cn("text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>Informations étudiant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
                <div>
                  <p className={cn("text-xs font-medium", theme === "dark" ? "text-gray-500" : "text-gray-600")}>Nom</p>
                  <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{request.studentName}</p>
                </div>
              </div>
              <div>
                <p className={cn("text-xs font-medium", theme === "dark" ? "text-gray-500" : "text-gray-600")}>Établissement</p>
                <p className={cn("text-sm font-semibold", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{request.establishment}</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium", theme === "dark" ? "text-gray-500" : "text-gray-600")}>Email</p>
                <p className={cn("text-sm font-semibold", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{request.email}</p>
              </div>
              <div>
                <p className={cn("text-xs font-medium", theme === "dark" ? "text-gray-500" : "text-gray-600")}>Téléphone</p>
                <p className={cn("text-sm font-semibold", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{request.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(theme === "dark" ? "border-neon-green/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
            <CardHeader>
              <CardTitle className={cn("text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("flex items-center gap-2 text-sm mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                <CalendarIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-green" : "text-green-600")} />
                <span>{request.scheduledAt}</span>
              </div>
              <div>
                <p className={cn("text-xs font-medium mb-1", theme === "dark" ? "text-gray-500" : "text-gray-600")}>Conseiller assigné</p>
                <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{request.counselor}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrientationRequestDetailPage;

