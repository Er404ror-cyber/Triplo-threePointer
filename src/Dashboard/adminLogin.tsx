import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslate } from '../context/LanguageProvider';
import { ChevronLeft } from 'lucide-react';
import LanguageSwitcher from '../context/buttom';

export default function AdminLogin() {
  const { t } = useTranslate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bloqueio síncrono — evita duplo clique/toque antes do React re-renderizar
    if (isSubmittingRef.current || loading || cooldown > 0) return;
    isSubmittingRef.current = true;

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(t('invalid_credentials'));

      // Cooldown de 5s após erro, para evitar spam de tentativas
      setCooldown(5);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      navigate('/admin');
    }

    setLoading(false);
    isSubmittingRef.current = false;
  };

  const isBlocked = loading || cooldown > 0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* TOPO — bloco com imagem de fundo e curva. Texto só aparece no mobile. */}
      <div
        className="relative w-full bg-cover bg-center pt-14 pb-36 px-8 sm:px-16 md:pt-10 md:pb-50"
        style={{ backgroundImage: `url(/Gemini_Generated_Image_o0c917o0c917o0c9-2.png)` }}
      >
        {/* Camada escura para os ícones/textos ficarem legíveis sobre a imagem */}
        <div className="absolute inset-0 bg-black/10" aria-hidden />

        {/* Setas — canto superior esquerdo */}
        <Link
          to="/"
          className="absolute z-10 top-6 left-6 md:top-8 md:left-8 flex items-center gap-1 text-black hover:text-white/80 transition"
        >
          <ChevronLeft className='object-contain size-10 rounded-full bg-black/30' />
          <ChevronLeft className='object-contain size-10 text-black/70' />
          <ChevronLeft className='object-contain size-10 text-black/40' />
        </Link>

        {/* Botão de idioma — canto superior direito */}
        <div className="absolute z-10 top-6 right-6 md:top-8 md:right-8">
          <LanguageSwitcher />
        </div>

        {/* CURVA (onda) fazendo a transição para o branco */}
        <svg
          className="absolute bottom-0 left-0 w-full h-14 z-10"
          viewBox="0 0 500 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C125,80 375,-20 500,30 L500,60 L0,60 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* FUNDO BRANCO — no mobile: só o formulário. No desktop: formulário + texto ao lado direito */}
      <div className="flex-1 w-full flex flex-col justify-center px-8 sm:px-16 py-2">

        <div className="w-full max-w-sm md:max-w-none md:grid md:grid-cols-2 md:gap-16 md:items-center">

          {/* Texto de boas-vindas — só aparece no desktop, no espaço vazio à direita */}
          <div className="hidden md:block text-left pb-20">
            <p className="text-rose-500 text-xs font-medium tracking-wide">{t('admin')}</p>
            <h1 className="text-slate-900 text-4xl font-extrabold mt-2">{t('welcome')}</h1>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">
              {t('hero_description')}
            </p>
          </div>

          {/* Formulário — coluna esquerda no desktop */}
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-bold text-slate-900 text-left">{t('login')}</h2>
            <p className="text-sm text-slate-500 text-left mt-0.5 mb-6">
              {t('login_subtitle')}
            </p>

            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200 text-left">
                  {error}
                  {cooldown > 0 && (
                    <span className="block mt-1 text-red-400">
                      Tente novamente em {cooldown}s
                    </span>
                  )}
                </div>
              )}

              <div className="text-left">
                <label className="block text-xs font-medium text-slate-600 mb-1">{t('contact_email')}</label>
                <div className="relative">
                  <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email_placeholder')}
                    className="w-full bg-transparent border-0 border-b border-slate-300 pl-7 pr-2 py-2.5 text-sm text-left focus:ring-0 focus:border-rose-400 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-medium text-slate-600 mb-1">{t('password')}</label>
                <div className="relative">
                  <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password_placeholder')}
                    className="w-full bg-transparent border-0 border-b border-slate-300 pl-7 pr-2 py-2.5 text-sm text-left focus:ring-0 focus:border-rose-400 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start text-xs pt-1">
                <a href="#" className="text-rose-500 font-medium hover:text-rose-600">
                  {t('forgot_password')}
                </a>
              </div>

              <button
                type="submit"
                disabled={isBlocked}
                className="w-full flex items-center justify-end pt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="text-slate-900 font-medium text-sm pr-2">
                  {loading
                    ? t('authenticating')
                    : cooldown > 0
                    ? `${t('login')} (${cooldown}s)`
                    : t('login')}
                </span>
                <span className="w-11 h-11 rounded-full bg-linear-to-br from-black via-gray-300 to-gray-400 flex items-center justify-center shrink-0 transition group-hover:bg-rose-400">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}