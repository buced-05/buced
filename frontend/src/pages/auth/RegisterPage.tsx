import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { useThemeStore } from "../../stores/theme";
import { useAuthStore } from "../../stores/auth";
import { cn } from "../../utils/cn";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticating } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    first_name: "",
    last_name: "",
    role: "student" as const,
    establishment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validation côté client
    if (formData.password !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      console.log("Tentative d'inscription avec:", {
        email: formData.email.trim().toLowerCase(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        establishment: formData.establishment || undefined,
      });

      // Import dynamique pour éviter les problèmes de dépendances circulaires
      const { default: apiClient } = await import("../../api/client");
      
      const { data } = await apiClient.post("/v1/auth/register/", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
        establishment: formData.establishment.trim() || undefined,
        // username sera généré automatiquement par le backend à partir de l'email
      });

      console.log("Inscription réussie, données reçues:", data);

      // Connexion automatique après l'inscription
      console.log("Connexion automatique après l'inscription...");
      await login({
        username: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("Connexion réussie, redirection...");
      navigate("/");
    } catch (err: any) {
      console.error("Erreur lors de l'inscription complète:", err);
      console.error("Détails:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });

      let errorMessage = "Erreur lors de l'inscription.";
      const newFieldErrors: Record<string, string> = {};

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400) {
          // Erreurs de validation Django REST Framework
          if (typeof data === 'object' && data !== null) {
            // Gérer les erreurs de champ spécifiques
            Object.keys(data).forEach((field) => {
              if (Array.isArray(data[field])) {
                newFieldErrors[field] = data[field][0];
              } else if (typeof data[field] === 'string') {
                newFieldErrors[field] = data[field];
              } else if (typeof data[field] === 'object') {
                // Erreurs imbriquées
                const nestedErrors = Object.values(data[field]).flat();
                newFieldErrors[field] = nestedErrors[0] || "Erreur de validation";
              }
            });

            // Si on a des erreurs de champ, les utiliser
            if (Object.keys(newFieldErrors).length > 0) {
              setFieldErrors(newFieldErrors);
              // Prendre le premier message d'erreur comme message principal
              errorMessage = Object.values(newFieldErrors)[0];
            } else {
              // Sinon, utiliser le message général
              errorMessage = data.detail || data.message || "Données invalides. Vérifiez les informations saisies.";
            }
          } else {
            errorMessage = data?.detail || data?.message || "Données invalides. Vérifiez les informations saisies.";
          }
        } else if (status === 409) {
          errorMessage = "Cet email est déjà utilisé.";
        } else if (status === 404) {
          errorMessage = "Service d'inscription indisponible.";
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

      <Card className={`w-full max-w-2xl shadow-lg ${
        theme === "dark" 
          ? "border-neon-purple/30 bg-[#1A1A2E]" 
          : "border-gray-200 bg-white shadow-xl"
      }`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-black text-2xl">
            BCE
          </div>
          <CardTitle className={`text-3xl font-black ${theme === "dark" ? "gradient-text" : "text-gray-900"}`}>Créer un compte</CardTitle>
          <CardDescription className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Rejoignez la communauté d'innovation éducative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={cn(
                "rounded-lg border p-3 text-sm",
                theme === "dark" 
                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                  : "border-red-300 bg-red-50 text-red-600"
              )}>
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Jean"
                  value={formData.first_name}
                  onChange={(e) => {
                    setFormData({ ...formData, first_name: e.target.value });
                    if (fieldErrors.first_name) setFieldErrors({ ...fieldErrors, first_name: "" });
                  }}
                  required
                  startAdornment={<UserIcon className="h-5 w-5" />}
                />
                {fieldErrors.first_name && (
                  <p className={cn("text-xs", theme === "dark" ? "text-red-400" : "text-red-600")}>
                    {fieldErrors.first_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Dupont"
                  value={formData.last_name}
                  onChange={(e) => {
                    setFormData({ ...formData, last_name: e.target.value });
                    if (fieldErrors.last_name) setFieldErrors({ ...fieldErrors, last_name: "" });
                  }}
                  required
                  startAdornment={<UserIcon className="h-5 w-5" />}
                />
                {fieldErrors.last_name && (
                  <p className={cn("text-xs", theme === "dark" ? "text-red-400" : "text-red-600")}>
                    {fieldErrors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                required
                startAdornment={<EnvelopeIcon className="h-5 w-5" />}
              />
              {fieldErrors.email && (
                <p className={cn("text-xs", theme === "dark" ? "text-red-400" : "text-red-600")}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  required
                >
                  <option value="student">Étudiant</option>
                  <option value="counselor">Conseiller</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="mentor">Mentor</option>
                  <option value="jury">Jury</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishment">Établissement</Label>
                <Input
                  id="establishment"
                  type="text"
                  placeholder="Lycée Moderne Abidjan"
                  value={formData.establishment}
                  onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                  startAdornment={<BuildingOfficeIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  startAdornment={<LockClosedIcon className="h-5 w-5" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirmer le mot de passe</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  required
                  startAdornment={<LockClosedIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full" 
              loading={loading || isAuthenticating}
              disabled={loading || isAuthenticating}
            >
              Créer mon compte
              <ArrowRightIcon className="h-5 w-5" />
            </Button>

            <div className={`text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Déjà un compte ?{" "}
              <Link to="/login" className={`font-semibold ${theme === "dark" ? "text-neon-cyan hover:text-neon-purple" : "text-blue-600 hover:text-blue-700"}`}>
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;

