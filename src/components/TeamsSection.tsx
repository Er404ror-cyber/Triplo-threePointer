import React, { useState, useEffect } from 'react';
import { useTranslate } from '../context/LanguageProvider';
import { createClient } from '@supabase/supabase-js';

// 1. Configura as tuas credenciais do Supabase
// (Usa as mesmas chaves que usaste na página dos jogadores)
const supabaseUrl = 'https://bqguccwgarcenwdfgogv.supabase.co';
const supabaseKey = 'sb_publishable_NgRtAr6H5EttO4jgYvmH-g_cMbb9tv_';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Cria a interface baseada na estrutura da tua tabela
export interface Equipa {
  id: string;
  name: string;
  province: string;
  division: string;
  founded: number;
  description: string;
  header_color: string;
  crest_url: string;
}

export const TeamsSection: React.FC = () => {
  const { t } = useTranslate();
  // Estado para armazenar as equipas vindas da base de dados
  const [equipas, setEquipas] = useState<Equipa[]>([]);

  // 3. Faz o fetch das equipas ao carregar o componente
  useEffect(() => {
    const fetchEquipas = async () => {
      // ⚠️ SUBSTITUI 'teams' PELO NOME EXATO DA TUA TABELA DE EQUIPAS
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (error) {
        console.error("Erro ao carregar equipas do Supabase:", error.message);
        return;
      }

      if (data) {
        setEquipas(data);
      }
    };

    fetchEquipas();
  }, []);

  // Se o teu 'crest_url' guardar apenas o nome do ficheiro (ex: logo.png) e não o link completo,
  // define aqui o URL base das imagens do teu bucket. Se já for o link completo, podes ignorar.
  const BASE_IMAGE_URL = 'https://teu-servidor-de-imagens.com/logos/';

  return (
    <section className="relative overflow-hidden bg-cover bg-center py-20">
      <div className="absolute inset-0 bg-[#070a10]/90" aria-hidden />

      <div className="absolute left-[50%] top-24">
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none h-30 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
          aria-hidden
        >
          <circle cx="100" cy="100" r="92" stroke="white" strokeWidth="4" fill="none" />
          <line x1="8" y1="100" x2="192" y2="100" stroke="white" strokeWidth="4" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="white" strokeWidth="4" />
          <path d="M 30 30 Q 100 100 30 170" stroke="white" strokeWidth="4" fill="none" />
          <path d="M 170 30 Q 100 100 170 170" stroke="white" strokeWidth="4" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl font-black md:text-4xl">{t('meet_our_teams')}</h2>
        <p className="mt-2 text-sm font-bold tracking-[0.25em] text-blue-400">
          {t('hashtag_vxgwin')}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* 4. Mapear as equipas da base de dados */}
          {equipas.map((team) => {
            // Verifica se o crest_url é um link completo ou precisa do base url
            const imageUrl = team.crest_url?.startsWith('http') 
              ? team.crest_url 
              : `${BASE_IMAGE_URL}${team.crest_url}`;

            return (
              <button
                key={team.id}
                className="group relative flex min-h-32.5 flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center px-4 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_0_25px_5px_rgba(56,120,255,0.45)] border-blue-500 shadow-[0_0_20px_4px_rgba(56,120,255,0.4)]"
                style={{ 
                  backgroundImage: team.crest_url ? `url(${imageUrl})` : 'none',
                  backgroundColor: team.header_color || '#1e293b' // Usa a cor do header como fallback
                }}
              >
                {/* Overlay escuro para garantir que o texto é legível por cima das imagens */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" aria-hidden />

                <span className="relative block z-10">
                  <span className="block wrap-break-word text-sm font-bold text-white line-clamp-1 bwrap-break-word">
                    {team.name}
                  </span>
                  <span className="block text-xs text-slate-300 mt-1">
                    {team.division} {team.province ? `• ${team.province}` : ''}
                  </span>
                </span>
              </button>
            );
          })}
          
        </div>
      </div>
    </section>
  );
};