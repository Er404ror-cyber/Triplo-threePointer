import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MAX_FIELD_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 250;

export interface TeamFormData {
  crest: File | null;
  crestPreview: string | null;
  name: string;
  city: string;
  division: string;
  founded: string;
  description: string;
  headerColor: string;
  error: string | null;
}

export function useTeamForm(onSaveSuccess?: () => void) {
  const navigate = useNavigate();

  const [crest, setCrest] = useState<File | null>(null);
  const [crestPreview, setCrestPreview] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [city, setCity] = useState<string>("Maputo");
  const [division, setDivision] = useState<string>("1ª Divisão");
  const [founded, setFounded] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [headerColor, setHeaderColor] = useState<string>("#2563eb");
  const [error, setError] = useState<string | null>(null);

  const handleCrestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCrest(file);
      // Converte imagem para base64 para poder guardar no localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        setCrestPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Por favor, insere o nome da equipa.");
      return;
    }

    if (!founded.trim()) {
      setError("Por favor, insere o ano de fundação.");
      return;
    }

    try {
      // 💡 1. Estruturar a nova equipa
      const newTeam = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name,
        city,
        division,
        founded,
        description,
        headerColor,
        crestImage: crestPreview, // imagem em base64 salva
        createdAt: new Date().toISOString(),
      };

      // 💡 2. Guardar no localStorage
      const existingTeams = JSON.parse(localStorage.getItem("teams_data") || "[]");
      existingTeams.push(newTeam);
      localStorage.setItem("teams_data", JSON.stringify(existingTeams));

      // 💡 3. Limpar erros e redirecionar
      setError(null);
      
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        // Redireciona para o painel ou lista de equipas
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao guardar a equipa localmente.");
    }
  };

  return {
    formData: {
      crest,
      crestPreview,
      name,
      city,
      division,
      founded,
      description,
      headerColor,
      error,
    },
    actions: {
      setName,
      setCity,
      setDivision,
      setFounded,
      setDescription,
      setHeaderColor,
      handleCrestChange,
      handleSubmit,
    },
  };
}