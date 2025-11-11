const programs = [
  {
    id: "p1",
    project: "EduSolar",
    mentor: "Fatou Traoré",
    status: "Actif",
    budget: "12 M XOF",
    nextSession: "14 nov. 2025"
  },
  {
    id: "p2",
    project: "HealthBot",
    mentor: "Dr. Koffi",
    status: "Planifié",
    budget: "8 M XOF",
    nextSession: "18 nov. 2025"
  }
];

const AccompanimentPage = () => (
  <div className="space-y-6">
    <header>
      <h2 className="text-2xl font-semibold text-slate-900">Accompagnement des Lauréats</h2>
      <p className="text-sm text-slate-500">
        Suivez les jalons, le budget et les KPIs des projets sélectionnés (top 2%).
      </p>
    </header>

    <section className="grid gap-4 md:grid-cols-2">
      {programs.map((program) => (
        <article key={program.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{program.project}</h3>
              <p className="text-xs text-slate-400">Mentor : {program.mentor}</p>
            </div>
            <span className="rounded-full bg-ivoire-orange/10 px-3 py-1 text-xs font-semibold text-ivoire-orange">
              {program.status}
            </span>
          </header>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <dt>Budget alloué</dt>
              <dd className="font-semibold text-slate-800">{program.budget}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Prochaine session</dt>
              <dd>{program.nextSession}</dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-2">
            <button type="button" className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600">
              Voir les jalons
            </button>
            <button type="button" className="flex-1 rounded-xl bg-ivoire-green py-2 text-sm font-semibold text-white hover:bg-ivoire-green/90">
              Nouveau rapport
            </button>
          </div>
        </article>
      ))}
    </section>
  </div>
);

export default AccompanimentPage;

