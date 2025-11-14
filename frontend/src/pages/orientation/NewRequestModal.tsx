import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

type NewRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { studentName: string; topic: string; description: string }) => void;
};

const NewRequestModal = ({ open, onClose, onSubmit }: NewRequestModalProps) => {
  const [formData, setFormData] = useState({
    studentName: "",
    topic: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ studentName: "", topic: "", description: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvelle demande d'orientation"
      description="Créez une nouvelle demande d'orientation pour un étudiant"
      size="md"
      actions={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" form="new-request-form">
            Créer la demande
          </Button>
        </>
      }
    >
      <form id="new-request-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentName">Nom de l'étudiant</Label>
          <Input
            id="studentName"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            placeholder="Ex: Awa Koné"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Sujet d'orientation</Label>
          <Input
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Ex: Orientation IA & Data"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Détails de la demande..."
            rows={4}
          />
        </div>
      </form>
    </Modal>
  );
};

export default NewRequestModal;

