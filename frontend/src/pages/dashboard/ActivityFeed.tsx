import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useThemeStore } from "../../stores/theme";

const activities = [
  { id: "a1", title: "Prototype EduSolar livré", time: "Il y a 2h", projectId: "1" },
  { id: "a2", title: "15 nouveaux votes pour AgriConnect", time: "Il y a 5h", projectId: "2" },
  { id: "a3", title: "Sponsor Orange CI soutient HealthBot", time: "Hier", projectId: "3" }
];

const ActivityFeed = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const handleActivityClick = (projectId?: string) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Actualités</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
            Voir toutes les actualités
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 text-sm">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                theme === "dark"
                  ? "border-neon-cyan/20 bg-[#2A2A3E] hover:border-neon-cyan/50"
                  : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-gray-100"
              }`}
              onClick={() => handleActivityClick(activity.projectId)}
            >
              <p className={`font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {activity.title}
              </p>
              <p className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}>
                {activity.time}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
