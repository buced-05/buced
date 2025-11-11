const projects = [
  { id: "1", title: "EduSolar", category: "Énergie", finalScore: 92.5, communityScore: 88 },
  { id: "2", title: "AgriConnect", category: "AgriTech", finalScore: 90.1, communityScore: 85 },
  { id: "3", title: "HealthBot", category: "Santé", finalScore: 88.3, communityScore: 82 }
];

const ProjectsLeaderboard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Top projets IA + Communauté</h3>
      <span className="text-xs font-medium uppercase tracking-wide text-ivoire-orange">Top 3</span>
    </div>
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Projet</th>
            <th className="px-4 py-3 font-semibold">Catégorie</th>
            <th className="px-4 py-3 font-semibold">Score final</th>
            <th className="px-4 py-3 font-semibold">Score communauté</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-800">{project.title}</td>
              <td className="px-4 py-3 text-slate-500">{project.category}</td>
              <td className="px-4 py-3 text-slate-800">{project.finalScore}</td>
              <td className="px-4 py-3 text-slate-800">{project.communityScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProjectsLeaderboard;

