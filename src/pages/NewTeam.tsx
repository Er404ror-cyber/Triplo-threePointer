import PageHeader from "../components/PageHeader";
import TeamForm from "../components/TeamForm";
import { useTeamForm } from "../types/useTeamForm";

export default function NewTeam() {
  const formState = useTeamForm();

  const formData = {
    crest: formState.crest,
    crestPreview: formState.crestPreview,
    name: formState.name,
    city: formState.city,
    division: formState.division,
    founded: formState.founded,
    description: formState.description,
    error: formState.error,
  };

  const actions = {
    setName: formState.setName,
    setCity: formState.setCity,
    setDivision: formState.setDivision,
    setFounded: formState.setFounded,
    setDescription: formState.setDescription,
    handleCrestChange: formState.handleCrestChange,
    handleSubmit: formState.handleSubmit,
  };

  return (
    // Alterado 'p-8' fixo para padding fluido 'p-4 sm:p-6 md:p-8'
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Nova Equipa"
          subtitle="Cadastre um novo clube no sistema."
          backTo="/admin/dashboard"
        />

        <TeamForm formData={formData} actions={actions} />
      </div>
    </div>
  );
}