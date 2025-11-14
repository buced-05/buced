import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import OrientationPage from "./pages/orientation/OrientationPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
import VotesPage from "./pages/votes/VotesPage";
import PrototypingPage from "./pages/prototyping/PrototypingPage";
import SpecsPage from "./pages/prototyping/SpecsPage";
import SponsorsPage from "./pages/sponsors/SponsorsPage";
import SponsorProfilePage from "./pages/sponsors/SponsorProfilePage";
import AccompanimentPage from "./pages/accompaniment/AccompanimentPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileEditPage from "./pages/profile/ProfileEditPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProjectFormPage from "./pages/projects/ProjectFormPage";
import MilestonesPage from "./pages/accompaniment/MilestonesPage";
import OrientationRequestDetailPage from "./pages/orientation/OrientationRequestDetailPage";
import MessagingPage from "./pages/orientation/MessagingPage";
import TwoFactorPage from "./pages/settings/TwoFactorPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import ErrorPage from "./pages/errors/ErrorPage";
import SearchPage from "./pages/search/SearchPage";
import StatsPage from "./pages/stats/StatsPage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import FeedPage from "./pages/feed/FeedPage";
import { AdminPanel } from "./components/admin/AdminPanel";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "orientation",
        element: <OrientationPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/new",
        element: <ProjectFormPage />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "votes",
        element: <VotesPage />,
      },
      {
        path: "prototyping/specs",
        element: <SpecsPage />,
      },
      {
        path: "prototyping",
        element: <PrototypingPage />,
      },
      {
        path: "sponsors",
        element: <SponsorsPage />,
      },
      {
        path: "sponsors/:id",
        element: <SponsorProfilePage />,
      },
      {
        path: "accompagnement",
        element: <AccompanimentPage />,
      },
      {
        path: "accompagnement/milestones/:id",
        element: <MilestonesPage />,
      },
      {
        path: "orientation/:id",
        element: <OrientationRequestDetailPage />,
      },
      {
        path: "orientation/:id/messaging",
        element: <MessagingPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/edit",
        element: <ProfileEditPage />,
      },
      {
        path: "parametres",
        element: <SettingsPage />,
      },
      {
        path: "parametres/2fa",
        element: <TwoFactorPage />,
      },
      {
        path: "stats",
        element: <StatsPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "feed",
        element: <FeedPage />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
