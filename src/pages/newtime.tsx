import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function NewPlayer() {
  const [photo, setPhoto] = useState<File | null>(null);

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

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Formulário */}
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">

            <div className="space-y-6">

              {/* Nome */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nome do Jogador
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    placeholder="Ex: João Mondlane"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Idade */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Idade
                </label>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="number"
                    placeholder="20"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
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

                  <select className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500">
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

              {/* Equipa */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Equipa
                </label>

                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <select className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500">
                    <option>Selecione a equipa</option>
                    <option>Ferroviário de Maputo</option>
                    <option>Costa do Sol</option>
                    <option>Maxaquene</option>
                    <option>Beira</option>
                  </select>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Categoria
                </label>

                <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Sénior</option>
                  <option>Juvenil</option>
                  <option>Sub-18</option>
                  <option>Sub-16</option>
                  <option>Feminino</option>
                </select>
              </div>

              {/* Altura */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Altura
                </label>

                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                  <input
                    type="text"
                    placeholder="1.92 m"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Descrição
                </label>

                <div className="relative">
                  <FileText
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />

                  <textarea
                    rows={6}
                    placeholder="Descrição do jogador..."
                    className="w-full resize-none rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-4">

                <button className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100">
                  Cancelar
                </button>

                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
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

              <label className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-blue-500 hover:bg-blue-50">

                <Upload size={42} className="mb-4 text-slate-400" />

                <p className="font-semibold text-slate-700">
                  Clique para carregar uma foto
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  PNG, JPG ou JPEG
                </p>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhoto(e.target.files?.[0] || null)
                  }
                />
              </label>

              {photo && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {photo.name}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}