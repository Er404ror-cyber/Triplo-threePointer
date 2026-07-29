import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Shield,
  MapPin,
  Layers,
  Calendar,
  FileText,
} from "lucide-react";

const MAX_FIELD_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 60;

export default function NewTeam() {
  const navigate = useNavigate();

  const [crest, setCrest] = useState<File | null>(null);
  const [crestPreview, setCrestPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("Maputo");
  const [division, setDivision] = useState("1ª Divisão");
  const [founded, setFounded] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCrestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCrest(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCrestPreview(previewUrl);
    } else {
      setCrestPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !city.trim() || !founded.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const newTeam = {
      name,
      city,
      division,
      founded: Number(founded),
      description,
      crestName: crest?.name || null,
    };

    // TODO: substituir por chamada real ao Supabase (insert na tabela de equipas + upload do escudo)
    console.log("Nova equipa:", newTeam);

    navigate("/admin/equipas");
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
                Nova Equipa
              </h1>

              <p className="text-sm text-slate-500">
                Cadastre um novo clube no sistema.
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

              {/* Nome da equipa */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Nome da Equipa
                  </label>
                  <span className="text-xs text-slate-400">{name.length}/{MAX_FIELD_LENGTH}</span>
                </div>

                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={MAX_FIELD_LENGTH}
                    placeholder="Ex: Costa do Sol"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Cidade */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cidade
                </label>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                  >
                    <option>Maputo</option>
                    <option>Xai-Xai</option>
                    <option>Inhambane</option>
                    <option>Beira</option>
                    <option>Chimoio</option>
                    <option>Tete</option>
                    <option>Quelimane</option>
                    <option>Nampula</option>
                    <option>Pemba</option>
                    <option>Lichinga</option>
                  </select>
                </div>
              </div>

              {/* Divisão */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Divisão
                </label>

                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                  >
                    <option>1ª Divisão</option>
                    <option>2ª Divisão</option>
                  </select>
                </div>
              </div>

              {/* Ano de fundação */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Ano de Fundação
                  </label>
                  <span className="text-xs text-slate-400">{founded.length}/{MAX_FIELD_LENGTH}</span>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={founded}
                    onChange={(e) => setFounded(e.target.value.replace(/\D/g, ""))}
                    maxLength={MAX_FIELD_LENGTH}
                    placeholder="1949"
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
                    placeholder="Descrição da equipa..."
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
                  Guardar Equipa
                </button>

              </div>

            </div>

          </div>

          {/* Upload do Escudo */}
          <div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold text-slate-800">
                Escudo da Equipa
              </h2>

              <label className="relative flex h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-blue-500 hover:bg-blue-50">

                {crestPreview ? (
                  <>
                    <img
                      src={crestPreview}
                      alt="Pré-visualização do escudo"
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
                      Clique para carregar um escudo
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
                  onChange={handleCrestChange}
                />
              </label>

              {crest && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {crest.name}
                </div>
              )}

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}