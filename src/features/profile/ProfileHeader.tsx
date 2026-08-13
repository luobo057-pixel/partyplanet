import type { Player } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { CurrencyBadge } from '@/shared/components/CurrencyBadge';

/**
 * Profile header — identity card only (avatar + nickname + level + currencies).
 *
 * The 6 social-relation rows were removed per request to keep the header compact.
 */

interface ProfileHeaderProps {
  player: Player;
}

export function ProfileHeader({ player }: ProfileHeaderProps) {
  return (
    <div className="glass relative overflow-hidden p-5">
      {/* Decorative bg */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <SimpleAvatar
          nickname={player.nickname}
          config={player.avatar}
          size={80}
          circle
          ring="online"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-bold">{player.nickname}</h2>
            <span className="shrink-0 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-night-900">
              Lv.{player.level ?? 1}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/40">ID: {player.id.slice(0, 12)}</p>
        </div>
      </div>

      {/* Currencies */}
      <div className="relative mt-4 flex gap-2">
        <CurrencyBadge icon="coin" value={player.coins ?? 0} iconColor="text-amber-400" />
        <CurrencyBadge icon="gem" value={player.gems ?? 0} iconColor="text-violet-400" />
      </div>
    </div>
  );
}
