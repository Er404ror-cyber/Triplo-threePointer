import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient"; // Ajusta para o teu ficheiro do supabase

import PageHeader from "../components/PageHeader";
import PlayerForm from "../components/PlayerForm";

export default function NewPlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Estados do Formulário
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [province, setProvince] = useState("");
  const [teamId, setTeamId] = useState("");
  const [category, setCategory] = useState(""); // Vamos mapear isto para a coluna "division"
  const [description, setDescription] = useState(""); // Não tens coluna p/ isto na DB, mas podes ignorar ou enviar p/ tags
  
  // Imagem
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 2. Lógica para capturar a imagem escolhida
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // 3. A Mutação que faz o trabalho pesado (Upload + Insert na Base de Dados)
  const submitMutation = useMutation({
    mutationFn: async () => {
      let photoUrl = null;

      // A) Fazer Upload da imagem para o Supabase Storage (se houver foto)
      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `fotos/${fileName}`;

        // NOTA: Precisas ter um bucket criado no Supabase chamado 'jogadores'
        const { error: uploadError } = await supabase.storage
          .from("jogadores") 
          .upload(filePath, photo);

        if (uploadError) throw new Error("Erro ao fazer upload da imagem: " + uploadError.message);

        // Obter o URL público da imagem carregada
        const { data: publicUrlData } = supabase.storage
          .from("jogadores")
          .getPublicUrl(filePath);

        photoUrl = publicUrlData.publicUrl;
      }

      // B) Preparar os dados exatos para a tua tabela 'player'
      const playerData = {
        name: name,
        team_id: teamId, // UUID da equipa
        age: parseInt(age, 10), // Converte a string para número
        height: height,
        province: province,
        division: category, // A categoria do formulário vai para 'division'
        photo: photoUrl, // A foto real em URL
        initials: name.substring(0, 2).toUpperCase(), // Ex: João -> JO
        active: true,
        is_top_5: false,
      };

     // C) Inserir na base de dados
      const { error: insertError } = await supabase
        .from("players") // <--- ADICIONA O "s" AQUI
        .insert([playerData]);

      if (insertError) throw new Error("Erro ao salvar jogador: " + insertError.message);
    },
    onSuccess: () => {
      // Força a página de jogadores a atualizar com os novos dados
      queryClient.invalidateQueries({ queryKey: ["players"] });
      // Redireciona de volta para a página de jogadores
      navigate("/admin/jogadores"); // Ajusta para a rota correta onde listas os jogadores
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  // 4. A Função de submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação básica
    if (!name || !teamId || !age) {
      setError("Por favor, preencha os campos obrigatórios (Nome, Idade e Equipa).");
      return;
    }

    // Dispara a mutação
    submitMutation.mutate();
  };

  // 5. Estruturar os dados para passar ao PlayerForm
  const formData = {
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
  };

  const actions = {
    setName,
    setAge,
    setProvince,
    setTeamId,
    setCategory,
    setHeight,
    setDescription,
    handlePhotoChange,
    handleSubmit,
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Novo Jogador"
          subtitle="Adicione um novo atleta ao sistema."
          backTo="/admin/jogadores" // Ajusta a rota de "voltar"
        />

        <PlayerForm 
          formData={formData} 
          actions={actions} 
          isSubmitting={submitMutation.isPending} 
        />
      </div>
    </div>
  );
}