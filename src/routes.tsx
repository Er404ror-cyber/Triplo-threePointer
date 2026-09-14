import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layout/publicLayout";
import Home from "./pages/Home";
import AdminPublications from "./Dashboard/AdminPublications";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./Dashboard/adminLogin";
import PublicationsFeed from "./pages/PublicationsFeed";
import PublicationWatch from "./pages/PublicationWatch";
import Jogadores from "./Dashboard/jogadore";
import Dash from "./Dashboard/das";
import Newtime from "./pages/NewTeam";
import T_jogadores from "./Dashboard/t_jogadores";
import TeamManagement from "./Dashboard/TeamManagement";
import T_Details from "./Dashboard/t_details";
import Newplay from "./Dashboard/newplay";
import NewPartida from "./Dashboard/newpartida";
import TeamDetailsPage from "./Dashboard/TeamDetailsPage";
import EditPlayer from "./Dashboard/EditPlayer";
import PlayerDetails from "./Dashboard/PlayerDetails";
import FullStandings from "./components/dasboard/StandingsTable";
import PublicJogadores from "./pages/PublicJogadores";

export const router = createBrowserRouter([
  // Rotas Públicas (Visitantes)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jogadores", element: <Jogadores /> },
      // MOVI A ROTA PARA AQUI:
      { path: "/PublicJogadores", element: <PublicJogadores /> }, 
      { path: "/publications", element: <PublicationsFeed /> },
      { path: "/publications/:id", element: <PublicationWatch /> }
    ]
  },
  // Rota de Login
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  // Rotas Protegidas (Apenas Administradores)
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      { path: "/admin", element: <AdminPublications /> },
      { path: "/admin/dashboard", element: <Dash /> },
      { path: "/admin/newtime", element: <Newtime /> },
      { path: "/admin/newplay", element: <Newplay /> },
      { path: "/admin/newpartida", element: <NewPartida /> },
      { path: "/admin/jogadores", element: <T_jogadores /> },
      // A ROTA FOI REMOVIDA DAQUI
      { path: "/admin/equipas", element: <TeamManagement /> },
      { path: "/admin/equipas/:id", element: <TeamDetailsPage /> },
      { path: "/admin/equipas/detalhes/:id", element: <T_Details /> },
      { path: "/admin/publications/:id", element: <PublicationWatch /> },
      { path: "/admin/editplayer/:id", element: <EditPlayer /> },
      { path: "/admin/jogadores/:id", element: <PlayerDetails /> },
      { path: "/admin/classificacao", element: <FullStandings /> },
    ]
  }
]);