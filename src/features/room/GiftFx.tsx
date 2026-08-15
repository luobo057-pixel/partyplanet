import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { GiftItem } from './giftCatalog';

/**
 * Gift send effects — one renderer per tier.
 *
 * normal: emoji bubbles float up above the input area (1.6s)
 * room:   emoji confetti rains across the stage (2.4s)
 * global: full-screen announcement takeover (3.2s, tap to skip)
 *
 * Timing deps are [effect.id, tier] only — onDone lives in a ref so
 * parent re-renders (NPC chatter) never reset the countdown.
 */

export interface GiftEffect {
  id: number;
  gift: GiftItem;
  fromNickname: string;
}

interface GiftFxProps {
  effect: GiftEffect;
  onDone: () => void;
}

export function GiftFx({ effect, onDone }: GiftFxProps) {
  const { gift } = effect;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const ms = gift.tier === 'global' ? 3200 : gift.tier === 'room' ? 2400 : 1600;
    const t = setTimeout(() => doneRef.current(), ms);
    return () => clearTimeout(t);
  }, [effect.id, gift.tier]);

  if (gift.tier === 'global') return <GlobalAnnouncement effect={effect} onSkip={() => doneRef.current()} />;
  if (gift.tier === 'room') return <RoomRain gift={gift} />;
  return <FloatBubbles gift={gift} />;
}

/** normal — a few emoji bubbles rise above the bottom-right area */
function FloatBubbles({ gift }: { gift: GiftItem }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        x: 70 + Math.random() * 20, // % from left
        delay: i * 0.12,
        scale: 0.7 + Math.random() * 0.6,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {bubbles.map((b, i) => (
        <motion.span
          key={i}
          initial={{ y: '85vh', opacity: 0 }}
          animate={{ y: '30vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.4, delay: b.delay, ease: 'easeOut' }}
          className="absolute text-3xl"
          style={{ left: `${b.x}%`, scale: b.scale }}
        >
          {gift.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/** room — confetti rain across the whole stage */
function RoomRain({ gift }: { gift: GiftItem }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        scale: 0.8 + Math.random() * 1.2,
        rotate: Math.random() * 360,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {drops.map((d, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: '90vh', opacity: [0, 1, 1, 0], rotate: d.rotate + 180 }}
          transition={{ duration: 2.2, delay: d.delay, ease: 'easeIn' }}
          className="absolute text-4xl"
          style={{ left: `${d.x}%`, scale: d.scale }}
        >
          {gift.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/** global — full-screen announcement takeover (tap to skip) */
function GlobalAnnouncement({
  effect,
  onSkip,
}: {
  effect: GiftEffect;
  onSkip: () => void;
}) {
  const { gift, fromNickname } = effect;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onSkip}
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/70 backdrop-blur-md"
    >
      {/* radial glow */}
      <div
        className="absolute h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'rgba(244,63,94,0.25)' }}
      />

      {/* big gift */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [0, 1.4, 1], rotate: 0 }}
        transition={{ duration: 0.7, ease: 'backOut' }}
        className="relative text-[110px] leading-none drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]"
      >
        {gift.emoji}
      </motion.div>

      {/* announcement text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative mt-6 flex flex-col items-center px-8 text-center"
      >
        <p className="bg-gradient-to-r from-amber-300 to-brand-400 bg-clip-text text-2xl font-bold text-transparent">
          {fromNickname} sent {gift.name}
        </p>
        <p className="mt-1 text-sm text-white/70">to everyone in the room!</p>

        {/* sparkle rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex gap-3 text-xl"
        >
          {['✨', '🎉', '✨'].map((s, i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
