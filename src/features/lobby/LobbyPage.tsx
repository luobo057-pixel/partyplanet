import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SimpleAvatar } from '@/shared/components/SimpleAvatar';
import { Icon } from '@/shared/components/Icon';
import {
  getMockRooms,
  GAME_TYPE_LABELS,
  GAME_TYPE_IMAGES,
  VIBE_STYLES,
  VIBE_LABELS,
  type RoomWithHost,
} from '@/services/mocks/roomData';
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

  /** Search mode — find a room by its ID (or name substring) */
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setSearching(true);
    setQuery('');
    // focus after the input mounts
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const closeSearch = () => {
    setSearching(false);
    setQuery('');
  };

  const filteredRooms = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return allRooms.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q),
      );
    }
    if (category === 'all') return allRooms;
    return allRooms.filter((r) => r.gameType === category);
  }, [allRooms, category, searching, query]);

  return (
    <div className="flex h-full flex-col">
      {searching ? (
        /* Search bar */
        <header className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <button
            onClick={closeSearch}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-95"
          >
            <Icon name="back" size={16} />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Icon name="search" size={15} className="shrink-0 text-white/40" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search room ID or name..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="shrink-0 text-white/40 transition active:scale-90"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </header>
      ) : (
        /* Normal top bar */
        <header className="flex items-center justify-between px-4 pt-4 pb-3">
          <h1 className="text-2xl font-bold">Rooms</h1>
          <button
            onClick={openSearch}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition active:scale-95"
          >
            <Icon name="search" size={18} />
          </button>
        </header>
      )}

      {/* Body */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {/* Category tabs (hidden while searching) */}
        {!searching && (
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
        )}

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
              <Icon name="search" size={40} className="mb-3 text-white/20" />
              <p className="text-sm">
                {searching && query.trim()
                  ? `No room matches "${query.trim()}"`
                  : searching
                    ? 'Enter a room ID to search'
                    : 'No rooms in this category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Room card ============

function RoomCard({ room, onClick }: { room: RoomWithHost; onClick: () => void }) {
  // displayCount carries the big-room occupancy; players array is the interactive roster
  const playerCount = Math.min(room.displayCount ?? room.players.length, room.maxPlayers);
  const shownPlayers = room.players.slice(0, 5);

  return (
    <button
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/5 bg-night-800 p-3 text-left transition active:scale-[0.98]"
    >
      {/* Game illustration (square art fills the tile) */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <img
          src={GAME_TYPE_IMAGES[room.gameType]}
          alt={GAME_TYPE_LABELS[room.gameType]}
          width={64}
          height={64}
          loading="lazy"
          className="h-full w-full object-cover"
        />
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
