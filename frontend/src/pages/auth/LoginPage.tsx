import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { useThemeStore } from "../../stores/theme";
import { useAuthStore } from "../../stores/auth";
import { handleDeepLink } from "../../utils/deepLinking";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticating } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Tentative de connexion avec:", { email: email.trim().toLowerCase() });
      
      // Utiliser le store auth qui gère automatiquement email/username
      await login({ 
        username: email.trim().toLowerCase(), // Le store détectera que c'est un email
        password 
      });
      
      console.log("Connexion réussie, redirection...");
      
      // Handle redirect after login
      const redirect = searchParams.get('redirect');
      const deepLink = searchParams.get('deep_link');
      
      if (deepLink) {
        handleDeepLink(deepLink, navigate);
      } else if (redirect) {
        navigate(decodeURIComponent(redirect));
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Erreur de connexion complète:", err);
      console.error("Détails:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });
      
      let errorMessage = "Erreur de connexion. Vérifiez vos identifiants.";
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          errorMessage = data?.detail || data?.message || "Email ou mot de passe incorrect.";
        } else if (status === 400) {
          errorMessage = data?.detail || data?.message || "Données invalides. Vérifiez votre email.";
        } else if (status === 404) {
          errorMessage = "Service d'authentification indisponible.";
        } else if (status >= 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
        } else {
          errorMessage = data?.detail || data?.message || `Erreur ${status}: ${err.response.statusText}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === "dark" ? "bg-[#0A0A0F]" : "bg-gray-50"
    }`}>
      {/* Theme toggle button */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`fixed top-4 right-4 rounded-lg p-2.5 transition-all duration-200 shadow-md z-50 ${
          theme === "dark"
            ? "border border-neon-cyan/30 bg-[#2A2A3E] text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan"
            : "border border-blue-300 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 shadow-sm"
        }`}
        aria-label="Changer le thème"
        title={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </button>

      <div className={`fixed inset-0 -z-10 ${theme === "dark" ? "bg-pattern opacity-30" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"}`} />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {theme === "dark" ? (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </>
        )}
      </div>

      <Card className={`w-full max-w-md shadow-lg ${
        theme === "dark" 
          ? "border-neon-cyan/30 bg-[#1A1A2E]" 
          : "border-gray-200 bg-white shadow-xl"
      }`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F] font-black text-2xl">
            BCE
          </div>
          <CardTitle className={`text-3xl font-black ${theme === "dark" ? "gradient-text" : "text-gray-900"}`}>Connexion</CardTitle>
          <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Accédez à votre espace de travail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-neon-pink/50 bg-neon-pink/10 p-3 text-sm text-neon-pink">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                startAdornment={<EnvelopeIcon className="h-5 w-5" />}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                startAdornment={<LockClosedIcon className="h-5 w-5" />}
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full" 
              loading={loading || isAuthenticating}
              disabled={loading || isAuthenticating}
            >
              Se connecter
              <ArrowRightIcon className="h-5 w-5" />
            </Button>

            <div className={`text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Pas encore de compte ?{" "}
              <Link to="/register" className={`font-semibold ${theme === "dark" ? "text-neon-cyan hover:text-neon-purple" : "text-blue-600 hover:text-blue-700"}`}>
                Créer un compte
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

