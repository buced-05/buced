import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { sponsorsService } from "../../api/services";
import type { SponsorProfile } from "../../types/api";

type InviteSponsorModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const InviteSponsorModal = ({ open, onClose, onSuccess }: InviteSponsorModalProps) => {
  const { theme } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    description: "",
    interests: [] as string[],
    total_budget: "",
  });

  const interestOptions = [
    "Technologie",
    "Éducation",
    "Innovation",
    "Environnement",
    "Santé",
    "Social",
    "Entrepreneuriat",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Note: L'API backend attend probablement un user_id ou email pour créer le sponsor
      // Pour l'instant, on simule l'appel API
      // TODO: Implémenter l'endpoint d'invitation dans le backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // En production, ce serait :
      // await sponsorsService.invite(formData);
      
      console.log("Invitation envoyée:", formData);
      setFormData({
        company: "",
        email: "",
        description: "",
        interests: [],
        total_budget: "",
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Inviter un sponsor"
      description="Invitez une entreprise ou organisation à devenir sponsor de projets éducatifs"
      size="lg"
      actions={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer l'invitation"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className={cn(
              "p-4 rounded-lg border",
              theme === "dark"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-red-50 border-red-200 text-red-600"
            )}
          >
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Nom de l'entreprise *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Ex: Orange Côte d'Ivoire"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email de contact *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@entreprise.ci"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_budget">Budget total (XOF)</Label>
          <Input
            id="total_budget"
            type="number"
            value={formData.total_budget}
            onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
            placeholder="Ex: 50000000"
          />
        </div>

        <div className="space-y-2">
          <Label>Centres d'intérêt</Label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  formData.interests.includes(interest)
                    ? theme === "dark"
                      ? "bg-neon-cyan text-white border border-neon-cyan"
                      : "bg-blue-600 text-white border border-blue-600"
                    : theme === "dark"
                    ? "bg-[#2A2A3E] text-gray-300 border border-neon-cyan/20 hover:border-neon-cyan/50"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:border-blue-300"
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez l'entreprise et ses objectifs de sponsoring..."
            rows={4}
          />
        </div>
      </form>
    </Modal>
  );
};

export default InviteSponsorModal;

