import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import PageHeader from "../components/PageHeader";
import PlayerForm from "../components/PlayerForm";

// Função que analisa a imagem e devolve uma cor hexadecimal que combina para o banner
function extractBannerColor(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Redimensiona para 50x50 para a análise ser instantânea
      canvas.width = 50;
      canvas.height = 50;

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return resolve("#1e293b"); // Fallback cinzento-escuro
      }

      ctx.drawImage(img, 0, 0, 50, 50);
      const imageData = ctx.getImageData(0, 0, 50, 50).data;

      let rTotal = 0,
        gTotal = 0,
        bTotal = 0,
        count = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Ignora píxeis transparentes (logos em PNG)
        if (a < 128) continue;

        // Ignora píxeis quase 100% brancos (geralmente fundo de imagens JPEG)
        if (r > 245 && g > 245 && b > 245) continue;

        rTotal += r;
        gTotal += g;
        bTotal += b;
        count++;
      }

      URL.revokeObjectURL(objectUrl);

      // Se a imagem for toda branca ou transparente, sugere cinzento-escuro
      if (count === 0) return resolve("#334155");

      let rAvg = Math.round(rTotal / count);
      let gAvg = Math.round(gTotal / count);
      let bAvg = Math.round(bTotal / count);

      // Calcula o brilho (luminância) da cor extraída (0 = preto, 255 = branco)
      const brightness = (rAvg * 299 + gAvg * 587 + bAvg * 114) / 1000;

      // CASO 1: A foto é preta ou muito escura -> transforma em cinzento-escuro suave
      if (brightness < 35) {
        rAvg = Math.min(255, rAvg + 45);
        gAvg = Math.min(255, gAvg + 45);
        bAvg = Math.min(255, bAvg + 52); // Leve toque azulado/ardósia moderno
      }
      // CASO 2: A foto é muito clara -> escurece a cor para o texto branco do banner aparecer bem
      else if (brightness > 175) {
        rAvg = Math.round(rAvg * 0.6);
        gAvg = Math.round(gAvg * 0.6);
        bAvg = Math.round(bAvg * 0.6);
      }

      // Converte o RGB ajustado para Hexadecimal (ex: #2d2d34)
      const toHex = (n: number) => n.toString(16).padStart(2, "0");
      const suggestedHex = `#${toHex(rAvg)}${toHex(gAvg)}${toHex(bAvg)}`;

      resolve(suggestedHex);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve("#1e293b");
    };
  });
}

export default function NewPlayer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTeamId = searchParams.get("teamId") || "";
  const queryClient = useQueryClient();

  // 1. Estados do Formulário
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [province, setProvince] = useState("");
  const [teamId, setTeamId] = useState(preselectedTeamId);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Imagem e Cor do Banner
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [headerColor, setHeaderColor] = useState("#2563eb");
  const [error, setError] = useState<string | null>(null);

  // 2. Captura a imagem escolhida e analisa a cor automaticamente
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));

      const suggestedColor = await extractBannerColor(file);
      setHeaderColor(suggestedColor);
    }
  };

  // 3. Mutação para Upload + Insert na Base de Dados
  const submitMutation = useMutation({
    mutationFn: async () => {
      let photoUrl = null;

      // A) Fazer Upload da imagem para o Supabase Storage (se houver foto)
      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `fotos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("jogadores")
          .upload(filePath, photo);

        if (uploadError)
          throw new Error("Erro ao fazer upload da imagem: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("jogadores")
          .getPublicUrl(filePath);

        photoUrl = publicUrlData.publicUrl;
      }

      // B) Preparar os dados exatos para a tabela 'players'
      const playerData = {
        name: name,
        team_id: teamId,
        age: parseInt(age, 10),
        height: height,
        province: province,
        division: category,
        photo: photoUrl,
        initials: name.substring(0, 2).toUpperCase(),
        active: true,
        is_top_5: false,
      };

      // C) Inserir na base de dados
      const { error: insertError } = await supabase
        .from("players")
        .insert([playerData]);

      if (insertError)
        throw new Error("Erro ao salvar jogador: " + insertError.message);
    },
    onSuccess: () => {
      // Atualiza o cache da lista de jogadores e dos detalhes da equipa
      queryClient.invalidateQueries({ queryKey: ["players-list"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: ["team-details-dashboard", teamId] });
      }
      navigate("/admin/jogadores");
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  // 4. Submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !teamId || !age) {
      setError("Por favor, preencha os campos obrigatórios (Nome, Idade e Equipa).");
      return;
    }

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
    headerColor,
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
    setHeaderColor,
    handlePhotoChange,
    handleSubmit,
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Novo Jogador"
          subtitle="Adicione um novo atleta ao sistema."
          backTo="/admin/jogadores"
        />

        {/* Pré-visualização da cor do banner sugerida pela foto */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <label className="text-sm font-semibold text-slate-800">
              Cor de Destaque da Foto (Sugerida automaticamente)
            </label>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm"
              />
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                {headerColor}
              </span>
            </div>

            <div
              className="flex h-11 flex-1 items-center justify-between rounded-xl px-5 text-white shadow-inner transition-colors duration-300"
              style={{ backgroundColor: headerColor }}
            >
              <span className="text-sm font-bold tracking-tight">
                {name || "Pré-visualização do Perfil do Atleta"}
              </span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                {category || "Categoria"}
              </span>
            </div>
          </div>
        </div>

        <PlayerForm
          formData={formData}
          actions={actions}
          isSubmitting={submitMutation.isPending}
        />
      </div>
    </div>
  );
}