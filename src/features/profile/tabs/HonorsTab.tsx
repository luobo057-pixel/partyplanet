import { useState } from 'react';
import type { Gift, Achievement } from '@/types/profile';
import { TOTAL_GIFT_STARS } from '@/services/mocks/profileData';
import { Icon } from '@/shared/components/Icon';

interface HonorsTabProps {
  gifts: Gift[];
  achievements: Achievement[];
}

type SubTab = 'gifts' | 'titles';

/**
 * Honors tab — gift wall (with Gift Star total) + achievement titles.
 */
export function HonorsTab({ gifts, achievements }: HonorsTabProps) {
  const [sub, setSub] = useState<SubTab>('gifts');

  return (
    <div className="space-y-3">
      {/* Gift Star banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 p-4">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-400/30 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <Icon name="star" size={36} className="text-amber-300" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-xs text-amber-200/80">Gift Star</p>
            <p className="text-2xl font-bold text-amber-200">
              {TOTAL_GIFT_STARS.toLocaleString()}
            </p>
          </div>
          <span className="text-xs text-amber-200/60">
            {gifts.length} kinds
          </span>
        </div>
      </section>

      {/* Sub-tab switch */}
      <div className="flex gap-2">
        <SubTabButton
          active={sub === 'gifts'}
          onClick={() => setSub('gifts')}
          icon="gift"
          label={`Gift Wall (${gifts.length})`}
        />
        <SubTabButton
          active={sub === 'titles'}
          onClick={() => setSub('titles')}
          icon="star"
          label={`Titles (${achievements.length})`}
        />
      </div>

      {/* Content */}
      {sub === 'gifts' ? <GiftWall gifts={gifts} /> : <TitleWall achievements={achievements} />}
    </div>
  );
}

// ============ Gift wall ============

function GiftWall({ gifts }: { gifts: Gift[] }) {
  // Sort by stars desc
  const sorted = [...gifts].sort((a, b) => b.stars - a.stars);

  return (
    <div className="grid grid-cols-4 gap-2">
      {sorted.map((g) => (
        <div
          key={g.id}
          className="flex flex-col items-center rounded-xl bg-white/5 p-2 text-center"
        >
          <span className="text-3xl">{g.emoji}</span>
          <span className="mt-1 text-micro font-medium text-white/90">{g.name}</span>
          <span className="text-micro text-white/40">×{g.count}</span>
        </div>
      ))}
      {/* Locked slots to show "more to collect" */}
      {[1, 2, 3].map((i) => (
        <div
          key={`locked-${i}`}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-2 text-center"
        >
          <span className="text-2xl text-white/10">?</span>
          <span className="mt-1 text-micro text-white/20">Locked</span>
        </div>
      ))}
    </div>
  );
}

// ============ Title wall (achievements) ============

function TitleWall({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="space-y-2">
      {achievements.map((a) => {
        const earned = !!a.earnedAt;
        return (
          <div
            key={a.id}
            className={`flex items-center gap-3 rounded-xl p-3 ${
              earned ? 'bg-white/5' : 'border border-dashed border-white/10 opacity-50'
            }`}
          >
            <span className={`text-3xl ${earned ? '' : 'grayscale'}`}>{a.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold">{a.title}</p>
                <span
                  className={`rounded px-1.5 py-0.5 text-micro font-bold uppercase ${RARITY_BADGE[a.rarity]}`}
                >
                  {a.rarity}
                </span>
              </div>
              <p className="text-xs text-white/40">{a.description}</p>
              {earned && (
                <p className="mt-0.5 text-micro text-emerald-400">
                  Earned {a.earnedAt}
                </p>
              )}
            </div>
            {!earned && (
              <span className="text-xs text-white/40">🔒</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

const RARITY_BADGE: Record<string, string> = {
  common: 'bg-white/10 text-white/70',
  rare: 'bg-sky-500/20 text-sky-300',
  epic: 'bg-violet-500/20 text-violet-300',
  legendary: 'bg-amber-500/20 text-amber-300',
};

function SubTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: 'gift' | 'star';
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition ${
        active ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
      }`}
    >
      <Icon name={icon} size={14} />
      {label}
    </button>
  );
}
