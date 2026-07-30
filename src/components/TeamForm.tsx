import { Link } from "react-router-dom";
import { Save, Shield, MapPin, Layers, Calendar, FileText } from "lucide-react";

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

interface TeamFormProps {
  formData: {
    crest: File | null;
    crestPreview: string | null;
    name: string;
    city: string;
    division: string;
    founded: string;
    description: string;
    error: string | null;
  };
  actions: {
    setName: (val: string) => void;
    setCity: (val: string) => void;
    setDivision: (val: string) => void;
    setFounded: (val: string) => void;
    setDescription: (val: string) => void;
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
    error,
  } = formData;

  const {
    setName,
    setCity,
    setDivision,
    setFounded,
    setDescription,
    handleCrestChange,
    handleSubmit,
  } = actions;

  return (
    // 💡 FLEX-COL no mobile (um abaixo do outro) / GRID só a partir do ecrã grande (lg:)
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

          {/* 💡 Nos ecrãs móveis fica 1 coluna, no computador fica lado a lado */}
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

          {/* Botões ocupam 100% da largura no telemóvel */}
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

      {/* Upload do Escudo (Fica por baixo do formulário no telemóvel) */}
      <div className="w-full">
        <ImageUploadCard
          title="Escudo da Equipa"
          file={crest}
          previewUrl={crestPreview}
          onChange={handleCrestChange}
        />
      </div>
    </form>
  );
}