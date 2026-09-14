import React from 'react';
import { Header } from '../components/header/header';
// Ajuste os caminhos abaixo conforme a pasta onde guardou os componentes que criámos!
import { MatchHero } from '../components/pub_jogadores/MatchHero'; 
import { ExclusiveGallery } from '../components/pub_jogadores/ExclusiveGallery';
import { FeaturedClubs } from '../components/pub_jogadores/FeaturedClubs';

export default function PublicJogadores() {
  return (
    <div className="bg-[#090b10] font-sans text-white overflow-x-hidden">
      {/* 1. Cabeçalho */}
      <Header />
      
      {/* 2. Secção do Placar e Texto Gigante */}
      <MatchHero />
      
      {/* 3. Secção da Galeria com Scroll Infinito */}
      <ExclusiveGallery />
      
      {/* 4. Secção dos Clubes e Banner World Cup */}
      <FeaturedClubs />
    </div>
  );
}