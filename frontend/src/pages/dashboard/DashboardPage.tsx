import StatCard from "../../components/dashboard/StatCard";
import ProjectsLeaderboard from "./ProjectsLeaderboard";
import ActivityFeed from "./ActivityFeed";
import { useThemeStore } from "../../stores/theme";

const DashboardPage = () => {
  const { theme } = useThemeStore();
  
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      <section className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-10 shadow-neon ${
        theme === "dark"
          ? "border-neon-cyan/30 bg-[#1A1A2E] text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}>
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text leading-tight">Bureau des Clubs Éducatifs</h2>
          <p className={`mt-3 sm:mt-2 max-w-2xl text-base sm:text-sm font-medium leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            Pilotez l&apos;innovation ivoirienne : identifiez, évaluez et accompagnez les projets les plus prometteurs
            grâce à l&apos;intelligence collective et à l&apos;IA.
          </p>
        </div>
      </section>

    <section className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Projets actifs" value="128" description="+12% vs mois dernier" />
      <StatCard title="Votes communautaires" value="4 560" description="60% de participation" />
      <StatCard title="Sponsors engagés" value="32" description="8 nouveaux cette semaine" />
      <StatCard title="Prototypes livrés" value="14" description="Cycle moyen : 6.5 jours" />
    </section>

    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ProjectsLeaderboard />
      </div>
      <ActivityFeed />
    </section>
  </div>
  );
};

export default DashboardPage;
