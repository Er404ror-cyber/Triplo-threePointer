import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Importa a biblioteca
import { Header } from '../components/header/header';
import { MatchHero } from '../components/pub_jogadores/MatchHero'; 
import { ExclusiveGallery } from '../components/pub_jogadores/ExclusiveGallery';
import type { Jogador } from '../components/pub_jogadores/ExclusiveGallery'; 
import { FeaturedClubs } from '../components/pub_jogadores/FeaturedClubs';

// 1. Configura o Supabase (fora do componente)
// 1. Este é o URL exato do teu projeto (retirado da tua barra de endereço)
const supabaseUrl = 'https://bqguccwgarcenwdfgogv.supabase.co';

// 2. Clica no botão de copiar ao lado da "Publishable key" e cola-a aqui
const supabaseKey = 'sb_publishable_NgRtAr6H5EttO4jgYvmH-g_cMbb9tv_'; // Substitui pelos ... o resto da chave completa

const supabase = createClient(supabaseUrl, supabaseKey);
export default function PublicJogadores() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  useEffect(() => {
    const fetchJogadores = async () => {
      // 2. O Supabase-js faz o pedido de forma simples
     const { data, error } = await supabase
  .from('players') 
  .select('*');

      if (error) {
        console.error("Erro do Supabase:", error.message);
        return;
      }

      // Se tudo correr bem, guarda os dados
      if (data) {
        setJogadores(data);
      }
    };

    fetchJogadores();
  }, []);

  return (
    <div className="bg-[#090b10] font-sans text-white overflow-x-hidden">
      <Header />
      <MatchHero />
      <ExclusiveGallery jogadores={jogadores} />
      <FeaturedClubs />
    </div>
  );
}