import { motion } from 'framer-motion';
import { GAME_TYPE_LABELS } from '@/services/mocks/roomData';
import { GAME_ICON_MAP } from '@/shared/config/gameIcons';
import { Icon } from '@/shared/components/Icon';
import type { GameType } from '@/types';

/**
 * Game stage — central visual area of the room.
 * Placeholder for now (real games come in a later stage).
 */

interface GameStageProps {
  gameType: GameType;
  isPlaying: boolean;
  roomName: string;
  isHost: boolean;
  onStartGame?: () => void;
}

export function GameStage({
  gameType,
  isPlaying,
  roomName,
  isHost,
  onStartGame,
}: GameStageProps) {
  if (isPlaying) {
    return <StagePlaying gameType={gameType} />;
  }

  return (
    <div className="relative mx-3 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-night-700/60 to-night-800/60">
      <BackgroundGlow />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center gap-3 px-8 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white"
        >
          <Icon name={GAME_ICON_MAP[gameType]} size={64} strokeWidth={1.8} />
        </motion.div>

        <div>
          <p className="text-lg font-semibold">{roomName}</p>
          <p className="mt-1 text-sm text-white/50">
            {gameType === 'none'
              ? 'Chat-only room, free social'
              : `Now playing: ${GAME_TYPE_LABELS[gameType]}`}
          </p>
        </div>

        {gameType !== 'none' && isHost && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStartGame}
            className="btn-primary mt-2 px-8"
          >
            Start Game
          </motion.button>
        )}
        {gameType !== 'none' && !isHost && (
          <p className="mt-2 text-xs text-white/40">Waiting for host to start...</p>
        )}
        {gameType === 'none' && (
          <p className="mt-2 text-xs text-white/40">Chat with friends below</p>
        )}
      </motion.div>
    </div>
  );
}

function StagePlaying({ gameType }: { gameType: GameType }) {
  return (
    <div className="relative mx-3 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-b from-brand-500/10 to-night-800/60">
      <BackgroundGlow active />
      <div className="relative flex flex-col items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="text-white"
        >
          <Icon name={GAME_ICON_MAP[gameType]} size={52} strokeWidth={1.8} />
        </motion.div>
        <p className="text-sm font-medium text-brand-300">
          {GAME_TYPE_LABELS[gameType]} · In Progress
        </p>
        <p className="text-xs text-white/40">Game UI coming in stage 4</p>
      </div>
    </div>
  );
}

function BackgroundGlow({ active = false }: { active?: boolean }) {
  const colors = active
    ? ['rgba(244,63,94,0.25)', 'rgba(139,92,246,0.2)']
    : ['rgba(139,92,246,0.15)', 'rgba(59,130,246,0.12)'];
  return (
    <>
      <motion.div
        className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full blur-3xl"
        style={{ background: colors[0] }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full blur-3xl"
        style={{ background: colors[1] }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
