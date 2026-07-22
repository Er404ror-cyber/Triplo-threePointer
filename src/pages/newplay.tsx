import {
  Shield,
  Upload,
  Save,
  ArrowLeft,
  Users,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { useState } from "react";

import { Link } from "react-router-dom";

export default function Newplay() {
  const [logo, setLogo] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
   <Link
  to="/admin/dashboard"
  className="rounded-xl bg-white p-3 shadow-sm transition hover:bg-slate-50 text-slate-700"
>
  <ArrowLeft size={18} />
</Link>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Nova Equipa
              </h1>
              <p className="text-sm text-slate-500">
                Adicione uma nova equipa ao sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Formulário */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm">

            <div className="space-y-6">

              {/* Nome */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nome da equipa
                </label>

                <div className="relative">
                  <Shield
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Ex: Ferroviário de Maputo"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
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

              {/* Cidade */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cidade
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Maputo"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Treinador */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Treinador
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Nome do treinador"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Membros */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Número de membros
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    placeholder="15"
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
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    rows={6}
                    placeholder="Descrição da equipa..."
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
                  Guardar equipa
                </button>

              </div>

            </div>

          </div>

          {/* Upload Logo */}
          <div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold text-slate-800">
                Logo da Equipa
              </h2>

              <label className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-blue-500 hover:bg-blue-50">

                <Upload
                  size={42}
                  className="mb-4 text-slate-400"
                />

                <p className="font-semibold text-slate-700">
                  Clique para carregar
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  PNG, JPG ou SVG
                </p>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setLogo(e.target.files?.[0] || null)
                  }
                />
              </label>

              {logo && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {logo.name}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}