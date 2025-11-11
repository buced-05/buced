import type { Project } from "../../types";

type ProjectCardProps = {
  project: Project;
};

const statusColors: Record<string, string> = {
  idea: "bg-slate-100 text-slate-600",
  prototype: "bg-sky-100 text-sky-700",
  mvp: "bg-emerald-100 text-emerald-700",
  incubation: "bg-violet-100 text-violet-700",
  completed: "bg-amber-100 text-amber-700"
};

const ProjectCard = ({ project }: ProjectCardProps) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <header className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
        <p className="text-xs uppercase tracking-wide text-ivoire-orange">{project.category}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[project.current_status] ?? statusColors.idea}`}>
        {project.current_status}
      </span>
    </header>
    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{project.description}</p>
    <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-500">
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-400">Communauté</p>
        <p className="text-slate-800">{project.community_score.toFixed(1)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-400">IA</p>
        <p className="text-slate-800">{project.ai_score.toFixed(1)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-400">Likes</p>
        <p className="text-slate-800">{project.likes_count}</p>
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <button className="flex-1 rounded-xl bg-ivoire-orange py-2 text-sm font-semibold text-white hover:bg-ivoire-orange/90" type="button">
        Détails
      </button>
      <button className="flex-1 rounded-xl border border-ivoire-orange py-2 text-sm font-semibold text-ivoire-orange hover:bg-ivoire-orange/10" type="button">
        Voter
      </button>
    </div>
  </article>
);

export default ProjectCard;

