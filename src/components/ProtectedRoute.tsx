import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "../layout/adminLayout";

export default function ProtectedRoute() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pega a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças (se fizer logout noutra aba, por exemplo)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">A verificar autorização...</p>
      </div>
    );
  }

  // Se NÃO houver sessão, redireciona imediatamente para a página de Login
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se HOUVER sessão, renderiza o Layout Admin passando a sessão pelas props
  return <AdminLayout session={session} />;
}