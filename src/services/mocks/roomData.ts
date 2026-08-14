import type { Room, RoomId, RoomVibe, GameType, Player } from '@/types';
import { NPC_PROFILES, pickNpcsWithout } from './npcData';

/**
 * Mock room data for the rooms tab and matching.
 * Big-room oriented (8-20 players).
 */

export interface RoomWithHost extends Room {
  /** Room host (NPC by default; real player takes over on enter) */
  host: Player;
  announcement: string;
  isHot?: boolean;
  /** Displayed occupancy (supports big-room feel beyond the interactive NPC roster) */
  displayCount?: number;
}

const ROOM_TEMPLATES: Array<{
  name: string;
  gameType: GameType;
  vibe: RoomVibe;
  announcement: string;
  hostIdx: number;
  playerCount: number;
  isHot?: boolean;
}> = [
  {
    name: 'Late Night Icebreakers',
    gameType: 'truth-or-dare',
    vibe: 'icebreak',
    announcement: 'New here? Raise your hand! Truth or Dare time',
    hostIdx: 0,
    playerCount: 12,
    isHot: true,
  },
  {
    name: 'Spy Masters',
    gameType: 'who-is-spy',
    vibe: 'hot',
    announcement: 'Pros carry newbies, beginners welcome',
    hostIdx: 2,
    playerCount: 16,
    isHot: true,
  },
  {
    name: 'Chill Lounge',
    gameType: 'none',
    vibe: 'chill',
    announcement: 'No games, just vibes. Come hang out',
    hostIdx: 1,
    playerCount: 8,
  },
  {
    name: 'Quiz Champions',
    gameType: 'quiz',
    vibe: 'competitive',
    announcement: 'New questions today. Come challenge!',
    hostIdx: 4,
    playerCount: 14,
    isHot: true,
  },
  {
    name: '3 AM Squad',
    gameType: 'truth-or-dare',
    vibe: 'late-night',
    announcement: 'Night owls assemble, chat till dawn',
    hostIdx: 5,
    playerCount: 6,
  },
  {
    name: 'Beginner Friendly',
    gameType: 'who-is-spy',
    vibe: 'icebreak',
    announcement: 'First time? Join this room~',
    hostIdx: 3,
    playerCount: 10,
  },
  {
    name: 'Weekend Madness',
    gameType: 'quiz',
    vibe: 'hot',
    announcement: 'Prize room! Lucky winner gets rewards',
    hostIdx: 0,
    playerCount: 18,
    isHot: true,
  },
  {
    name: 'Cozy Corner',
    gameType: 'none',
    vibe: 'chill',
    announcement: 'Small room, 8 max. Let\'s talk deep',
    hostIdx: 1,
    playerCount: 5,
  },
];

let _roomsCache: RoomWithHost[] | null = null;

export function getMockRooms(): RoomWithHost[] {
  if (_roomsCache) return _roomsCache;

  _roomsCache = ROOM_TEMPLATES.map((tpl, i) => {
    const host = NPC_PROFILES[tpl.hostIdx];
    const others = pickNpcsWithout(
      Math.min(tpl.playerCount - 1, NPC_PROFILES.length - 1),
      [host.id],
    );
    return {
      id: `room_${String(i + 1).padStart(3, '0')}` as RoomId,
      name: tpl.name,
      gameType: tpl.gameType,
      vibe: tpl.vibe,
      host,
      hostId: host.id,
      announcement: tpl.announcement,
      players: [host, ...others],
      maxPlayers: 20,
      isPlaying: tpl.gameType !== 'none',
      isHot: tpl.isHot,
      displayCount: tpl.playerCount,
    };
  });

  return _roomsCache;
}

export function getMockRoomById(id: RoomId): RoomWithHost | undefined {
  return getMockRooms().find((r) => r.id === id);
}

/** Game type → display label (English) */
export const GAME_TYPE_LABELS: Record<GameType, string> = {
  'truth-or-dare': 'Truth or Dare',
  quiz: 'Quiz',
  'who-is-spy': 'Who is Spy',
  none: 'Chat Only',
};

/** Vibe → style class */
export const VIBE_STYLES: Record<RoomVibe, string> = {
  hot: 'bg-brand-500/20 text-brand-300',
  'late-night': 'bg-indigo-500/20 text-indigo-300',
  icebreak: 'bg-emerald-500/20 text-emerald-300',
  competitive: 'bg-amber-500/20 text-amber-300',
  chill: 'bg-sky-500/20 text-sky-300',
};

/** Vibe → display label (English) */
export const VIBE_LABELS: Record<RoomVibe, string> = {
  hot: 'Hot',
  'late-night': 'Late Night',
  icebreak: 'Icebreak',
  competitive: 'Ranked',
  chill: 'Chill',
};
