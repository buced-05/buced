import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

type ReplyModalProps = {
  open: boolean;
  onClose: () => void;
  project: string;
  onSubmit: (reply: string) => void;
};

const ReplyModal = ({ open, onClose, project, onSubmit }: ReplyModalProps) => {
  const [reply, setReply] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reply);
    setReply("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Répondre au vote"
      description={`Réponse pour ${project}`}
      size="md"
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Envoyer la réponse
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reply">Votre réponse</Label>
          <Textarea
            id="reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Merci pour votre retour..."
            rows={6}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReplyModal;

