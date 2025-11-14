import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentTextIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import NewReportModal from "./NewReportModal";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const programs = [
  {
    id: "p1",
    project: "EduSolar",
    mentor: "Fatou Traoré",
    status: "Actif",
    budget: "12 M XOF",
    nextSession: "14 nov. 2025"
  },
  {
    id: "p2",
    project: "HealthBot",
    mentor: "Dr. Koffi",
    status: "Planifié",
    budget: "8 M XOF",
    nextSession: "18 nov. 2025"
  }
];

const AccompanimentPage = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [newReportOpen, setNewReportOpen] = useState<string | null>(null);

  const handleNewReport = (data: { title: string; type: string; content: string; milestoneId?: string }) => {
    console.log("Nouveau rapport:", data);
    // TODO: Appel API pour créer le rapport
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
    <header>
      <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Accompagnement des Lauréats</h2>
      <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
        Suivez les jalons, le budget et les KPIs des projets sélectionnés (top 2%).
      </p>
    </header>

    <section className="grid gap-4 md:grid-cols-2">
      {programs.map((program) => (
        <Card key={program.id} className={cn("hover:border-neon-cyan/50", theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
          <CardContent className="p-5">
            <header className="flex items-center justify-between mb-4">
              <div>
                <h3 className={cn("text-lg font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{program.project}</h3>
                <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-500" : "text-gray-600")}>Mentor : {program.mentor}</p>
              </div>
              <Badge variant="primary">{program.status}</Badge>
            </header>
            <dl className="space-y-2 text-sm mb-4">
              <div className={cn("flex justify-between items-center py-2 border-b", theme === "dark" ? "border-neon-purple/10" : "border-gray-200")}>
                <dt className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Budget alloué</dt>
                <dd className={cn("font-bold", theme === "dark" ? "text-neon-purple" : "text-purple-600")}>{program.budget}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className={cn("font-medium flex items-center gap-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  <CalendarIcon className="h-4 w-4" />
                  Prochaine session
                </dt>
                <dd className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>{program.nextSession}</dd>
              </div>
            </dl>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/accompagnement/milestones/${program.id}`)}>
                Voir les jalons
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setNewReportOpen(program.id)}>
                <DocumentTextIcon className="h-4 w-4" />
                Nouveau rapport
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>

    {newReportOpen && (
      <NewReportModal
        open={!!newReportOpen}
        onClose={() => setNewReportOpen(null)}
        projectId={newReportOpen}
        onSubmit={handleNewReport}
      />
    )}
  </div>
  );
};

export default AccompanimentPage;
