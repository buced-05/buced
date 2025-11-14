import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import NewTaskModal from "./NewTaskModal";

const columns = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [{ id: "t1", title: "Brief UX", owner: "Design team" }]
  },
  {
    id: "in_progress",
    title: "En cours",
    tasks: [{ id: "t2", title: "API scoring IA", owner: "Equipe ML" }]
  },
  {
    id: "review",
    title: "Revue",
    tasks: [{ id: "t3", title: "Tests QA", owner: "Quality squad" }]
  },
  {
    id: "done",
    title: "Terminé",
    tasks: [{ id: "t4", title: "Prototype EduSolar", owner: "DevOps" }]
  }
];

const PrototypingPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const handleNewTask = (data: { title: string; description: string; owner: string; column: string }) => {
    console.log("Nouvelle tâche:", data);
    // TODO: Appel API pour créer la tâche
  };

  const handleGenerateSpecs = () => {
    navigate("/prototyping/specs");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-2xl md:text-3xl font-black ${
            theme === "dark" ? "gradient-text" : "text-gray-900"
          }`}>
            Prototypage rapide
          </h2>
          <p className={`text-sm font-medium mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Planifiez les sprints de 7 jours, assignez les équipes et générez des spécifications techniques.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => setNewTaskOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Nouvelle tâche
          </Button>
          <Button variant="primary" size="md" onClick={handleGenerateSpecs}>
            <SparklesIcon className="h-4 w-4" />
            Générer les specs
          </Button>
        </div>
      </header>

    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <Card key={column.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-sm font-bold uppercase tracking-wide ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                {column.title}
              </CardTitle>
              <Badge variant="neutral">{column.tasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl border p-4 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-neon-cyan/20 bg-[#2A2A3E] hover:border-neon-cyan/50"
                    : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-gray-100"
                }`}
              >
                <p className={`text-sm font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {task.title}
                </p>
                <p className={`mt-1 text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-600"
                }`}>
                  {task.owner}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>

    <NewTaskModal
      open={newTaskOpen}
      onClose={() => setNewTaskOpen(false)}
      onSubmit={handleNewTask}
    />
  </div>
  );
};

export default PrototypingPage;
