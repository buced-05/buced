import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { HomeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const ErrorPage = () => {
  const error = useRouteError();
  const { theme } = useThemeStore();

  let errorMessage = "Une erreur inattendue s'est produite.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || errorMessage;
    
    if (error.status === 404) {
      errorMessage = "La page que vous recherchez n'existe pas.";
    } else if (error.status === 403) {
      errorMessage = "Vous n'avez pas l'autorisation d'accéder à cette page.";
    } else if (error.status === 500) {
      errorMessage = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4", theme === "dark" ? "bg-[#0A0A0F]" : "bg-gray-50")}>
      {theme === "dark" && <div className="fixed inset-0 bg-pattern -z-10 opacity-30" />}
      <Card className={cn("max-w-2xl w-full text-center animate-fade-in-up", theme === "dark" ? "border-neon-pink/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
        <CardContent className="p-12">
          <div className="mb-8">
            <div className={cn("inline-flex h-20 w-20 items-center justify-center rounded-full border-2 mb-6", theme === "dark" ? "bg-neon-pink/20 border-neon-pink/50" : "bg-pink-100 border-pink-300")}>
              <ExclamationTriangleIcon className={cn("h-10 w-10", theme === "dark" ? "text-neon-pink" : "text-pink-600")} />
            </div>
            <h1 className={cn("text-6xl font-black mb-4", theme === "dark" ? "gradient-text" : "text-gray-900")}>{errorStatus}</h1>
            <h2 className={cn("text-2xl font-black mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Oups ! Une erreur est survenue</h2>
            <p className={cn("font-medium text-lg mb-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>{errorMessage}</p>
            {process.env.NODE_ENV === "development" && error instanceof Error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-neon-cyan">
                  Détails techniques
                </summary>
                <pre className="mt-2 p-4 rounded-lg bg-[#0A0A0F] border border-neon-cyan/20 text-xs text-gray-400 overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button variant="primary" size="lg">
                <HomeIcon className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
