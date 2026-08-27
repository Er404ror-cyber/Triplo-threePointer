import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export const MAX_FIELD_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 250;

export interface Team {
  id: string;
  name: string;
  city: string;
  division: string;
  founded: string;
  description: string;
  color: string;
  logo: string | null;
  initials: string;
  players: number;
}

export function useTeamForm(teamId?: string, initialData?: Partial<Team>, onSaveSuccess?: () => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>(initialData?.name || "");
  const [city, setCity] = useState<string>(initialData?.city || "Maputo (Cidade)");
  const [division, setDivision] = useState<string>(initialData?.division || "Moçambola");
  const [founded, setFounded] = useState<string>(initialData?.founded || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [headerColor, setHeaderColor] = useState<string>(initialData?.color || "#2563eb");
  const [error, setError] = useState<string | null>(null);

  const [crest, setCrest] = useState<File | null>(null);
  const [crestPreview, setCrestPreview] = useState<string | null>(initialData?.logo || null);

  // 💡 GARANTE A ATUALIZAÇÃO: Se o initialData mudar (Modo Edição), o formulário assume logo os valores corretos.
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCity(initialData.city || "Maputo (Cidade)");
      setDivision(initialData.division || "Moçambola");
      setFounded(initialData.founded || "");
      setDescription(initialData.description || "");
      setHeaderColor(initialData.color || "#2563eb");
      setCrestPreview(initialData.logo || null);
    }
  }, [initialData]);

  const handleCrestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCrest(file);
      setCrestPreview(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: async (logoUrl: string | null) => {
      const payload = {
        name: name.trim(),
        province: city,
        division,
        founded: parseInt(founded, 10),
        description: description.trim() || null,
        header_color: headerColor,
        crest_url: logoUrl || crestPreview, 
      };

      if (teamId) {
        const { error: sbError } = await supabase.from("teams").update(payload).eq("id", teamId);
        if (sbError) throw new Error(sbError.message, { cause: sbError });
      } else {
        const { error: sbError } = await supabase.from("teams").insert([payload]);
        if (sbError) throw new Error(sbError.message, { cause: sbError });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      if (teamId) queryClient.invalidateQueries({ queryKey: ["teams", teamId] });
      
      toast.success(teamId ? "Equipa atualizada com sucesso!" : "Equipa criada com sucesso!");
      
      if (onSaveSuccess) onSaveSuccess();
      else navigate(teamId ? `/admin/equipas/${teamId}` : "/admin/equipas");
    },
    onError: (err: Error) => {
      console.error("Erro na base de dados:", err);
      toast.error("Falha ao guardar a equipa.");
      setError(err.message);
    }
  });

  const onSubmitData = async (data: { logoUrl: string | null }) => {
    setError(null);
    const toastId = "save-team";
    toast.loading("A guardar equipa...", { id: toastId }); 
    
    try {
      await mutation.mutateAsync(data.logoUrl);
      toast.dismiss(toastId);
    } catch (err) {
      toast.dismiss(toastId);
    }
  };

  return {
    formData: { crest, crestPreview, name, city, division, founded, description, headerColor, error },
    actions: { setName, setCity, setDivision, setFounded, setDescription, setHeaderColor, handleCrestChange, onSubmitData }
  };
}