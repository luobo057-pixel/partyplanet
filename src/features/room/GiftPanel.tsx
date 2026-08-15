import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/shared/components/Icon';
import { GIFT_CATALOG, GIFT_TIER_LABELS, type GiftItem, type GiftTier } from './giftCatalog';

/**
 * Gift panel — bottom sheet over the input bar.
 *
 * Tap a gift to select, Send confirms (deducts coins, triggers effect).
 * Unaffordable gifts are visibly locked.
 */

interface GiftPanelProps {
  coins: number;
  onClose: () => void;
  onSend: (gift: GiftItem) => void;
}

const TIER_ORDER: GiftTier[] = ['normal', 'room', 'global'];

export function GiftPanel({ coins, onClose, onSend }: GiftPanelProps) {
  const [selected, setSelected] = useState<GiftItem | null>(null);
  const canAfford = selected ? coins >= selected.price : false;

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-white/10 bg-night-800 pb-6 pt-4"
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between px-5">
          <h3 className="text-base font-bold">Gifts</h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
              <Icon name="coin" size={13} className="text-amber-400" />
              <span className="text-xs font-semibold tabular-nums">{coins}</span>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 active:scale-90"
            >
              <Icon name="close" size={13} />
            </button>
          </div>
        </div>

        {/* Catalog by tier */}
        <div className="no-scrollbar max-h-[42vh] overflow-y-auto px-5">
          {TIER_ORDER.map((tier) => (
            <section key={tier} className="mb-4 last:mb-1">
              <h4 className="mb-2 text-micro font-semibold uppercase tracking-wider text-white/40">
                {GIFT_TIER_LABELS[tier]}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {GIFT_CATALOG.filter((g) => g.tier === tier).map((gift) => {
                  const affordable = coins >= gift.price;
                  const isSelected = selected?.id === gift.id;
                  return (
                    <button
                      key={gift.id}
                      disabled={!affordable}
                      onClick={() => setSelected(gift)}
                      className={`relative flex flex-col items-center rounded-xl border py-2.5 transition active:scale-95 ${
                        isSelected
                          ? 'border-brand-400 bg-brand-400/15'
                          : 'border-white/10 bg-white/5'
                      } ${affordable ? '' : 'opacity-40'}`}
                    >
                      <span className="text-3xl leading-none">{gift.emoji}</span>
                      <span className="mt-1 text-micro font-medium">{gift.name}</span>
                      <span
                        className={`mt-0.5 flex items-center gap-0.5 text-micro tabular-nums ${
                          affordable ? 'text-amber-300' : 'text-red-400'
                        }`}
                      >
                        <Icon name="coin" size={9} />
                        {gift.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Send bar */}
        <div className="mt-3 px-5">
          <button
            disabled={!selected || !canAfford}
            onClick={() => selected && onSend(selected)}
            className="btn-primary w-full disabled:opacity-40"
          >
            {selected
              ? `Send ${selected.emoji} ${selected.name} · ${selected.price}`
              : 'Select a gift'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
