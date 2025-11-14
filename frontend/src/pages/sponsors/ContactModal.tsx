import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  sponsorName: string;
  sponsorEmail: string;
  onSubmit: (data: { subject: string; message: string }) => void;
};

const ContactModal = ({ open, onClose, sponsorName, sponsorEmail, onSubmit }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ subject: "", message: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Contacter ${sponsorName}`}
      description={`Envoyez un message à ${sponsorEmail}`}
      size="md"
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Envoyer le message
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Ex: Demande de partenariat"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Votre message..."
            rows={6}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default ContactModal;

