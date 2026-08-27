import React, { useState } from "react";
import { Upload, AlertCircle, ImageIcon } from "lucide-react";

interface ImageUploadCardProps {
  title: string;
  file: File | null;
  previewUrl: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadLabel?: string;
  hintText?: string;
  maxSizeMB?: number; // Nova propriedade para controlo de tamanho
}

export default function ImageUploadCard({
  title,
  file,
  previewUrl,
  onChange,
  uploadLabel = "Clique para carregar um escudo",
  hintText = "PNG, JPG ou WEBP",
  maxSizeMB = 2, // Padrão de 2MB (ideal para logos e poupa dados móveis)
}: ImageUploadCardProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // 1. Validação de tipo (garante que é mesmo uma imagem)
      if (!selectedFile.type.startsWith("image/")) {
        setError("Por favor, selecione apenas ficheiros de imagem (PNG, JPG, etc).");
        e.target.value = ""; // Limpa o input
        return;
      }

      // 2. Validação de tamanho
      const sizeInMB = selectedFile.size / (1024 * 1024);
      if (sizeInMB > maxSizeMB) {
        setError(`A imagem é muito pesada (${sizeInMB.toFixed(1)}MB). O limite é ${maxSizeMB}MB.`);
        e.target.value = ""; // Limpa o input
        return;
      }
    }

    // Se passou nas validações, limpa o erro e passa para o componente pai
    setError(null);
    onChange(e);
  };

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">
      <h2 className="mb-4 text-base font-bold text-slate-800">{title}</h2>

      {/* Área de Upload */}
      <label className="relative flex h-56 sm:h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-blue-400 hover:bg-blue-50/50">
        {previewUrl ? (
          <>
            {/* object-contain é melhor para escudos para não cortar as bordas */}
            <img
              src={previewUrl}
              alt="Pré-visualização do escudo"
              className="h-full w-full object-contain p-4"
            />
            {/* Fundo escuro ao passar o rato por cima para indicar que pode ser alterado */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                <Upload size={16} />
                Trocar imagem
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400 transition-colors hover:text-blue-500">
              <ImageIcon size={32} />
            </div>
            <p className="text-sm font-semibold text-slate-700">{uploadLabel}</p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {hintText} (Max: {maxSizeMB}MB)
            </p>
          </div>
        )}

        {/* Input escondido */}
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/webp" 
          onChange={handleFileChange} 
          className="sr-only" // Melhor que 'hidden' para leitores de ecrã
        />
      </label>

      {/* Feedback de Erro */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Ficheiro selecionado (Sucesso) */}
      {file && !error && (
        <div className="mt-3 truncate rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 border border-emerald-100 text-center">
          Ficheiro carregado: {file.name}
        </div>
      )}
    </div>
  );
}