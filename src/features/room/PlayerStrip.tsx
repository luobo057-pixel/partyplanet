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

/** Live per-player game state shown on the strip while a game runs */
export interface PlayerGameStatus {
  /** remaining dice; 0 = eliminated */
  diceLeft: number;
  totalDice: number;
  /** currently acting in the game */
  isTurn: boolean;
  /** latest action bubble (bid / call) */
  bubble?: { text: string; kind: 'bid' | 'call' };
  isLoser?: boolean;
}

interface PlayerStripProps {
  players: Player[];
  hostId: PlayerId;
  currentUserId: PlayerId | null;
  speakingPlayerId: PlayerId | null;
  /** Tap an avatar to open that player's card */
  onSelectPlayer?: (player: Player) => void;
  /** When set, the strip renders game state (dots/bubble/turn ring) */
  gameStatus?: Map<PlayerId, PlayerGameStatus> | null;
}

export function PlayerStrip({
  players,
  hostId,
  currentUserId,
  speakingPlayerId,
  onSelectPlayer,
  gameStatus,
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
        const gs = gameStatus?.get(player.id);
        const isOut = !!gs && gs.diceLeft === 0;

        return (
          <button
            key={player.id}
            onClick={() => onSelectPlayer?.(player)}
            className={`flex w-[52px] shrink-0 flex-col items-center gap-1 transition active:scale-95 ${
              isOut ? 'opacity-40' : ''
            }`}
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
                  ring={isSpeaking || gs?.isTurn ? 'active' : 'idle'}
                  isHost={isHost}
                  className={gs?.isLoser ? 'rounded-full ring-2 ring-red-400' : ''}
                />
              </motion.div>
              {isMe && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-1.5 text-micro font-bold leading-tight">
                  Me
                </span>
              )}
            </div>

            {/* Fixed-height name row — game bubble / dice dots / speaking
                bubble / idle name swap here without changing row height */}
            <div className="flex h-[18px] w-full items-center justify-center">
              {gs?.bubble ? (
                <motion.span
                  key={`act-${gs.bubble.text}-${gs.bubble.kind}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`max-w-full truncate rounded px-1.5 py-0.5 text-micro font-bold leading-none ${
                    gs.bubble.kind === 'call'
                      ? 'bg-gradient-to-r from-brand-500 to-pink-600 text-white'
                      : 'bg-violet-400 text-night-900'
                  }`}
                >
                  {gs.bubble.text}
                </motion.span>
              ) : gs ? (
                <span key="dice" className="flex gap-0.5">
                  {Array.from({ length: gs.totalDice }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        i < gs.diceLeft ? 'bg-violet-300' : 'bg-white/15'
                      }`}
                    />
                  ))}
                </span>
              ) : isSpeaking ? (
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
