import { Link, Outlet } from 'react-router-dom';
import { useTranslate } from '../context/LanguageProvider';

export default function PublicLayout() {
  const { t } = useTranslate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6f0] dark:bg-[#121316] text-stone-900 dark:text-[#eceae6]">

      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>

      {/* Rodapé Estruturado e Leve */}
      <footer className="w-full border-t border-[#e8e2d8] dark:border-[#242731] bg-[#f4f0e8]/50 dark:bg-[#0e0f12]/50 mt-12">
        <div className="max-w-[1560px] mx-auto px-4 lg:px-6 py-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs font-medium text-stone-500 dark:text-stone-400">
          
          {/* 1. Marca e Copyright */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-stone-800 dark:text-stone-200 tracking-tight text-sm">
              AppContent
            </span>
            <p>
              © {currentYear} AppContent. {t('footerAllRightsReserved')}
            </p>
          </div>

          {/* 2. Links Institucionais e Navegação */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              to="/about"
              className="hover:text-stone-900 dark:hover:text-white transition-colors duration-75"
            >
              {t('footerAbout')}
            </Link>
            <Link
              to="/privacy"
              className="hover:text-stone-900 dark:hover:text-white transition-colors duration-75"
            >
              {t('footerPrivacy')}
            </Link>
            <Link
              to="/terms"
              className="hover:text-stone-900 dark:hover:text-white transition-colors duration-75"
            >
              {t('footerTerms')}
            </Link>
            <Link
              to="/contact"
              className="hover:text-stone-900 dark:hover:text-white transition-colors duration-75"
            >
              {t('footerContact')}
            </Link>
          </nav>

        </div>
      </footer>
    </div>
  );
}