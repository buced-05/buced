import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  AcademicCapIcon,
  LightBulbIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Tableau de bord", to: "/", icon: HomeIcon },
  { name: "Orientation", to: "/orientation", icon: AcademicCapIcon },
  { name: "Projets", to: "/projects", icon: LightBulbIcon },
  { name: "Votes", to: "/votes", icon: StarIcon },
  { name: "Prototypage", to: "/prototyping", icon: WrenchScrewdriverIcon },
  { name: "Sponsors", to: "/sponsors", icon: BuildingOfficeIcon },
  { name: "Accompagnement", to: "/accompagnement", icon: UsersIcon },
  { name: "Paramètres", to: "/parametres", icon: Cog6ToothIcon }
];

const Sidebar = () => (
  <aside className="hidden w-72 border-r border-slate-200 bg-white lg:block">
    <div className="flex h-20 items-center gap-2 px-6 text-ivoire-orange">
      <span className="text-3xl font-semibold">BCE</span>
      <span className="text-sm font-medium text-slate-500">Bureau des Clubs Éducatifs</span>
    </div>
    <nav className="space-y-1 px-4 py-6">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-ivoire-orange/10 text-ivoire-orange" : "text-slate-600 hover:bg-slate-100"
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  </aside>
);

export default Sidebar;

