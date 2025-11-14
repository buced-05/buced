import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";

type NewTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; owner: string; column: string }) => void;
};

const NewTaskModal = ({ open, onClose, onSubmit }: NewTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    owner: "",
    column: "backlog",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", description: "", owner: "", column: "backlog" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvelle tâche"
      description="Créez une nouvelle tâche pour le prototypage rapide"
      size="md"
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Créer la tâche
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la tâche</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Brief UX"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Détails de la tâche..."
            rows={4}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="owner">Responsable</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="Ex: Design team"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="column">Colonne</Label>
            <Select
              id="column"
              value={formData.column}
              onChange={(e) => setFormData({ ...formData, column: e.target.value })}
            >
              <option value="backlog">Backlog</option>
              <option value="in_progress">En cours</option>
              <option value="review">Revue</option>
              <option value="done">Terminé</option>
            </Select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewTaskModal;

