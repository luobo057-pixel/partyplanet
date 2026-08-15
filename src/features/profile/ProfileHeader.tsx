import { useNavigate } from 'react-router-dom';
import type { Player } from '@/types';
import type { GameStat } from '@/types/profile';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { CurrencyBadge } from '@/shared/components/CurrencyBadge';
import { useFriendCount } from '@/stores/useFriendsStore';

/**
 * Profile hero — identity only, with generous breathing room.
 *
 * Identity (avatar / name / level / ID) + lifetime stats + currencies.
 * Per-game details live in the tabs below — no duplication here.
 */

interface ProfileHeaderProps {
  player: Player;
  stats: GameStat[];
}

export function ProfileHeader({ player, stats }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const totalGames = stats.reduce((s, g) => s + g.totalGames, 0);
  const totalWins = stats.reduce((s, g) => s + g.wins, 0);
  const friendCount = useFriendCount();

  return (
    <section className="relative overflow-hidden pb-8 pt-12 text-center">
      {/* 背景光晕 */}
      <div className="absolute left-1/2 top-6 h-48 w-64 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center px-6">
        {/* 身份 */}
        <SimpleAvatar
          nickname={player.nickname}
          config={player.avatar}
          size={88}
          circle
          ring="online"
        />
        <div className="mt-4 flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{player.nickname}</h1>
          <span className="rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-micro font-bold leading-none text-night-900">
            Lv.{player.level ?? 1}
          </span>
        </div>
        <p className="mt-1.5 text-micro uppercase tracking-[0.18em] text-white/30">
          ID {player.id.slice(0, 10)}
        </p>

        {/* 生涯统计 */}
        <div className="mt-7 flex items-center">
          <Stat value={totalGames} label="Games" />
          <Divider />
          <button onClick={() => navigate('/friends')} className="transition active:scale-95">
            <Stat value={friendCount} label="Friends" />
          </button>
          <Divider />
          <Stat value={totalWins} label="Wins" />
        </div>

        {/* 资产 */}
        <div className="mt-6 flex items-center gap-2.5">
          <CurrencyBadge icon="coin" value={player.coins ?? 0} iconColor="text-amber-400" />
          <CurrencyBadge icon="gem" value={player.gems ?? 0} iconColor="text-violet-400" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[72px] flex-col items-center">
      <span className="text-lg font-bold tabular-nums leading-tight">{value}</span>
      <span className="mt-0.5 text-micro text-white/40">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="mx-3 h-7 w-px bg-white/10" />;
}
