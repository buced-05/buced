const votes = [
  {
    id: "v1",
    project: "AgriConnect",
    rating: 5,
    comment: "Solution très innovante, impact agricole fort.",
    sentiment: "positif",
    date: "11 nov. 2025"
  },
  {
    id: "v2",
    project: "SmartCampus",
    rating: 4,
    comment: "Bon MVP, prévoir un plan de déploiement national.",
    sentiment: "neutre",
    date: "10 nov. 2025"
  }
];

const VotesPage = () => (
  <div className="space-y-6">
    <header>
      <h2 className="text-2xl font-semibold text-slate-900">Votes & Évaluations</h2>
      <p className="text-sm text-slate-500">Collectez la voix de la communauté et combinez-la au scoring IA.</p>
    </header>

    <section className="grid gap-4 md:grid-cols-2">
      {votes.map((vote) => (
        <article key={vote.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{vote.project}</h3>
            <span className="rounded-full bg-ivoire-orange/10 px-3 py-1 text-xs font-semibold text-ivoire-orange">
              {vote.rating} étoiles
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">“{vote.comment}”</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Sentiment IA : {vote.sentiment}</span>
            <span>{vote.date}</span>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:border-ivoire-orange">
              Détails IA
            </button>
            <button type="button" className="flex-1 rounded-xl bg-ivoire-green py-2 text-sm font-semibold text-white hover:bg-ivoire-green/90">
              Répondre
            </button>
          </div>
        </article>
      ))}
    </section>
  </div>
);

export default VotesPage;

