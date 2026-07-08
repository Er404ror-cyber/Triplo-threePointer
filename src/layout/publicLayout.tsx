import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../i18n/buttom';

export default function PublicLayout() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-slate-900">AppContent</Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium">{t('nav.home')}</Link>
            <Link to="/publicacoes" className="text-slate-600 hover:text-blue-600 font-medium">{t('nav.publications')}</Link>
            <Link to="/admin" className="text-slate-600 hover:text-blue-600 font-medium">{t('nav.admin')}</Link>
            <LanguageSwitcher />
          </div>
        </nav>
      </header>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>© 2026 AppContent. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}