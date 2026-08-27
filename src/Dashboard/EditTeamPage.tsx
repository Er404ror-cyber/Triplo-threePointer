import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import TeamForm from "../components/TeamForm";
import { useTeamForm } from "../types/useTeamForm"; // O teu hook atualizado
import toast from "react-hot-toast";

// Componente intermediário para aguardar os dados antes de montar o formulário
export default function EditTeamPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", id)
          .single(); // Traz apenas um registo

        if (error) throw error;
        setInitialData(data);
      } catch (error) {
        console.error("Erro ao carregar equipa:", error);
        toast.error("Equipa não encontrada.");
        navigate("/admin/equipas");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <button
          onClick={() => navigate("/admin/equipas")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Editar Equipa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Atualize as informações do {initialData?.name}
          </p>
        </div>
      </div>

      {/* Passa o ID e os dados para o Form wrapper */}
      {initialData && <EditFormWrapper id={id!} initialData={initialData} />}
    </div>
  );
}

// Criamos este sub-componente para garantir que o hook 'useTeamForm' 
// só é chamado depois de termos os initialData prontos.
function EditFormWrapper({ id, initialData }: { id: string, initialData: any }) {
  const { formData, actions } = useTeamForm(id, initialData);

  return <TeamForm formData={formData} actions={actions} />;
}