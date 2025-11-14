import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

type VoteDetailModalProps = {
  open: boolean;
  onClose: () => void;
  vote: {
    project: string;
    rating: number;
    comment: string;
    sentiment: string;
  };
};

const VoteDetailModal = ({ open, onClose, vote }: VoteDetailModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Détails de l'analyse IA"
      description={`Analyse du vote pour ${vote.project}`}
      size="md"
      actions={
        <Button variant="primary" onClick={onClose}>
          Fermer
        </Button>
      }
    >
      <div className="space-y-4">
        <Card className="border-neon-purple/30 bg-[#2A2A3E]">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Note</span>
                <span className="text-sm font-bold text-neon-cyan">{vote.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Sentiment</span>
                <span className="text-sm font-bold text-neon-purple capitalize">{vote.sentiment}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div>
          <p className="text-sm text-gray-400 mb-2">Commentaire analysé :</p>
          <p className="text-sm text-gray-300 italic">&ldquo;{vote.comment}&rdquo;</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Analyse IA :</p>
          <p className="text-sm text-gray-300">
            Le sentiment détecté est <span className="font-bold text-neon-purple">{vote.sentiment}</span>.
            Le commentaire montre un intérêt positif pour le projet avec une note élevée.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default VoteDetailModal;

