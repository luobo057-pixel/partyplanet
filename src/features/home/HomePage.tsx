import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';
import { CurrencyBadge } from '@/shared/components/CurrencyBadge';
import { GameIllustration } from './GameIllustration';
import type { GameType } from '@/types';

/**
 * Home (game entry)
 *
 * First screen users see. Big game cards with SVG illustrations, tap to match.
 */

interface GameEntry {
  type: GameType;
  title: string;
  gradient: string;
  glow: string;
  span: 'full' | 'half';
}

const GAME_ENTRIES: GameEntry[] = [
  {
    type: 'truth-or-dare',
    title: 'Truth or Dare',
    gradient: 'from-rose-500 to-pink-600',
    glow: 'shadow-[0_8px_32px_rgba(244,63,94,0.4)]',
    span: 'full',
  },
  {
    type: 'who-is-spy',
    title: 'Who is Spy',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-[0_8px_24px_rgba(139,92,246,0.4)]',
    span: 'half',
  },
  {
    type: 'quiz',
    title: 'Quiz',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'shadow-[0_8px_24px_rgba(59,130,246,0.4)]',
    span: 'half',
  },
  {
    type: 'none',
    title: 'Chat Room',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-[0_8px_24px_rgba(16,185,129,0.4)]',
    span: 'full',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        {/* Left: avatar + nickname + level */}
        <div className="flex items-center gap-2.5">
          {player && (
            <button onClick={() => navigate('/profile')}>
              <SimpleAvatar
                nickname={player.nickname}
                config={player.avatar}
                size={40}
                circle
                ring="online"
              />
            </button>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold leading-tight">{player?.nickname}</p>
              <span className="rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-micro font-bold leading-none text-night-900">
                Lv.{player?.level ?? 1}
              </span>
            </div>
          </div>
        </div>

        {/* Right: currencies */}
        <div className="flex items-center gap-1.5">
          <CurrencyBadge icon="coin" value={player?.coins ?? 0} iconColor="text-amber-400" />
          <CurrencyBadge icon="gem" value={player?.gems ?? 0} iconColor="text-violet-400" />
          <button
            onClick={() => navigate('/profile')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70"
          >
            <Icon name="bell" size={16} />
          </button>
        </div>
      </header>

      {/* Body (scrollable) */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {/* Title */}
        <div className="mb-4 mt-2">
          <h1 className="text-2xl font-bold">What to play?</h1>
          <p className="mt-0.5 text-sm text-white/40">Pick a game, match in 30s</p>
        </div>

        {/* Game entries grid */}
        <div className="grid grid-cols-2 gap-3">
          {GAME_ENTRIES.map((entry, i) => (
            <motion.button
              key={entry.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/matching', { state: { gameType: entry.type } })}
              className={`relative h-32 overflow-hidden rounded-2xl bg-gradient-to-br ${entry.gradient} ${entry.glow} p-4 text-left ${
                entry.span === 'full' ? 'col-span-2' : 'col-span-1'
              }`}
            >
              {/* SVG 几何插画（右上角装饰） */}
              <GameIllustration gameType={entry.type} variant={entry.span} />

              {/* 柔光 */}
              <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

              {/* 标题（左下定位，插画在右上做装饰） */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3
                  className={`relative font-bold text-white drop-shadow-sm ${
                    entry.span === 'full' ? 'text-xl' : 'text-base'
                  }`}
                >
                  {entry.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quick match */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/matching')}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
        >
          <Icon name="bolt" size={28} className="text-amber-400" />
          <div className="flex-1">
            <p className="font-semibold">Quick Match</p>
            <p className="text-xs text-white/40">No preference, play whatever</p>
          </div>
          <Icon name="back" size={18} className="rotate-180 text-white/40" />
        </motion.button>
      </div>
    </div>
  );
}
