const activities = [
  { id: "a1", title: "Prototype EduSolar livré", time: "Il y a 2h" },
  { id: "a2", title: "15 nouveaux votes pour AgriConnect", time: "Il y a 5h" },
  { id: "a3", title: "Sponsor Orange CI soutient HealthBot", time: "Hier" }
];

const ActivityFeed = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">Actualités</h3>
    <ul className="mt-4 space-y-4 text-sm text-slate-600">
      {activities.map((activity) => (
        <li key={activity.id} className="rounded-xl bg-slate-50 p-4">
          <p className="font-medium text-slate-800">{activity.title}</p>
          <p className="text-xs text-slate-400">{activity.time}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default ActivityFeed;

