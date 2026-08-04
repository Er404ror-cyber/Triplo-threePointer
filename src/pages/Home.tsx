import { EsportsHeroSection } from '../components/EsportsHeroSection';
import { NewsGridSection } from '../components/NewsGridSection';
import { TeamsSection } from '../components/TeamsSection';
import { ShopBannerSection } from '../components/ShopBannerSection';
import { EsportsFooter } from '../components/EsportsFooter';

export default function EsportsLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200 font-sans">
      <EsportsHeroSection />
      <NewsGridSection />
      <TeamsSection />
      <ShopBannerSection />
      <EsportsFooter />
    </div>
  );
}