import { useState } from "react";
import { StarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import VoteDetailModal from "./VoteDetailModal";
import ReplyModal from "./ReplyModal";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const votes = [
  {
    id: "v1",
    project: "AgriConnect",
    rating: 5,
    comment: "Solution très innovante, impact agricole fort.",
    sentiment: "positif",
    date: "11 nov. 2025"
  },
  {
    id: "v2",
    project: "SmartCampus",
    rating: 4,
    comment: "Bon MVP, prévoir un plan de déploiement national.",
    sentiment: "neutre",
    date: "10 nov. 2025"
  }
];

const VotesPage = () => {
  const { theme } = useThemeStore();
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);

  const handleReply = (reply: string) => {
    console.log("Réponse:", reply);
    // TODO: Appel API pour envoyer la réponse
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
    <header>
      <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Votes & Évaluations</h2>
      <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
        Collectez la voix de la communauté et combinez-la au scoring IA.
      </p>
    </header>

    <section className="grid gap-4 md:grid-cols-2">
      {votes.map((vote) => (
        <Card key={vote.id} className={cn("hover:border-neon-purple/50", theme === "dark" ? "border-neon-cyan/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn("text-lg font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{vote.project}</h3>
              <Badge variant="warning" className="flex items-center gap-1">
                <StarIcon className="h-3 w-3" />
                {vote.rating} étoiles
              </Badge>
            </div>
            <p className={cn("text-sm italic mb-3", theme === "dark" ? "text-gray-300" : "text-gray-700")}>&ldquo;{vote.comment}&rdquo;</p>
            <div className={cn("flex items-center justify-between text-xs mb-4", theme === "dark" ? "text-gray-500" : "text-gray-600")}>
              <span>Sentiment IA : <span className={cn("font-semibold", theme === "dark" ? "text-neon-purple" : "text-purple-600")}>{vote.sentiment}</span></span>
              <span>{vote.date}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setDetailOpen(vote.id)}>
                Détails IA
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setReplyOpen(vote.id)}>
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Répondre
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>

    {detailOpen && (
      <VoteDetailModal
        open={!!detailOpen}
        onClose={() => setDetailOpen(null)}
        vote={votes.find((v) => v.id === detailOpen)!}
      />
    )}
    {replyOpen && (
      <ReplyModal
        open={!!replyOpen}
        onClose={() => setReplyOpen(null)}
        project={votes.find((v) => v.id === replyOpen)!.project}
        onSubmit={handleReply}
      />
    )}
  </div>
  );
};

export default VotesPage;
