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
  Squares2X2Icon
} from "@heroicons/react/24/outline";

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
  { name: "Paramètres", to: "/parametres", icon: Cog6ToothIcon }
];

const Sidebar = () => {
  const location = useLocation();
  const { theme } = useThemeStore();

  return (
    <aside className={`relative hidden w-72 border-r lg:block shadow-lg transition-colors duration-300 z-40 ${
      theme === "dark" 
        ? "border-r border-neon-cyan/20 bg-[#1A1A2E]" 
        : "border-r border-gray-200 bg-gray-50"
    }`} style={{ zIndex: 40 }}>
      {/* Accent line */}
      <div className={`absolute left-0 top-0 h-full w-1 ${
        theme === "dark" 
          ? "bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink"
          : "bg-gray-300"
      }`} />
      
      <div className={`flex h-20 items-center gap-2 px-6 border-b ${
        theme === "dark" ? "border-neon-cyan/20" : "border-gray-200"
      }`}>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-black text-lg ${
          theme === "dark"
            ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F]"
            : "bg-gray-800 text-white shadow-md"
        }`}>
          BCE
        </div>
        <div>
          <p className={`text-xs uppercase tracking-wide font-bold ${
            theme === "dark" ? "text-gray-500" : "text-gray-600"
          }`}>Plateforme</p>
          <p className={`text-lg font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>Clubs Éducatifs</p>
        </div>
      </div>
      <nav className="space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to === "/" && location.pathname === "/");
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? theme === "dark"
                    ? "bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border border-neon-cyan/30"
                    : "bg-gray-100 text-gray-900 border border-gray-300"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
              {isActive && (
                <div className={`ml-auto h-2 w-2 rounded-full ${
                  theme === "dark" ? "bg-neon-cyan shadow-neon" : "bg-gray-600"
                }`} />
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
