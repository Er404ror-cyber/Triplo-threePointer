import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import LanguageSwitcher from '../context/buttom';
import { BlocksIcon, ExternalLink, LogOut, Navigation, Shield, Users } from 'lucide-react';

interface AdminLayoutProps {
  session: any;
}



export default function AdminLayout({ session }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-5 font-bold text-xl border-b border-slate-800 flex justify-between items-center">
          <span>Admin Panel</span>
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <Navigation size={20} />
            <span>{t('nav.publications')}</span>
          </Link>

          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition" 
            onClick={() => setIsSidebarOpen(false)}
          >    
            <BlocksIcon size={20} /> 
            <span>{t('dashboard')}</span>
          </Link>

          <Link 
            to="/admin/jogadores" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users size={20} />
            <span>{t('Jogadores')}</span>
          </Link>
       
          <Link 
            to="/admin/equipas" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <Shield size={20} />
            <span>{t('Equipas')}</span>
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition text-slate-400"
          >
            <ExternalLink size={20} />
            <span>Voltar ao Site</span>
          </Link>
        </nav>

        {/* Informações do utilizador conectado e botão de Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/50">
          <div className="text-xs text-slate-400 truncate">
            Logado como: <br />
            <span className="text-white font-medium">{session?.user?.email}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 p-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Sair da Conta</span>
          </button>
          <div className="pt-2 border-t border-slate-800/60">
            <LanguageSwitcher />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b sticky top-0 z-30">
          <button className="md:hidden p-2 rounded-lg bg-gray-100" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <div className="hidden md:block font-semibold text-lg">{t('nav.admin')}</div>
          <div className="md:hidden"><LanguageSwitcher /></div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}