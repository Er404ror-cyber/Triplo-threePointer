import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_TEAMS } from "../pages/t_equipas"; // ajuste o caminho conforme onde t_equipas.tsx está salvo
 
export const MAX_FIELD_LENGTH = 20;
export const MAX_DESCRIPTION_LENGTH = 60;

export function useNewPlayerForm() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [province, setProvince] = useState("Maputo");
  const [teamId, setTeamId] = useState("");
  const [category, setCategory] = useState("Sénior");
  const [height, setHeight] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !age.trim() || !teamId || !height.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const selectedTeam = ALL_TEAMS.find((t) => t.id === teamId);

    const newPlayer = {
      name,
      age: Number(age),
      province,
      teamId,
      teamName: selectedTeam?.name || "",
      category,
      height,
      description,
      photoName: photo?.name || null,
    };

    // TODO: substituir por chamada real ao Supabase (insert na tabela de jogadores + upload da foto)
    console.log("Novo jogador:", newPlayer);

    navigate("/admin/jogadores");
  };

  return {
    // estado
    photo,
    photoPreview,
    name,
    age,
    province,
    teamId,
    category,
    height,
    description,
    error,
    // setters
    setName,
    setAge,
    setProvince,
    setTeamId,
    setCategory,
    setHeight,
    setDescription,
    // handlers
    handlePhotoChange,
    handleSubmit,
  };
}
