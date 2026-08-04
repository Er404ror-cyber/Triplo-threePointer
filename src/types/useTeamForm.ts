import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MAX_FIELD_LENGTH = 20;
export const MAX_DESCRIPTION_LENGTH = 60;

export function useTeamForm() {
  const navigate = useNavigate();

  const [crest, setCrest] = useState<File | null>(null);
  const [crestPreview, setCrestPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("Maputo");
  const [division, setDivision] = useState("1ª Divisão");
  const [founded, setFounded] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCrestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCrest(file);
    setCrestPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !city.trim() || !founded.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const newTeam = {
      name,
      city,
      division,
      founded: Number(founded),
      description,
      crestName: crest?.name || null,
    };

    // TODO: substituir por chamada real ao Supabase (insert na tabela de equipas + upload do escudo)
    console.log("Nova equipa:", newTeam);

    navigate("/admin/equipas");
  };

  return {
    // estado
    crest,
    crestPreview,
    name,
    city,
    division,
    founded,
    description,
    error,
    // setters
    setName,
    setCity,
    setDivision,
    setFounded,
    setDescription,
    // handlers
    handleCrestChange,
    handleSubmit,
  };
}
