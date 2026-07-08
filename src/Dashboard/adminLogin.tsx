import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // <-- Instancia o hook

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Credenciais inválidas ou conta não autorizada.');
    } else {
      navigate('/admin'); // <-- Redireciona para o painel se der certo!
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">Painel de Administração</h2>
          <p className="mt-2 text-center text-sm text-slate-600">Acesso restrito a administradores</p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'A autenticar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}