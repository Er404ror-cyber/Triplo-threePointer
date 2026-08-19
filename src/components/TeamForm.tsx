import { useState } from "react";
import { Link } from "react-router-dom";
import { Save, Shield, MapPin, Layers, Calendar, FileText, Palette, Check } from "lucide-react";

import TextField from "./TextField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import ImageUploadCard from "./ImageUploadCard";
import ErrorAlert from "./ErrorAlert";
import { MAX_FIELD_LENGTH, MAX_DESCRIPTION_LENGTH } from "../types/useTeamForm";

const CITIES = [
  "Maputo", "Xai-Xai", "Inhambane", "Beira", "Chimoio", 
  "Tete", "Quelimane", "Nampula", "Pemba", "Lichinga",
];

const DIVISIONS = ["1ª Divisão", "2ª Divisão"];

const PRESET_COLORS = [
  { name: "Azul", value: "#2563eb" },
  { name: "Vermelho", value: "#dc2626" },
  { name: "Azul Petróleo", value: "#0e7490" },
  { name: "Roxo", value: "#7c3aed" },
  { name: "Verde Escuro", value: "#047857" },
  { name: "Amarelo/Dourado", value: "#d97706" },
  { name: "Grafite", value: "#334155" },
];

interface TeamFormProps {
  formData: {
    crest: File | null;
    crestPreview: string | null;
    name: string;
    city: string;
    division: string;
    founded: string;
    description: string;
    headerColor?: string;
    error: string | null;
  };
  actions: {
    setName: (val: string) => void;
    setCity: (val: string) => void;
    setDivision: (val: string) => void;
    setFounded: (val: string) => void;
    setDescription: (val: string) => void;
    setHeaderColor?: (val: string) => void;
    handleCrestChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
  };
}

export default function TeamForm({ formData, actions }: TeamFormProps) {
  const {
    crest,
    crestPreview,
    name,
    city,
    division,
    founded,
    description,
    headerColor = "#2563eb",
    error,
  } = formData;

  const {
    setName,
    setCity,
    setDivision,
    setFounded,
    setDescription,
    setHeaderColor,
    handleCrestChange,
    handleSubmit,
  } = actions;

  // Estado local para garantir que a cor muda instantaneamente no ecrã
  const [currentColor, setCurrentColor] = useState<string>(headerColor || "#2563eb");
  const [justConfirmed, setJustConfirmed] = useState<boolean>(false);

  // Manipulador para alterar cor
  const handleColorChange = (newColor: string, isConfirm = false) => {
    setCurrentColor(newColor);
    setHeaderColor?.(newColor);

    if (isConfirm) {
      setJustConfirmed(true);
      setTimeout(() => setJustConfirmed(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Bloco dos Campos */}
      <div className="w-full rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-sm lg:col-span-2">
        <div className="space-y-4 sm:space-y-6">
          {error && <ErrorAlert message={error} />}

          <TextField
            label="Nome da Equipa"
            icon={Shield}
            value={name}
            onChange={setName}
            placeholder="Ex: Costa do Sol"
            maxLength={MAX_FIELD_LENGTH}
            showCounter
            required
          />

          {/* Seletor de Cor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Palette size={16} className="text-slate-500" />
                Cor do Topo do Cartão
              </label>
              <span className="text-xs font-medium text-slate-400">
                Cor ativa: <strong style={{ color: currentColor }}>{currentColor}</strong>
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-3">
                {/* Input color livre */}
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-1.5 shadow-sm">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-20 font-mono text-xs uppercase font-semibold text-slate-700 focus:outline-none"
                    maxLength={7}
                  />
                </div>

                {/* Paleta rápida */}
                <div className="flex flex-wrap gap-2 items-center">
                  {PRESET_COLORS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      title={item.name}
                      onClick={() => handleColorChange(item.value, true)}
                      style={{ backgroundColor: item.value }}
                      className={`h-7 w-7 rounded-full transition-all hover:scale-110 ${
                        currentColor.toLowerCase() === item.value.toLowerCase()
                          ? "ring-2 ring-blue-600 ring-offset-2 scale-110"
                          : ""
                      }`}
                    />
                  ))}
                </div>

                {/* Botão de Confirmar Cor */}
                <button
                  type="button"
                  onClick={() => handleColorChange(currentColor, true)}
                  className={`ml-auto flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 active:scale-95 ${
                    justConfirmed
                      ? "bg-emerald-600 ring-2 ring-emerald-300"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  <Check size={14} className={justConfirmed ? "animate-bounce" : ""} />
                  {justConfirmed ? "Confirmada!" : "Confirmar Cor"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <SelectField
              label="Cidade"
              icon={MapPin}
              value={city}
              onChange={setCity}
              options={CITIES}
            />

            <SelectField
              label="Divisão"
              icon={Layers}
              value={division}
              onChange={setDivision}
              options={DIVISIONS}
            />
          </div>

          <TextField
            label="Ano de Fundação"
            icon={Calendar}
            value={founded}
            onChange={setFounded}
            placeholder="1949"
            maxLength={MAX_FIELD_LENGTH}
            showCounter
            required
            inputMode="numeric"
            numericOnly
          />

          <TextAreaField
            label="Descrição"
            icon={FileText}
            value={description}
            onChange={setDescription}
            placeholder="Descrição da equipa..."
            maxLength={MAX_DESCRIPTION_LENGTH}
          />

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
            <Link
              to="/admin/dashboard"
              className="w-full text-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 sm:w-auto"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              <Save size={18} />
              Guardar Equipa
            </button>
          </div>
        </div>
      </div>

      {/* Pré-visualização do Cartão */}
      <div className="w-full space-y-4">
        <ImageUploadCard
          title="Escudo da Equipa"
          file={crest}
          previewUrl={crestPreview}
          onChange={handleCrestChange}
        />

        {/* Card em tempo real */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
          <div
            className="h-20 w-full p-4 transition-colors duration-300 flex items-start justify-between text-white text-xs font-semibold"
            style={{ backgroundColor: currentColor }}
          >
            <span className="rounded bg-black/20 px-2 py-0.5 backdrop-blur-sm"># Destaque</span>
            <span className="rounded bg-black/20 px-2 py-0.5 backdrop-blur-sm">{division || "1ª Divisão"}</span>
          </div>

          <div className="relative p-4 pt-2 space-y-2">
            <div className="-mt-10 mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-slate-100 shadow-md">
              {crestPreview ? (
                <img src={crestPreview} alt="Escudo" className="h-full w-full object-cover" />
              ) : (
                <Shield size={24} className="text-slate-400" />
              )}
            </div>

            <div>
              <p className="font-bold text-slate-900 text-base">{name || "Nome da Equipa"}</p>
              <p className="text-xs text-slate-500">
                {city || "Maputo, MZ"} • Fundado em {founded || "----"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}