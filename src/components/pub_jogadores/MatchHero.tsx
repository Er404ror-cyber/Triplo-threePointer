import { useEffect, useState } from 'react';
import { useTranslate } from '../../context/LanguageProvider'; // Ajuste o caminho
import { supabase } from '../../lib/supabaseClient'; // Ajuste o caminho do seu cliente Supabase

// ---- Configuração da base de dados (ajuste se os nomes forem diferentes) ----
const PLAYERS_TABLE = 'players';
const TEAMS_TABLE = 'teams';
const TEAM_NAME_COLUMN = 'name'; // coluna com o nome da equipa
const TEAM_SCORE_COLUMN = 'points'; // coluna usada para ordenar o ranking (ex: 'points', 'wins', 'score')
const PLAYER_PHOTO_BUCKET = 'players'; // bucket do Storage para fotos dos jogadores
const TEAM_PHOTO_BUCKET = 'teams'; // bucket do Storage para emblemas/logos dos clubes
const TOP_LIMIT = 3;

type PlayerRow = {
  id: number;
  name: string;
  position: string | null;
  photo: string | null;
  team_id: string | null;
  top_5_order: number | null;
};

type TopPlayer = PlayerRow & {
  teamName: string;
  imageUrl: string;
};

type TopTeam = {
  id: string;
  name: string;
  score: number | null;
  logoUrl: string;
};

type Status = 'loading' | 'ready' | 'error';

// Linha de equipa com colunas desconhecidas (lida com select('*'))
type TeamRecord = Record<string, unknown> & { id: string };

function readTeamName(row: TeamRecord): string {
  return String(row[TEAM_NAME_COLUMN] ?? '');
}

function readTeamScore(row: TeamRecord): number | null {
  const value = row[TEAM_SCORE_COLUMN];
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

// Resolução genérica de imagens (URL externo ou Supabase Storage Bucket)
function resolveStorageUrl(pathOrUrl: string | null | undefined, bucket: string): string {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }
  return supabase.storage.from(bucket).getPublicUrl(pathOrUrl).data.publicUrl;
}

