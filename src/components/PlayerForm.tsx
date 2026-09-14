import { useState } from "react";
import { Link } from "react-router-dom";
import { Save, User, Calendar, MapPin, Shield, Ruler, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

import TextField from "./TextField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import ImageUploadCard from "./ImageUploadCard";
import ErrorAlert from "./ErrorAlert";

const PROVINCES = [
"Maputo", "Gaza", "Inhambane", "Sofala", "Manica",
"Tete", "Zambézia", "Nampula", "Cabo Delgado", "Niassa",
];

// Categorias atualizadas apenas com Sénior e Juvenil
const CATEGORIES = ["Sénior", "Juvenil"];

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
isSubmitting?: boolean;
}

export default function PlayerForm({ formData, actions, isSubmitting }: PlayerFormProps) {
const { photo, photoPreview, name, age, province, teamId, category, height, description, error } = formData;
const { setName, setAge, setProvince, setTeamId, setCategory, setHeight, setDescription, handlePhotoChange, handleSubmit } = actions;

// Estado local para exibir erros de validação antes do submit
const [localError, setLocalError] = useState<string | null>(null);

const { data: teams = [], isLoading: loadingTeams } = useQuery({
queryKey: ['teams'],
queryFn: async () => {
const { data, error } = await supabase.from('teams').select('id, name');
if (error) throw error;
return data;
}
});

const teamOptions = teams.map((team) => ({
label: team.name,
value: team.id,
}));

// --- NOME (Máximo 20 letras bloqueado ao digitar) ---
const handleNameChange = (val: string) => {
if (val.length <= 20) {
setName(val);
}
};

// --- IDADE (Apenas números, máximo 2 dígitos) ---
const handleAgeChange = (val: string) => {
const apenasNumeros = val.replace(/\D/g, '');
if (apenasNumeros.length <= 2) {
setAge(apenasNumeros);
}
};

// --- ALTURA (Auto-ponto) ---
const handleHeightChange = (val: string) => {
// Remove tudo o que não for número para reconstruir a string
const apenasNumeros = val.replace(/\D/g, '');

// Limita a 3 dígitos (ex: 240 para 2.40)
const numsLimitados = apenasNumeros.slice(0, 3);

let alturaFormatada = numsLimitados;

// Se tiver mais de 1 dígito, coloca o ponto logo após o primeiro dígito automaticamente
if (numsLimitados.length > 1) {
alturaFormatada = `${numsLimitados.slice(0, 1)}.${numsLimitados.slice(1)}`;
}

setHeight(alturaFormatada);
};

// --- DESCRIÇÃO (Máximo 5 parágrafos) ---
const handleDescriptionChange = (val: string) => {
const paragrafos = val.split('\n');
// Só atualiza o estado se tiver 5 ou menos parágrafos
if (paragrafos.length <= 5) {
setDescription(val);
}
};

// --- VALIDAÇÃO FINAL ANTES DE GUARDAR ---
const onFormSubmit = (e: React.FormEvent) => {
e.preventDefault();
setLocalError(null);

// Validar Nome (< 3 letras)
if (name.trim().length < 3) {
return setLocalError("O nome deve ter pelo menos 3 letras.");
}

// Validar Idade (< 16 ou > 60)
const ageNum = parseInt(age, 10);
if (!age || isNaN(ageNum) || ageNum < 16 || ageNum > 60) {
return setLocalError("A idade deve estar entre 16 e 60 anos.");
}

// Validar Altura (< 1.20 ou > 2.40)
const heightNum = parseFloat(height);
if (!height || isNaN(heightNum) || heightNum < 1.20 || heightNum > 2.40) {
return setLocalError("A altura deve estar entre 1.20m e 2.40m.");
}

// Se passar todas as validações, chama a função handleSubmit original
handleSubmit(e);
};

return (
<form onSubmit={onFormSubmit} className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
<div className="w-full rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-sm lg:col-span-2">
<div className="space-y-4 sm:space-y-6">
{/* Exibe erro local de validação ou o erro que vem da base de dados */}
{(localError || error) && <ErrorAlert message={localError || error || ''} />}

<TextField 
label="Nome do Jogador" 
icon={User} 
value={name} 
onChange={handleNameChange} 
placeholder="Ex: João Mondlane" 
maxLength={20} 
showCounter 
required 
/>

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
<TextField 
label="Idade" 
icon={Calendar} 
value={age} 
onChange={handleAgeChange}
placeholder="Ex: 24" 
maxLength={2} 
showCounter 
required 
inputMode="numeric" 
numericOnly 
/>

<TextField 
label="Altura (m)" 
icon={Ruler} 
value={height} 
onChange={handleHeightChange}
placeholder="Ex: 1.92" 
maxLength={4} // 1 dígito + ponto + 2 dígitos
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
label={loadingTeams ? "A carregar equipas..." : "Equipa"} 
icon={Shield} 
value={teamId} 
onChange={setTeamId} 
options={teamOptions} 
placeholder="Selecione a equipa" 
required 
/>

<TextAreaField 
label="Descrição (Máx. 5 Parágrafos)" 
icon={FileText} 
value={description} 
onChange={handleDescriptionChange} 
placeholder="Breve descrição do jogador..." 
// A restrição de tamanho de caracteres foi removida (maxLength)
// para dar prioridade à lógica de limite de parágrafos.
/>

<div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
<Link 
to="/admin/jogadores" 
className="w-full text-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 sm:w-auto"
>
Cancelar
</Link>

<button
type="submit"
disabled={isSubmitting}
className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
>
<Save size={18} />
{isSubmitting ? 'A Guardar...' : 'Guardar Jogador'}
</button>
</div>
</div>
</div>

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