import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import { safeString } from "../../utils/validation";
import useAuth from "../../hooks/useAuth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
}

interface CompactCommentsProps {
  itemId: string;
  comments?: Comment[];
  commentCount?: number;
  onAddComment?: (content: string) => void;
  onViewAll?: () => void;
}

export const CompactComments = ({
  itemId,
  comments = [],
  commentCount = 0,
  onAddComment,
  onViewAll,
}: CompactCommentsProps) => {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState("");

  const displayedComments = comments.slice(0, 2);
  const hasMoreComments = comments.length > 2 || commentCount > comments.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && onAddComment) {
      onAddComment(commentText.trim());
      setCommentText("");
      setShowInput(false);
    }
  };

  if (!isExpanded && !showInput && displayedComments.length === 0 && commentCount === 0) {
    return (
      <div className={cn(
        "px-4 py-2 border-t",
        theme === "dark" ? "border-gray-700/50" : "border-gray-200"
      )}>
        <button
          onClick={() => setShowInput(true)}
          className={cn(
            "w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors",
            theme === "dark"
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          )}
        >
          {t("feed.addComment") || "Ajouter un commentaire..."}
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "border-t",
      theme === "dark" ? "border-gray-700/50 bg-[#1A1A2E]/50" : "border-gray-200 bg-gray-50/50"
    )}>
      {/* Commentaires affichés */}
      {isExpanded && displayedComments.length > 0 && (
        <div className="px-4 py-2 space-y-2 max-h-48 overflow-y-auto">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex gap-2 group">
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                theme === "dark"
                  ? "bg-gradient-to-br from-neon-cyan to-neon-purple text-white"
                  : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
              )}>
                {safeString(comment.user?.name, "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-xs font-semibold truncate",
                    theme === "dark" ? "text-gray-300" : "text-gray-900"
                  )}>
                    {safeString(comment.user?.name, "Utilisateur")}
                  </span>
                  <span className={cn(
                    "text-[10px] flex-shrink-0",
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  )}>
                    {dayjs(safeString(comment.created_at, new Date().toISOString())).fromNow()}
                  </span>
                </div>
                <p className={cn(
                  "text-xs mt-0.5 break-words",
                  theme === "dark" ? "text-gray-400" : "text-gray-700"
                )}>
                  {safeString(comment.content, "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      {showInput && (
        <form onSubmit={handleSubmit} className="px-4 py-2 border-t border-gray-700/30">
          <div className="flex gap-2 items-start">
            <div className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              theme === "dark"
                ? "bg-gradient-to-br from-neon-cyan to-neon-purple text-white"
                : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
            )}>
              {user?.first_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t("feed.addComment") || "Ajouter un commentaire..."}
                className={cn(
                  "flex-1 text-xs px-2 py-1.5 rounded-md border focus:outline-none focus:ring-1",
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700 text-gray-300 placeholder-gray-500 focus:ring-neon-cyan/50 focus:border-neon-cyan/50"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500"
                )}
                autoFocus
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={cn(
                  "p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  theme === "dark"
                    ? "text-neon-cyan hover:bg-neon-cyan/10"
                    : "text-blue-600 hover:bg-blue-50"
                )}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false);
                  setCommentText("");
                }}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  theme === "dark"
                    ? "text-gray-500 hover:text-gray-400 hover:bg-gray-800/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Actions */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-gray-700/30">
        <div className="flex items-center gap-3">
          {!isExpanded && displayedComments.length > 0 && (
            <button
              onClick={() => setIsExpanded(true)}
              className={cn(
                "text-xs font-medium transition-colors",
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {t("feed.viewComments") || `Voir ${commentCount || displayedComments.length} commentaire${(commentCount || displayedComments.length) > 1 ? 's' : ''}`}
            </button>
          )}
          {isExpanded && hasMoreComments && (
            <button
              onClick={onViewAll}
              className={cn(
                "text-xs font-medium transition-colors",
                theme === "dark"
                  ? "text-neon-cyan hover:text-neon-cyan/80"
                  : "text-blue-600 hover:text-blue-700"
              )}
            >
              {t("feed.viewAllComments") || `Voir tous les commentaires (${commentCount})`}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className={cn(
                "text-xs px-2 py-1 rounded transition-colors",
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {t("common.close") || "Réduire"}
            </button>
          )}
          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className={cn(
                "flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors",
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
              {t("feed.comment") || "Commenter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

