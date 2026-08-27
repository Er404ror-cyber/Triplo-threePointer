import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Shield, MapPin, Layers, Calendar, FileText, Palette, Loader2 } from "lucide-react";
import TextField from "./TextField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import ImageUploadCard from "./ImageUploadCard";
import ErrorAlert from "./ErrorAlert";
import { MAX_FIELD_LENGTH, MAX_DESCRIPTION_LENGTH } from "../types/useTeamForm";

const CLOUDINARY_CLOUD_NAME = "askrxqnj"; 
const CLOUDINARY_UPLOAD_PRESET = "basket_teams"; 
const CLOUDINARY_FOLDER = "teams"; 

const PROVINCES = ["Maputo (Cidade)", "Maputo (Província)", "Gaza", "Inhambane", "Sofala", "Manica", "Tete", "Zambézia", "Nampula", "Cabo Delgado", "Niassa"];
const DIVISIONS = ["Moçambola", "Divisão de Honra", "1ª Divisão", "2ª Divisão", "3ª Divisão", "Liga Amadora", "Formação"];
const PRESET_COLORS = [
  { name: "Azul", value: "#2563eb" }, { name: "Vermelho", value: "#dc2626" },
  { name: "Azul Petróleo", value: "#0e7490" }, { name: "Roxo", value: "#7c3aed" },
  { name: "Verde Escuro", value: "#047857" }, { name: "Amarelo/Dourado", value: "#d97706" },
  { name: "Grafite", value: "#334155" },
];

interface TeamFormProps {
  formData: {
    crest: File | null; crestPreview: string | null; name: string;
    city: string; division: string; founded: string; description: string;
    headerColor?: string; error: string | null;
  };
  actions: {
    setName: (val: string) => void; setCity: (val: string) => void; setDivision: (val: string) => void;
    setFounded: (val: string) => void; setDescription: (val: string) => void; setHeaderColor: (val: string) => void;
    handleCrestChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmitData: (data: { logoUrl: string | null }) => Promise<void>; 
  };
  isEditing?: boolean; 
}

export default function TeamForm({ formData, actions, isEditing = false }: TeamFormProps) {
  const navigate = useNavigate();
  
  const { crest, crestPreview, name, city, division, founded, description, headerColor = "#2563eb", error: parentError } = formData;
  const { setName, setCity, setDivision, setFounded, setDescription, setHeaderColor, handleCrestChange, onSubmitData } = actions;

  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [debouncedPreview, setDebouncedPreview] = useState({ name, city, founded, division });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedPreview({ name, city, founded, division }), 500);
    return () => clearTimeout(handler);
  }, [name, city, founded, division]);

  const handleColorChange = (newColor: string) => {
    const isValidHex = /^#[0-9A-F]{6}$/i.test(newColor);
    if (isValidHex) {
      setHeaderColor(newColor);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const data = new FormData();
      data.append("file", file); 
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); 
      data.append("folder", CLOUDINARY_FOLDER); 
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error("Erro no upload: " + JSON.stringify(errData));
      }
      const result = await response.json();
      return result.secure_url as string;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      throw new Error("Falha ao carregar a imagem na nuvem: " + errorMessage, { cause: err });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim()) return setLocalError("O nome da equipa é obrigatório.");
    if (!city) return setLocalError("Selecione uma província.");
    if (!division) return setLocalError("Selecione uma divisão.");
    if (!/^#[0-9A-F]{6}$/i.test(headerColor)) return setLocalError("Cor inválida.");
    
    if (founded) {
      const year = parseInt(founded, 10);
      if (year < 1800 || year > new Date().getFullYear()) return setLocalError("Ano inválido.");
    } else {
      return setLocalError("Ano de fundação é obrigatório.");
    }

    setIsSubmitting(true);
    try {
      let logoUrl: string | null = null;
      if (crest) {
        logoUrl = await uploadToCloudinary(crest);
      }
      await onSubmitData({ logoUrl });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado.";
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || parentError;

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
      <div className="w-full rounded-2xl bg-white p-5 sm:p-8 shadow-sm border border-slate-100 lg:col-span-2">
        <div className="space-y-6">
          {displayError && <ErrorAlert message={displayError} />}
          
          <TextField label="Nome da Equipa" icon={Shield} value={name} onChange={setName} placeholder="Ex: Ferroviário" maxLength={MAX_FIELD_LENGTH} showCounter required disabled={isSubmitting} />
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Palette size={16} className="text-slate-500" /> Cor de Destaque
            </label>
            <div className="rounded-xl border border-slate-200 p-3 sm:p-4 bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-1.5 shadow-sm">
                  <input type="color" value={headerColor} onChange={(e) => handleColorChange(e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0" disabled={isSubmitting} />
                  <input type="text" value={headerColor} onChange={(e) => handleColorChange(e.target.value)} className="w-20 font-mono text-xs uppercase font-semibold text-slate-700 focus:outline-none" maxLength={7} disabled={isSubmitting} />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {PRESET_COLORS.map((item) => (
                    <button key={item.value} type="button" onClick={() => handleColorChange(item.value)} style={{ backgroundColor: item.value }} disabled={isSubmitting} className={`h-8 w-8 rounded-full transition-transform hover:scale-110 active:scale-95 ${headerColor.toLowerCase() === item.value.toLowerCase() ? "ring-2 ring-blue-600 ring-offset-2 scale-110" : ""}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <SelectField label="Província" icon={MapPin} value={city} onChange={setCity} options={PROVINCES} disabled={isSubmitting} />
            <SelectField label="Divisão" icon={Layers} value={division} onChange={setDivision} options={DIVISIONS} disabled={isSubmitting} />
          </div>
          
          <TextField label="Ano de Fundação" icon={Calendar} value={founded} onChange={setFounded} placeholder="Ex: 1976" maxLength={4} required inputMode="numeric" numericOnly disabled={isSubmitting} />
          <TextAreaField label="Descrição" icon={FileText} value={description} onChange={setDescription} placeholder="Breve história..." maxLength={MAX_DESCRIPTION_LENGTH} disabled={isSubmitting} />
          
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
            <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting} className={`w-full text-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 sm:w-auto ${isSubmitting ? 'opacity-50' : ''}`}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400 sm:w-auto active:scale-[0.98]">
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> A guardar...</> : <><Save size={18} /> {isEditing ? "Atualizar Equipa" : "Guardar Equipa"}</>}
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full space-y-5">
        <ImageUploadCard title="Escudo da Equipa" file={crest} previewUrl={crestPreview} onChange={handleCrestChange} />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 w-full p-4 transition-colors duration-500 flex items-start justify-between text-white text-xs font-semibold" style={{ backgroundColor: headerColor }}>
            <span className="rounded bg-black/40 px-2 py-1"># Destaque</span>
            <span className="rounded bg-black/40 px-2 py-1">{debouncedPreview.division || "Divisão"}</span>
          </div>
          <div className="relative p-5 pt-0 space-y-3">
            <div className="-mt-10 mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-slate-100 shadow-sm">
              {crestPreview ? <img src={crestPreview} alt="Escudo" className="h-full w-full object-contain p-1" /> : <Shield size={24} className="text-slate-400" />}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg leading-tight transition-all">{debouncedPreview.name || "Nome da Equipa"}</p>
              <p className="text-sm text-slate-500 mt-1 transition-all">{debouncedPreview.city || "Província"} {debouncedPreview.founded ? `• Fundado em ${debouncedPreview.founded}` : ""}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}