import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NPC_PROFILES } from '@/services/mocks/npcData';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { getMockRooms, GAME_TYPE_LABELS } from '@/services/mocks/roomData';
import type { GameType } from '@/types';

/**
 * Matching page.
 * From home game entry: carries state.gameType, prioritizes that game's rooms.
 * From Quick Match: no gameType, random hot room.
 */
export default function MatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetGameType = (location.state as { gameType?: GameType } | null)?.gameType;
  const [progress, setProgress] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);

  // Cycle through NPC avatars
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashIndex((i) => (i + 1) % NPC_PROFILES.length);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Progress + completion
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          const rooms = getMockRooms();
          let target;
          if (targetGameType) {
            target =
              rooms.find((r) => r.gameType === targetGameType && r.isHot) ??
              rooms.find((r) => r.gameType === targetGameType);
          }
          target = target ?? rooms.find((r) => r.isHot) ?? rooms[0];
          setTimeout(() => navigate(`/room/${target.id}`), 300);
          return 100;
        }
        return Math.min(100, p + 4);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [navigate, targetGameType]);

  const currentNpc = NPC_PROFILES[flashIndex];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-8">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-accent-400/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={flashIndex}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <SimpleAvatar
              nickname={currentNpc.nickname}
              config={currentNpc.avatar}
              size={120}
              circle
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg font-medium text-white/80"
        >
          {targetGameType && targetGameType !== 'none'
            ? `Finding "${GAME_TYPE_LABELS[targetGameType]}" buddies...`
            : 'Finding interesting souls for you...'}
        </motion.p>
        <p className="mt-2 text-sm text-white/40">
          Matched {Math.floor(progress / 20)} / 6 players
        </p>
      </div>

      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-400 to-accent-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={() => navigate('/lobby')}
        className="text-sm text-white/40 underline"
      >
        Cancel
      </button>
    </div>
  );
}
