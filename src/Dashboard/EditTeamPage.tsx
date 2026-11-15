import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import TeamForm from "../components/TeamForm";
import { useTeamForm } from "../types/useTeamForm";
import toast from "react-hot-toast";

// PASSO 1: Função que analisa a imagem e devolve uma cor hexadecimal que combina para o banner
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

export default function EditTeamPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setInitialData(data);
      } catch (error) {
        console.error("Erro ao carregar equipa:", error);
        toast.error("Equipa não encontrada.");
        navigate("/admin/equipas");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <button
          onClick={() => navigate("/admin/equipas")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Editar Equipa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Atualize as informações do {initialData?.name}
          </p>
        </div>
      </div>

      {/* Passa o ID e os dados para o Form wrapper */}
      {initialData && <EditFormWrapper id={id!} initialData={initialData} />}
    </div>
  );
}

// Sub-componente com os Passos 2 e 3 integrados
function EditFormWrapper({ id, initialData }: { id: string; initialData: any }) {
  const { formData, actions } = useTeamForm(id, initialData);

  // Estado local da cor do banner (inicia com a cor atual da equipa ou azul padrão)
  const [headerColor, setHeaderColor] = useState<string>(
    (formData as any)?.header_color ||
      (formData as any)?.headerColor ||
      initialData?.header_color ||
      "#2563eb"
  );

  // Sincroniza a nova cor com o hook useTeamForm e garante que seja salva no Supabase
  const applyBannerColor = (newColor: string) => {
    setHeaderColor(newColor);

    const a = actions as any;
    // Tenta atualizar a cor nas funções mais comuns do seu hook useTeamForm
    if (typeof a.setHeaderColor === "function") a.setHeaderColor(newColor);
    if (typeof a.handleColorChange === "function") a.handleColorChange(newColor);
    if (typeof a.setFieldValue === "function") a.setFieldValue("header_color", newColor);
    if (typeof a.handleChange === "function") {
      a.handleChange({ target: { name: "header_color", value: newColor } });
      a.handleChange({ target: { name: "headerColor", value: newColor } });
    }
  };

  // PASSO 2: Interceta qualquer input de ficheiro dentro do formulário para analisar a foto automaticamente
  const handleContainerFileChange = async (e: React.ChangeEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement;
    if (target && target.type === "file" && target.files?.[0]) {
      const file = target.files[0];
      const suggestedColor = await extractBannerColor(file);
      applyBannerColor(suggestedColor);

      // Também garante diretamente no Supabase que a cor sugerida fica guardada para esta equipa
      await supabase
        .from("teams")
        .update({ header_color: suggestedColor })
        .eq("id", id);

      toast.success(`Cor de banner sugerida: ${suggestedColor}`);
    }
  };

  // Quando o utilizador escolhe manualmente outra cor no seletor
  const handleManualColorChange = async (newColor: string) => {
    applyBannerColor(newColor);
    await supabase
      .from("teams")
      .update({ header_color: newColor })
      .eq("id", id);
  };

  return (
    <div className="space-y-6" onChange={handleContainerFileChange}>
      {/* PASSO 3: Seletor visual e Pré-visualização em tempo real do Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600" />
          <label className="text-sm font-semibold text-slate-800">
            Cor do Banner (Sugerida automaticamente ao escolher uma foto)
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={headerColor}
              onChange={(e) => handleManualColorChange(e.target.value)}
              className="h-11 w-16 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm"
            />
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
              {headerColor}
            </span>
          </div>

          {/* Pré-visualização rápida do banner */}
          <div
            className="flex h-12 flex-1 items-center justify-between rounded-xl px-5 text-white shadow-inner transition-colors duration-300"
            style={{ backgroundColor: headerColor }}
          >
            <span className="text-sm font-bold tracking-tight">
              {initialData?.name || "Pré-visualização do Banner"}
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
              {initialData?.division || "Divisão"}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário original */}
      <TeamForm
        formData={{
          ...formData,
          header_color: headerColor,
          headerColor: headerColor,
        }}
        actions={actions}
      />
    </div>
  );
}