import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../i18n/buttom';
import { Header } from '../components/header/header';

export default function PublicLayout() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header/>
      <main className="flex-grow max-w-7xl mx-auto w-full ">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>© 2026 AppContent. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}