const columns = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [{ id: "t1", title: "Brief UX", owner: "Design team" }]
  },
  {
    id: "in_progress",
    title: "En cours",
    tasks: [{ id: "t2", title: "API scoring IA", owner: "Equipe ML" }]
  },
  {
    id: "review",
    title: "Revue",
    tasks: [{ id: "t3", title: "Tests QA", owner: "Quality squad" }]
  },
  {
    id: "done",
    title: "Terminé",
    tasks: [{ id: "t4", title: "Prototype EduSolar", owner: "DevOps" }]
  }
];

const PrototypingPage = () => (
  <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Prototypage rapide</h2>
        <p className="text-sm text-slate-500">
          Planifiez les sprints de 7 jours, assignez les équipes et générez des spécifications techniques.
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" className="rounded-xl border border-ivoire-orange px-4 py-2 text-sm font-semibold text-ivoire-orange hover:bg-ivoire-orange/10">
          Nouvelle tâche
        </button>
        <button type="button" className="rounded-xl bg-ivoire-orange px-4 py-2 text-sm font-semibold text-white hover:bg-ivoire-orange/90">
          Générer les specs
        </button>
      </div>
    </header>

    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{column.title}</h3>
            <span className="rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-500">
              {column.tasks.length}
            </span>
          </div>
          <div className="mt-4 flex flex-1 flex-col gap-3">
            {column.tasks.map((task) => (
              <article key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-800">{task.title}</p>
                <p className="mt-1 text-xs text-slate-400">{task.owner}</p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default PrototypingPage;

