import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import OrientationPage from "./pages/orientation/OrientationPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import VotesPage from "./pages/votes/VotesPage";
import PrototypingPage from "./pages/prototyping/PrototypingPage";
import SponsorsPage from "./pages/sponsors/SponsorsPage";
import AccompanimentPage from "./pages/accompaniment/AccompanimentPage";
import SettingsPage from "./pages/settings/SettingsPage";

const App = () => (
  <RootLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/orientation" element={<OrientationPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/votes" element={<VotesPage />} />
      <Route path="/prototyping" element={<PrototypingPage />} />
      <Route path="/sponsors" element={<SponsorsPage />} />
      <Route path="/accompagnement" element={<AccompanimentPage />} />
      <Route path="/parametres" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </RootLayout>
);

export default App;

