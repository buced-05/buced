import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import ContactModal from "./ContactModal";

const SponsorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [contactOpen, setContactOpen] = useState(false);

  const handleContact = (data: { subject: string; message: string }) => {
    console.log("Message envoyé:", data);
    // TODO: Appel API pour envoyer le message
  };

  // Mock data - à remplacer par un appel API
  const sponsor = {
    id: id ?? "s1",
    name: "Orange Côte d'Ivoire",
    budget: "45 M XOF",
    projects: 6,
    description: "Orange Côte d'Ivoire s'engage pour l'innovation éducative et le développement des talents locaux.",
    interests: ["Technologie", "Éducation", "Innovation"],
    contact: "sponsors@orange.ci",
  };

  const projects = [
    { id: "1", name: "EduSolar", budget: "8 M XOF", status: "Actif" },
    { id: "2", name: "AgriConnect", budget: "12 M XOF", status: "En développement" },
    { id: "3", name: "HealthBot", budget: "10 M XOF", status: "Actif" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/sponsors")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h2 className={cn(
            "text-2xl md:text-3xl font-black",
            theme === "dark" ? "gradient-text" : "text-gray-900"
          )}>
            {sponsor.name}
          </h2>
          <p className={cn(
            "text-sm font-medium mt-1",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Profil du sponsor et projets soutenus
          </p>
        </div>
        <Button variant="dark" size="md" onClick={() => setContactOpen(true)}>
          Contacter
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className={cn(
            theme === "dark"
              ? "border-neon-cyan/30 bg-[#1A1A2E]"
              : "border-gray-200 bg-white"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                <BuildingOfficeIcon className={cn(
                  "h-5 w-5",
                  theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                )} />
                À propos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(
                "leading-relaxed mb-4",
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              )}>
                {sponsor.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {sponsor.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">{interest}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            theme === "dark"
              ? "border-neon-purple/30 bg-[#1A1A2E]"
              : "border-gray-200 bg-white"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                <LightBulbIcon className={cn(
                  "h-5 w-5",
                  theme === "dark" ? "text-neon-purple" : "text-purple-600"
                )} />
                Projets soutenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                      theme === "dark"
                        ? "border-neon-purple/20 bg-[#2A2A3E] hover:border-neon-purple/50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    <div>
                      <p className={cn(
                        "font-bold",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}>
                        {project.name}
                      </p>
                      <p className={cn(
                        "text-sm",
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      )}>
                        {project.budget}
                      </p>
                    </div>
                    <Badge variant="primary">{project.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={cn(
            theme === "dark"
              ? "border-neon-pink/30 bg-[#1A1A2E]"
              : "border-gray-200 bg-white"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "text-lg",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn(
                "text-center p-4 rounded-lg border",
                theme === "dark"
                  ? "border-neon-cyan/20 bg-[#2A2A3E]"
                  : "border-gray-200 bg-gray-50"
              )}>
                <CurrencyDollarIcon className={cn(
                  "h-8 w-8 mx-auto mb-2",
                  theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                )} />
                <p className={cn(
                  "text-2xl font-black",
                  theme === "dark" ? "gradient-text" : "text-gray-900"
                )}>
                  {sponsor.budget}
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  Budget total
                </p>
              </div>
              <div className={cn(
                "text-center p-4 rounded-lg border",
                theme === "dark"
                  ? "border-neon-purple/20 bg-[#2A2A3E]"
                  : "border-gray-200 bg-gray-50"
              )}>
                <LightBulbIcon className={cn(
                  "h-8 w-8 mx-auto mb-2",
                  theme === "dark" ? "text-neon-purple" : "text-purple-600"
                )} />
                <p className={cn(
                  "text-2xl font-black",
                  theme === "dark" ? "gradient-text" : "text-gray-900"
                )}>
                  {sponsor.projects}
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  Projets actifs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            theme === "dark"
              ? "border-neon-green/30 bg-[#1A1A2E]"
              : "border-gray-200 bg-white"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "text-lg",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(
                "text-sm mb-4",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}>
                {sponsor.contact}
              </p>
              <Button variant="primary" size="md" className="w-full" onClick={() => setContactOpen(true)}>
                Envoyer un message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        sponsorName={sponsor.name}
        sponsorEmail={sponsor.contact}
        onSubmit={handleContact}
      />
    </div>
  );
};

export default SponsorProfilePage;


