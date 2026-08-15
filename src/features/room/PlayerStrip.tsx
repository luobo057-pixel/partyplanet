import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import type { Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';

/**
 * Player strip — horizontal player list at the top of a room.
 *
 * Layout-stability rules (prevents the stage below from jumping):
 * - Fixed name-row height: speaking bubble and idle name render inside
 *   the same h-[18px] row, swapped by opacity — never by height
 * - Fixed button width so the strip never reflows horizontally
 * - Speaking emphasis uses transform only (scale), which never affects layout
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
            className="flex w-[52px] shrink-0 flex-col items-center gap-1 transition active:scale-95"
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
                  size={44}
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

            {/* Fixed-height name row — bubble/idle name swap by opacity only */}
            <div className="flex h-[18px] w-full items-center justify-center">
              {isSpeaking ? (
                <motion.span
                  key="bubble"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-full truncate rounded bg-white/10 px-1.5 py-0.5 text-micro leading-none"
                >
                  {player.nickname}
                </motion.span>
              ) : (
                <motion.span
                  key="name"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-full truncate text-micro leading-none text-white/40"
                >
                  {isMe ? 'Me' : player.nickname}
                </motion.span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
