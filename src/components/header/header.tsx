import { Bird, ChevronDown,  Info,  Phone,  Users } from "lucide-react";
import LanguageSwitcher from "../../i18n/buttom";

const NAV_LINKS = ['Home', 'Publications', 'Admin'];

export const Header = () =>{
    return(
        <>
      <header className="fixed left-1/2 top-4 z-50 w-[94%] max-w-7xl -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a0e14]/70  transition-all duration-300 hover:border-blue-400/40 hover:shadow-[0_0_35px_8px_rgba(56,120,255,0.35)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
              <span className="text-xs text-slate-300">V</span>
            </div>
            <span className="text-lg text-slate-300 tracking-widest">VXG</span>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-bold tracking-widest text-slate-300 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className={`flex items-center  uppercase transition-colors hover:text-white ${
                  link === 'News' ? 'text-white' : ''
                }`}
              >
                {link}
                {(link === 'Teams' || link === 'More') && <ChevronDown size={12} />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6 text-slate-300">
            <LanguageSwitcher />
            <Info size={16} className="cursor-pointer hover:text-white" />
            <Phone size={16} className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </header>

      </>
    )
}