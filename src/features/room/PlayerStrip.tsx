import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import type { Player, PlayerId } from '@/types';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';

/**
 * 玩家头像条
 *
 * 房间顶部的横向玩家列表：
 * - 紧凑展示所有在场玩家（支持 8-20 人横向滚动）
 * - 房主带皇冠角标
 * - 正在发言的头像放大 + 高亮环 + 名字气泡
 * - 当前用户（自己）有特殊标记
 */

interface PlayerStripProps {
  players: Player[];
  hostId: PlayerId;
  currentUserId: PlayerId | null;
  speakingPlayerId: PlayerId | null;
}

export function PlayerStrip({
  players,
  hostId,
  currentUserId,
  speakingPlayerId,
}: PlayerStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 默认滚到最前面
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
          <div key={player.id} className="flex shrink-0 flex-col items-center gap-1">
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
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-1.5 text-[9px] font-bold leading-tight">
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
                  className="max-w-[60px] truncate rounded bg-white/15 px-1.5 py-0.5 text-[10px]"
                >
                  {player.nickname}
                </motion.span>
              )}
            </AnimatePresence>
            {!isSpeaking && (
              <span className="max-w-[52px] truncate text-[10px] text-white/40">
                {isMe ? 'Me' : player.nickname}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
