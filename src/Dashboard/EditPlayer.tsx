import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

import PageHeader from "../components/PageHeader";
import PlayerForm from "../components/PlayerForm";

// ============================================================================
// 1. COMPONENTE PRINCIPAL (Busca os dados e lida com o Loading)
// ============================================================================
export default function EditPlayer() {
  const { id } = useParams();

  const { data: player, isLoading, error: queryError } = useQuery({
    queryKey: ['player', id],
    queryFn: async () => {
      // 👇 Correção 1: Mudar "err" para "error"
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">A carregar dados do jogador...</div>;
  }

  if (queryError || !player) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar dados do jogador.</div>;
  }

  return <EditPlayerContent player={player} playerId={id as string} />;
}


// ============================================================================
// 2. COMPONENTE DE CONTEÚDO (Gere o estado e o formulário)
// ============================================================================

// 👇 Correção 2: Criar uma interface exata em vez de usar "any"
interface PlayerData {
  name: string;
  age?: number;
  height?: string;
  province?: string;
  team_id?: string;
  division?: string;
  photo?: string;
}

function EditPlayerContent({ player, playerId }: { player: PlayerData, playerId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState(player.name || "");
  const [age, setAge] = useState(player.age ? player.age.toString() : "");
  const [height, setHeight] = useState(player.height || "");
  const [province, setProvince] = useState(player.province || "");
  const [teamId, setTeamId] = useState(player.team_id || "");
  const [category, setCategory] = useState(player.division || "");
  const [description, setDescription] = useState("");
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(player.photo || null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      let photoUrl = photoPreview; 

      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `fotos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("jogadores") 
          .upload(filePath, photo);

        if (uploadError) throw new Error("Erro upload imagem: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("jogadores")
          .getPublicUrl(filePath);

        photoUrl = publicUrlData.publicUrl;
      }

      const updatedData = {
        name: name,
        team_id: teamId,
        age: parseInt(age, 10),
        height: height,
        province: province,
        division: category,
        photo: photoUrl,
        initials: name.substring(0, 2).toUpperCase(),
      };

      const { error: updateError } = await supabase
        .from("players")
        .update(updatedData)
        .eq('id', playerId); 

      if (updateError) throw new Error(updateError.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["player", playerId] });
      navigate("/admin/jogadores"); 
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !teamId || !age) {
      setError("Por favor, preencha os campos obrigatórios.");
      return;
    }
    updateMutation.mutate();
  };

  const formData = { photo, photoPreview, name, age, province, teamId, category, height, description, error };
  const actions = { setName, setAge, setProvince, setTeamId, setCategory, setHeight, setDescription, handlePhotoChange, handleSubmit };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Editar Jogador"
          subtitle={`A atualizar as informações de ${name}`}
          backTo="/admin/jogadores" 
        />

        <PlayerForm 
          formData={formData} 
          actions={actions} 
          isSubmitting={updateMutation.isPending} 
        />
      </div>
    </div>
  );
}