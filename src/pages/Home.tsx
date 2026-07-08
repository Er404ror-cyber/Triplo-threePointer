import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl">
        Bem-vindo à nossa Plataforma
      </h1>
      <p className="mt-6 text-lg text-slate-600 max-w-2xl">
        Explore publicações de treinos, eventos, calendários e novidades gerais com suporte multimédia completo.
      </p>
      <div className="mt-10">
        <Link to="/publicacoes" className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 transition complex-shadow">
          {t('nav.publications')}
        </Link>
      </div>
    </div>
  );
}