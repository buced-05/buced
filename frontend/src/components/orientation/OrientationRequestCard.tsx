type OrientationRequest = {
  id: string;
  studentName: string;
  topic: string;
  status: "pending" | "matched" | "in_progress" | "completed";
  scheduledAt?: string;
};

const statusColors: Record<OrientationRequest["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  matched: "bg-sky-100 text-sky-700",
  in_progress: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700"
};

const OrientationRequestCard = ({ request }: { request: OrientationRequest }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h4 className="text-base font-semibold text-slate-900">{request.topic}</h4>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[request.status]}`}>
        {request.status.replace("_", " ")}
      </span>
    </div>
    <p className="mt-1 text-sm text-slate-500">{request.studentName}</p>
    {request.scheduledAt ? (
      <p className="mt-3 text-xs text-slate-400">Session prévue : {request.scheduledAt}</p>
    ) : null}
    <button
      type="button"
      className="mt-4 w-full rounded-xl bg-ivoire-orange py-2 text-sm font-semibold text-white transition hover:bg-ivoire-orange/90"
    >
      Ouvrir la fiche
    </button>
  </article>
);

export default OrientationRequestCard;

