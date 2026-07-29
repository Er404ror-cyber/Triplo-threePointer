import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminLayout from "../layout/adminLayout";
import type { Session } from "@supabase/supabase-js";

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Escuta alterações na autenticação e obtém a sessão inicial
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">A verificar autorização...</p>
      </div>
    );
  }

  // Se NÃO houver sessão, redireciona imediatamente para o Login
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se HOUVER sessão, renderiza o Layout Admin
  return <AdminLayout session={session} />;
}