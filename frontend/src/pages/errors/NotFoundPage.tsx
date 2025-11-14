import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const NotFoundPage = () => {
  const { theme } = useThemeStore();
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in-up">
      <Card className={cn("max-w-2xl w-full text-center", theme === "dark" ? "border-neon-pink/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
        <CardContent className="p-12">
          <div className="mb-8">
            <h1 className={cn("text-9xl font-black mb-4", theme === "dark" ? "gradient-text" : "text-gray-900")}>404</h1>
            <h2 className={cn("text-3xl font-black mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Page introuvable</h2>
            <p className={cn("font-medium text-lg", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              <HomeIcon className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Page précédente
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default NotFoundPage;
