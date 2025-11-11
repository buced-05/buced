import StatCard from "../../components/dashboard/StatCard";
import ProjectsLeaderboard from "./ProjectsLeaderboard";
import ActivityFeed from "./ActivityFeed";

const DashboardPage = () => (
  <div className="space-y-8">
    <section className="rounded-3xl bg-gradient-to-r from-ivoire-orange to-ivoire-green p-8 text-white shadow-lg">
      <h2 className="text-3xl font-semibold">Bureau des Clubs Éducatifs</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/80">
        Pilotez l&apos;innovation ivoirienne : identifiez, évaluez et accompagnez les projets les plus prometteurs
        grâce à l&apos;intelligence collective et à l&apos;IA.
      </p>
    </section>

    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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

export default DashboardPage;

