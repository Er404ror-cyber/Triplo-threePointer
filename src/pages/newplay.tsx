import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Calendar,
  MapPin,
  Shield,
  Ruler,
  FileText,
} from "lucide-react";
import { ALL_TEAMS } from "./t_equipas"; // ajuste o caminho conforme onde t_esqupas.tsx está salvo

const MAX_FIELD_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 60;

export default function NewPlayer() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [province, setProvince] = useState("Maputo");
  const [teamId, setTeamId] = useState("");
  const [category, setCategory] = useState("Sénior");
  const [height, setHeight] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !age.trim() || !teamId || !height.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const selectedTeam = ALL_TEAMS.find((t) => t.id === teamId);

    const newPlayer = {
      name,
      age: Number(age),
      province,
      teamId,
      teamName: selectedTeam?.name || "",
      category,
      height,
      description,
      photoName: photo?.name || null,
    };

    // TODO: substituir por chamada real ao Supabase (insert na tabela de jogadores + upload da foto)
    console.log("Novo jogador:", newPlayer);

    navigate("/admin/jogadores");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="rounded-xl bg-white p-3 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Novo Jogador
              </h1>

              <p className="text-sm text-slate-500">
                Adicione um novo atleta ao sistema.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">

          {/* Formulário */}
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">

            <div className="space-y-6">

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Nome */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Nome do Jogador
                  </label>
                  <span className="text-xs text-slate-400">{name.length}/{MAX_FIELD_LENGTH}</span>
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={MAX_FIELD_LENGTH}
                    placeholder="Ex: João Mondlane"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Idade */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Idade
                  </label>
                  <span className="text-xs text-slate-400">{age.length}/{MAX_FIELD_LENGTH}</span>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                    maxLength={MAX_FIELD_LENGTH}
                    placeholder="20"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Província */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Província
                </label>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                  >
                    <option>Maputo</option>
                    <option>Gaza</option>
                    <option>Inhambane</option>
                    <option>Sofala</option>
                    <option>Manica</option>
                    <option>Tete</option>
                    <option>Zambézia</option>
                    <option>Nampula</option>
                    <option>Cabo Delgado</option>
                    <option>Niassa</option>
                  </select>
                </div>
              </div>

              {/* Equipa — agora usa ALL_TEAMS, as mesmas equipas já cadastradas */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Equipa
                </label>

                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione a equipa</option>
                    {ALL_TEAMS.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Categoria
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Sénior</option>
                  <option>Juvenil</option>
                  <option>Sub-18</option>
                  <option>Sub-16</option>
                  <option>Feminino</option>
                </select>
              </div>

              {/* Altura */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Altura
                  </label>
                  <span className="text-xs text-slate-400">{height.length}/{MAX_FIELD_LENGTH}</span>
                </div>

                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    maxLength={MAX_FIELD_LENGTH}
                    placeholder="1.92 m"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Descrição
                  </label>
                  <span className="text-xs text-slate-400">{description.length}/{MAX_DESCRIPTION_LENGTH}</span>
                </div>

                <div className="relative">
                  <FileText
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    placeholder="Descrição do jogador..."
                    className="w-full resize-none rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-4">

                <Link
                  to="/admin/dashboard"
                  className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <Save size={18} />
                  Guardar Jogador
                </button>

              </div>

            </div>

          </div>

          {/* Upload da Foto */}
          <div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold text-slate-800">
                Foto do Jogador
              </h2>

              <label className="relative flex h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-blue-500 hover:bg-blue-50">

                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Pré-visualização do jogador"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-4 opacity-0 transition hover:bg-black/40 hover:opacity-100">
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700">
                        Clique para trocar
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={42} className="mb-4 text-slate-400" />

                    <p className="font-semibold text-slate-700">
                      Clique para carregar uma foto
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      PNG, JPG ou JPEG
                    </p>
                  </>
                )}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>

              {photo && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {photo.name}
                </div>
              )}

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}