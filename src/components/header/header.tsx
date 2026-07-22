import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Info, Phone, Menu, X } from "lucide-react";
import LanguageSwitcher from "../../context/buttom";
import { useTranslate } from "../../context/LanguageProvider";

export const Header = () => {
  const { t } = useTranslate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const NAV_LINKS = [
    {
      label: "publications",
      to: "/publications",
    },
   
    {
      label: "jogadores",
      to: "/jogadores",
    },
    {
      label: "admin",
      to: "/admin/login",
    },
  ] as const;

  // Fecha o menu ao tocar/clicar fora do header
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Bloqueia o scroll da página enquanto o menu mobile estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed left-1/2 top-4 z-50 w-[94%] max-w-7xl -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a0e14]"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
            <span className="text-xs text-slate-300">O</span>
          </div>

          <span className="text-lg tracking-widest text-slate-300">
            T3P
          </span>
        </div>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-8 text-xs font-bold tracking-widest text-slate-300 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center uppercase text-slate-300 hover:text-white"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 text-slate-300">
          {/* Ícones extra só aparecem no desktop */}
          <div className="hidden items-center gap-6 md:flex">
            <LanguageSwitcher />
            <Info size={16} className="cursor-pointer hover:text-white" />
            <Phone size={16} className="cursor-pointer hover:text-white" />
          </div>

          {/* Botão hambúrguer — só em mobile */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            className="flex items-center justify-center rounded-full p-2 text-slate-300 hover:text-white md:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile — dropdown abaixo do header */}
      {isMenuOpen && (
        <nav className="flex flex-col gap-2 border-t border-white/10 px-6 py-5 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-4 text-sm font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white"
            >
              {t(link.label)}
            </Link>
          ))}

          <div className="mt-3 flex items-center gap-4 border-t border-white/10 px-3 pt-5 text-slate-300">
            <LanguageSwitcher />
            <a href="#" className="flex items-center gap-2 py-2 hover:text-white">
              <Info size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Info</span>
            </a>
            <a href="#" className="flex items-center gap-2 py-2 hover:text-white">
              <Phone size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Contato</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};