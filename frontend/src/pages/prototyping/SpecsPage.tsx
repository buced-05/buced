import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SparklesIcon, DocumentTextIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";

const SpecsPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [specs, setSpecs] = useState<string>("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSpecs(""); // Réinitialiser les specs
    
    // TODO: Appel API pour générer les specs
    // Simulation d'une génération
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedSpecs = `# Spécifications Techniques

## Architecture
- Frontend: React avec TypeScript
- Backend: Django REST Framework
- Base de données: PostgreSQL
- Cache: Redis

## Fonctionnalités principales
1. Authentification et autorisation
2. Gestion des projets
3. Système de vote communautaire
4. Prototypage rapide avec Kanban
5. Messagerie sécurisée

## Technologies
- React 18+
- TypeScript
- TailwindCSS
- Django 5
- PostgreSQL
- Redis

## Déploiement
- Docker Compose
- Nginx pour le reverse proxy
- SSL/TLS pour la sécurité

## API Endpoints
- POST /api/auth/token/ - Authentification
- GET /api/projects/ - Liste des projets
- POST /api/projects/ - Créer un projet
- GET /api/projects/:id/ - Détails d'un projet
- POST /api/projects/:id/vote/ - Voter pour un projet

## Base de données
- Modèle User pour les utilisateurs
- Modèle Project pour les projets
- Modèle Vote pour les votes
- Modèle Task pour les tâches Kanban
`;
      
      setSpecs(generatedSpecs);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([specs], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "specifications-techniques.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/prototyping")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h2 className={`text-2xl md:text-3xl font-black ${
            theme === "dark" ? "gradient-text" : "text-gray-900"
          }`}>
            Génération des spécifications
          </h2>
          <p className={`text-sm font-medium mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Générez automatiquement les spécifications techniques de votre projet
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DocumentTextIcon className={`h-5 w-5 ${
                    theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                  }`} />
                  Spécifications techniques
                </CardTitle>
                {specs && (
                  <Badge variant="success">Généré</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!specs && !isGenerating ? (
                <div className="text-center py-12">
                  <SparklesIcon className={`h-16 w-16 mx-auto mb-4 opacity-50 ${
                    theme === "dark" ? "text-neon-purple" : "text-purple-600"
                  }`} />
                  <p className={`font-medium mb-6 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Cliquez sur le bouton ci-dessous pour générer les spécifications techniques
                  </p>
                  <Button variant="primary" size="lg" onClick={handleGenerate} disabled={isGenerating}>
                    <SparklesIcon className="h-5 w-5" />
                    Générer les spécifications
                  </Button>
                </div>
              ) : isGenerating ? (
                <div className="text-center py-12">
                  <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 mb-4 ${
                    theme === "dark" 
                      ? "border-neon-cyan border-t-transparent" 
                      : "border-blue-600 border-t-transparent"
                  }`}></div>
                  <p className={`font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Génération en cours...
                  </p>
                  <p className={`text-sm mt-2 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}>
                    Veuillez patienter quelques secondes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleDownload} disabled={!specs}>
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Télécharger
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setSpecs("");
                      setIsGenerating(false);
                    }}>
                      <SparklesIcon className="h-4 w-4" />
                      Régénérer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className={`space-y-3 text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              <p>
                Les spécifications sont générées automatiquement en fonction des tâches de votre tableau Kanban.
              </p>
              <p>
                Vous pouvez modifier le contenu généré avant de le télécharger.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpecsPage;

