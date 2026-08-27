import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit2, MapPin, Calendar, Layers, FileText, Shield, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import TeamForm from "../components/TeamForm";
import { useTeamForm, type Team } from "../types/useTeamForm";
import toast from "react-hot-toast";

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // 💡 React Query para buscar a equipa de forma infalível
  const { data: team, isLoading, isError } = useQuery({
    queryKey: ["teams", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*").eq("id", id!).single();
      if (error) throw new Error(error.message, { cause: error });
      
      // Mapear SQL -> UI
      return {
        id: data.id,
        name: data.name,
        city: data.province,
        division: data.division,
        founded: data.founded?.toString() || "",
        description: data.description || "",
        color: data.header_color || "#2563eb",
        logo: data.crest_url,
        initials: data.name.substring(0, 3).toUpperCase(),
        players: 0,
      } as Team;
    },
    // Otimização: Tenta usar os dados da cache da listagem imediatamente!
    initialData: () => {
      const cachedTeams = queryClient.getQueryData<Team[]>(["teams"]);
      return cachedTeams?.find((t) => t.id === id);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !team) {
    toast.error("Equipa não encontrada.");
    navigate("/admin/equipas");
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => isEditing ? setIsEditing(false) : navigate("/admin/equipas")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {isEditing ? "Editar Equipa" : "Detalhes da Equipa"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing ? `Atualize as informações do ${team.name}` : `A visualizar informações do ${team.name}`}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <Edit2 size={16} /> Editar Equipa
          </button>
        )}
      </div>

      {isEditing ? (
        <EditFormWrapper teamId={id!} initialData={team} onCancel={() => setIsEditing(false)} />
      ) : (
        <TeamReadOnlyView team={team} />
      )}
    </div>
  );
}

// O Wrapper garante que o Hook só carrega quando o team existe (React puro)
function EditFormWrapper({ teamId, initialData, onCancel }: { teamId: string; initialData: Team; onCancel: () => void }) {
  const { formData, actions } = useTeamForm(teamId, initialData, () => onCancel());
  return <TeamForm formData={formData} actions={actions} isEditing={true} />;
}

// Componente de Leitura
function TeamReadOnlyView({ team }: { team: Team }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
      <div className="h-32 w-full" style={{ backgroundColor: team.color }} />
      <div className="px-6 pb-8 sm:px-10">
        <div className="-mt-16 mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md">
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="h-full w-full object-contain p-2" />
          ) : (
            <Shield size={48} className="text-slate-400" />
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">{team.name}</h2>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1"><MapPin size={16} className="text-slate-400" /> {team.city}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1"><Layers size={16} className="text-slate-400" /> {team.division}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1"><Calendar size={16} className="text-slate-400" /> Fundado em {team.founded}</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-6 border border-slate-100">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
            <FileText size={18} className="text-blue-600" /> História e Descrição
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
            {team.description || "Sem descrição disponível."}
          </p>
        </div>
      </div>
    </div>
  );
}