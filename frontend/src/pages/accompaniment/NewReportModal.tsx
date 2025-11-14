import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";

type NewReportModalProps = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSubmit: (data: { title: string; type: string; content: string; milestoneId?: string }) => void;
};

const NewReportModal = ({ open, onClose, projectId, onSubmit }: NewReportModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "progress",
    content: "",
    milestoneId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", type: "progress", content: "", milestoneId: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouveau rapport"
      description="Créez un rapport d'avancement pour le projet"
      size="lg"
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Enregistrer le rapport
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rapport</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Rapport mensuel - Novembre 2025"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de rapport</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="progress">Avancement</option>
              <option value="financial">Financier</option>
              <option value="technical">Technique</option>
              <option value="milestone">Jalon</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenu</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Détails du rapport..."
            rows={8}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default NewReportModal;

