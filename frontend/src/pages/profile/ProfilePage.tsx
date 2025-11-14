import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserCircleIcon, 
  PencilIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  PhotoIcon,
  CameraIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import useAuth from "../../hooks/useAuth";
import { projectsService, votesService } from "../../api/services";
import { cn } from "../../utils/cn";
import apiClient from "../../api/client";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useThemeStore();
  const [stats, setStats] = useState({
    projectsCreated: 0,
    votesGiven: 0,
    contributions: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showCoverUpload, setShowCoverUpload] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      // Récupérer les projets créés par l'utilisateur
      const projectsData = await projectsService.list({ filters: { owner: user?.id } }).catch(() => ({ results: [] }));
      const projectsCount = projectsData.results?.length || 0;

      // Récupérer les votes donnés par l'utilisateur
      const votesData = await votesService.list({ filters: { voter: user?.id } }).catch(() => ({ results: [] }));
      const votesCount = votesData.results?.length || 0;

      setStats({
        projectsCreated: projectsCount,
        votesGiven: votesCount,
        contributions: projectsCount + votesCount, // Simple calcul pour les contributions
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handlePhotoChange = async (type: "avatar" | "cover", file: File | null) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append(type === "avatar" ? "avatar" : "cover_photo", file);
      
      await apiClient.patch("/v1/auth/profile/", formData);
      
      // Rafraîchir le profil en rechargeant la page
      window.location.reload();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la photo:", error);
      alert(error.response?.data?.detail || "Erreur lors de la mise à jour de la photo");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl md:text-3xl font-black ${
            theme === "dark" ? "gradient-text" : "text-gray-900"
          }`}>
            Mon Profil
          </h2>
          <p className={`text-sm font-medium mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
              <div className="flex gap-2">
                <Button variant="outline" size="md" onClick={() => navigate("/stats")}>
                  <ChartBarIcon className="h-4 w-4" />
                  Statistiques
                </Button>
                <Button variant="dark" size="md" onClick={() => navigate("/profile/edit")}>
                  <PencilIcon className="h-4 w-4" />
                  Modifier
                </Button>
              </div>
      </header>

      <div className="space-y-6">
        {/* Photo de couverture */}
        <Card className="overflow-hidden p-0">
          <div className={cn("relative h-48 sm:h-64 group", user?.cover_photo 
              ? "" 
              : theme === "dark" 
                ? "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" 
                : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          )}>
            {user?.cover_photo ? (
              <img 
                src={user.cover_photo} 
                alt="Photo de couverture" 
                className="w-full h-full object-cover"
              />
            ) : null}
            
            {/* Photo de profil positionnée sur la couverture */}
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className={`relative ${
                user?.avatar 
                  ? "ring-4 ring-white rounded-full" 
                  : `ring-4 ring-white rounded-full ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-neon-cyan to-neon-purple"
                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                    }`
              }`}>
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Photo de profil" 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-black text-4xl ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-neon-cyan to-neon-purple"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}>
                    {user?.first_name?.[0] ?? "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircleIcon className={`h-5 w-5 ${
                  theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                }`} />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-16">
              <div>
                <h3 className={`text-xl font-black ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {user?.full_name ?? "Utilisateur"}
                </h3>
                <Badge variant="primary" className="mt-1">
                  {user?.role ?? "N/A"}
                </Badge>
              </div>

              <div className={`grid gap-4 md:grid-cols-2 pt-4 border-t ${
                theme === "dark" ? "border-neon-cyan/10" : "border-gray-200"
              }`}>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className={`h-5 w-5 ${
                    theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                  }`} />
                  <div>
                    <p className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}>
                      Email
                    </p>
                    <p className={`text-sm font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {user?.email ?? "N/A"}
                    </p>
                  </div>
                </div>

                {user?.phone_number && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className={`h-5 w-5 ${
                      theme === "dark" ? "text-neon-purple" : "text-purple-600"
                    }`} />
                    <div>
                      <p className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-500" : "text-gray-600"
                      }`}>
                        Téléphone
                      </p>
                      <p className={`text-sm font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {user.phone_number}
                      </p>
                    </div>
                  </div>
                )}

                {user?.establishment && (
                  <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className={`h-5 w-5 ${
                      theme === "dark" ? "text-neon-pink" : "text-pink-600"
                    }`} />
                    <div>
                      <p className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-500" : "text-gray-600"
                      }`}>
                        Établissement
                      </p>
                      <p className={`text-sm font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {user.establishment}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CalendarIcon className={`h-5 w-5 ${
                    theme === "dark" ? "text-neon-green" : "text-green-600"
                  }`} />
                  <div>
                    <p className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-500" : "text-gray-600"
                    }`}>
                      Membre depuis
                    </p>
                    <p className={`text-sm font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString("fr-FR") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {user?.bio && (
                <div className={`pt-4 border-t ${
                  theme === "dark" ? "border-neon-cyan/10" : "border-gray-200"
                }`}>
                  <p className={`text-xs font-medium mb-2 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-600"
                  }`}>
                    Biographie
                  </p>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {user.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className={`h-5 w-5 ${
                  theme === "dark" ? "text-neon-purple" : "text-purple-600"
                }`} />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={cn("text-sm font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    Authentification à deux facteurs
                  </p>
                  <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    {user?.two_factor_enabled ? "Activée" : "Non activée"}
                  </p>
                </div>
                <Badge variant={user?.two_factor_enabled ? "success" : "neutral"}>
                  {user?.two_factor_enabled ? "Activé" : "Désactivé"}
                </Badge>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => navigate("/parametres/2fa")}
              >
                <ShieldCheckIcon className="h-4 w-4" />
                {user?.two_factor_enabled ? "Gérer le 2FA" : "Activer le 2FA"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => navigate("/projects")}
                className={cn(
                  "w-full text-center p-4 rounded-lg border transition-all duration-200 hover:scale-105",
                  theme === "dark"
                    ? "border-neon-cyan/20 bg-[#2A2A3E] hover:border-neon-cyan/40"
                    : "border-blue-200 bg-blue-50 hover:border-blue-300"
                )}
              >
                {isLoadingStats ? (
                  <div className={cn("inline-block animate-spin rounded-full h-6 w-6 border-2", theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent")} />
                ) : (
                  <>
                    <p className={cn("text-3xl font-black", theme === "dark" ? "gradient-text" : "text-blue-600")}>
                      {stats.projectsCreated}
                    </p>
                    <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Projets créés
                    </p>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/votes")}
                className={cn(
                  "w-full text-center p-4 rounded-lg border transition-all duration-200 hover:scale-105",
                  theme === "dark"
                    ? "border-neon-purple/20 bg-[#2A2A3E] hover:border-neon-purple/40"
                    : "border-purple-200 bg-purple-50 hover:border-purple-300"
                )}
              >
                {isLoadingStats ? (
                  <div className={cn("inline-block animate-spin rounded-full h-6 w-6 border-2", theme === "dark" ? "border-neon-purple border-t-transparent" : "border-purple-600 border-t-transparent")} />
                ) : (
                  <>
                    <p className={cn("text-3xl font-black", theme === "dark" ? "gradient-text" : "text-purple-600")}>
                      {stats.votesGiven}
                    </p>
                    <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Votes donnés
                    </p>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/stats")}
                className={cn(
                  "w-full text-center p-4 rounded-lg border transition-all duration-200 hover:scale-105",
                  theme === "dark"
                    ? "border-neon-pink/20 bg-[#2A2A3E] hover:border-neon-pink/40"
                    : "border-pink-200 bg-pink-50 hover:border-pink-300"
                )}
              >
                {isLoadingStats ? (
                  <div className={cn("inline-block animate-spin rounded-full h-6 w-6 border-2", theme === "dark" ? "border-neon-pink border-t-transparent" : "border-pink-600 border-t-transparent")} />
                ) : (
                  <>
                    <p className={cn("text-3xl font-black", theme === "dark" ? "gradient-text" : "text-pink-600")}>
                      {stats.contributions}
                    </p>
                    <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Contributions
                    </p>
                  </>
                )}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* Modals pour upload de photos */}
      {showAvatarUpload && (
        <PhotoUploadModal
          open={showAvatarUpload}
          onClose={() => setShowAvatarUpload(false)}
          onSave={(file) => handlePhotoChange("avatar", file)}
          title="Modifier la photo de profil"
          currentPhoto={user?.avatar}
        />
      )}
      
      {showCoverUpload && (
        <PhotoUploadModal
          open={showCoverUpload}
          onClose={() => setShowCoverUpload(false)}
          onSave={(file) => handlePhotoChange("cover", file)}
          title="Modifier la photo de couverture"
          currentPhoto={user?.cover_photo}
          aspectRatio="cover"
        />
      )}
    </div>
  );
};

// Composant modal pour upload de photo
interface PhotoUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File | null) => void;
  title: string;
  currentPhoto?: string;
  aspectRatio?: "square" | "cover" | "profile";
}

const PhotoUploadModal = ({ open, onClose, onSave, title, currentPhoto, aspectRatio = "profile" }: PhotoUploadModalProps) => {
  const { theme } = useThemeStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];

  useEffect(() => {
    if (open) {
      setFile(null);
      setPreview(currentPhoto || null);
    }
  }, [open, currentPhoto]);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSave = () => {
    onSave(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn("fixed inset-0 bg-black/50 z-40")}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-md rounded-xl border p-6 shadow-lg",
          theme === "dark"
            ? "border-neon-cyan/30 bg-[#1A1A2E]"
            : "border-gray-300 bg-white"
        )}
      >
        <h3 className={cn("text-xl font-black mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
          {title}
        </h3>
        
        <div className="mb-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all",
              theme === "dark"
                ? "border-neon-cyan/30 bg-[#2A2A3E] hover:border-neon-cyan/50"
                : "border-gray-300 bg-gray-50 hover:border-blue-400"
            )}
            onClick={() => document.getElementById("photo-input")?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="text-center py-8">
                <PhotoIcon className={cn("h-12 w-12 mx-auto mb-2", theme === "dark" ? "text-gray-500" : "text-gray-400")} />
                <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Cliquez pour sélectionner une image
                </p>
              </div>
            )}
          </div>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="md" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={!file}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


