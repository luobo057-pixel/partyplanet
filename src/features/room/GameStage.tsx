import { motion } from 'framer-motion';
import { GAME_TYPE_LABELS } from '@/services/mocks/roomData';
import { GAME_ICON_MAP } from '@/shared/config/gameIcons';
import { Icon } from '@/shared/components/Icon';
import type { GameType } from '@/types';

/**
 * Game stage — central visual area of the room.
 *
 * `active=false` while someone is speaking: the center content fades
 * out so chat bubbles own the stage, background glow stays.
 *
 * Performance: glows animate opacity only via CSS (compositor thread,
 * no scale/blur re-paints) — keeps the stage rock-stable.
 */

interface GameStageProps {
  gameType: GameType;
  isPlaying: boolean;
  roomName: string;
  isHost: boolean;
  /** false while a player is speaking → hide center content */
  active?: boolean;
  onStartGame?: () => void;
}

export function GameStage({
  gameType,
  isPlaying,
  roomName,
  isHost,
  active = true,
  onStartGame,
}: GameStageProps) {
  if (isPlaying) {
    return <StagePlaying gameType={gameType} active={active} />;
  }

  return (
    <div className="relative mx-3 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-night-700/60 to-night-800/60">
      <BackgroundGlow />

      {/* Center content — fades out while someone speaks */}
      <motion.div
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative flex flex-col items-center gap-3 px-8 text-center ${
          active ? '' : 'pointer-events-none'
        }`}
      >
        <div className="animate-float text-white">
          <Icon name={GAME_ICON_MAP[gameType]} size={64} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-lg font-semibold">{roomName}</p>
          <p className="mt-1 text-sm text-white/40">
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

function StagePlaying({ gameType, active }: { gameType: GameType; active: boolean }) {
  return (
    <div className="relative mx-3 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-b from-brand-500/10 to-night-800/60">
      <BackgroundGlow active />
      <motion.div
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="relative flex flex-col items-center gap-2"
      >
        <div className="text-white">
          <Icon name={GAME_ICON_MAP[gameType]} size={52} strokeWidth={1.8} />
        </div>
        <p className="text-sm font-medium text-brand-300">
          {GAME_TYPE_LABELS[gameType]} · In Progress
        </p>
        <p className="text-xs text-white/40">Game UI coming in stage 4</p>
      </motion.div>
    </div>
  );
}

/**
 * Ambient glows — CSS opacity-only animation (pulse), different phases.
 * No scale animation: scaling a 64px-blur layer every frame is what made
 * the stage visibly shake.
 */
function BackgroundGlow({ active = false }: { active?: boolean }) {
  const colors = active
    ? ['rgba(244,63,94,0.22)', 'rgba(139,92,246,0.18)']
    : ['rgba(139,92,246,0.14)', 'rgba(59,130,246,0.10)'];
  return (
    <>
      <div
        className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full blur-3xl [animation:pulse_5s_ease-in-out_infinite]"
        style={{ background: colors[0] }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full blur-3xl [animation:pulse_7s_ease-in-out_1.5s_infinite]"
        style={{ background: colors[1] }}
      />
    </>
  );
}
