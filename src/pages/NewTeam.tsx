import TeamForm from "../components/TeamForm";
import { useTeamForm } from "../types/useTeamForm";

export default function NewTeamPage() {
  const { formData, actions } = useTeamForm();

  return (
    <div className="p-6">
      <TeamForm formData={formData} actions={actions} />
    </div>
  );
}