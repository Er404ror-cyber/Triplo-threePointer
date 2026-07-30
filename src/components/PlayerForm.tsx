import { Link } from "react-router-dom";
import { Save, User, Calendar, MapPin, Shield, Ruler, FileText } from "lucide-react";

import TextField from "./TextField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import ImageUploadCard from "./ImageUploadCard";
import ErrorAlert from "./ErrorAlert";
import {
  MAX_FIELD_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../types/useNewPlayerForm";
import { ALL_TEAMS } from "../pages/t_equipas";

const PROVINCES = [
  "Maputo", "Gaza", "Inhambane", "Sofala", "Manica",
  "Tete", "Zambézia", "Nampula", "Cabo Delgado", "Niassa",
];

const CATEGORIES = ["Sénior", "Juvenil", "Sub-18", "Sub-16", "Feminino"];

interface PlayerFormProps {
  formData: {
    photo: File | null;
    photoPreview: string | null;
    name: string;
    age: string;
    province: string;
    teamId: string;
    category: string;
    height: string;
    description: string;
    error: string | null;
  };
  actions: {
    setName: (val: string) => void;
    setAge: (val: string) => void;
    setProvince: (val: string) => void;
    setTeamId: (val: string) => void;
    setCategory: (val: string) => void;
    setHeight: (val: string) => void;
    setDescription: (val: string) => void;
    handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
  };
}

export default function PlayerForm({ formData, actions }: PlayerFormProps) {
  const {
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
  } = formData;

  const {
    setName,
    setAge,
    setProvince,
    setTeamId,
    setCategory,
    setHeight,
    setDescription,
    handlePhotoChange,
    handleSubmit,
  } = actions;

  const teamOptions = ALL_TEAMS.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  return (
    // 💡 FLEX-COL no mobile (tudo um debaixo do outro) / GRID só em computadores (lg:)
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Bloco Principal do Formulário */}
      <div className="w-full rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-sm lg:col-span-2">
        <div className="space-y-4 sm:space-y-6">
          {error && <ErrorAlert message={error} />}

          <TextField
            label="Nome do Jogador"
            icon={User}
            value={name}
            onChange={setName}
            placeholder="Ex: João Mondlane"
            maxLength={MAX_FIELD_LENGTH}
            showCounter
            required
          />

          {/* 💡 Um debaixo do outro no mobile, lado a lado em tablets/PC */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <TextField
              label="Idade"
              icon={Calendar}
              value={age}
              onChange={setAge}
              placeholder="20"
              maxLength={MAX_FIELD_LENGTH}
              showCounter
              required
              inputMode="numeric"
              numericOnly
            />

            <TextField
              label="Altura"
              icon={Ruler}
              value={height}
              onChange={setHeight}
              placeholder="1.92 m"
              maxLength={MAX_FIELD_LENGTH}
              showCounter
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <SelectField
              label="Província"
              icon={MapPin}
              value={province}
              onChange={setProvince}
              options={PROVINCES}
            />

            <SelectField
              label="Categoria"
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
            />
          </div>

          <SelectField
            label="Equipa"
            icon={Shield}
            value={teamId}
            onChange={setTeamId}
            options={teamOptions}
            placeholder="Selecione a equipa"
            required
          />

          <TextAreaField
            label="Descrição"
            icon={FileText}
            value={description}
            onChange={setDescription}
            placeholder="Descrição do jogador..."
            maxLength={MAX_DESCRIPTION_LENGTH}
          />

          {/* Botões adaptados ao ecrã móvel */}
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
              Guardar Jogador
            </button>
          </div>
        </div>
      </div>

      {/* Card da Foto */}
      <div className="w-full">
        <ImageUploadCard
          title="Foto do Jogador"
          file={photo}
          previewUrl={photoPreview}
          onChange={handlePhotoChange}
          uploadLabel="Clique para carregar uma foto"
        />
      </div>
    </form>
  );
}