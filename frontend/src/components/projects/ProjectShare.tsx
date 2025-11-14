import { useState } from "react";
import {
  ShareIcon,
  LinkIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

type ProjectShareProps = {
  projectId: string;
  projectTitle: string;
  onClose?: () => void;
};

export const ProjectShare = ({ projectId, projectTitle, onClose }: ProjectShareProps) => {
  const { theme } = useThemeStore();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const projectUrl = `${window.location.origin}/projects/${projectId}`;
  const shareText = `Découvrez ce projet innovant : ${projectTitle}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectTitle,
          text: shareText,
          url: projectUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Erreur lors du partage:", error);
        }
      }
    }
  };

  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSendingEmail(true);
    try {
      // TODO: Appel API pour envoyer l'email
      // await apiClient.post("/v1/projects/share/email/", {
      //   project_id: projectId,
      //   email: email,
      //   message: shareText
      // });

      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Lien envoyé à ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi de l'email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const shareToSocialMedia = (platform: string) => {
    const encodedUrl = encodeURIComponent(projectUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    const url = urls[platform];
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShareIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
            Partager le projet
          </CardTitle>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                "p-1 rounded-lg transition-colors",
                theme === "dark"
                  ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Copy Link */}
        <div className="space-y-2">
          <label className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Lien du projet
          </label>
          <div className="flex gap-2">
            <Input value={projectUrl} readOnly className="flex-1 font-mono text-xs" />
            <Button
              variant={copied ? "success" : "primary"}
              size="md"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Copié
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Native Share */}
        {navigator.share && (
          <Button variant="outline" size="lg" className="w-full" onClick={handleShareNative}>
            <ShareIcon className="h-5 w-5" />
            Partager via...
          </Button>
        )}

        {/* Social Media */}
        <div className="space-y-2">
          <label className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
            Partager sur les réseaux sociaux
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => shareToSocialMedia("twitter")}
              className={cn(
                theme === "dark"
                  ? "hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-400"
                  : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              )}
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => shareToSocialMedia("facebook")}
              className={cn(
                theme === "dark"
                  ? "hover:bg-blue-600/10 hover:border-blue-600 hover:text-blue-400"
                  : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              )}
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => shareToSocialMedia("linkedin")}
              className={cn(
                theme === "dark"
                  ? "hover:bg-blue-700/10 hover:border-blue-700 hover:text-blue-400"
                  : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
              )}
            >
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => shareToSocialMedia("whatsapp")}
              className={cn(
                theme === "dark"
                  ? "hover:bg-green-500/10 hover:border-green-500 hover:text-green-400"
                  : "hover:bg-green-50 hover:border-green-300 hover:text-green-600"
              )}
            >
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Email Share */}
        <div className={cn("pt-4 border-t", theme === "dark" ? "border-neon-cyan/20" : "border-gray-200")}>
          <form onSubmit={handleEmailShare} className="space-y-2">
            <label className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
              Envoyer par email
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                startAdornment={<EnvelopeIcon className="h-5 w-5" />}
                className="flex-1"
                required
              />
              <Button variant="primary" type="submit" loading={isSendingEmail} className="flex-shrink-0">
                <EnvelopeIcon className="h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

