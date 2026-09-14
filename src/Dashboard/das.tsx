import { Topbar } from '../components/dasboard/Topbar';
import { WelcomeBanner } from '../components/dasboard/WelcomeBanner';
import { StatCardsList } from '../components/dasboard/StatCardsList';
import { QuickActions } from '../components/dasboard/QuickActions';
// O import correto sem as chaves (default)
import StandingsTable from '../components/dasboard/StandingsTable';
import { UpcomingGames } from '../components/dasboard/UpcomingGames';
import { TopScorers } from '../components/dasboard/TopScorers';
import { RecentActivityList } from '../components/dasboard/RecentActivityList'

export default function Dash() {
  return (
    <div className="min-h-screen w-full bg-slate-100 font-sans text-slate-900">
      <main className="w-full px-6 py-8 lg:px-10">
        
        <Topbar />
        <WelcomeBanner />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          
          {/* Coluna Esquerda */}
          <div className="space-y-6 xl:col-span-2">
            <QuickActions />
            
            {/* AQUI ESTÁ A TABELA! É isto que estava a faltar para o aviso sumir */}
            <StandingsTable />
            
            <UpcomingGames />
          </div>
          
          <StatCardsList />

          {/* Coluna Direita */}
          <div className="space-y-6">
            <TopScorers />
            <RecentActivityList />
          </div>
          
        </div>

      </main>
    </div>
  );
}