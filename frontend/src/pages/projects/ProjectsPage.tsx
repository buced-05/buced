import ProjectCard from "../../components/projects/ProjectCard";
import type { Project } from "../../types";

const sampleProjects: Project[] = [
  {
    id: "1",
    title: "AgriConnect",
    description: "Plateforme mobile reliant les agripreneurs aux acheteurs et mentors spécialisés.",
    category: "AgriTech",
    current_status: "prototype",
    community_score: 86.4,
    ai_score: 90.2,
    final_score: 89.1,
    likes_count: 120,
    views_count: 540,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "SmartCampus",
    description: "Application IoT pour monitorer la consommation énergétique des universités.",
    category: "Technologie",
    current_status: "mvp",
    community_score: 82.3,
    ai_score: 87.8,
    final_score: 88.5,
    likes_count: 98,
    views_count: 410,
    created_at: new Date().toISOString()
  }
];

const ProjectsPage = () => (
  <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Projets & Idées</h2>
        <p className="text-sm text-slate-500">
          Soumettez des innovations, suivez leur scoring communautaire & IA et accédez aux ressources.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          placeholder="Recherche par mot-clé..."
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-ivoire-orange focus:outline-none"
        />
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-ivoire-orange focus:outline-none">
          <option value="all">Toutes catégories</option>
          <option value="technology">Technologie</option>
          <option value="social">Social</option>
          <option value="environment">Environnement</option>
        </select>
        <button className="rounded-xl bg-ivoire-orange px-4 py-2 text-sm font-semibold text-white hover:bg-ivoire-orange/90" type="button">
          Soumettre un projet
        </button>
      </div>
    </header>

    <section className="grid gap-6 lg:grid-cols-2">
      {sampleProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  </div>
);

export default ProjectsPage;

