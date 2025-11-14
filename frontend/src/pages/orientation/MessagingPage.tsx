import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  UserIcon,
  PaperClipIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

type Message = {
  id: string;
  sender: "student" | "counselor";
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string }[];
};

const MessagingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "student",
      senderName: "Awa Koné",
      content: "Bonjour, je suis intéressée par les carrières en IA et Data Science. Pouvez-vous me donner des conseils sur les parcours disponibles ?",
      timestamp: "2025-11-12T10:00:00",
    },
    {
      id: "2",
      sender: "counselor",
      senderName: "Dr. Kouamé",
      content: "Bonjour Awa ! Je serais ravi de vous aider. Il existe plusieurs parcours intéressants en Côte d'Ivoire. Avez-vous déjà une formation de base en mathématiques ou informatique ?",
      timestamp: "2025-11-12T10:15:00",
    },
    {
      id: "3",
      sender: "student",
      senderName: "Awa Koné",
      content: "Oui, je suis en dernière année de licence en Mathématiques Appliquées.",
      timestamp: "2025-11-12T10:20:00",
    },
  ]);

  // Mock data - à remplacer par un appel API
  const request = {
    id: id ?? "1",
    studentName: "Awa Koné",
    topic: "Orientation IA & Data",
    counselor: "Dr. Kouamé",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "counselor",
      senderName: "Vous",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6 animate-fade-in-up h-full flex flex-col">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/orientation/${id}`)}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h2 className={`text-2xl md:text-3xl font-black ${
            theme === "dark" ? "gradient-text" : "text-gray-900"
          }`}>
            Messagerie sécurisée
          </h2>
          <p className={`text-sm font-medium mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Conversation avec {request.studentName} - {request.topic}
          </p>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-4">
        {/* Participants info */}
        <Card className={cn(theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full font-black text-white",
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-cyan to-neon-purple"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              )}>
                {request.studentName[0]}
              </div>
              <div className="flex-1">
                <p className={cn("font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  {request.studentName}
                </p>
                <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Étudiant
                </p>
              </div>
              <Badge variant="primary">{request.counselor}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Messages area */}
        <Card className={cn("flex-1 flex flex-col overflow-hidden", theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
          <CardHeader className={cn("border-b", theme === "dark" ? "border-neon-purple/10" : "border-gray-200")}>
            <CardTitle className={cn("text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "counselor" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "student" && (
                  <div className={cn(
                    "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm",
                    theme === "dark"
                      ? "bg-neon-cyan/20 text-neon-cyan"
                      : "bg-blue-100 text-blue-600"
                  )}>
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl p-4",
                    message.sender === "counselor"
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : theme === "dark"
                        ? "bg-[#2A2A3E] border border-neon-cyan/20 text-gray-200"
                        : "bg-gray-100 border border-gray-300 text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold">
                      {message.sender === "counselor" ? message.senderName : message.senderName}
                    </p>
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 text-xs transition-colors ${
                            theme === "dark"
                              ? "hover:text-neon-cyan"
                              : "hover:text-blue-600"
                          }`}
                        >
                          <PaperClipIcon className="h-4 w-4" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {message.sender === "counselor" && (
                  <div className={cn(
                    "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm",
                    theme === "dark"
                      ? "bg-neon-purple/20 text-neon-purple"
                      : "bg-purple-100 text-purple-600"
                  )}>
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Message input */}
        <Card className={cn(theme === "dark" ? "border-neon-purple/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="w-full"
                />
              </div>
              <Button variant="outline" size="md" type="button" className="flex-shrink-0">
                <PaperClipIcon className="h-5 w-5" />
              </Button>
              <Button variant="primary" size="md" type="submit" className="flex-shrink-0">
                <PaperAirplaneIcon className="h-5 w-5" />
                Envoyer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagingPage;

