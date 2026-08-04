import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/header';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow mx-auto w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>© 2026 AppContent. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}