// Tenta identificar o campo de imagem do clube (crest_url, logo_url, logo, photo, etc.)
function readTeamLogo(row: TeamRecord): string {
  const logoValue = (row.crest_url || row.logo_url || row.logo || row.photo || row.image) as string | undefined;
  return resolveStorageUrl(logoValue, TEAM_PHOTO_BUCKET);
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function teamTag(name: string): string {
  const short = initials(name);
  return short.length > 1 ? short : name.slice(0, 2).toUpperCase();
}

// Hook: Melhores Jogadores
function useTopPlayers() {
  const [players, setPlayers] = useState<TopPlayer[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from(PLAYERS_TABLE)
        .select('id, name, position, photo, team_id, top_5_order')
        .eq('is_top_5', true)
        .order('top_5_order', { ascending: true, nullsFirst: false })
        .limit(TOP_LIMIT);

      if (cancelled) return;
      if (error) {
        console.error('Erro ao carregar melhores jogadores:', error);
        setStatus('error');
        return;
      }

      const rows = (data ?? []) as PlayerRow[];

      // Procura as equipas pelos team_id dos jogadores
      const teamIds = Array.from(
        new Set(rows.map((r) => r.team_id).filter((id): id is string => !!id)),
      );
      const teamNames = new Map<string, string>();

      if (teamIds.length > 0) {
        const { data: teams, error: teamsError } = await supabase
          .from(TEAMS_TABLE)
          .select('*')
          .in('id', teamIds);

        if (teamsError) {
          console.error('Erro ao carregar equipas dos jogadores:', teamsError);
        }

        ((teams ?? []) as TeamRecord[]).forEach((team) =>
          teamNames.set(team.id, readTeamName(team)),
        );
      }

      if (cancelled) return;
      setPlayers(
        rows.map((row) => ({
          ...row,
          teamName: row.team_id ? teamNames.get(row.team_id) ?? '' : '',
          imageUrl: resolveStorageUrl(row.photo, PLAYER_PHOTO_BUCKET),
        })),
      );
      setStatus('ready');
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { players, status };
}

// Hook: Melhores Equipas (com logos resolvidos)
function useTopTeams() {
  const [teams, setTeams] = useState<TopTeam[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase.from(TEAMS_TABLE).select('*');

      if (cancelled) return;
      if (error) {
        console.error('Erro ao carregar melhores equipas:', error);
        setStatus('error');
        return;
      }

      const rows = (data ?? []) as TeamRecord[];

      const mapped: TopTeam[] = rows.map((row) => ({
        id: row.id,
        name: readTeamName(row),
        score: readTeamScore(row),
        logoUrl: readTeamLogo(row),
      }));

      const hasScores = mapped.some((team) => team.score !== null);

      mapped.sort((a, b) =>
        hasScores
          ? (b.score ?? -Infinity) - (a.score ?? -Infinity)
          : a.name.localeCompare(b.name),
      );

      setTeams(mapped.slice(0, TOP_LIMIT));
      setStatus('ready');
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { teams, status };
}

// Cor do emblema de fallback por posição no ranking de equipas
const TEAM_BADGES = ['bg-[#f59e0b]', 'bg-[#dc2626]', 'bg-[#6b7280]'];

// Estilo do pódio por posição
const PODIUM = [
  {
    avatar: 'bg-[#f59e0b] text-[#090b10]',
    block: 'h-20 sm:h-24 bg-[#f59e0b] text-[#090b10]',
  },
  {
    avatar: 'bg-[#dc2626] text-[#090b10]',
    block: 'h-16 sm:h-20 bg-[#0f131a] border border-[#3f1d24] text-[#dc2626]',
  },
  {
    avatar: 'bg-[#6b7280] text-[#090b10]',
    block: 'h-12 sm:h-16 bg-[#0f131a] border border-[#3f1d24] text-gray-400',
  },
];

// Ordem visual do pódio: 2.º, 1.º, 3.º
const PODIUM_ORDER = [1, 0, 2];

export function MatchHero() {
  const { t } = useTranslate();
  const { players, status: playersStatus } = useTopPlayers();
  const { teams, status: teamsStatus } = useTopTeams();
  const best = players[0];

  return (
    <section className="min-h-screen flex flex-col relative">
      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row px-6 lg:px-16 pt-24 lg:pt-32 pb-20 gap-16 lg:gap-24">
        {/* Coluna esquerda: ranking de equipas + título */}
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="bg-[#0f131a] rounded-2xl p-6 sm:p-8 w-full max-w-[480px] border border-white/5 shadow-xl"
            aria-labelledby="top-teams-title"
          >
            <h2
              id="top-teams-title"
              className="text-[11px] text-gray-400 font-medium mb-5 text-center uppercase tracking-wider"
            >
              {t('hero_top_teams_label')}
            </h2>

            {teamsStatus === 'loading' && (
              <div className="h-[196px] rounded-xl bg-[#090b10] motion-safe:animate-pulse" />
            )}

            {teamsStatus === 'error' && (
              <p className="text-[11px] text-gray-500 text-center">
                {t('hero_teams_error')}
              </p>
            )}

            {teamsStatus === 'ready' && teams.length === 0 && (
              <p className="text-[11px] text-gray-500 text-center">
                {t('hero_teams_empty')}
              </p>
            )}

            {teamsStatus === 'ready' && teams.length > 0 && (
              <ol className="flex flex-col gap-4">
                {teams.map((team, index) => (
                  <li key={team.id} className="flex items-center gap-4">
                    <span className="w-4 text-sm font-black text-gray-500">
                      {index + 1}
                    </span>

                    {/* Imagem do Clube ou Fallback com Sigla */}
                    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#141822] border border-white/10 shadow-md">
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-[#090b10] font-black text-xs ${TEAM_BADGES[index]}`}
                        >
                          {teamTag(team.name)}
                        </div>
                      )}
                    </div>

                    <span className="flex-1 text-sm text-white font-semibold truncate">
                      {team.name}
                    </span>

                    {team.score !== null && (
                      <span
                        className={`text-lg font-black ${
                          index === 0 ? 'text-[#f59e0b]' : 'text-white'
                        }`}
                      >
                        {team.score}
                        <span className="ml-1 text-[11px] font-medium text-gray-500">
                          {t('hero_points_unit')}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-white mt-16 tracking-tight leading-[1.05] uppercase max-w-[640px]">
            {t('hero_top_title')}
          </h1>
          <p className="text-gray-400 mt-6 text-sm sm:text-base max-w-md leading-relaxed pr-4">
            {t('hero_top_description')}
          </p>
        </div>

        {/* Coluna direita: imagem do melhor jogador + pódio */}
        <div className="flex-1 w-full min-h-[400px] lg:min-h-[600px] flex items-stretch py-4 lg:py-0">
          <div className="w-full h-full border border-[#3f1d24] rounded-[2rem] bg-transparent relative overflow-hidden flex flex-col gap-6 p-6 sm:p-8">
            <h2 className="text-[11px] text-gray-400 font-medium">
              {t('hero_top_players_label')}
            </h2>

            {/* Imagem principal do melhor jogador */}
            <figure className="relative flex-1 min-h-[240px] rounded-2xl overflow-hidden border border-[#3f1d24] bg-[#0f131a]">
              {playersStatus === 'loading' && (
                <div className="absolute inset-0 bg-[#0f131a] motion-safe:animate-pulse" />
              )}

              {playersStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[11px] text-gray-500">
                  {t('hero_error')}
                </div>
              )}

              {playersStatus === 'ready' && !best && (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[11px] text-gray-500">
                  {t('hero_empty')}
                </div>
              )}

              {best && best.imageUrl && (
                <img
                  src={best.imageUrl}
                  alt={best.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              )}

              {best && !best.imageUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="text-8xl font-black text-[#3f1d24] leading-none">
                    {initials(best.name)}
                  </span>
                  <span className="text-[11px] text-gray-500 text-center px-6">
                    {t('hero_image_placeholder')}
                  </span>
                </div>
              )}

              {best && (
                <figcaption className="absolute inset-x-0 bottom-0 px-5 pt-16 pb-5 bg-gradient-to-t from-[#090b10] via-[#090b10]/70 to-transparent">
                  <span className="block text-[11px] text-[#f59e0b] font-medium">
                    {t('hero_best_player')}
                  </span>
                  <span className="block text-2xl sm:text-3xl font-black text-white leading-tight">
                    {best.name}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {[best.teamName, best.position].filter(Boolean).join(' · ')}
                  </span>
                </figcaption>
              )}
            </figure>

            {/* Pódio compacto com fotos dos jogadores */}
            <ol className="flex items-end justify-center gap-3 sm:gap-5">
              {PODIUM_ORDER.filter((rank) => rank < players.length).map((rank) => {
                const player = players[rank];
                const style = PODIUM[rank];

                return (
                  <li
                    key={player.id}
                    className="flex flex-col items-center w-full max-w-[140px]"
                  >
                    <div
                      className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-black text-base border-2 border-white/10 ${style.avatar}`}
                    >
                      {player.imageUrl ? (
                        <img
                          src={player.imageUrl}
                          alt={player.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        initials(player.name)
                      )}
                    </div>
                    <span className="mt-2 text-white font-bold text-sm text-center truncate max-w-full px-1">
                      {player.name}
                    </span>
                    <span className="text-[11px] text-gray-500 text-center truncate max-w-full px-1">
                      {player.teamName}
                    </span>
                    <span className="mt-1 mb-2 text-xs font-semibold text-gray-300">
                      {player.position}
                    </span>

                    <div
                      className={`w-full rounded-t-xl flex items-start justify-center pt-2 text-2xl sm:text-3xl font-black leading-none ${style.block}`}
                    >
                      {rank + 1}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 left-6 lg:left-16 flex gap-3 text-[10px] font-bold text-gray-600 tracking-[0.25em] uppercase">
        {t('gallery_eyebrow')}
      </footer>
    </section>
  );
}