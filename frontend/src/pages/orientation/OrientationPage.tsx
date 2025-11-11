import OrientationRequestCard from "../../components/orientation/OrientationRequestCard";

const mockRequests = [
  { id: "1", studentName: "Awa Koné", topic: "Orientation IA & Data", status: "matched", scheduledAt: "12 nov. 2025 - 14h" },
  { id: "2", studentName: "Yao Kouadio", topic: "Entrepreneuriat social", status: "pending" },
  { id: "3", studentName: "Kouamé Léa", topic: "Ingénierie environnementale", status: "in_progress", scheduledAt: "13 nov. 2025 - 10h" }
] as const;

const resources = [
  { id: "r1", title: "Guide filières scientifiques 2025", category: "Orientation" },
  { id: "r2", title: "Mentors disponibles - Q4", category: "Mentorat" },
  { id: "r3", title: "Bourses & financements innovants", category: "Financement" }
];

const OrientationPage = () => (
  <div className="space-y-6">
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Orientation & Conseil</h2>
        <p className="text-sm text-slate-500">Assignez les demandes, suivez les conversations et partagez des ressources.</p>
      </div>
      <div className="flex gap-3">
        <button className="rounded-xl border border-ivoire-orange px-4 py-2 text-sm font-semibold text-ivoire-orange hover:bg-ivoire-orange/10" type="button">
          Ajouter une ressource
        </button>
        <button className="rounded-xl bg-ivoire-green px-4 py-2 text-sm font-semibold text-white hover:bg-ivoire-green/90" type="button">
          Nouvelle demande
        </button>
      </div>
    </header>

    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {mockRequests.map((request) => (
          <OrientationRequestCard key={request.id} request={request} />
        ))}
      </div>
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Ressources pédagogiques</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {resources.map((resource) => (
            <li key={resource.id} className="rounded-xl border border-slate-100 p-4 hover:border-ivoire-orange">
              <p className="font-medium text-slate-800">{resource.title}</p>
              <p className="text-xs uppercase tracking-wide text-ivoire-orange">{resource.category}</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  </div>
);

export default OrientationPage;

