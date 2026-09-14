import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface EquipaSupabase {
  id?: string | number;
  name?: string;
  nome?: string;
  equipa?: string;
  initials?: string;
  sigla?: string;
  color?: string;
  cor?: string;
  // O 'any' foi removido daqui e trocado por tipos seguros:
  [key: string]: string | number | boolean | null | undefined; 
}

export default function FullStandings() {
  const [equipas, setEquipas] = useState<EquipaSupabase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarEquipasDoSupabase() {
      try {
        setLoading(true);
        const SUPABASE_URL = 'https://bqguccwgarcenwdfgogv.supabase.co/rest/v1/teams?select=*';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZ3VjY3dnYXJjZW53ZGZnb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjMxMjMsImV4cCI6MjA5ODQ5OTEyM30.PFZm8FMkOnb8vuNGgS_sMFZfl_67bpQk1d0EviG1UPI';

        const response = await fetch(SUPABASE_URL, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const textData = await response.text();
        if (!response.ok) throw new Error(`Erro: ${textData}`);
        setEquipas(JSON.parse(textData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    carregarEquipasDoSupabase();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-100 p-6 lg:p-10 font-sans text-slate-900">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classificação Completa</h1>
          <p className="text-slate-500">Campeonato Nacional · Época 2025/26</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/dashboard" className="px-4 py-2 bg-white text-slate-700 font-medium rounded-lg shadow hover:bg-slate-50 transition">
            Voltar ao Dashboard
          </Link>
          <Link to="/admin/equipas" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            Gerir Equipas
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {loading && <div className="text-slate-500">A carregar...</div>}
        {error && <div className="text-red-500">Erro: {error}</div>}
        {!loading && !error && (
          <table className="w-full text-sm text-left">
            <thead className="text-slate-400 border-b border-slate-100">
              <tr>
                <th className="pb-3">EQUIPA</th>
                <th className="pb-3 text-center">PTS</th>
              </tr>
            </thead>
            <tbody>
              {equipas.map((equipa, index) => (
                <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-4 font-medium text-slate-700 flex items-center gap-3">
                     <div 
                        className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: equipa.color || equipa.cor || '#2563eb' }}
                      >
                        {String(equipa.initials || equipa.sigla || 'EQ')}
                      </div>
                    {String(equipa.name || equipa.nome || 'Desconhecida')}
                  </td>
                  <td className="py-4 text-center font-bold text-slate-900">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}