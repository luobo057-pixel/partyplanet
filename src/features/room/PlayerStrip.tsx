import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import type { Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';

/**
 * Player strip — horizontal player list at the top of a room.
 *
 * - Compact, scrollable (8-20 players)
 * - Host carries a crown badge
 * - Speaker avatar scales up + highlight ring + name bubble
 * - Every avatar is tappable → opens player card (add friend)
 */

interface PlayerStripProps {
  players: Player[];
  hostId: PlayerId;
  currentUserId: PlayerId | null;
  speakingPlayerId: PlayerId | null;
  /** Tap an avatar to open that player's card */
  onSelectPlayer?: (player: Player) => void;
}

export function PlayerStrip({
  players,
  hostId,
  currentUserId,
  speakingPlayerId,
  onSelectPlayer,
}: PlayerStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, []);

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-2"
    >
      {players.map((player) => {
        const isHost = player.id === hostId;
        const isMe = player.id === currentUserId;
        const isSpeaking = player.id === speakingPlayerId;

        return (
          <button
            key={player.id}
            onClick={() => onSelectPlayer?.(player)}
            className="flex shrink-0 flex-col items-center gap-1 transition active:scale-95"
          >
            <div className="relative">
              <motion.div
                animate={
                  isSpeaking
                    ? { scale: 1.12, y: -2 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <SimpleAvatar
                  nickname={player.nickname}
                  config={player.avatar}
                  size={isSpeaking ? 52 : 44}
                  circle
                  ring={isSpeaking ? 'active' : 'idle'}
                  isHost={isHost}
                />
              </motion.div>
              {isMe && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-1.5 text-micro font-bold leading-tight">
                  Me
                </span>
              )}
            </div>
            <AnimatePresence>
              {isSpeaking && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-[60px] truncate rounded bg-white/10 px-1.5 py-0.5 text-micro"
                >
                  {player.nickname}
                </motion.span>
              )}
            </AnimatePresence>
            {!isSpeaking && (
              <span className="max-w-[52px] truncate text-micro text-white/40">
                {isMe ? 'Me' : player.nickname}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
