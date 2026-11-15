import  { useRef, useEffect } from 'react';

export interface Jogador {
  id: string | number;
  photo?: string | null;
  name: string;
  category: string; // "sénior" | "juvenil"
}

interface ExclusiveGalleryProps {
  jogadores: Jogador[];
}

const getInitials = (name: string) => {
  if (!name) return '';
  const names = name.trim().split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const normalize = (str: string) =>
  str
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') || '';

function JogadorCard({ jogador }: { jogador: Jogador }) {
  const isSenior = normalize(jogador.category) === 'senior';

  return (
    <div className="snap-center shrink-0 w-64 h-80 relative rounded-lg overflow-hidden bg-gray-800">
      <div
        className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
          isSenior ? 'bg-blue-600 text-white' : 'bg-amber-500 text-black'
        }`}
      >
        {jogador.category}
      </div>

      {jogador.photo ? (
        <img
          src={jogador.photo}
          alt={`Foto de ${jogador.name}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 hover:scale-105 transition-transform duration-300">
          <span className="text-6xl font-bold text-gray-500 opacity-50">
            {getInitials(jogador.name)}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <p className="font-semibold text-lg">{jogador.name}</p>
      </div>
    </div>
  );
}

interface CategoryRowProps {
  title: string;
  jogadores: Jogador[];
  direction: 'right' | 'left'; // direção do auto-scroll
}

function CategoryRow({ title, jogadores, direction }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const CARD_WIDTH = 256 + 16; // w-64 (256px) + gap-4 (16px)

  // Posição inicial: seniores começam no início (esquerda),
  // juvenis começam já deslocados para a direita (para poderem "voltar" da direita para a esquerda)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (direction === 'left') {
      // Começa logo à esquerda e vai avançando para a direita antes de inverter o loop
      el.scrollLeft = 0;
    } else {
      el.scrollLeft = 0;
    }
  }, [direction, jogadores.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || jogadores.length === 0) return;

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (direction === 'right') {
        // Sénior: avança para a direita, ao chegar ao fim reinicia do início
        if (el.scrollLeft >= maxScroll - 5) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
        }
      } else {
        // Juvenil: avança para a esquerda, ao chegar ao fim (scrollLeft = 0) reinicia do fim
        if (el.scrollLeft <= 5) {
          el.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
        }
      }
    }, 3000); // <-- Alterado de 2000 para 4000 (4 segundos)

    return () => clearInterval(interval);
  }, [direction, jogadores.length]);

  if (jogadores.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold mb-4 px-4 text-gray-200">{title}</h3>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x scroll-smooth"
      >
        {jogadores.map((jogador) => (
          <JogadorCard key={jogador.id} jogador={jogador} />
        ))}
      </div>
    </div>
  );
}

export function ExclusiveGallery({ jogadores = [] }: ExclusiveGalleryProps) {
  const seniores = jogadores.filter((j) => normalize(j.category) === 'senior');
  const juvenis = jogadores.filter((j) => normalize(j.category) === 'juvenil');

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Galeria Exclusiva</h2>

      <CategoryRow title="Séniores" jogadores={seniores} direction="right" />
      <CategoryRow title="Juvenis" jogadores={juvenis} direction="left" />
    </section>
  );
}