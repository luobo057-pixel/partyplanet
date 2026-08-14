import { useState } from 'react';
import type { Asset, AssetCategory } from '@/types/profile';
import { Icon } from '@/shared/components/Icon';

interface AssetsTabProps {
  assets: Asset[];
}

const CATEGORY_LABELS: { key: AssetCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'avatar-frame', label: 'Frames' },
  { key: 'theme', label: 'Themes' },
  { key: 'prop', label: 'Props' },
  { key: 'emoji-pack', label: 'Emojis' },
  { key: 'ride', label: 'Rides' },
];

const RARITY_STYLES: Record<string, string> = {
  common: 'bg-white/10 text-white/70',
  rare: 'bg-sky-500/20 text-sky-300',
  epic: 'bg-violet-500/20 text-violet-300',
  legendary: 'bg-amber-500/20 text-amber-300',
};

/**
 * Assets tab — owned items (frames/themes/props/emojis/rides).
 * Filterable by category.
 */
export function AssetsTab({ assets }: AssetsTabProps) {
  const [filter, setFilter] = useState<AssetCategory | 'all'>('all');

  const filtered = filter === 'all' ? assets : assets.filter((a) => a.category === filter);
  const equippedCount = assets.filter((a) => a.equipped).length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <section className="glass flex items-center gap-4 p-4">
        <Icon name="shopping-bag" size={28} className="text-brand-400" />
        <div className="flex-1">
          <p className="text-lg font-bold">{assets.length}</p>
          <p className="text-xs text-white/40">items owned · {equippedCount} equipped</p>
        </div>
      </section>

      {/* Category filter */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {CATEGORY_LABELS.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === cat.key
                ? 'bg-white text-night-900'
                : 'bg-white/10 text-white/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Asset grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-white/40">
          <Icon name="shopping-bag" size={48} className="mb-2 text-white/20" />
          <p className="text-sm">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="relative flex flex-col items-center rounded-xl bg-white/5 p-3 text-center"
            >
              {asset.equipped && (
                <span className="absolute right-1 top-1 rounded bg-emerald-500/30 px-1 text-micro font-bold text-emerald-300">
                  ON
                </span>
              )}
              <span className="text-3xl">{asset.emoji}</span>
              <span className="mt-1 line-clamp-1 text-micro font-medium text-white/90">
                {asset.name}
              </span>
              <span
                className={`mt-0.5 rounded px-1 py-0.5 text-micro font-bold uppercase ${RARITY_STYLES[asset.rarity]}`}
              >
                {asset.rarity}
              </span>
              {asset.daysLeft && (
                <span className="mt-0.5 text-micro text-amber-400">{asset.daysLeft}d left</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
