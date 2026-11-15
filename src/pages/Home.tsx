import { EsportsHeroSection } from '../components/EsportsHeroSection';
import { NewsGridSection } from '../components/NewsGridSection';
import { ShopBannerSection } from '../components/ShopBannerSection';
import { EsportsFooter } from '../components/EsportsFooter';
import { Header } from '../components/header/header';

export default function EsportsLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200 font-sans">
      <Header />
      <EsportsHeroSection />
      <NewsGridSection />
     <ShopBannerSection />
      <EsportsFooter />
    </div>
  );
}