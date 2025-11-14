import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { ImageUpload } from "../../components/ui/image-upload";
import { useThemeStore } from "../../stores/theme";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../api/client";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone_number: user?.phone_number ?? "",
    establishment: user?.establishment ?? "",
    bio: user?.bio ?? "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Créer FormData pour gérer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les champs texte
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      // Ajouter les fichiers si présents
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }
      if (coverPhotoFile) {
        formDataToSend.append("cover_photo", coverPhotoFile);
      }

      // Ne pas définir Content-Type manuellement, axios le fait automatiquement pour FormData
      // Le baseURL est http://localhost:8000/api, donc on utilise /v1/auth/profile/
      // pour obtenir http://localhost:8000/api/v1/auth/profile/
      await apiClient.patch("/v1/auth/profile/", formDataToSend);
      
      // Rafraîchir le profil et naviguer
      // Recharger la page pour afficher les nouvelles photos
      window.location.href = "/profile";
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message
        || (typeof err.response?.data === 'string' ? err.response.data : null)
        || err.message
        || "Erreur lors de la mise à jour du profil.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h2 className={`text-2xl md:text-3xl font-black ${
            theme === "dark" ? "gradient-text" : "text-gray-900"
          }`}>
            Modifier mon profil
          </h2>
          <p className={`text-sm font-medium mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Mettez à jour vos informations personnelles
          </p>
        </div>
      </header>

      <div className="max-w-3xl space-y-6">
        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhotoIcon className={`h-5 w-5 ${
                theme === "dark" ? "text-neon-cyan" : "text-blue-600"
              }`} />
              Photos de profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <ImageUpload
                label="Photo de couverture"
                value={user?.cover_photo}
                onChange={setCoverPhotoFile}
                aspectRatio="cover"
              />
            </div>
            <div>
              <ImageUpload
                label="Photo de profil"
                value={user?.avatar}
                onChange={setAvatarFile}
                aspectRatio="profile"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`rounded-lg border p-3 text-sm ${
                  theme === "dark"
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-red-300 bg-red-50 text-red-600"
                }`}>
                  {error}
                </div>
              )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  startAdornment={<UserIcon className="h-5 w-5" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  startAdornment={<UserIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                startAdornment={<EnvelopeIcon className="h-5 w-5" />}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Téléphone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  startAdornment={<PhoneIcon className="h-5 w-5" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishment">Établissement</Label>
                <Input
                  id="establishment"
                  type="text"
                  value={formData.establishment}
                  onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                  startAdornment={<BuildingOfficeIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Parlez-nous de vous..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="md" type="button" onClick={() => navigate("/profile")}>
                Annuler
              </Button>
              <Button variant="primary" size="md" type="submit" loading={loading}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEditPage;

