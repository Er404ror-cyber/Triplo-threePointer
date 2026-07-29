import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layout/publicLayout";
import Home from "./pages/Home";
import AdminPublications from "./Dashboard/AdminPublications";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./Dashboard/adminLogin";
import PublicationsFeed from "./pages/PublicationsFeed";
import PublicationWatch from "./pages/PublicationWatch";
import Jogadores from "./pages/jogadore";
import Dash from "./Dashboard/das";
import Newptime from "./pages/newtime";
import T_jogadores from "./pages/t_jogadores";
import T_Equipas from "./pages/t_equipas";
import T_Details from "./pages/t_details";
import Newplay from "./pages/newplay";
import NewPartida from "./pages/newpartida";

export const router = createBrowserRouter([
  // Rotas Públicas (Visitantes)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jogadores", element: <Jogadores /> },
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
      { path: "/admin/newtime", element: <Newptime /> },
      { path: "/admin/newplay", element: <Newplay /> },
      { path: "/admin/newpartida", element: <NewPartida /> },
      { path: "/admin/jogadores", element: <T_jogadores /> },
      { path: "/admin/equipas", element: <T_Equipas /> },
      { path: "/admin/equipas/detalhes/:id", element: <T_Details /> },
      { path: "/admin/publications/:id", element: <PublicationWatch /> }
    ]
  }
]);