import { useNavigate } from "react-router-dom";
import { PencilIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useThemeStore();

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in-up">
      <header>
        <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Paramètres & Sécurité</h2>
        <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          Gérez votre compte, les rôles et l'authentification à deux facteurs.
        </p>
      </header>

      <Card className={cn(theme === "dark" ? "border-neon-cyan/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            <PencilIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4 text-sm">
            <div className={cn("flex justify-between items-center py-2 border-b", theme === "dark" ? "border-neon-cyan/10" : "border-gray-200")}>
              <dt className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Nom complet</dt>
              <dd className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{user?.full_name ?? "Non renseigné"}</dd>
            </div>
            <div className={cn("flex justify-between items-center py-2 border-b", theme === "dark" ? "border-neon-cyan/10" : "border-gray-200")}>
              <dt className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Email</dt>
              <dd className={cn("font-semibold", theme === "dark" ? "text-gray-300" : "text-gray-700")}>{user?.email ?? "Non renseigné"}</dd>
            </div>
            <div className="flex justify-between items-center py-2">
              <dt className={cn("font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Rôle</dt>
              <dd className={cn("capitalize font-bold", theme === "dark" ? "text-neon-purple" : "text-purple-600")}>{user?.role ?? "N/A"}</dd>
            </div>
          </dl>
          <Button variant="dark" size="md" className="mt-6 group" onClick={() => navigate("/profile/edit")}>
            <PencilIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>Modifier le profil</span>
          </Button>
        </CardContent>
      </Card>

      <Card className={cn(theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            <ShieldCheckIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-purple" : "text-purple-600")} />
            Sécurité & 2FA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn("text-sm font-medium mb-6", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Activez l'authentification à deux facteurs pour sécuriser les accès des sponsors et administrateurs.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate("/parametres/2fa")}>
            <ShieldCheckIcon className="h-4 w-4" />
            Activer / Gérer le 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
