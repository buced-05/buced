import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import useNotifications from "../../hooks/useNotifications";
import useAuth from "../../hooks/useAuth";
import { Badge } from "../ui/badge";
import { useThemeStore } from "../../stores/theme";
import { NotificationsPanel } from "../notifications/NotificationsPanel";
import { LanguageSelector } from "../language/LanguageSelector";
import { cn } from "../../utils/cn";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header 
      className={cn(
        "relative flex h-20 lg:h-20 items-center justify-between",
        "px-4 sm:px-4 lg:px-8 shadow-lg transition-colors duration-300",
        theme === "dark" 
          ? "border-b border-neon-cyan/20 bg-[#1A1A2E]" 
          : "border-b border-gray-200 bg-white"
      )} 
      style={{ zIndex: 1000, position: "sticky", top: 0 }}
    >
      {/* Bottom accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-full",
        theme === "dark" 
          ? "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
          : "bg-gray-300"
      )} />
      
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className={cn(
          "lg:hidden p-3.5 rounded-lg transition-colors mr-2",
          theme === "dark"
            ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
        aria-label="Ouvrir le menu"
      >
        <Bars3Icon className="h-8 w-8" />
      </button>

      <div className="space-y-1 relative z-10 flex-shrink-0 flex-1 min-w-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <h1 className={cn(
            "font-heading text-2xl sm:text-lg lg:text-2xl font-black truncate",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            <span className="hidden sm:inline">Bienvenue, </span>
            <span className={theme === "dark" ? "gradient-text" : "text-gray-700"}>
              {user?.full_name?.split(" ")[0] ?? "Invité"}
            </span>
          </h1>
          {user?.role && (
            <Badge variant="primary" className={cn(
              "hidden sm:inline-flex text-sm sm:text-sm px-3 py-1.5",
              theme === "dark" ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F]" : "bg-gray-200 text-gray-700"
            )}>
              {user.role}
            </Badge>
          )}
        </div>
        <p className={cn(
          "text-base sm:text-xs lg:text-sm font-medium hidden sm:block",
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        )}>
          Suivez vos projets et les innovations en temps réel.
        </p>
      </div>
      
      <div className="relative flex items-center gap-2 lg:gap-3 flex-shrink-0" style={{ zIndex: 1001 }}>
        {/* Language Selector */}
        <LanguageSelector />
        
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "rounded-lg p-3.5 transition-all duration-200",
            "flex items-center justify-center",
            theme === "dark"
              ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
          aria-label="Changer le thème"
          title={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
        >
          {theme === "dark" ? (
            <SunIcon className="h-8 w-8" />
          ) : (
            <MoonIcon className="h-8 w-8" />
          )}
        </button>
        
        <button
          type="button"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className={cn(
            "relative rounded-lg p-3.5 lg:p-2.5 transition-all duration-300 shadow-md",
            theme === "dark"
              ? "border border-neon-cyan/30 bg-[#2A2A3E] text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
          )}
        >
          <BellIcon className="h-8 w-8" />
          {unreadCount > 0 ? (
            <span className={cn(
              "absolute -right-0.5 -top-0.5 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 text-sm font-bold text-white",
              theme === "dark" 
                ? "bg-gradient-to-r from-neon-pink to-neon-purple shadow-neon-pink"
                : "bg-red-500 shadow-md"
            )}>
              {unreadCount}
            </span>
          ) : null}
        </button>
        
        <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 lg:px-3 py-3 transition-all duration-300 shadow-md",
              theme === "dark"
                ? "border border-neon-cyan/30 bg-[#2A2A3E] text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
            )}
          >
            <UserCircleIcon className="h-8 w-8" />
            <span className="text-base font-medium hidden lg:inline">{user?.full_name?.split(" ")[0] ?? "Utilisateur"}</span>
          </button>

          {userMenuOpen && (
            <div className={cn(
              "absolute right-0 mt-2 w-56 rounded-lg shadow-lg border transition-all duration-300 z-[1002]",
              theme === "dark"
                ? "border-neon-cyan/30 bg-[#1A1A2E]"
                : "border-gray-200 bg-white shadow-xl"
            )}>
              <div className={`p-2 border-b ${
                theme === "dark" ? "border-neon-cyan/20" : "border-gray-200"
              }`}>
                <p className={`px-3 py-2 text-sm font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {user?.full_name ?? "Utilisateur"}
                </p>
                <p className={`px-3 py-1 text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  {user?.email ?? ""}
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <UserCircleIcon className="h-4 w-4" />
                  {t("nav.profile")}
                </button>
                <button
                  onClick={() => {
                    navigate("/parametres");
                    setUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  {t("nav.settings")}
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-2 ${
                    theme === "dark"
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300 border-t border-neon-cyan/20"
                      : "text-red-600 hover:bg-red-50 hover:text-red-700 border-t border-gray-200"
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  {t("nav.logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
