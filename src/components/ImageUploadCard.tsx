import { Upload } from "lucide-react";

interface ImageUploadCardProps {
  title: string;
  file: File | null;
  previewUrl: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadLabel?: string;
  hintText?: string;
}

export default function ImageUploadCard({
  title,
  file,
  previewUrl,
  onChange,
  uploadLabel = "Clique para carregar um escudo",
  hintText = "PNG, JPG ou JPEG",
}: ImageUploadCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-slate-800">{title}</h2>

      <label className="relative flex h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-blue-500 hover:bg-blue-50">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Pré-visualização"
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
            <p className="font-semibold text-slate-700">{uploadLabel}</p>
            <p className="mt-2 text-xs text-slate-400">{hintText}</p>
          </>
        )}

        <input hidden type="file" accept="image/*" onChange={onChange} />
      </label>

      {file && (
        <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
          {file.name}
        </div>
      )}
    </div>
  );
}
