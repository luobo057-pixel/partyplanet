import type { Player } from '@/types';
import type { GameStat } from '@/types/profile';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { CurrencyBadge } from '@/shared/components/CurrencyBadge';

/**
 * Profile hero — centered identity section.
 *
 * Spacious layout: large avatar, nickname + level, inline stats,
 * currencies and edit pill all in one calm column.
 */

interface ProfileHeaderProps {
  player: Player;
  stats: GameStat[];
}

export function ProfileHeader({ player, stats }: ProfileHeaderProps) {
  const totalGames = stats.reduce((s, g) => s + g.totalGames, 0);
  const totalWins = stats.reduce((s, g) => s + g.wins, 0);

  return (
    <section className="relative overflow-hidden pb-1 pt-10 text-center">
      {/* 背景光晕装饰 */}
      <div className="absolute left-1/2 top-4 h-44 w-60 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center">
        {/* 头像 */}
        <SimpleAvatar
          nickname={player.nickname}
          config={player.avatar}
          size={96}
          circle
          ring="online"
        />

        {/* 昵称 + 等级 */}
        <div className="mt-3 flex items-center gap-2">
          <h1 className="text-xl font-bold">{player.nickname}</h1>
          <span className="rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-micro font-bold leading-none text-night-900">
            Lv.{player.level ?? 1}
          </span>
        </div>

        {/* ID */}
        <p className="mt-1 text-micro text-white/40">
          ID {player.id.slice(0, 10)}
        </p>

        {/* 内联统计：Games / Wins / Friends */}
        <div className="mt-5 flex items-center">
          <Stat value={totalGames} label="Games" />
          <Divider />
          <Stat value={totalWins} label="Wins" />
          <Divider />
          <Stat value={0} label="Friends" />
        </div>

        {/* 资产 */}
        <div className="mt-5 flex items-center gap-2">
          <CurrencyBadge icon="coin" value={player.coins ?? 0} iconColor="text-amber-400" />
          <CurrencyBadge icon="gem" value={player.gems ?? 0} iconColor="text-violet-400" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-4">
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-micro text-white/40">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="h-6 w-px bg-white/10" />;
}
