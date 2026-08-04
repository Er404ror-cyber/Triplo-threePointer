import PageHeader from "../components/PageHeader";
import PlayerForm from "../components/PlayerForm";
import { useNewPlayerForm } from "../types/useNewPlayerForm";

export default function NewPlayer() {
  const formState = useNewPlayerForm();

  const formData = {
    photo: formState.photo,
    photoPreview: formState.photoPreview,
    name: formState.name,
    age: formState.age,
    province: formState.province,
    teamId: formState.teamId,
    category: formState.category,
    height: formState.height,
    description: formState.description,
    error: formState.error,
  };

  const actions = {
    setName: formState.setName,
    setAge: formState.setAge,
    setProvince: formState.setProvince,
    setTeamId: formState.setTeamId,
    setCategory: formState.setCategory,
    setHeight: formState.setHeight,
    setDescription: formState.setDescription,
    handlePhotoChange: formState.handlePhotoChange,
    handleSubmit: formState.handleSubmit,
  };

  return (
    // Alterado 'p-8' fixo para padding fluido 'p-4 sm:p-6 md:p-8'
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Novo Jogador"
          subtitle="Adicione um novo atleta ao sistema."
          backTo="/admin/dashboard"
        />

        <PlayerForm formData={formData} actions={actions} />
      </div>
    </div>
  );
}