import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';
import {
  getMockRooms,
  GAME_TYPE_LABELS,
  VIBE_STYLES,
  VIBE_LABELS,
  type RoomWithHost,
} from '@/services/mocks/roomData';
import { GAME_ICON_MAP } from '@/shared/config/gameIcons';
import type { GameType } from '@/types';

/**
 * Rooms tab — browse and join ongoing party rooms.
 */

type CategoryKey = 'all' | GameType;

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'For You' },
  { key: 'truth-or-dare', label: 'Truth or Dare' },
  { key: 'who-is-spy', label: 'Spy' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'none', label: 'Chat' },
];

export default function LobbyPage() {
  const navigate = useNavigate();
  const allRooms = useMemo(() => getMockRooms(), []);
  const [category, setCategory] = useState<CategoryKey>('all');

  const filteredRooms = useMemo(() => {
    if (category === 'all') return allRooms;
    return allRooms.filter((r) => r.gameType === category);
  }, [allRooms, category]);

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button
          onClick={() => navigate('/')}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70"
        >
          <Icon name="search" size={18} />
        </button>
      </header>

      {/* Body */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {/* Category tabs */}
        <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === cat.key
                  ? 'bg-white text-night-900'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Room list */}
        <div className="space-y-3">
          {filteredRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <RoomCard room={room} onClick={() => navigate(`/room/${room.id}`)} />
            </motion.div>
          ))}

          {filteredRooms.length === 0 && (
            <div className="flex flex-col items-center py-16 text-white/40">
              <Icon name="chat" size={40} className="mb-2 text-white/20" />
              <p className="text-sm">No rooms in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Room card ============

function RoomCard({ room, onClick }: { room: RoomWithHost; onClick: () => void }) {
  const playerCount = room.players.length;
  const shownPlayers = room.players.slice(0, 5);

  return (
    <button
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/5 bg-night-800 p-3 text-left transition active:scale-[0.98]"
    >
      {/* Game icon */}
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-transparent">
        <Icon name={GAME_ICON_MAP[room.gameType]} size={30} className="text-white/90" />
        {room.isPlaying && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-1.5 py-0.5 text-micro font-bold leading-none">
            LIVE
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-semibold">{room.name}</h3>
          {room.isHot && (
            <Icon name="fire" size={14} className="shrink-0 text-orange-400" />
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
          <span className={`rounded px-1.5 py-0.5 text-micro font-medium ${VIBE_STYLES[room.vibe]}`}>
            {VIBE_LABELS[room.vibe]}
          </span>
          <span className="truncate">{GAME_TYPE_LABELS[room.gameType]}</span>
        </div>
        <p className="mt-1 truncate text-xs text-white/40">{room.announcement}</p>
      </div>

      {/* Players + count */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex -space-x-2">
          {shownPlayers.map((p) => (
            <div key={p.id} className="ring-2 ring-night-800 rounded-full">
              <SimpleAvatar nickname={p.nickname} config={p.avatar} size={24} circle />
            </div>
          ))}
        </div>
        <span className="text-xs font-medium text-white/70">{playerCount}/{room.maxPlayers}</span>
      </div>
    </button>
  );
}
