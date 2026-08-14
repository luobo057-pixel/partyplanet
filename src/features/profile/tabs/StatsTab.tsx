import type { GameStat } from '@/types/profile';
import { GAME_TYPE_LABELS } from '@/services/mocks/roomData';
import { GAME_ICON_MAP } from '@/shared/config/gameIcons';
import { Icon } from '@/shared/components/Icon';

interface StatsTabProps {
  stats: GameStat[];
}

/**
 * Stats tab — per-game win rate, rank, streak.
 */
export function StatsTab({ stats }: StatsTabProps) {
  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-white/40">
        <Icon name="trophy" size={48} className="mb-2 text-white/20" />
        <p className="text-sm">No games played yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stats.map((stat) => {
        const winRate = stat.totalGames > 0 ? Math.round((stat.wins / stat.totalGames) * 100) : 0;
        return (
          <div key={stat.gameType} className="glass p-4">
            {/* Header */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <Icon name={GAME_ICON_MAP[stat.gameType]} size={24} className="text-white/90" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{GAME_TYPE_LABELS[stat.gameType]}</p>
                <p className="text-xs text-white/40">{stat.tier}</p>
              </div>
              <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                {stat.rankPoints} RP
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <MiniStat label="Games" value={stat.totalGames} />
              <MiniStat label="Wins" value={stat.wins} />
              <MiniStat label="Win%" value={`${winRate}%`} />
              <MiniStat label="Streak" value={stat.bestStreak} highlight={stat.bestStreak >= 5} />
            </div>

            {/* Win rate bar */}
            <div className="mt-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-brand-400 to-accent-400"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white/5 py-2">
      <span className={`text-base font-bold ${highlight ? 'text-amber-400' : 'text-white/90'}`}>
        {value}
      </span>
      <span className="text-micro text-white/40">{label}</span>
    </div>
  );
}
