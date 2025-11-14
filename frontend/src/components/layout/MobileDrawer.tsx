import { NavLink, useLocation } from "react-router-dom";
import { useThemeStore } from "../../stores/theme";
import {
  HomeIcon,
  AcademicCapIcon,
  LightBulbIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";

const navigation = [
  { name: "Flux", to: "/", icon: Squares2X2Icon },
  { name: "Tableau de bord", to: "/dashboard", icon: HomeIcon },
  { name: "Recherche", to: "/search", icon: MagnifyingGlassIcon },
  { name: "Favoris", to: "/favorites", icon: HeartIcon },
  { name: "Orientation", to: "/orientation", icon: AcademicCapIcon },
  { name: "Projets", to: "/projects", icon: LightBulbIcon },
  { name: "Votes", to: "/votes", icon: StarIcon },
  { name: "Prototypage", to: "/prototyping", icon: WrenchScrewdriverIcon },
  { name: "Sponsors", to: "/sponsors", icon: BuildingOfficeIcon },
  { name: "Accompagnement", to: "/accompagnement", icon: UsersIcon },
  { name: "Paramètres", to: "/parametres", icon: Cog6ToothIcon },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  const location = useLocation();
  const { theme } = useThemeStore();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-80 z-50 lg:hidden",
          "transform transition-transform duration-300 ease-in-out",
          "overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
          theme === "dark"
            ? "border-r border-neon-cyan/20 bg-[#1A1A2E]"
            : "border-r border-gray-200 bg-white shadow-xl"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-20 items-center justify-between px-6 border-b sticky top-0 z-10",
            theme === "dark"
              ? "border-neon-cyan/20 bg-[#1A1A2E]"
              : "border-gray-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl font-black text-base",
                theme === "dark"
                  ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F]"
                  : "bg-gray-800 text-white shadow-md"
              )}
            >
              BCE
            </div>
            <div>
              <p
                className={cn(
                  "text-xs uppercase tracking-wide font-bold",
                  theme === "dark" ? "text-gray-500" : "text-gray-600"
                )}
              >
                Plateforme
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                Clubs Éducatifs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === "dark"
                ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to === "/" && location.pathname === "/");

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? theme === "dark"
                      ? "bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border border-neon-cyan/30"
                      : "bg-gray-100 text-gray-900 border border-gray-300"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && (
                  <div
                    className={cn(
                      "ml-auto h-2 w-2 rounded-full",
                      theme === "dark" ? "bg-neon-cyan shadow-neon" : "bg-gray-600"
                    )}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Accent line */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-1",
            theme === "dark"
              ? "bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink"
              : "bg-gray-300"
          )}
        />
      </aside>
    </>
  );
};

export default MobileDrawer;

