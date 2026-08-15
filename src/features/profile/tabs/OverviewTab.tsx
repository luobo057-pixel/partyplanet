import type { GameStat, Post, Achievement, Gift } from '@/types/profile';
import { GAME_TYPE_LABELS } from '@/services/mocks/roomData';
import { GAME_ICON_MAP } from '@/shared/config/gameIcons';
import { Icon } from '@/shared/components/Icon';

/**
 * Overview tab — curated highlights, one concern per section.
 *
 * Lifetime Games/Wins live in the page hero; this tab leads with the
 * player's best game, then achievements, latest post and top gift.
 */

interface OverviewTabProps {
  stats: GameStat[];
  recentPosts: Post[];
  achievements: Achievement[];
  gifts: Gift[];
}

export function OverviewTab({
  stats,
  recentPosts,
  achievements,
  gifts,
}: OverviewTabProps) {
  const earned = achievements.filter((a) => a.earnedAt);
  const topGift = [...gifts].sort((a, b) => b.stars - a.stars)[0];
  const bestGame = [...stats].sort((a, b) => b.rankPoints - a.rankPoints)[0];

  return (
    <div className="space-y-6">
      {/* Top game */}
      {bestGame && (
        <Section title="Top Game" icon="game" iconClass="text-brand-400">
          <div className="flex items-center gap-3.5 px-1 py-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <Icon name={GAME_ICON_MAP[bestGame.gameType]} size={24} className="text-white/90" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{GAME_TYPE_LABELS[bestGame.gameType]}</p>
              <p className="mt-0.5 text-xs text-white/40">
                {bestGame.totalGames} games · {bestGame.rankPoints} RP
              </p>
            </div>
            <span className="rounded-md bg-amber-400/20 px-2 py-1 text-micro font-semibold text-amber-300">
              {bestGame.tier}
            </span>
          </div>
        </Section>
      )}

      {/* Achievements */}
      {earned.length > 0 && (
        <Section title="Achievements" icon="star" iconClass="text-violet-400">
          <div className="flex flex-wrap gap-2 px-1 py-1.5">
            {earned.slice(0, 4).map((a) => (
              <span
                key={a.id}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${RARITY_STYLES[a.rarity]}`}
              >
                {a.emoji} {a.title}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Latest post */}
      {recentPosts[0] && (
        <Section title="Latest Post" icon="image" iconClass="text-sky-400">
          <div className="rounded-xl bg-white/5 p-4">
            {recentPosts[0].emoji && (
              <span className="mb-1.5 block text-2xl">{recentPosts[0].emoji}</span>
            )}
            <p className="text-sm leading-relaxed text-white/90">{recentPosts[0].text}</p>
            <p className="mt-2.5 text-micro text-white/40">
              {formatDate(recentPosts[0].createdAt)} · {recentPosts[0].likes} likes
            </p>
          </div>
        </Section>
      )}

      {/* Top gift */}
      {topGift && (
        <Section title="Top Gift" icon="gift" iconClass="text-rose-400">
          <div className="flex items-center gap-3.5 px-1 py-1">
            <span className="text-4xl">{topGift.emoji}</span>
            <div className="flex-1">
              <p className="font-medium">{topGift.name}</p>
              <p className="mt-0.5 text-xs text-white/40">
                ×{topGift.count} · {topGift.stars.toLocaleString()} stars
              </p>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}

/** Section wrapper — consistent title + card rhythm */
function Section({
  title,
  icon,
  iconClass,
  children,
}: {
  title: string;
  icon: 'game' | 'star' | 'image' | 'gift';
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
        <Icon name={icon} size={14} className={iconClass} />
        {title}
      </h3>
      {children}
    </section>
  );
}

export const RARITY_STYLES: Record<string, string> = {
  common: 'bg-white/10 text-white/70',
  rare: 'bg-sky-500/20 text-sky-300',
  epic: 'bg-violet-500/20 text-violet-300',
  legendary: 'bg-amber-500/20 text-amber-300',
};

function formatDate(iso: string): string {
  const diffH = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}
