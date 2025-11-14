import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const MilestonesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - à remplacer par un appel API
  const project = {
    id: id ?? "p1",
    name: "EduSolar",
    mentor: "Fatou Traoré",
    budget: "12 M XOF",
  };

  const milestones = [
    {
      id: "m1",
      title: "Phase 1 : Conception",
      description: "Définition de l'architecture et des spécifications techniques",
      status: "completed",
      dueDate: "2025-10-01",
      completedDate: "2025-09-28",
    },
    {
      id: "m2",
      title: "Phase 2 : Développement MVP",
      description: "Développement du prototype fonctionnel",
      status: "in_progress",
      dueDate: "2025-11-15",
      progress: 65,
    },
    {
      id: "m3",
      title: "Phase 3 : Tests & Validation",
      description: "Tests utilisateurs et validation des fonctionnalités",
      status: "pending",
      dueDate: "2025-12-01",
    },
    {
      id: "m4",
      title: "Phase 4 : Déploiement",
      description: "Mise en production et lancement officiel",
      status: "pending",
      dueDate: "2025-12-15",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/accompagnement")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-black gradient-text">Jalons - {project.name}</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Suivez l'avancement des jalons du projet
          </p>
        </div>
      </header>

      <Card className="border-neon-cyan/30 bg-[#1A1A2E]">
        <CardHeader>
          <CardTitle className="text-white">Informations du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">Mentor</p>
              <p className="text-sm font-bold text-white mt-1">{project.mentor}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Budget</p>
              <p className="text-sm font-bold text-neon-purple mt-1">{project.budget}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Statut global</p>
              <Badge variant="primary" className="mt-1">En cours</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card
            key={milestone.id}
            className={`border-neon-cyan/30 bg-[#1A1A2E] ${
              milestone.status === "completed" ? "opacity-75" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {milestone.status === "completed" ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neon-green/20 border-2 border-neon-green">
                      <CheckCircleIcon className="h-6 w-6 text-neon-green" />
                    </div>
                  ) : milestone.status === "in_progress" ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neon-cyan/20 border-2 border-neon-cyan">
                      <ClockIcon className="h-6 w-6 text-neon-cyan" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700/20 border-2 border-gray-700">
                      <div className="h-3 w-3 rounded-full bg-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "success"
                          : milestone.status === "in_progress"
                          ? "primary"
                          : "neutral"
                      }
                    >
                      {milestone.status === "completed"
                        ? "Terminé"
                        : milestone.status === "in_progress"
                        ? "En cours"
                        : "En attente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{milestone.description}</p>
                  {milestone.status === "in_progress" && milestone.progress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span className="font-bold text-neon-cyan">{milestone.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#2A2A3E] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Échéance :{" "}
                      <span className="font-semibold text-white">
                        {new Date(milestone.dueDate).toLocaleDateString("fr-FR")}
                      </span>
                    </span>
                    {milestone.completedDate && (
                      <span>
                        Terminé le :{" "}
                        <span className="font-semibold text-neon-green">
                          {new Date(milestone.completedDate).toLocaleDateString("fr-FR")}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MilestonesPage;

