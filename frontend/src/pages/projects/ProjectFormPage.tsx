import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { projectsService } from "../../api/services";

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech",
    objectives: "",
    expected_impact: "",
    required_resources: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await projectsService.create(formData);
      navigate(`/projects/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Erreur lors de la soumission du projet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Soumettre un projet</h2>
          <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Partagez votre innovation avec la communauté
          </p>
        </div>
      </header>

      <Card className={cn(theme === "dark" ? "border-neon-cyan/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
        <CardHeader>
          <CardTitle className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>Informations du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-neon-pink/50 bg-neon-pink/10 p-3 text-sm text-neon-pink">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Titre du projet *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: AgriConnect"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="tech">Technologie</option>
                <option value="social">Social</option>
                <option value="environment">Environnement</option>
                <option value="health">Santé</option>
                <option value="education">Éducation</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre projet..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objectifs</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Quels sont les objectifs de votre projet ?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_impact">Impact attendu</Label>
              <Textarea
                id="expected_impact"
                value={formData.expected_impact}
                onChange={(e) => setFormData({ ...formData, expected_impact: e.target.value })}
                placeholder="Quel impact votre projet aura-t-il ?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_resources">Ressources nécessaires</Label>
              <Textarea
                id="required_resources"
                value={formData.required_resources}
                onChange={(e) => setFormData({ ...formData, required_resources: e.target.value })}
                placeholder="Quelles ressources sont nécessaires ?"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" size="md" type="button" onClick={() => navigate("/projects")}>
                Annuler
              </Button>
              <Button variant="primary" size="md" type="submit" loading={loading}>
                Soumettre le projet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFormPage;

