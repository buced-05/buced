import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";

const projects = [
  { id: "1", title: "EduSolar", category: "Énergie", finalScore: 92.5, communityScore: 88 },
  { id: "2", title: "AgriConnect", category: "AgriTech", finalScore: 90.1, communityScore: 85 },
  { id: "3", title: "HealthBot", category: "Santé", finalScore: 88.3, communityScore: 82 }
];

const ProjectsLeaderboard = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top projets IA + Communauté</CardTitle>
          <Badge variant="primary">Top 3</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`overflow-hidden rounded-xl border ${
          theme === "dark" ? "border-neon-cyan/20" : "border-gray-200"
        }`}>
          <table className="w-full text-left text-sm">
            <thead className={`${
              theme === "dark" ? "bg-[#2A2A3E] text-gray-400" : "bg-gray-100 text-gray-600"
            }`}>
              <tr>
                <th className="px-4 py-3 font-bold">Projet</th>
                <th className="px-4 py-3 font-bold">Catégorie</th>
                <th className="px-4 py-3 font-bold">Score final</th>
                <th className="px-4 py-3 font-bold">Score communauté</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className={`border-t transition-colors cursor-pointer ${
                    theme === "dark"
                      ? "border-neon-cyan/10 hover:bg-[#2A2A3E]/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <td className={`px-4 py-3 font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {project.title}
                  </td>
                  <td className={`px-4 py-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {project.category}
                  </td>
                  <td className={`px-4 py-3 font-bold ${
                    theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                  }`}>
                    {project.finalScore}
                  </td>
                  <td className={`px-4 py-3 font-bold ${
                    theme === "dark" ? "text-neon-purple" : "text-purple-600"
                  }`}>
                    {project.communityScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsLeaderboard;
