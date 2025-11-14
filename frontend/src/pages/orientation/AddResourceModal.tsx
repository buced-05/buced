import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";

type AddResourceModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; description: string; url?: string }) => void;
};

const AddResourceModal = ({ open, onClose, onSubmit }: AddResourceModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Orientation",
    description: "",
    url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", category: "Orientation", description: "", url: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter une ressource"
      description="Partagez une ressource pédagogique avec la communauté"
      size="md"
      actions={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" form="add-resource-form">
            Ajouter la ressource
          </Button>
        </>
      }
    >
      <form id="add-resource-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Guide filières scientifiques 2025"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Orientation">Orientation</option>
            <option value="Mentorat">Mentorat</option>
            <option value="Financement">Financement</option>
            <option value="Formation">Formation</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la ressource..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL (optionnel)</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddResourceModal;

