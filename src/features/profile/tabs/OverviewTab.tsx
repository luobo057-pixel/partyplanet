import type { GameStat, Post, Achievement, Gift } from '@/types/profile';
import { GAME_TYPE_LABELS } from '@/services/mocks/roomData';
import { GAME_ICON_MAP } from '@/shared/config/gameIcons';
import { Icon } from '@/shared/components/Icon';

interface OverviewTabProps {
  stats: GameStat[];
  recentPosts: Post[];
  achievements: Achievement[];
  gifts: Gift[];
}

/**
 * Overview tab — a summary card combining key info from other tabs.
 */
export function OverviewTab({
  stats,
  recentPosts,
  achievements,
  gifts,
}: OverviewTabProps) {
  const totalGames = stats.reduce((s, g) => s + g.totalGames, 0);
  const totalWins = stats.reduce((s, g) => s + g.wins, 0);
  const earnedAchievements = achievements.filter((a) => a.earnedAt);
  const topGift = [...gifts].sort((a, b) => b.stars - a.stars)[0];

  return (
    <div className="space-y-3">
      {/* Stats summary */}
      <section className="glass p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white/80">
          <Icon name="trophy" size={16} className="text-amber-400" />
          Highlights
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Games" value={totalGames} />
          <Stat label="Wins" value={totalWins} />
          <Stat
            label="Win Rate"
            value={`${totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%`}
          />
        </div>
      </section>

      {/* Best game */}
      <section className="glass p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white/80">
          <Icon name="game" size={16} className="text-brand-400" />
          Top Game
        </h3>
        {stats.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <Icon name={GAME_ICON_MAP[stats[0].gameType]} size={24} className="text-white/80" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{GAME_TYPE_LABELS[stats[0].gameType]}</p>
              <p className="text-xs text-white/50">
                {stats[0].tier} · {stats[0].rankPoints} RP
              </p>
            </div>
            <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-300">
              {stats[0].tier}
            </span>
          </div>
        )}
      </section>

      {/* Recent post */}
      <section className="glass p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white/80">
          <Icon name="image" size={16} className="text-sky-400" />
          Latest Post
        </h3>
        {recentPosts[0] ? (
          <div className="rounded-xl bg-white/5 p-3">
            {recentPosts[0].emoji && (
              <span className="mb-1 block text-2xl">{recentPosts[0].emoji}</span>
            )}
            <p className="text-sm text-white/80">{recentPosts[0].text}</p>
            <p className="mt-2 text-xs text-white/40">
              {formatDate(recentPosts[0].createdAt)} · ❤ {recentPosts[0].likes}
            </p>
          </div>
        ) : (
          <EmptyHint text="No posts yet" />
        )}
      </section>

      {/* Featured achievement */}
      <section className="glass p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white/80">
          <Icon name="star" size={16} className="text-violet-400" />
          Featured Achievement
        </h3>
        <div className="flex flex-wrap gap-2">
          {earnedAchievements.slice(0, 3).map((a) => (
            <span
              key={a.id}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${RARITY_STYLES[a.rarity]}`}
            >
              {a.title}
            </span>
          ))}
        </div>
      </section>

      {/* Gift highlight */}
      {topGift && (
        <section className="glass p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white/80">
            <Icon name="gift" size={16} className="text-rose-400" />
            Top Gift
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topGift.emoji}</span>
            <div className="flex-1">
              <p className="font-medium">{topGift.name}</p>
              <p className="text-xs text-white/50">
                ×{topGift.count} · {topGift.stars} stars
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/5 py-3">
      <span className="text-lg font-bold text-brand-400">{value}</span>
      <span className="text-[11px] text-white/40">{label}</span>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="py-3 text-center text-sm italic text-white/30">{text}</p>;
}

export const RARITY_STYLES: Record<string, string> = {
  common: 'bg-white/10 text-white/60',
  rare: 'bg-sky-500/20 text-sky-300',
  epic: 'bg-violet-500/20 text-violet-300',
  legendary: 'bg-amber-500/20 text-amber-300',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
