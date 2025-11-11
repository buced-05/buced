import { BellIcon } from "@heroicons/react/24/outline";
import useNotifications from "../../hooks/useNotifications";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Bienvenue, {user?.full_name ?? "Invité"}</h1>
        <p className="text-sm text-slate-500">Suivez vos projets et les innovations en temps réel.</p>
      </div>
      <button
        type="button"
        className="relative rounded-full border border-slate-200 p-3 text-slate-600 hover:bg-slate-100"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ivoire-orange px-1 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>
    </header>
  );
};

export default Header;

