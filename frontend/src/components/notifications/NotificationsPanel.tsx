import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useNotificationsStore } from "../../stores/notifications";
import type { Notification } from "../../types/api";
import { useThemeStore } from "../../stores/theme";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../utils/cn";

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
};

const getNotificationIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("vote") || lowerTitle.includes("like")) return HeartIcon;
  if (lowerTitle.includes("comment")) return ChatBubbleLeftIcon;
  if (lowerTitle.includes("projet") || lowerTitle.includes("project")) return SparklesIcon;
  if (lowerTitle.includes("équipe") || lowerTitle.includes("team")) return UserPlusIcon;
  if (lowerTitle.includes("document")) return DocumentTextIcon;
  return BellIcon;
};

const getNotificationColor = (title: string, theme: "dark" | "light") => {
  const lowerTitle = title.toLowerCase();
  if (theme === "dark") {
    if (lowerTitle.includes("vote") || lowerTitle.includes("like")) return "text-neon-pink";
    if (lowerTitle.includes("comment")) return "text-neon-cyan";
    if (lowerTitle.includes("projet") || lowerTitle.includes("project")) return "text-neon-purple";
    if (lowerTitle.includes("équipe") || lowerTitle.includes("team")) return "text-neon-green";
    return "text-neon-cyan";
  } else {
    if (lowerTitle.includes("vote") || lowerTitle.includes("like")) return "text-pink-600";
    if (lowerTitle.includes("comment")) return "text-blue-600";
    if (lowerTitle.includes("projet") || lowerTitle.includes("project")) return "text-purple-600";
    if (lowerTitle.includes("équipe") || lowerTitle.includes("team")) return "text-green-600";
    return "text-blue-600";
  }
};

export const NotificationsPanel = ({ open, onClose }: NotificationsPanelProps) => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { items, fetchAll, markAsRead, unreadCount } = useNotificationsStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchAll().finally(() => setIsLoading(false));
    }
  }, [open, fetchAll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Naviguer selon l'URL de la notification
    if (notification.url) {
      navigate(notification.url);
      onClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = items.filter((n) => !n.is_read);
    await Promise.all(unreadNotifications.map((n) => markAsRead(n.id)));
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return notificationDate.toLocaleDateString("fr-FR");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1002] pointer-events-none">
      <div className="absolute top-20 right-8 w-96 max-h-[600px] pointer-events-auto">
        <div
          ref={panelRef}
          className={cn(
            "rounded-2xl border shadow-xl overflow-hidden flex flex-col",
            theme === "dark"
              ? "border-neon-cyan/30 bg-[#1A1A2E]"
              : "border-gray-200 bg-white shadow-2xl"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between p-4 border-b",
              theme === "dark" ? "border-neon-cyan/20" : "border-gray-200"
            )}
          >
            <div className="flex items-center gap-2">
              <BellIcon className={cn("h-5 w-5", theme === "dark" ? "text-neon-cyan" : "text-blue-600")} />
              <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                Notifications
              </h3>
              {unreadCount() > 0 && (
                <Badge
                  variant="primary"
                  className={theme === "dark" ? "bg-gradient-to-r from-neon-pink to-neon-purple" : "bg-red-500"}
                >
                  {unreadCount()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-gray-400 hover:text-neon-cyan" : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Tout marquer lu
                </Button>
              )}
              <button
                onClick={onClose}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  theme === "dark"
                    ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div
                  className={cn(
                    "inline-block animate-spin rounded-full h-8 w-8 border-4",
                    theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent"
                  )}
                />
                <p className={cn("mt-4 text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Chargement...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center">
                <BellIcon
                  className={cn(
                    "h-12 w-12 mx-auto mb-4 opacity-50",
                    theme === "dark" ? "text-neon-cyan" : "text-gray-400"
                  )}
                />
                <p className={cn("text-sm font-medium", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Aucune notification
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: theme === "dark" ? "rgba(0, 240, 255, 0.1)" : "#e5e7eb" }}>
                {items.map((notification) => {
                  const Icon = getNotificationIcon(notification.title || "");
                  const iconColor = getNotificationColor(notification.title || "", theme);

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "p-4 cursor-pointer transition-colors relative",
                        !notification.is_read
                          ? theme === "dark"
                            ? "bg-neon-cyan/5 hover:bg-neon-cyan/10"
                            : "bg-blue-50 hover:bg-blue-100"
                          : theme === "dark"
                          ? "hover:bg-[#2A2A3E]"
                          : "hover:bg-gray-50"
                      )}
                    >
                      {!notification.is_read && (
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 w-1",
                            theme === "dark" ? "bg-neon-cyan" : "bg-blue-600"
                          )}
                        />
                      )}
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg",
                            theme === "dark" ? "bg-[#2A2A3E]" : "bg-gray-100"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-semibold mb-1",
                              !notification.is_read
                                ? theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                                : theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            )}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={cn(
                              "text-xs mb-2 line-clamp-2",
                              theme === "dark" ? "text-gray-400" : "text-gray-600"
                            )}
                          >
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <ClockIcon className={cn("h-3 w-3", theme === "dark" ? "text-gray-500" : "text-gray-400")} />
                            <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                              {formatTime(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className={cn(
                              "flex-shrink-0 p-1 rounded-lg transition-colors",
                              theme === "dark"
                                ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            )}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div
              className={cn(
                "p-3 border-t text-center",
                theme === "dark" ? "border-neon-cyan/20" : "border-gray-200"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/notifications");
                  onClose();
                }}
                className={cn(
                  "text-xs",
                  theme === "dark" ? "text-neon-cyan hover:text-neon-purple" : "text-blue-600 hover:text-blue-700"
                )}
              >
                Voir toutes les notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

