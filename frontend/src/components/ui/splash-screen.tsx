import { Spinner } from "./spinner";

export const SplashScreen = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0A0A0F]">
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-[#1A1A2E] shadow-neon">
      <Spinner size="lg" />
    </div>
    <div className="text-center">
      <p className="text-lg font-bold text-white">Chargement de la plateforme</p>
      <p className="mt-2 text-sm text-gray-400">
        Nous vérifions vos accès et préparons votre espace de travail…
      </p>
    </div>
  </div>
);

export default SplashScreen;

