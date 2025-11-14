import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

type OrientationRequest = {
  id: string;
  studentName: string;
  topic: string;
  status: "pending" | "matched" | "in_progress" | "completed";
  scheduledAt?: string;
};

const statusColors: Record<OrientationRequest["status"], "warning" | "primary" | "secondary" | "success"> = {
  pending: "warning",
  matched: "primary",
  in_progress: "secondary",
  completed: "success"
};

const OrientationRequestCard = ({ request }: { request: OrientationRequest }) => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  return (
    <Card className={cn(
      "hover:border-neon-purple/50 transition-all duration-200",
      theme === "dark" 
        ? "border-neon-cyan/30 bg-[#1A1A2E]" 
        : "border-gray-200 bg-white hover:border-purple-300"
    )}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className={cn("text-base font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
            {request.topic}
          </h4>
          <Badge variant={statusColors[request.status]}>
            {request.status.replace("_", " ")}
          </Badge>
        </div>
        <p className={cn("mt-1 text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          {request.studentName}
        </p>
        {request.scheduledAt ? (
          <p className={cn("mt-3 text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
            Session prévue : {request.scheduledAt}
          </p>
        ) : null}
        <Button variant="primary" size="sm" className="mt-4 w-full" onClick={() => navigate(`/orientation/${request.id}`)}>
          Ouvrir la fiche
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrientationRequestCard;
