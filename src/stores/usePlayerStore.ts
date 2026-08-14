import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AvatarConfig, Player, PlayerId } from '@/types';

/**
 * Current player store.
 * Guest mode: auto-generate nickname + random avatar on first visit, persisted to localStorage.
 */

const NICKNAME_POOL = [
  'NightCat',
  'BubblePop',
  'MoonRider',
  'BerrySoft',
  '4AM',
  'PixelNomad',
  'SaltIce',
  'QuantumChip',
  'Dreamwalk',
  'Caramel',
];

const AVATAR_PRESETS: AvatarConfig[] = [
  { faceStyle: 0, hairStyle: 0, eyeStyle: 0, mouthStyle: 0, outfitStyle: 0, skinTone: 0, hairColor: 0, outfitColor: 0 },
  { faceStyle: 1, hairStyle: 2, eyeStyle: 2, mouthStyle: 1, outfitStyle: 1, skinTone: 1, hairColor: 2, outfitColor: 3 },
  { faceStyle: 2, hairStyle: 4, eyeStyle: 4, mouthStyle: 3, outfitStyle: 2, skinTone: 2, hairColor: 5, outfitColor: 4 },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createGuestPlayer(): Player {
  return {
    id: `guest_${Math.random().toString(36).slice(2, 10)}`,
    nickname: randomFrom(NICKNAME_POOL),
    avatar: randomFrom(AVATAR_PRESETS),
    level: 1,
    coins: 500,
    gems: 20,
  };
}

interface PlayerStore {
  player: Player | null;
  /** 首次进入时调用，创建游客 */
  ensureGuest: () => Player;
  /** 更新当前玩家信息（编辑昵称 / Avatar） */
  updateProfile: (patch: Partial<Pick<Player, 'nickname' | 'avatar' | 'bio'>>) => void;
  setPlayer: (player: Player) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      player: null,
      ensureGuest: () => {
        const existing = get().player;
        if (existing) return existing;
        const guest = createGuestPlayer();
        set({ player: guest });
        return guest;
      },
      updateProfile: (patch) => {
        const current = get().player;
        if (!current) return;
        set({ player: { ...current, ...patch } });
      },
      setPlayer: (player) => set({ player }),
    }),
    {
      name: 'partyplanet-player',
      version: 2,
      // v1 guests predate English nicknames and coins/gems —
      // reset so ensureGuest() regenerates a complete profile
      migrate: () => ({ player: null }),
    },
  ),
);

/** 便捷选择器：当前玩家ID */
export const useCurrentPlayerId = (): PlayerId | null =>
  usePlayerStore((s) => s.player?.id ?? null);
