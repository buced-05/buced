import useAuth from "../../hooks/useAuth";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Paramètres & Sécurité</h2>
        <p className="text-sm text-slate-500">Gérez votre compte, les rôles et l’authentification à deux facteurs.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Profil</h3>
        <dl className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <dt>Nom complet</dt>
            <dd className="font-medium text-slate-800">{user?.full_name ?? "Non renseigné"}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Email</dt>
            <dd>{user?.email ?? "Non renseigné"}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Rôle</dt>
            <dd className="capitalize">{user?.role ?? "N/A"}</dd>
          </div>
        </dl>
        <button type="button" className="mt-4 rounded-xl border border-ivoire-orange px-4 py-2 text-sm font-semibold text-ivoire-orange hover:bg-ivoire-orange/10">
          Modifier le profil
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Sécurité & 2FA</h3>
        <p className="mt-2 text-sm text-slate-500">
          Activez l’authentification à deux facteurs pour sécuriser les accès des sponsors et administrateurs.
        </p>
        <button type="button" className="mt-4 rounded-xl bg-ivoire-orange px-4 py-2 text-sm font-semibold text-white hover:bg-ivoire-orange/90">
          Activer / Gérer le 2FA
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;

