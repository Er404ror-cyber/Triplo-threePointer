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
import Newplay from "./pages/newplay";
import Newtime from "./pages/newtime";

export const router = createBrowserRouter([
  // Rotas Públicas (Visitantes)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jogadores", element: <Jogadores /> },
      { path: "/publications", element: <PublicationsFeed /> },
      { path: "/publications/:id", element: <PublicationWatch /> } // Visão do cliente
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
      // URL: /admin (Lista e Criar)
      { path: "/admin", element: <AdminPublications /> },
      { path: "/admin/dashboard", element: <Dash /> },
      { path: "/admin/dashboard/newplay", element: <Newplay /> },
      { path: "/admin/dashboard/newtime", element: <Newtime /> },
      
      // URL: /admin/publications/:id (Visão do Admin para testar/moderar)
      // Usamos o mesmo componente PublicationWatch que já tens pronto!
      { path: "/admin/publications/:id", element: <PublicationWatch /> }
    ]
  }
]);