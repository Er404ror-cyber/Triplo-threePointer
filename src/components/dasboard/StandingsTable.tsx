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

export default function StandingsTable() {
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

  if (loading) return <div className="p-6 bg-white rounded-xl shadow text-slate-500">A carregar classificação...</div>;
  if (error) return <div className="p-6 bg-white text-red-500 rounded-xl shadow font-semibold">Erro: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Classificação</h2>
          <p className="text-sm text-slate-500">Campeonato Nacional · Época 2025/26</p>
        </div>
        
        <Link to="/admin/equipas" className="text-orange-500 text-sm font-semibold hover:underline">
  Gerir equipas &gt;
</Link>
      </div>

      <div className="w-full">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-400 border-b border-slate-100">
            <tr>
              <th className="pb-3 font-medium">#</th>
              <th className="pb-3 font-medium">EQUIPA</th>
              <th className="pb-3 font-medium text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            {equipas.map((equipa, index) => (
              <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="py-3 text-slate-500">{index + 1}</td>
                <td className="py-3 flex items-center gap-3 font-medium text-slate-700">
                  <div 
                    className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: equipa.color || equipa.cor || '#2563eb' }}
                  >
                    {String(equipa.initials || equipa.sigla || 'EQ')}
                  </div>
                  {String(equipa.name || equipa.nome || 'Desconhecida')}
                </td>
                <td className="py-3 text-center font-bold text-slate-900">0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}