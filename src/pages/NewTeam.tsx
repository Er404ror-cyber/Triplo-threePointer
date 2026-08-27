import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TeamForm from "../components/TeamForm";
import { useTeamForm } from "../types/useTeamForm"; // (Ou ../hooks/useTeamForm dependendo da tua pasta)

export default function NewTeamPage() {
  const navigate = useNavigate();
  const { formData, actions } = useTeamForm();

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho da Página */}
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Criar Nova Equipa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Adicione uma nova equipa ao campeonato preenchendo os dados abaixo.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <TeamForm formData={formData} actions={actions} />
    </div>
  );
}