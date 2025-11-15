import { NavLink, useLocation } from "react-router-dom";
import { useThemeStore } from "../../stores/theme";
import {
  Squares2X2Icon,
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Squares2X2Icon as Squares2X2IconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  HeartIcon as HeartIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from "@heroicons/react/24/solid";
import { cn } from "../../utils/cn";

const mobileNavigation = [
  { name: "Flux", to: "/", icon: Squares2X2Icon, iconSolid: Squares2X2IconSolid },
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: "Recherche", to: "/search", icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassIconSolid },
  { name: "Favoris", to: "/favorites", icon: HeartIcon, iconSolid: HeartIconSolid },
  { name: "Profil", to: "/profile", icon: UserCircleIcon, iconSolid: UserCircleIconSolid },
];

const BottomNavigation = () => {
  const location = useLocation();
  const { theme } = useThemeStore();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "border-t backdrop-blur-lg",
        theme === "dark"
          ? "border-neon-cyan/20 bg-[#1A1A2E]/95"
          : "border-gray-200 bg-white/95 shadow-lg"
      )}
      style={{ 
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: theme === "dark" 
          ? "0 -4px 20px rgba(0, 240, 255, 0.1)" 
          : "0 -4px 20px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="flex items-center justify-around h-20 px-2">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;
          const IconSolid = item.iconSolid;
          const isActive =
            location.pathname === item.to ||
            (item.to === "/" && location.pathname === "/");

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "transition-all duration-200 rounded-lg mx-1",
                "relative group py-2"
              )}
            >
              {isActive ? (
                <>
                  <div
                    className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-b-full",
                      theme === "dark"
                        ? "bg-gradient-to-r from-neon-cyan to-neon-purple"
                        : "bg-gradient-to-r from-blue-600 to-purple-600"
                    )}
                  />
                  <IconSolid
                    className={cn(
                      "h-8 w-8 mb-1.5 transition-transform duration-200",
                      theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                    )}
                  >
                    {item.name}
                  </span>
                </>
              ) : (
                <>
                  <Icon
                    className={cn(
                      "h-8 w-8 mb-1.5 transition-all duration-200",
                      theme === "dark"
                        ? "text-gray-500 group-hover:text-neon-cyan"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium leading-tight",
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    )}
                  >
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

