const sponsors = [
  { id: "s1", name: "Orange Côte d'Ivoire", budget: "45 M XOF", projects: 6 },
  { id: "s2", name: "MTN Foundation", budget: "30 M XOF", projects: 4 },
  { id: "s3", name: "Société Générale", budget: "25 M XOF", projects: 3 }
];

const SponsorsPage = () => (
  <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Sponsors & Partenaires</h2>
        <p className="text-sm text-slate-500">Identifiez les partenaires stratégiques et suivez leurs engagements.</p>
      </div>
      <button type="button" className="rounded-xl bg-ivoire-green px-4 py-2 text-sm font-semibold text-white hover:bg-ivoire-green/90">
        Inviter un sponsor
      </button>
    </header>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Sponsor</th>
            <th className="px-6 py-4 font-semibold">Budget engagé</th>
            <th className="px-6 py-4 font-semibold">Projets soutenus</th>
            <th className="px-6 py-4 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id} className="border-t border-slate-100">
              <td className="px-6 py-4 font-medium text-slate-800">{sponsor.name}</td>
              <td className="px-6 py-4 text-slate-500">{sponsor.budget}</td>
              <td className="px-6 py-4 text-slate-500">{sponsor.projects}</td>
              <td className="px-6 py-4">
                <button type="button" className="rounded-lg border border-ivoire-orange px-3 py-2 text-xs font-semibold text-ivoire-orange">
                  Voir le profil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
);

export default SponsorsPage;

